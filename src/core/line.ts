/**
 * src/core/line.ts
 *
 * Module description:
 *
 * Line class which represents a drawable line on a Graph that supports drawing lines.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import Point from "./point";
import config from "./../config";
import { rgba } from "./../utils/colours";
import { ControlPoint, InterpolationKind, splineCurve } from "./interpolation";
import * as arrays from "./../utils/arrays";
import BasicGraph from "../basic.graph";
import { EasingAnimationFn, splitCubicAt, splitQuadraticAt, Vec2 } from "./animation";

/** Options for the line area. */
export type LineAreaOptions = {
    fill?: boolean;
    colour?: string;
};

/** Options for line animation. */
export type LineAnimationOptions = {
    duration: number;
    easing: EasingAnimationFn;
};

/** Represents the drawing state for partial line rendering. */
type DrawState = {
    /** Number of complete segments to draw. */
    segments: number;
    /** Progress within the partial segment (0-1). */
    segmentProgress: number;
    /** Interpolated endpoint for the partial segment. */
    endpoint: Vec2;
};

/** Options for a line on a graph. */
export type LineOptions = {
    /** Colour of the line. */
    colour: string;

    /** Style of the line: 'solid' or 'dashed'. */
    style?: string;

    /** Interpolation type for the line. */
    interpolation: InterpolationKind;

    /** Optional area settings for the line. */
    area?: LineAreaOptions;

    /** Optional animation settings for the line. */
    animation?: LineAnimationOptions;

    /** Optional label for the line. */
    label?: string;

    /** Whether to annotate points on the line. */
    annotatePoints: boolean;
};

/**
 * Line class that represent the drawing mechanisms of each line that is drawn on a
 * graph.
 *  */
class Line {
    private points: Point[] = [];
    private controlPoints: ControlPoint[] = [];

    constructor(
        private readonly data: number[] | Float64Array,
        private readonly graph: BasicGraph,
        private readonly options: LineOptions,
    ) {
        this.#convertDataToPoints();
    }

    /**
     * @since v1.0.0
     *
     * Function to convert the given data points into plottable data on the chart. This has
     * to be done since we need to convert the data into positions on the chart that can be
     * drawn.
     * */
    #convertDataToPoints() {
        for (let index = 0; index < this.data.length; index++) {
            this.points.push(new Point({ x: index, y: this.data[index] }, this.graph));
        }

        if (this.options.interpolation === "cubic") {
            this.#computeInterpolationControlPoints();
        }
    }

    /**
     * @since v1.0.0
     *
     * Internal function to compute interpolation points for a line if it has 'cubic' interpolation
     * enabled.
     * */
    #computeInterpolationControlPoints() {
        this.controlPoints = [];

        // start from point 1 and not point 0, as point one and last point will
        // be quadratic curves and not splines
        for (let k = 1; k < this.points.length - 1; k++) {
            this.controlPoints.push(
                splineCurve(
                    arrays.getPrevious(k, this.points),
                    this.points[k],
                    arrays.getNext(k, this.points),
                    config.tension,
                    this.graph,
                ),
            );

            // perform a check to see if a control point goes out of the graph bounds,
            // if so we correct this behaviour by setting the 'y' to the lengths.y_begin
            // value.
            if (this.controlPoints[k - 1].prev.y < this.graph.lengths.yBegin) {
                this.controlPoints[k - 1].prev.y = this.graph.lengths.yBegin;
            }

            if (this.controlPoints[k - 1].next.y < this.graph.lengths.yBegin) {
                this.controlPoints[k - 1].next.y = this.graph.lengths.yBegin;
            }
        }
    }

    /**
     * Sets up the canvas context with the appropriate styles for drawing.
     */
    #setupContext(): CanvasRenderingContext2D {
        const ctx = this.graph.drawer.ctx;

        ctx.lineJoin = "round";
        ctx.lineWidth = config.lineWidth;
        ctx.fillStyle = rgba(this.options.colour, 40);
        ctx.strokeStyle = rgba(this.options.colour, 100);
        ctx.setLineDash(this.options.style === "dashed" ? [5, 5] : []);

        return ctx;
    }

    /**
     * Computes the draw state for a given progress value (0-1).
     */
    #computeDrawState(progress: number): DrawState {
        const totalSegments = this.points.length - 1;
        const exactSegment = progress * totalSegments;
        const segments = Math.floor(exactSegment);
        const segmentProgress = exactSegment - segments;

        let endpoint: { x: number; y: number };

        if (segments >= totalSegments) {
            // Fully complete - use the last point
            const lastPoint = this.points[this.points.length - 1];
            endpoint = { x: lastPoint.x, y: lastPoint.y };
        } else if (this.options.interpolation === "cubic") {
            endpoint = this.#interpolateCubicAt(segments, segmentProgress);
        } else {
            endpoint = this.#interpolateLinearAt(segments, segmentProgress);
        }

        return { segments: Math.min(segments, totalSegments), segmentProgress, endpoint };
    }

    /**
     * Linearly interpolates a point within a segment.
     */
    #interpolateLinearAt(segment: number, t: number): { x: number; y: number } {
        const p0 = this.points[segment];
        const p1 = this.points[segment + 1];

        return {
            x: p0.x + (p1.x - p0.x) * t,
            y: p0.y + (p1.y - p0.y) * t,
        };
    }

    /**
     * Interpolates a point along a cubic bezier curve segment using de Casteljau's algorithm.
     * Handles the special cases of quadratic curves at the start and end.
     */
    #interpolateCubicAt(segment: number, t: number): { x: number; y: number } {
        const totalSegments = this.points.length - 1;

        if (segment === 0) {
            // First segment: quadratic curve
            const p0 = this.points[0];
            const cp = this.controlPoints[0].prev;
            const p1 = this.points[1];

            // Quadratic bezier: B(t) = (1-t)²P0 + 2(1-t)tCP + t²P1
            const mt = 1 - t;
            return {
                x: mt * mt * p0.x + 2 * mt * t * cp.x + t * t * p1.x,
                y: mt * mt * p0.y + 2 * mt * t * cp.y + t * t * p1.y,
            };
        } else if (segment === totalSegments - 1) {
            // Last segment: quadratic curve (drawn in reverse)
            const p0 = this.points[segment];
            const cp = this.controlPoints[this.controlPoints.length - 1].next;
            const p1 = this.points[segment + 1];

            // Quadratic bezier
            const mt = 1 - t;
            return {
                x: mt * mt * p0.x + 2 * mt * t * cp.x + t * t * p1.x,
                y: mt * mt * p0.y + 2 * mt * t * cp.y + t * t * p1.y,
            };
        } else {
            // Middle segments: cubic bezier
            const p0 = this.points[segment];
            const cp1 = this.controlPoints[segment - 1].next;
            const cp2 = this.controlPoints[segment].prev;
            const p1 = this.points[segment + 1];

            // Cubic bezier: B(t) = (1-t)³P0 + 3(1-t)²tCP1 + 3(1-t)t²CP2 + t³P1
            const mt = 1 - t;
            const mt2 = mt * mt;
            const mt3 = mt2 * mt;
            const t2 = t * t;
            const t3 = t2 * t;

            return {
                x: mt3 * p0.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * p1.x,
                y: mt3 * p0.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * p1.y,
            };
        }
    }

    /**
     * Builds a Path2D for the linear line stroke.
     */
    #buildLinearLinePath(state?: DrawState): Path2D {
        const path = new Path2D();
        const segmentCount = state ? state.segments : this.points.length - 1;

        // Draw complete segments
        for (let p = 0; p < segmentCount; p++) {
            path.moveTo(this.points[p].x, this.points[p].y);
            path.lineTo(this.points[p + 1].x, this.points[p + 1].y);
        }

        // Draw partial segment if there's progress within a segment
        if (state && state.segmentProgress > 0 && state.segments < this.points.length - 1) {
            path.moveTo(this.points[state.segments].x, this.points[state.segments].y);
            path.lineTo(state.endpoint.x, state.endpoint.y);
        }

        return path;
    }

    /**
     * Builds a Path2D for the linear area fill.
     */
    #buildLinearAreaPath(state?: DrawState): Path2D {
        const path = new Path2D();
        const { start } = this.graph.axisManager.yAxis;
        const segmentCount = state ? state.segments : this.points.length - 1;

        // Draw complete segment areas
        for (let i = 0; i < segmentCount; i++) {
            const x1 = new Point({ x: i, y: start }, this.graph);
            const x2 = new Point({ x: i + 1, y: start }, this.graph);

            path.moveTo(this.points[i].x, this.points[i].y);
            path.lineTo(this.points[i + 1].x, this.points[i + 1].y);
            path.lineTo(x2.x, x2.y);
            path.lineTo(x1.x, x1.y);
            path.closePath();
        }

        // Draw partial segment area
        if (state && state.segmentProgress > 0 && state.segments < this.points.length - 1) {
            const x1 = new Point({ x: state.segments, y: start }, this.graph);
            // Interpolate the baseline x position
            const baselineEndX = x1.x + (state.endpoint.x - this.points[state.segments].x);

            path.moveTo(this.points[state.segments].x, this.points[state.segments].y);
            path.lineTo(state.endpoint.x, state.endpoint.y);
            path.lineTo(baselineEndX, x1.y);
            path.lineTo(x1.x, x1.y);
            path.closePath();
        }

        return path;
    }

    /**
     * Builds a Path2D for the cubic line stroke (including first/last quadratic curves).
     */
    #buildCubicLinePath(state?: DrawState): Path2D {
        const path = new Path2D();
        const totalSegments = this.points.length - 1;
        const segmentCount = state ? state.segments : totalSegments;

        // First quadratic curve: from point 0 to point 1 (segment 0)
        if (segmentCount >= 1) {
            path.moveTo(this.points[0].x, this.points[0].y);
            path.quadraticCurveTo(
                this.controlPoints[0].prev.x,
                this.controlPoints[0].prev.y,
                this.points[1].x,
                this.points[1].y,
            );
        } else if (state && state.segments === 0 && state.segmentProgress > 0) {
            // Partial first segment - split the quadratic curve
            const partial = splitQuadraticAt(
                this.points[0],
                this.controlPoints[0].prev,
                this.points[1],
                state.segmentProgress,
            );
            path.moveTo(partial.p0.x, partial.p0.y);
            path.quadraticCurveTo(partial.cp.x, partial.cp.y, partial.p1.x, partial.p1.y);
        }

        // Middle bezier curves (segments 1 to length-3)
        const middleEnd = Math.min(segmentCount, totalSegments - 1);
        for (let i = 1; i < middleEnd; i++) {
            path.moveTo(this.points[i].x, this.points[i].y);
            path.bezierCurveTo(
                this.controlPoints[i - 1].next.x,
                this.controlPoints[i - 1].next.y,
                this.controlPoints[i].prev.x,
                this.controlPoints[i].prev.y,
                this.points[i + 1].x,
                this.points[i + 1].y,
            );
        }

        // Partial middle segment - split the cubic curve
        if (state && state.segmentProgress > 0 && state.segments >= 1 && state.segments < totalSegments - 1) {
            const seg = state.segments;
            const partial = splitCubicAt(
                this.points[seg],
                this.controlPoints[seg - 1].next,
                this.controlPoints[seg].prev,
                this.points[seg + 1],
                state.segmentProgress,
            );
            path.moveTo(partial.p0.x, partial.p0.y);
            path.bezierCurveTo(partial.cp1.x, partial.cp1.y, partial.cp2.x, partial.cp2.y, partial.p1.x, partial.p1.y);
        }

        // Last quadratic curve: from second-to-last point to last point (segment length-2)
        if (segmentCount >= totalSegments) {
            path.moveTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
            path.quadraticCurveTo(
                this.controlPoints[this.controlPoints.length - 1].next.x,
                this.controlPoints[this.controlPoints.length - 1].next.y,
                this.points[this.points.length - 1].x,
                this.points[this.points.length - 1].y,
            );
        } else if (state && state.segmentProgress > 0 && state.segments === totalSegments - 1) {
            // Partial last segment - split the quadratic curve
            const partial = splitQuadraticAt(
                this.points[state.segments],
                this.controlPoints[this.controlPoints.length - 1].next,
                this.points[this.points.length - 1],
                state.segmentProgress,
            );
            path.moveTo(partial.p0.x, partial.p0.y);
            path.quadraticCurveTo(partial.cp.x, partial.cp.y, partial.p1.x, partial.p1.y);
        }

        return path;
    }

    /**
     * Builds a Path2D for the cubic area fill.
     */
    #buildCubicAreaPath(state?: DrawState): Path2D {
        const path = new Path2D();
        const { start } = this.graph.axisManager.yAxis;
        const totalSegments = this.points.length - 1;
        const segmentCount = state ? state.segments : totalSegments;

        // First section: quadratic from point 0 to point 1
        if (segmentCount >= 1) {
            const f1 = new Point({ x: 0, y: start }, this.graph);
            const f2 = new Point({ x: 1, y: start }, this.graph);

            path.moveTo(this.points[0].x, this.points[0].y);
            path.quadraticCurveTo(
                this.controlPoints[0].prev.x,
                this.controlPoints[0].prev.y,
                this.points[1].x,
                this.points[1].y,
            );
            path.lineTo(f2.x, f2.y);
            path.lineTo(f1.x, f1.y);
            path.closePath();
        } else if (state && state.segments === 0 && state.segmentProgress > 0) {
            // Partial first segment area - use split quadratic curve
            const f1 = new Point({ x: 0, y: start }, this.graph);
            const partial = splitQuadraticAt(
                this.points[0],
                this.controlPoints[0].prev,
                this.points[1],
                state.segmentProgress,
            );
            const baselineEndX = f1.x + (partial.p1.x - this.points[0].x);

            path.moveTo(partial.p0.x, partial.p0.y);
            path.quadraticCurveTo(partial.cp.x, partial.cp.y, partial.p1.x, partial.p1.y);
            path.lineTo(baselineEndX, f1.y);
            path.lineTo(f1.x, f1.y);
            path.closePath();
        }

        // Middle sections: bezier curves
        const middleEnd = Math.min(segmentCount, totalSegments - 1);
        for (let i = 1; i < middleEnd; i++) {
            const x1 = new Point({ x: i, y: start }, this.graph);
            const x2 = new Point({ x: i + 1, y: start }, this.graph);

            path.moveTo(this.points[i].x, this.points[i].y);
            path.bezierCurveTo(
                this.controlPoints[i - 1].next.x,
                this.controlPoints[i - 1].next.y,
                this.controlPoints[i].prev.x,
                this.controlPoints[i].prev.y,
                this.points[i + 1].x,
                this.points[i + 1].y,
            );
            path.lineTo(x2.x, x2.y);
            path.lineTo(x1.x, x1.y);
            path.closePath();
        }

        // Partial middle segment area - use split cubic curve
        if (state && state.segmentProgress > 0 && state.segments >= 1 && state.segments < totalSegments - 1) {
            const seg = state.segments;
            const x1 = new Point({ x: seg, y: start }, this.graph);
            const partial = splitCubicAt(
                this.points[seg],
                this.controlPoints[seg - 1].next,
                this.controlPoints[seg].prev,
                this.points[seg + 1],
                state.segmentProgress,
            );
            const baselineEndX = x1.x + (partial.p1.x - this.points[seg].x);

            path.moveTo(partial.p0.x, partial.p0.y);
            path.bezierCurveTo(partial.cp1.x, partial.cp1.y, partial.cp2.x, partial.cp2.y, partial.p1.x, partial.p1.y);
            path.lineTo(baselineEndX, x1.y);
            path.lineTo(x1.x, x1.y);
            path.closePath();
        }

        // Last section: quadratic from second-to-last point to last point
        if (segmentCount >= totalSegments) {
            const f3 = new Point({ x: this.points.length - 2, y: start }, this.graph);
            const f4 = new Point({ x: this.points.length - 1, y: start }, this.graph);

            path.moveTo(this.points[this.points.length - 2].x, this.points[this.points.length - 2].y);
            path.quadraticCurveTo(
                this.controlPoints[this.controlPoints.length - 1].next.x,
                this.controlPoints[this.controlPoints.length - 1].next.y,
                this.points[this.points.length - 1].x,
                this.points[this.points.length - 1].y,
            );
            path.lineTo(f4.x, f4.y);
            path.lineTo(f3.x, f3.y);
            path.closePath();
        } else if (state && state.segmentProgress > 0 && state.segments === totalSegments - 1) {
            // Partial last segment area - use split quadratic curve
            const x1 = new Point({ x: state.segments, y: start }, this.graph);
            const partial = splitQuadraticAt(
                this.points[state.segments],
                this.controlPoints[this.controlPoints.length - 1].next,
                this.points[this.points.length - 1],
                state.segmentProgress,
            );
            const baselineEndX = x1.x + (partial.p1.x - this.points[state.segments].x);

            path.moveTo(partial.p0.x, partial.p0.y);
            path.quadraticCurveTo(partial.cp.x, partial.cp.y, partial.p1.x, partial.p1.y);
            path.lineTo(baselineEndX, x1.y);
            path.lineTo(x1.x, x1.y);
            path.closePath();
        }

        return path;
    }

    /**
     * @since v1.0.0
     *
     * Internal function to draw point annotations on the line.
     */
    #drawPointAnnotations(state?: DrawState) {
        const maxIndex = state ? state.segments : this.points.length - 1;

        this.points.forEach((point, index) => {
            // Only draw points up to the current progress
            if (index > maxIndex) return;

            if (index === this.points.length - 1 || (point.data.x / this.graph.axisManager.xAxis.scaleStep) % 1 === 0) {
                point.draw();
            }
        });
    }

    /**
     * @since v1.0.0
     *
     * Function that can be called by a graph to draw the graph including the line
     * style and the line fill (if enabled).
     *
     * @param progress - Value from 0 to 1 indicating how much of the line to draw.
     *                   Defaults to 1 (full line).
     */
    draw(progress: number = 1) {
        if (progress <= 0) return;
        progress = Math.min(1, progress);

        const ctx = this.#setupContext();
        const state = progress < 1 ? this.#computeDrawState(progress) : undefined;

        // Build paths based on interpolation type
        const linePath =
            this.options.interpolation === "cubic" ? this.#buildCubicLinePath(state) : this.#buildLinearLinePath(state);

        // Draw area fill if enabled
        if (this.options.area?.fill) {
            const areaPath =
                this.options.interpolation === "cubic"
                    ? this.#buildCubicAreaPath(state)
                    : this.#buildLinearAreaPath(state);

            ctx.globalAlpha = 0.6;
            ctx.fill(areaPath);
            ctx.globalAlpha = 1;
        }

        // Stroke the line
        ctx.stroke(linePath);

        // Draw point annotations if enabled
        if (this.options.annotatePoints) {
            this.#drawPointAnnotations(state);
        }
    }
}

export default Line;
