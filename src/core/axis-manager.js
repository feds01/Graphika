/**
 * Module description:   /axis-manager.js
 *
 * Created on 23/12/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 *
 * */
import config from "./config"
import * as utils from "../general"
import * as arrays from "../utils/arrays"
import Axis, {AxisType} from "./axis"

class AxisManager {
    constructor(graph) {
        this.graph = graph;

        // Object to hold Axis(...) options
        this.options = {axisColour: config.axisColour};

        this.data = graph.dataManager.join();

        // Does the data contain any negative values, if so enable negative axis.
        this.negativeScale = arrays.negativeValues(this.data).length > 0;

        // initialise the y-axis & x-axis
        this.yAxis = new Axis(this, AxisType.Y_AXIS, this.options);
        this.xAxis = new Axis(this, AxisType.X_AXIS, this.options);

        // The scale numbers of the x-axis & y-axis in object
        this.scaleNumbers = {
            x: this.xAxis.scaleLabels,
            y: this.yAxis.scaleLabels
        };

        /* Work out if we should do a 'zeroScale', where the 'X' & 'Y' axis' share a zero */
        // if the graph has a zero scale setting, and the y-scale first element is a 0
        // (excluding negative scales), don't draw the 0 on the first tick and remove it from
        // scaleNumbers for the time being.
        if (this.graph.gridOptions.sharedAxisZero &&
            this.scaleNumbers.x.indexOf("0") === 0 &&
            this.scaleNumbers.y.indexOf("0") === 0) {
            this.sharedAxisZero = true;
        }
    }


    draw() {
        // check if the sharedAxisZero was detected in y-axis draw method, do the same thing
        // as for the y-axis and then draw the centered 0.
        if (this.sharedAxisZero) {
            this.graph.drawer.text("0",
                this.graph.lengths.x_begin - this.graph.options.padding,
                this.graph.yLength + this.graph.padding.top + this.graph.fontSize(),
                14, config.axisColour
            );
        }

        // get the context ready to draw
        this.graph.ctx.strokeStyle = utils.rgba(this.options.axisColour, 60);
        this.graph.ctx.lineWidth = config.gridLineWidth;

        this.yAxis.draw();
        this.xAxis.draw();
    }

    get xAxisTickStep() {
        return this.xAxis.scaleStep;
    }

    get yAxisTickStep() {
        return this.yAxis.scaleStep;
    }

    get xAxisYStart() {
        return this.xAxis.yStart;
    }

    get yAxisScaleNumbers() {
        return this.yAxis.scaleLabels;
    }

    get xAxisScaleNumbers() {
        return this.xAxis.scaleLabels;
    }

    get joinedScaleNumbers() {
        return [...this.scaleNumbers.x, ...this.scaleNumbers.y];
    }
}

export default AxisManager;