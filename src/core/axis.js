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

const arrays = require("../utils/arrays");
const conversions = require("../utils/conversions");
const config = require("./config");
const utils = require("./../utils");
const {Scale} = require("./scale");
const {assert} = require("./../utils/assert");

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
        this.manager = manager;
        this.data = this.manager.graph.dataManager.join();
        this.graph = this.manager.graph;
        this.options = options;
        this.type = type;

        // This is the variable which holds the tick step of the axis.
        this.scaleStep = 0;

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

        // Ensure that minTicks & maxTicks don't overflow and aren't negative, otherwise they would cause a
        // DivisionByZero or Infinity issues
        assert(
            this.options.maxTicks > 0 && this.options.minTicks > 0,
            "Max/Min ticks cannot be 0 or negative"
        );

        this._computeAxisScale();
        this.generateScaleNumbers();
    }


    /**
     * @since v0.0.1 Takes in input as the lengths object from a graph object.
     * */
    determineAxisPosition() {
        // Y & X positions which represent the start of the drawing line
        // @Cleanup: this must be determined here because the graph 'lengths' haven't been
        // calculated yet.
        this.yStart = this.graph.padding.top + this.graph.yLength;

        // position the x-axis then in the center of the y-axis, calculate this offset by indexing
        // where the zero '0' value in the scale label array (reversed), and multiplying this by the
        // amount of squares there are between the zero and the last axis value. We need to reverse
        // the labels because the Axis position is calculated from the top of the graph, where as
        // the numbers are drawn from the bottom of the graph.
        // TODO: maybe just change the calculation to compute the position of the x-axis from the
        //      bottom of the graph.
        if (this.type === AxisType.X_AXIS && this.manager.negativeScale) {
            let zeroIndex = this.manager.scaleNumbers.y.reverse().indexOf(0);

            // The zero index must not be '-1' or in other words, not found.
            assert(zeroIndex !== -1, `couldn't find the '0' scale position in Axis{${this.type}}`);

            this.yStart = this.graph.lengths.y_begin + (this.graph.gridRectSize.y * zeroIndex);
        }
    }

    _computeAxisScale() {
        if (this.type === AxisType.X_AXIS) {
            this.options.maxTicks = Math.min(this.graph.dataManager.maxLen(), config.xTicks);

            this.positveScale = new Scale({
                min: 0,
                max: this.graph.dataManager.maxLen() - 1,
                maxTicks: this.options.maxTicks
            });

            this.scaleStep = this.positveScale.getScaleStep();
        } else if (this.type === AxisType.Y_AXIS) {
            let positiveValues = arrays.positiveAndZeroValues(this.data);

            if (this.manager.negativeScale) {
                let negativeDataSet = arrays.negativeValues(this.data).map(x => Math.abs(x));
                // divide the max ticks by two since negative and positive are sharing the scale.
                this.negativeScale = new Scale({
                    min: Math.min(...negativeDataSet),
                    max: Math.max(...negativeDataSet),
                    maxTicks: this.options.maxTicks / 2,
                    isNegativeScale: true,
                });
            }

            this.positveScale = new Scale({
                min: Math.min(...positiveValues),
                max: Math.max(...positiveValues),
                maxTicks: this.manager.negativeScale ? this.options.maxTicks / 2 : this.options.maxTicks,
            });

            /*
            // Get the largest tick step of the two and set the other scale tick step to the same one. This is
            // because the tick steps must be consistent for both negative and positive scales. Synchronise the
            // tickSteps basically.
            */
            if (this.manager.negativeScale) {
                this.scaleStep = Math.max(this.positveScale.getScaleStep(), this.negativeScale.getScaleStep());

                this.positveScale.setTickStep(this.scaleStep);
                this.negativeScale.setTickStep(this.scaleStep);

            } else {
                this.scaleStep = this.positveScale.getScaleStep();
            }
        } else {
            throw Error(`graph.js: Unrecognised Axis type '${this.type}'`);
        }
    }

    generateScaleNumbers() {
        this.scaleNumbers = [];

        if (this.type === AxisType.X_AXIS) {
            this.scaleNumbers = arrays.fillRange(this.options.maxTicks).map(
                x => this.positveScale.scaleStep * x
            );
        } else {
            if (this.manager.negativeScale) {
                this.scaleNumbers = this.negativeScale.getScaleLabels(true, true);

                // check if 0 & -0 exist, if so remove the negative 0
                if (this.scaleNumbers[this.scaleNumbers.length - 1] === 0) this.scaleNumbers.pop();

                this.scaleNumbers = [...this.scaleNumbers, ...this.positveScale.getScaleLabels()];
            } else {
                this.scaleNumbers = this.positveScale.getScaleLabels();
            }
        }
    }

    // @Cleanup: There must be some cleaner way to get this value, maybe using
    // AxisManager store this value.
    get yStartingPosition() {
        return this.yStart;
    }

    draw() {
        // determine the positions of the x-axis
        this.determineAxisPosition();
        let offset = this.manager.sharedAxisZero ? 1 : 0;

        // get the context ready to draw
        this.graph.ctx.lineWidth = config.gridLineWidth;
        this.graph.ctx.strokeStyle = utils.rgba(this.options.axisColour, 60);

        // Apply numerical conversion magic.
        // TODO: add configuration for exactly which axis' should use these conversions.
        let scaleNumericsToDraw = this.scaleNumbers;

        if (this.graph.scaleOptions.shorthandNumerics) {
            scaleNumericsToDraw = scaleNumericsToDraw.map((numeric) => {
                return conversions.convertFromNumerical(numeric);
            });
        }

        // Y-Axis Drawing !
        if (this.type === AxisType.Y_AXIS) {
            this.graph.drawer.verticalLine(this.graph.lengths.x_begin, this.graph.lengths.y_begin, this.graph.yLength + 9);
            this.graph.ctx.textBaseline = "middle";

            for (let number of scaleNumericsToDraw) {
                if (!(this.manager.sharedAxisZero && number === 0)) {
                    let y_offset = offset * this.graph.gridRectSize.y;
                    let scale_offset = Math.ceil(this.graph.ctx.measureText(number).width / 1.5);

                    this.graph.drawer.text(
                        number,
                        this.graph.lengths.x_begin - 9 - scale_offset,
                        this.graph.padding.top + this.graph.yLength - y_offset,
                        config.scaleLabelFontSize,
                        this.options.axisColour
                    );
                    offset++;
                }
            }
        } else {
            this.graph.drawer.horizontalLine(this.graph.lengths.x_begin, this.yStart, this.graph.xLength);

            // We also need to draw a horizontal line at the bottom of the graph
            // if it includes a negative quadrant. We can check this by accessing the
            // manager.negativeScale constant, if so draw the horizontal line at the
            // bottom of the graph.
            if (this.manager.negativeScale && !this.graph.gridOptions.gridded) {
                this.graph.drawer.horizontalLine(this.graph.lengths.x_begin, this.graph.yLength + this.graph.padding.top, this.graph.xLength);
            }

            for (let number of this.scaleNumbers) {
                // if sharedAxisZero isn't enabled and the number isn't zero, draw the number label
                if (!(this.manager.sharedAxisZero && number === 0)) {
                    let x_offset = offset * this.graph.gridRectSize.x;
                    let scale_offset = this.graph.padding.top + this.graph.fontSize();

                    this.graph.drawer.text(number,
                        this.graph.lengths.x_begin + x_offset,
                        this.graph.yLength + 9 + scale_offset,
                        config.scaleLabelFontSize,
                        this.options.axisColour
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