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
import { EasingAnimationFn } from "./animation";

/** Options for the line area. */
export type LineAreaOptions = {
    fill: boolean;
    colour?: string;
};

/** Options for line animation. */
export type LineAnimationOptions = {
    duration: number;
    easing: EasingAnimationFn;
};

/** Options for a line on a graph. */
export type LineOptions = {
    /** Colour of the line. */
    colour: string;

    /** Style of the line: 'solid' or 'dashed'. */
    style: string;

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
        ctx.fillStyle = rgba(this.options.colour, 100);
        ctx.strokeStyle = rgba(this.options.colour, 40);
        ctx.setLineDash(this.options.style === "dashed" ? [5, 5] : []);

        return ctx;
    }

    /**
     * Builds a Path2D for the linear line stroke.
     */
    #buildLinearLinePath(): Path2D {
        const path = new Path2D();

        for (let p = 0; p < this.points.length - 1; p++) {
            path.moveTo(this.points[p].x, this.points[p].y);
            path.lineTo(this.points[p + 1].x, this.points[p + 1].y);
        }

        return path;
    }

    /**
     * Builds a Path2D for the linear area fill.
     */
    #buildLinearAreaPath(): Path2D {
        const path = new Path2D();
        const { start } = this.graph.axisManager.yAxis;

        for (let i = 0; i < this.points.length - 1; i++) {
            const x1 = new Point({ x: i, y: start }, this.graph);
            const x2 = new Point({ x: i + 1, y: start }, this.graph);

            path.moveTo(this.points[i].x, this.points[i].y);
            path.lineTo(this.points[i + 1].x, this.points[i + 1].y);
            path.lineTo(x2.x, x2.y);
            path.lineTo(x1.x, x1.y);
            path.closePath();
        }

        return path;
    }

    /**
     * Builds a Path2D for the cubic line stroke (including first/last quadratic curves).
     */
    #buildCubicLinePath(): Path2D {
        const path = new Path2D();

        // First quadratic curve: from point 0 to point 1
        path.moveTo(this.points[0].x, this.points[0].y);
        path.quadraticCurveTo(
            this.controlPoints[0].prev.x,
            this.controlPoints[0].prev.y,
            this.points[1].x,
            this.points[1].y,
        );

        // Middle bezier curves
        for (let i = 1; i < this.points.length - 2; i++) {
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

        // Last quadratic curve: from last point to second-to-last point
        path.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);
        path.quadraticCurveTo(
            this.controlPoints[this.controlPoints.length - 1].next.x,
            this.controlPoints[this.controlPoints.length - 1].next.y,
            this.points[this.points.length - 2].x,
            this.points[this.points.length - 2].y,
        );

        return path;
    }

    /**
     * Builds a Path2D for the cubic area fill.
     */
    #buildCubicAreaPath(): Path2D {
        const path = new Path2D();
        const { start } = this.graph.axisManager.yAxis;

        // First section: quadratic from point 0 to point 1
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

        // Middle sections: bezier curves
        for (let i = 1; i < this.points.length - 2; i++) {
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

        // Last section: quadratic from last point to second-to-last
        const f3 = new Point({ x: this.points.length - 2, y: start }, this.graph);
        const f4 = new Point({ x: this.points.length - 1, y: start }, this.graph);
        const lastPoint = this.points[this.points.length - 1];

        path.moveTo(f4.x, f4.y);
        path.lineTo(lastPoint.x, lastPoint.y);
        path.quadraticCurveTo(
            this.controlPoints[this.controlPoints.length - 1].next.x,
            this.controlPoints[this.controlPoints.length - 1].next.y,
            this.points[this.points.length - 2].x,
            this.points[this.points.length - 2].y,
        );
        path.lineTo(f3.x, f3.y);
        path.closePath();

        return path;
    }

    /**
     * @since v1.0.0
     *
     * Internal function to draw point annotations on the line.
     *  */
    #drawPointAnnotations() {
        this.points.forEach((point, index) => {
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
     */
    draw() {
        const ctx = this.#setupContext();

        // Build paths based on interpolation type
        const linePath =
            this.options.interpolation === "cubic" ? this.#buildCubicLinePath() : this.#buildLinearLinePath();

        // Draw area fill if enabled
        if (this.options.area?.fill) {
            const areaPath =
                this.options.interpolation === "cubic" ? this.#buildCubicAreaPath() : this.#buildLinearAreaPath();

            ctx.globalAlpha = 0.6;
            ctx.fill(areaPath);
            ctx.globalAlpha = 1;
        }

        // Stroke the line
        ctx.stroke(linePath);

        // Draw point annotations if enabled
        if (this.options.annotatePoints) {
            this.#drawPointAnnotations();
        }
    }
}

export default Line;
