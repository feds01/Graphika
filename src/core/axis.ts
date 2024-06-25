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
    public scaleStep: number;
    public scaleLabels: string[] = [];
    public yStart: number = 0;
    public start: number = 0; // @@TODO: explain the difference between `yStart` and `start`
    public min: number = 0;
    public max: number = 0;

    private data: Float64Array;
    private graph: BasicGraph;
    private positiveScale: Scale | null = null;
    private negativeScale: Scale | null = null;

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

        // This is the variable which holds the tick step of the axis.
        this.scaleStep = 0;

        // we have negative values in the data set and therefore will require two
        // different scales
        this._computeAxisScale();
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
        if (this.type === "x" && this.manager.negativeScale) {
            const zeroIndex = this.manager.scaleNumbers.y.reverse().indexOf("0");

            // The zero index must not be '-1' or in other words, not found.
            assert(zeroIndex !== -1, `couldn't find the '0' scale position on the {${this.type}}`);

            this.yStart = this.graph.lengths.y_begin + this.graph.gridRectSize.y * zeroIndex;
        }
    }

    _computeAxisScale() {
        if (this.type === "x") {
            // we want to set the minimum scale step to 1 since we don't care about numerics on this
            // axis scale.
            this.positiveScale = new Scale({
                min: 0,
                max: this.graph.dataManager.maxLen() - 1,
                // Subtract one here since we are counting the axis as a tick as well
                tickCount: this.options.ticks - 1,
                // bound the minimum step to one!
                minimumScaleStep: 1,
                optimiseTicks: this.options.optimiseTicks,
            });

            this.scaleStep = this.positiveScale.getScaleStep();
        } else if (this.type === "y") {
            const positiveValues = arrays.positiveAndZeroValues(this.data);

            if (this.manager.negativeScale) {
                const negativeDataSet = arrays.negativeValues(this.data).map((x) => Math.abs(x));
                // divide the max ticks by two since negative and positive are sharing the scale.

                this.negativeScale = new Scale({
                    min: 0,
                    max: arrays.getMax(negativeDataSet),
                    tickCount: this.options.ticks / 2,
                    isNegativeScale: true,
                });
            }

            this.positiveScale = new Scale({
                ...arrays.getMinMax(positiveValues),
                tickCount: this.manager.negativeScale ? this.options.ticks / 2 : this.options.ticks,
            });

            // set the axis min and max
            this.min = 0;
            this.max = this.positiveScale.range;

            /*
            // Get the largest tick step of the two and set the other scale tick step to the same one. This is
            // because the tick steps must be consistent for both negative and positive scales. Synchronise the
            // tickSteps basically.
            */
            if (this.manager.negativeScale) {
                assert(isDef(this.negativeScale), "negative scale must be defined for y-axis");

                this.scaleStep = Math.max(this.positiveScale.getScaleStep(), this.negativeScale.getScaleStep());

                this.positiveScale.tickStep = this.scaleStep;
                this.negativeScale.tickStep = this.scaleStep;
                this.start = 0;

                // we'll need to overwrite the 'min' tick for this axis since in positive it will be 0
                this.min = -this.negativeScale.range;
            } else {
                this.scaleStep = this.positiveScale.getScaleStep();
                this.start = this.positiveScale.roundedMinimum;
            }
        } else {
            throw Error(`Unrecognised Axis type '${this.type}'`);
        }
    }

    generateScaleNumbers() {
        if (this.type === "x") {
            assert(isDef(this.positiveScale), "positive scale must be defined for x-axis");

            // if the user has provided custom labels to use instead of the auto
            // generated ones, we use those instead. In the event that the user
            // provides less labels than the number of ticks, we will just fill
            // it in by copying in the provided labels.
            if (isDef(this.options.tickLabels) && this.options.drawLabels) {
                assert(this.options.tickLabels.length > 0, "left over ticks");

                return this.positiveScale.getScaleLabels().map((_, index: number) => {
                    assert(isDef(this.options.tickLabels), "tick labels must be defined");
                    return this.options.tickLabels[index % this.options.tickLabels.length];
                });
            } else {
                return arrays
                    .fillRange(this.positiveScale.getTickCount() + 1)
                    .map((x) => (this.positiveScale!.scaleStep * x).toString());
            }
        } else {
            assert(isDef(this.positiveScale), "positive scale must be defined for y-axis");

            if (this.manager.negativeScale) {
                assert(isDef(this.negativeScale), "negative scale must be defined for y-axis");

                const scaleLabels = this.negativeScale.getScaleLabels(true, true);

                // check if 0 & -0 exist, if so remove the negative 0
                if (scaleLabels[scaleLabels.length - 1] === "0" && this.positiveScale.getScaleLabels().includes("0")) {
                    scaleLabels.pop();
                }

                return [...scaleLabels, ...this.positiveScale.getScaleLabels()];
            } else {
                return this.positiveScale.getScaleLabels();
            }
        }
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
