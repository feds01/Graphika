/**
 * src/core/axis-manager.ts
 *
 * Module description:
 *
 * This module is responsible for managing the axis on the graph. The axis manager
 * is responsible for drawing the axis on the graph and managing the scale numbers.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 *
 * */
import Axis from "./axis";
import BasicGraph from "../basic.graph";
import config from "./../config";
import { rgba } from "../utils/colours";

class AxisManager {
    public xAxis: Axis;
    public yAxis: Axis;
    public scaleNumbers: { x: string[]; y: string[] };

    public sharedAxisZero: boolean = false;
    public negativeScale: boolean = false;
    public readonly data: Float64Array;

    constructor(public readonly graph: BasicGraph) {
        this.data = graph.dataManager.join();
        this.negativeScale = this.data.some((item) => item < 0);

        // initialise the y-axis & x-axis
        this.yAxis = new Axis(this, "y", this.graph.options.scale?.y ?? {});
        this.xAxis = new Axis(this, "x", this.graph.options.scale?.x ?? {});

        // The scale numbers of the x-axis & y-axis in object
        this.scaleNumbers = {
            x: this.xAxis.scaleLabels,
            y: this.yAxis.scaleLabels,
        };

        /* Work out if we should do a 'zeroScale', where the 'X' & 'Y' axis' share a zero */
        // if the graph has a zero scale setting, and the y-scale first element is a 0
        // (excluding negative scales), don't draw the 0 on the first tick and remove it from
        // scaleNumbers for the time being.
        if (
            this.graph.options.grid?.sharedAxisZero &&
            this.scaleNumbers.x.indexOf("0") === 0 &&
            this.scaleNumbers.y.indexOf("0") === 0
        ) {
            this.sharedAxisZero = true;
        }
    }

    getColour(): string {
        const base = (() => {
            // Use inheritance or option override for axis colour.
            if (this.graph.options.axisColour) return this.graph.options.axisColour;

            return config.axisColour;
        })();

        return rgba(base, 40);
    }

    /**
     * Method to draw on axis on the current graph. Takes into account graph settings
     * and then invokes the draw method on the individual drawing methods for each axis.
     * */
    draw() {
        // check if the sharedAxisZero was detected in y-axis draw method, do the same thing
        // as for the y-axis and then draw the centred 0.
        if (this.sharedAxisZero) {
            this.graph.drawer.text(
                "0",
                this.graph.lengths.xBegin - this.graph.padding.base,
                this.graph.lengths.yLength + this.graph.padding.top + this.graph.fontSize(),
                12,
                this.getColour(),
            );
        }

        this.yAxis.draw();
        this.xAxis.draw();
    }
}

export default AxisManager;
