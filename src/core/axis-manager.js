/**
 * Module description:   /axis-manager.js
 *
 * Created on 23/12/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

const config = require("./config");
const utils = require("../utils");
const {Axis, AxisType} = require("./axis");

class AxisManager {
    constructor(graph) {
        this.graph = graph;

        // Object to hold Axis(...) options
        this.options = {axis_colour: config.axis_colour};

        // initialise the y-axis & x-axis
        this.yAxis = new Axis(this, AxisType.Y_AXIS, this.options);
        this.xAxis = new Axis(this, AxisType.X_AXIS, this.options);

        // The scale numbers of the x-axis & y-axis in object
        this.scaleNumbers = {
            "x": this.xAxis.scaleNumbers,
            "y": this.yAxis.scaleNumbers
        };

        // If the Y-Axis object has detected present negative values, we should update
        // the X-Axis to correspond to this change. This should be done in a better way
        // TODO: GraphScales object to better manage our scales
        this.xAxis.negativeScale = this.yAxis.negativeScale;

        // This is the variable which holds the tick step for positive & negative scales on
        // the Y-Axis
        this.tickStep = this.xAxis.tickStep;

        /* Work out if we should do a 'zeroScale', where the 'X' & 'Y' axis' share a zero */
        // if the graph has a zero scale setting, and the y-scale first element is a 0
        // (excluding negative scales), don't draw the 0 on the first tick and remove it from
        // scaleNumbers for the time being.
        if (this.graph.options.sharedZero &&
            this.scaleNumbers["x"].indexOf(0) === 0 &&
            this.scaleNumbers["y"].indexOf(0) === 0) {
            this.sharedZero = true;
        }
    }

    draw() {
        // check if the sharedZero was detected in y-axis draw method, do the same thing
        // as for the y-axis and then draw the centered 0.
        if (this.sharedZero) {
            this.graph.ctx.fillText("0",
                this.graph.lengths.x_begin - this.graph.options.padding,
                this.graph.lengths.y_end + this.graph.options.padding
            );
        }

        // get the context ready to draw
        this.graph.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 60);
        this.graph.ctx.lineWidth = 1;

        this.yAxis.draw();
        this.xAxis.draw();

        this.telemetry = {
            "xAxis": this.xAxis.telemetry,
            "yAxis": this.yAxis.telemetry,
        };
    }

    get yAxisScaleNumbers() {
        return this.yAxis.scaleNumbers;
    }

    get xAxisScaleNumbers() {
        return this.xAxis.scaleNumbers;
    }

    get joinedScaleNumbers() {
        return [...this.scaleNumbers["x"], ...this.scaleNumbers["y"]];
    }
}

module.exports = {
    AxisManager: AxisManager
};