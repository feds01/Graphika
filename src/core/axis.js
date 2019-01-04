/**
 * Module description: src/core/axis.js
 *
 * This module holds the general object for a graph/chart axis scale.
 * It determine if the axis should be negative, and also includes methods
 * to draw the scale, provided the graph object.
 *
 * Created on 29/06/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

const {Scale} = require("./scale");
const arrays = require("../utils/arrays");
const config = require("./config");
const draw = require("./drawing");
const utils = require("./../utils");
const assert = require("./../utils/assert").assert;

const defaultOptions = {
    minTicks: 10,
    maxTicks: 20,
    drawNotches: true,
    drawNumbers: true,
    startAtZero: true
};

const AxisType = {
    X_AXIS: "x-axis",
    Y_AXIS: "y-axis"
};

class Axis {
    constructor(manager, type, options) {
        this.maxDataPoints = manager.graph.dataManager.maxLen();
        this.data = manager.graph.dataManager.join();
        this.options = options;
        this.graph = manager.graph;
        this.type = type;

        this.manager = manager;

        /*
        // This is the flag which represents if the Axis is split into two scales, negative & positive.
        // Initial value is false, because we don's assume that provided dataset will use negative values.
        */
        this.hasNegativeScale = false;

        // This is the variable which holds the tick step of the axis.
        this.tickStep = 0;

        // we have negative values in the data set and therefore will require two
        // different scales
        this.positveScale = null;
        this.negativeScale = null;

        // fill in missing option values with default values
        for (let option of Object.keys(defaultOptions)) {
            if (this.options[option] === undefined) {
                this.options[option] = defaultOptions[option];
            }
        }

        if (this.options.maxTicks <= 0 || this.options.minTicks <= 0) {
            throw Error("Max/Min ticks cannot be 0 or negative");
        }

        let positiveValues = arrays.positiveAndZeroValues(this.data);



        switch (this.type) {
            case AxisType.X_AXIS:
                this.options["maxTicks"] = Math.min(this.graph.dataManager.maxLen(), config.xTicks);

                this.positveScale = new Scale({
                    min: 0,
                    max: this.maxDataPoints - 1,
                    maxTicks: this.options.maxTicks,
                    name: "positive scale"
                });
                break;
            case AxisType.Y_AXIS:
                if (arrays.negativeValues(this.data).length > 0) {
                    let negativeDataSet = arrays.negativeValues(this.data).map(x => Math.abs(x));
                    // divide the max ticks by two since negative and positive are sharing the scale.
                    this.negativeScale = new Scale({
                        min: Math.min(...negativeDataSet),
                        max: Math.max(...negativeDataSet),
                        maxTicks: this.options.maxTicks / 2,
                        name: "negative scale"
                    });
                    this.hasNegativeScale = true;
                }

                this.positveScale = new Scale({
                    min: Math.min(...positiveValues),
                    max: Math.max(...positiveValues),
                    maxTicks: this.hasNegativeScale ? this.options.maxTicks / 2 : this.options.maxTicks,
                    name: "positive scale"
                });

                /*
                // Get the largest tick step of the two and set the other scale
                // tick step to the same one. This is because the tick steps must be
                // consistent for both negative and positive scales. Synchronise the tickSteps basically.
                */
                if (this.hasNegativeScale) {
                    this.tickStep = Math.max(this.positveScale.getTickStep(), this.negativeScale.getTickStep());

                    this.positveScale.setTickStep(this.tickStep);
                    this.negativeScale.setTickStep(this.tickStep);

                } else {
                    this.tickStep = this.positveScale.getTickStep();
                }
                break;
            default:
                throw Error(`graph.js: Unrecognised Axis type '${this.type}'`);
        }
        this.generateScaleNumbers();
    }


    /**
     * @since v0.0.1
     * Takes in input as the lengths object from a graph object.
     * * */
    determineAxisPosition() {
        // Y & X positions which represent the start of the drawing line
        // @Cleanup: this must be determined here because the graph 'lengths' haven't been
        // calculated yet.
        this.yStart = this.graph.lengths.y_end;

        // position the x-axis then in the center of the y-axis, calculate this offset by indexing
        // where the zero '0' value is and multiplying this by the amount of squares there are between
        // the zero and the last axis value.
        if (this.type === AxisType.X_AXIS && this.hasNegativeScale) {
            let zeroIndex = this.manager.scaleNumbers["y"].indexOf(0);

            // The zero index must not be '-1' or in other words, not found.
            assert(zeroIndex !== -1, `couldn't find the '0' tick position in Axis{${this.type}}`);

            this.yStart = this.graph.lengths.y_end - (this.graph.squareSize.y * this.manager.scaleNumbers.y.indexOf(0));
        }
    }

    generateScaleNumbers() {
        this.scaleNumbers = [];

        if (this.type === AxisType.X_AXIS) {
            this.scaleNumbers = arrays.fillRange(this.options.maxTicks).map(
                x => this.positveScale.tickStep * x
            );

        } else {
            if (this.hasNegativeScale) {
                // @Cleanup: this is a quite horrible way to do this, maybe use a simple representation
                this.scaleNumbers = this.negativeScale.getTickLabels().map(x => x === 0 ? x : x * -1).slice().reverse();
            }
            this.scaleNumbers = arrays.join(this.scaleNumbers, this.positveScale.getTickLabels());

            // check if 0 & -0 exist, if so remove the negative 0
            for (let i = 0; i < this.scaleNumbers.length; i++) {
                if (this.scaleNumbers[i] === this.scaleNumbers[i + 1] &&
                    this.scaleNumbers[i] === 0) {
                    this.scaleNumbers.splice(i + 1, 1);
                }
            }
        }
    }

    // There must be some cleaner way to get this value, maybe using AxisManager store this value.
    get yStartingPosition() {
        return this.yStart;
    }

    draw() {
        // determine the positions of the x-axis
        this.determineAxisPosition();
        this.sharedZero = false;

        let offset = this.manager.sharedZero ? 1 : 0;

        // get the context ready to draw
        this.graph.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 60);
        this.graph.ctx.lineWidth = 1;

        // Y-Axis Drawing !
        if (this.type === AxisType.Y_AXIS) {
            draw.verticalLine(this.graph.ctx, this.graph.lengths.x_begin, this.graph.lengths.y_end, -this.graph.y_length);

            for (let number of this.scaleNumbers) {
                let y_offset = offset * this.graph.squareSize.y;
                let scale_offset = Math.ceil(this.graph.ctx.measureText(number.toString()).width / 1.5);

                this.graph.ctx.textBaseline = "middle";

                if (!(this.manager.sharedZero && number === 0)) {
                    this.graph.ctx.fillText(number.toString(),
                        this.graph.lengths.x_begin - 9 - scale_offset,
                        this.graph.lengths.y_end - y_offset
                    );
                    offset++;
                }
            }
        } else {
            draw.horizontalLine(this.graph.ctx, this.graph.lengths.x_begin, this.yStart, this.graph.x_length);

            for (let number of this.scaleNumbers) {
                let x_offset = offset * this.graph.squareSize.x;
                let scale_offset = this.graph.fontSize() / 2;

                draw.toTextMode(this.graph.ctx, 14, this.options.axis_colour);

                // if sharedZero isn't enabled and the number isn't zero, draw the number label
                if (!(this.manager.sharedZero && number === 0)) {
                    this.graph.ctx.fillText(number.toString(),
                        this.graph.lengths.x_begin + x_offset,
                        this.graph.lengths.y_end + 9 + scale_offset
                    );
                    offset++;
                }
            }
        }
    }
}

module.exports = {
    Axis: Axis,
    AxisType: AxisType
};