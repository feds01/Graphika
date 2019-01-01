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
    X_AXIS: 'x-axis',
    Y_AXIS: 'y-axis'
}

class Axis {
    constructor(manager, type, options) {
        this.maxDataPoints = manager.graph.data.maxLen();
        this.data = manager.graph.data.join();
        this.options = options;
        this.graph = manager.graph;
        this.type = type;

        this.manager = manager;

        /// This is the variable which holds the tick step of the axis.
        this.tickStep = null;

        // we have negative values in the data set and therefore will require two
        // different scales
        this.scales = {};

        // Y & X positions which represent the start of the drawing line
        this.yStart = null;
        this.xStart = null;

        // fill in missing option values with default values
        for (let option of Object.keys(defaultOptions)) {
            if (this.options[option] === undefined) {
                this.options[option] = defaultOptions[option];
            }
        }

        if (this.options.maxTicks <= 0 || this.options.minTicks <= 0) {
            throw Error("Max/Min ticks cannot be 0 or negative");
        }

        switch (this.type) {
            case AxisType.X_AXIS:
                this.options['maxTicks'] = Math.min(this.graph.data.maxLen(), config.xTicks);

                this.scales.positive = new Scale({
                    min: 0,
                    max: this.maxDataPoints - 1,
                    maxTicks: this.options.maxTicks,
                    name: 'positive scale'
                });
                break;
            case AxisType.Y_AXIS:
                if (arrays.negativeValues(this.data).length > 0) {
                    let negativeDataSet = arrays.negativeValues(this.data).map(x => Math.abs(x));
                    // divide the max ticks by two since negative and positive are sharing the scale.
                    this.scales.negative = new Scale({
                        min: Math.min(...negativeDataSet),
                        max: Math.max(...negativeDataSet),
                        maxTicks: this.options.maxTicks / 2,
                        name: "negative scale"
                    });
                    this.negativeScale = true;
                } else {
                    this.negativeScale = false;
                }

                let positiveValues = arrays.positiveAndZeroValues(this.data);

                this.scales.positive = new Scale({
                    min: Math.min(...positiveValues),
                    max: Math.max(...positiveValues),
                    maxTicks: this.negativeScale ? this.options.maxTicks / 2 : this.options.maxTicks,
                    name: 'positive scale'
                });

                // Get the largest tick step of the two and set the other scale
                // tick step to the same one. This is because the tick steps must be
                // consistent for both negative and positive scales.
                if (this.negativeScale) {
                    this.tickStep = Math.max(this.scales["positive"].getTickStep(), this.scales["negative"].getTickStep());

                    this.scales["positive"].setTickStep(this.tickStep);
                    this.scales["negative"].setTickStep(this.tickStep);

                } else {
                    this.tickStep = this.scales["positive"].getTickStep();
                }
                break;
            default:
                throw Error(`graph.js: Unrecognised Axis type '${this.type}'`);
        }
        this.generateScaleNumbers();
    };


    /**
     * @since v0.0.1
     * Takes in input as the lengths object from a graph object.
     * * */
    determineAxisPosition() {
        this.yStart = this.graph.lengths.y_end;
        this.xStart = this.graph.lengths.x_begin;

        // position the x-axis then in the center of the y-axis, calculate this offset by indexing
        // where the zero '0' value is and multiplying this by the amount of squares there are between
        // the zero and the last axis value.
        if (this.type === AxisType.X_AXIS && this.negativeScale) {
            let zeroIndex = this.manager.scaleNumbers['y'].indexOf(0);

            // The zero index must not be '-1' or in other words, not found.
            assert(zeroIndex !== -1, `couldn't find the '0' tick position in Axis{${this.type}}`);

            this.yStart = this.graph.lengths.y_end - (this.graph.squareSize.y * this.manager.scaleNumbers.y.indexOf(0));
        }

        // Set the Axis' telemetry data, so it can be accessed by the manager
        this.telemetry = {
            "xStart": this.xStart,
            "yStart": this.yStart,
            "tickStep": this.tickStep
        }
    }

    generateScaleNumbers() {
        this.scaleNumbers = [];

        if (this.type === AxisType.X_AXIS) {
            this.scaleNumbers = arrays.fillRange(this.options.maxTicks + 1).map(
                x => this.scales["positive"].tickStep * x
            );

        } else {
            if (this.negativeScale) {
                this.scaleNumbers = this.scales['negative'].getTickLabels().map(x => x === 0 ? x : x * -1).slice().reverse();
            }
            this.scaleNumbers = arrays.join(this.scaleNumbers, this.scales["positive"].getTickLabels());

            // check if 0 & -0 exist, if so remove the negative 0
            for (let i = 0; i < this.scaleNumbers.length - 1; i++) {
                if (this.scaleNumbers[i] === this.scaleNumbers[i + 1] &&
                    this.scaleNumbers[i] === 0) {
                    this.scaleNumbers.splice(i + 1, 1);
                }
            }
        }
    }

    draw() {
        // determine the positions of the x-axis
        this.determineAxisPosition();
        this.sharedZero = false;
        let offset = 0;

        // get the context ready to draw
        this.graph.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 60);
        this.graph.ctx.lineWidth = 1;

        /// Y-Axis Drawing !
        if (this.type === AxisType.Y_AXIS) {
            draw.verticalLine(this.graph.ctx, this.xStart, this.graph.lengths.y_end, -this.graph.y_length);
            // if the graph has a zero scale setting, and the y-scale first element is a 0
            // (excluding negative scales), don't draw the 0 on the first tick and remove it from
            // scaleNumbers for the time being.
            if (this.graph.options.zero_scale && this.scaleNumbers.indexOf(0) === 0) {
                this.scaleNumbers.shift();
                this.sharedZero = true;

                offset++;
            }

            for (let number of this.scaleNumbers) {
                let y_offset = offset * this.graph.squareSize.y;
                let scale_offset = Math.ceil(this.graph.ctx.measureText(number.toString()).width / 1.5);

                this.graph.ctx.textBaseline = 'middle';
                this.graph.ctx.fillText(number.toString(),
                    this.graph.lengths.x_begin - 9 - scale_offset,
                    this.graph.lengths.y_end - y_offset
                );
                offset++;
            }

            // add the '0' back if it was removed
            if (this.sharedZero) {
                this.scaleNumbers = [0].concat(this.scaleNumbers);
            }

        } else {
            draw.horizontalLine(this.graph.ctx, this.xStart, this.yStart, this.graph.x_length);

            // check if the sharedZero was detected in y-axis draw method, do the same thing
            // as for the y-axis and then draw the centered 0.
            if (this.manager.sharedZero) {
                this.scaleNumbers.shift();
                this.sharedZero = true;

                offset = 1;

                this.graph.ctx.fillText('0',
                    this.graph.lengths.x_begin - this.graph.padding.val,
                    this.graph.lengths.y_end + this.graph.padding.val
                );
            }

            for (let number of this.scaleNumbers) {
                let x_offset = offset * this.graph.squareSize.x;
                let scale_offset = this.graph.font_size / 2;

                draw.toTextMode(this.graph.ctx, 14, this.options.axis_colour);

                this.graph.ctx.fillText(number.toString(),
                    this.xStart + x_offset,
                    this.graph.lengths.y_end + 9 + scale_offset
                );
                offset++;
            }

            // add the '0' back if it was removed
            if (this.sharedZero) {
                this.scaleNumbers = [0].concat(this.scaleNumbers);
            }
        }

    }
}

module.exports = {
    Axis: Axis,
    AxisType: AxisType
};