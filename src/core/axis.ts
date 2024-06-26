/**
 * src/core/axis.ts
 *
 * Module description:
 *
 * This module holds the general object for a graph/chart axis scale.
 * It determine if the axis should be negative, and also includes methods
 * to draw the scale, provided the graph object.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import Scale from "./scale";
import config from "./../config";
import { rgba } from "./../utils/colours";
import * as arrays from "../utils/arrays";
import { assert } from "./../utils/assert";
import { convertFromNumerical } from "../utils/conversions";
import AxisManager from "./axis-manager";
import BasicGraph from "../basic.graph";
import { isDef } from "../utils/object";

export type AxisType = "x" | "y";

export type AxisOptions = {
    axisColour: string;
    drawLabels?: boolean;
    drawTicks?: boolean;
    labelDirection?: string;
    optimiseTicks?: boolean;
    startAtZero?: boolean;
    tickLabels?: string[];
    ticks: number;
};

class Axis {
    public yStart: number = 0;
    public start: number = 0; // @@TODO: explain the difference between `yStart` and `start`

    private data: Float64Array;
    private graph: BasicGraph;
    private scale: Scale;

    constructor(
        private readonly manager: AxisManager,
        private readonly type: AxisType,
        private readonly options: AxisOptions
    ) {
        this.data = this.manager.data;
        this.graph = this.manager.graph;

        // Ensure that minTicks & maxTicks don't overflow and aren't negative, otherwise they would cause a
        // DivisionByZero or Infinity issues
        assert(this.options.ticks > 0, `${this.type} cannot have zero or negative tick count`);

        // we have negative values in the data set and therefore will require two
        // different scales
        this.scale = this.#computeAxisScale();
        this.start = this.scale.closestToZero;
    }

    /**
     * @since v0.0.1 Takes in input as the lengths object from a graph object.
     * */
    determineAxisPosition() {
        // Y & X positions which represent the start of the drawing line
        // @@Cleanup: this must be determined here because the graph 'lengths' haven't been
        // calculated yet.
        this.yStart = this.graph.padding.top + this.graph.lengths.yLength;

        // position the x-axis then in the center of the y-axis, calculate this offset by indexing
        // where the zero '0' value in the scale label array (reversed), and multiplying this by the
        // amount of squares there are between the zero and the last axis value. We need to reverse
        // the labels because the Axis position is calculated from the top of the graph, where as
        // the numbers are drawn from the bottom of the graph.

        // @@TODO: maybe just change the calculation to compute the position of the x-axis from the
        //      bottom of the graph.
        if (this.type === "x") {
            const ticks = this.manager.yAxis.scale.ticks;
            const [start, end] = arrays.findClosestIndex(ticks.reverse(), 0);

            // The zero index must not be '-1' or in other words, not found.
            assert(start !== -1, `couldn't find the '0' scale position on the {${this.type}}`);

            const middleIndex = (start + end) / 2;
            this.yStart = this.graph.lengths.yBegin + this.graph.gridRectSize.y * middleIndex;
        }
    }

    #computeAxisScale(): Scale {
        if (this.type === "x") {
            // we want to set the minimum scale step to 1 since we don't care about numerics on this
            // axis scale.
            return new Scale({
                min: 0,
                max: this.graph.dataManager.maxLen() - 1,
                // Subtract one here since we are counting the axis as a tick as well
                tickCount: this.options.ticks - 1,
                // bound the minimum step to one!
                minimumScaleStep: 1,
            });
        } else {
            return new Scale({
                ...arrays.getMinMax(this.data),
                tickCount: this.options.ticks,
            });
        }
    }

    generateScaleNumbers() {
        const scale = this.scale;
        const { tickLabels, drawLabels } = this.options;

        if (this.type === "x") {
            // if the user has provided custom labels to use instead of the auto
            // generated ones, we use those instead. In the event that the user
            // provides less labels than the number of ticks, we will just fill
            // it in by copying in the provided labels.
            if (isDef(tickLabels) && drawLabels) {
                assert(tickLabels.length > 0, "left over ticks");

                return scale.getScaleLabels().map((_, index: number) => {
                    assert(isDef(tickLabels), "tick labels must be defined");
                    return tickLabels[index % tickLabels.length];
                });
            } else {
                return arrays.fillRange(scale.getTickCount() + 1).map((x) => (scale.scaleStep * x).toString());
            }
        } else {
            return scale.getScaleLabels();
        }
    }

    get scaleStep() {
        return this.scale.scaleStep;
    }

    get min() {
        return this.scale.min;
    }

    get roundedMin() {
        return this.scale.roundedMinimum;
    }

    get max() {
        return this.scale.max;
    }

    get scaleLabels(): string[] {
        let scaleNumericsToDraw = this.generateScaleNumbers();

        if (this.graph.options.scale.shorthandNumerics) {
            scaleNumericsToDraw = scaleNumericsToDraw.map((numeric) => {
                // TODO: unhandled case where we have a float that is larger than log(n) > 1
                return convertFromNumerical(numeric);
            });
        }

        return scaleNumericsToDraw;
    }

    draw() {
        // determine the positions of the x-axis
        this.determineAxisPosition();

        // @@TODO: consider drawing `x` axis at top if the graph is "inverted" or
        //         only has negative values.
        //
        //         x----┴----┴----┴---┴---┴---┴----
        //         |     x x                  x x
        //         |         x              x
        //         |          x            x
        //         |           x          x
        //         |            x        x
        //         |             x     x
        //         |               x x
        //
        //
        // @@TODO: account for negative?
        let offset = this.manager.sharedAxisZero ? 1 : 0;

        // get the context ready to draw
        this.graph.ctx.lineWidth = config.gridLineWidth;
        this.graph.ctx.strokeStyle = rgba(this.options.axisColour, 60);

        // Y-Axis Drawing !
        if (this.type === "y") {
            this.graph.drawer.verticalLine(
                this.graph.lengths.xBegin,
                this.graph.lengths.yBegin,
                this.graph.lengths.yLength + 9
            );
            this.graph.ctx.textBaseline = "middle";

            for (const number of this.scaleLabels) {
                if (!(this.manager.sharedAxisZero && number.toString() === "0")) {
                    const y_offset = offset * this.graph.gridRectSize.y;

                    // tick drawing
                    this.graph.drawer.horizontalLine(
                        this.graph.lengths.xBegin - 9,
                        this.graph.lengths.yBegin + y_offset,
                        9
                    );

                    // draw the text
                    this.graph.drawer.text(
                        number,
                        this.graph.lengths.xBegin - 9 - this.graph.padding.textPadding,
                        this.graph.padding.top + this.graph.lengths.yLength - y_offset,
                        config.scaleLabelFontSize,
                        this.options.axisColour,
                        "right"
                    );
                    offset++;
                }
            }
        } else {
            this.graph.drawer.horizontalLine(
                this.graph.lengths.xBegin - 9,
                this.yStart,
                this.graph.lengths.xLength + 9
            );

            // We also need to draw a horizontal line at the bottom of the graph
            // if it includes a negative quadrant. We can check this by accessing the
            // manager.negativeScale constant, if so draw the horizontal line at the
            // bottom of the graph.
            if (this.manager.negativeScale && !this.graph.options.grid.gridded) {
                this.graph.drawer.horizontalLine(
                    this.graph.lengths.xBegin,
                    this.graph.lengths.yLength + this.graph.padding.top,
                    this.graph.lengths.xLength
                );
            }

            const scale_offset = this.graph.padding.textPadding + this.graph.fontSize() / 2;

            for (const label of this.scaleLabels) {
                // if sharedAxisZero isn't enabled and the number isn't zero, draw the number label
                if (!(this.manager.sharedAxisZero && label === "0")) {
                    const x_offset = offset * this.graph.gridRectSize.x;

                    // draw the tick
                    this.graph.drawer.verticalLine(
                        this.graph.lengths.xBegin + x_offset,
                        this.graph.lengths.yLength + this.graph.padding.top,
                        9
                    );

                    this.graph.drawer.text(
                        label,
                        this.graph.lengths.xBegin + x_offset,
                        this.graph.lengths.yLength + 9 + this.graph.padding.top + scale_offset,
                        config.scaleLabelFontSize,
                        this.options.axisColour,
                        "center"
                    );
                    offset++;
                }
            }
        }
    }
}

export default Axis;
