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
import conversions from "../utils/conversions";
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
    public scaleLabels: string[] = [];
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
        this.start = this.scale.roundedMinimum;
        this.scaleLabels = this.generateScaleNumbers();
    }

    /**
     * @since v0.0.1 Takes in input as the lengths object from a graph object.
     * */
    determineAxisPosition() {
        // Y & X positions which represent the start of the drawing line
        // @@Cleanup: this must be determined here because the graph 'lengths' haven't been
        // calculated yet.
        this.yStart = this.graph.padding.top + this.graph.yLength;

        // position the x-axis then in the center of the y-axis, calculate this offset by indexing
        // where the zero '0' value in the scale label array (reversed), and multiplying this by the
        // amount of squares there are between the zero and the last axis value. We need to reverse
        // the labels because the Axis position is calculated from the top of the graph, where as
        // the numbers are drawn from the bottom of the graph.

        // @@TODO: maybe just change the calculation to compute the position of the x-axis from the
        //      bottom of the graph.
        if (this.type === "x") {
            assert(isDef(this.scale), "scale must be defined");
            const [start, end] = arrays.findClosestIndex(this.scale.ticks.reverse(), 0);

            // The zero index must not be '-1' or in other words, not found.
            assert(start !== -1, `couldn't find the '0' scale position on the {${this.type}}`);

            const middleIndex = (start + end) / 2;
            this.yStart = this.graph.lengths.y_begin + this.graph.gridRectSize.y * middleIndex;
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
                optimiseTicks: this.options.optimiseTicks,
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

    get max() {
        return this.scale.max;
    }

    getScaleLabels(): string[] {
        let scaleNumericsToDraw = this.generateScaleNumbers();

        if (this.graph.options.scale.shorthandNumerics) {
            scaleNumericsToDraw = scaleNumericsToDraw.map((numeric) => {
                // TODO: unhandled case where we have a float that is larger than log(n) > 1
                if (Number.isInteger(parseFloat(numeric))) {
                    return conversions.convertFromNumerical(numeric);
                } else {
                    return numeric;
                }
            });
        }

        return scaleNumericsToDraw;
    }

    draw() {
        // determine the positions of the x-axis
        this.determineAxisPosition();
        let offset = this.manager.sharedAxisZero ? 1 : 0;

        // get the context ready to draw
        this.graph.ctx.lineWidth = config.gridLineWidth;
        this.graph.ctx.strokeStyle = rgba(this.options.axisColour, 60);

        // Apply numerical conversion magic.
        const scaleNumericsToDraw = this.getScaleLabels();

        // Y-Axis Drawing !
        if (this.type === "y") {
            this.graph.drawer.verticalLine(
                this.graph.lengths.x_begin,
                this.graph.lengths.y_begin,
                this.graph.yLength + 9
            );
            this.graph.ctx.textBaseline = "middle";

            for (const number of scaleNumericsToDraw) {
                if (!(this.manager.sharedAxisZero && number.toString() === "0")) {
                    const y_offset = offset * this.graph.gridRectSize.y;

                    // tick drawing
                    this.graph.drawer.horizontalLine(
                        this.graph.lengths.x_begin - 9,
                        this.graph.lengths.y_begin + y_offset,
                        9
                    );

                    // draw the text
                    this.graph.drawer.text(
                        number,
                        this.graph.lengths.x_begin - 9 - this.graph.padding.textPadding,
                        this.graph.padding.top + this.graph.yLength - y_offset,
                        config.scaleLabelFontSize,
                        this.options.axisColour,
                        "right"
                    );
                    offset++;
                }
            }
        } else {
            this.graph.drawer.horizontalLine(this.graph.lengths.x_begin - 9, this.yStart, this.graph.xLength + 9);

            // We also need to draw a horizontal line at the bottom of the graph
            // if it includes a negative quadrant. We can check this by accessing the
            // manager.negativeScale constant, if so draw the horizontal line at the
            // bottom of the graph.
            if (this.manager.negativeScale && !this.graph.options.grid.gridded) {
                this.graph.drawer.horizontalLine(
                    this.graph.lengths.x_begin,
                    this.graph.yLength + this.graph.padding.top,
                    this.graph.xLength
                );
            }

            const scale_offset = this.graph.padding.textPadding + this.graph.fontSize() / 2;

            for (const number of scaleNumericsToDraw) {
                // if sharedAxisZero isn't enabled and the number isn't zero, draw the number label
                if (!(this.manager.sharedAxisZero && number.toString() === "0")) {
                    const x_offset = offset * this.graph.gridRectSize.x;

                    // draw the tick
                    this.graph.drawer.verticalLine(
                        this.graph.lengths.x_begin + x_offset,
                        this.graph.yLength + this.graph.padding.top,
                        9
                    );

                    this.graph.drawer.text(
                        number,
                        this.graph.lengths.x_begin + x_offset,
                        this.graph.yLength + 9 + this.graph.padding.top + scale_offset,
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
