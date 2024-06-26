/**
 * src/basic.graph.ts
 *
 * Module description:
 *
 * The implementation of the `BasicGraph`.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import config from "./config";
import { isDef, merge } from "./utils/object";
import colours, { rgba } from "./utils/colours";
import { assert } from "./utils/assert";
import * as arrays from "./utils/arrays";
import * as utils from "./utils/html";

import Line from "./core/line";
import Drawer, { CanvasTextAlign } from "./core/drawing";
import AxisManager from "./core/axis-manager";
import DataManager, { DataSource } from "./core/data-manager";
import LegendManager, { LegendOptions } from "./legend/manager";
import { AxisOptions } from "./core/axis";

type GridOptions = {
    gridded: boolean;
    gridLineStyle: string;
    optimiseSquareSize: boolean;
    sharedAxisZero: boolean;
    strict: boolean;
};

type BasicGraphOptions = {
    debug: boolean;
    x_label: string;
    y_label: string;
    padding: number;
    labelFont: string;
    axisColour: string;
    grid: GridOptions;
    title: GraphTitleOptions;
    scale: {
        shorthandNumerics: boolean;
        x: AxisOptions;
        y: AxisOptions;
    };
    legend: LegendOptions;
};

type GraphTitleOptions = {
    draw: boolean;
    content: string;
    position: GraphTitlePosition;
    alignment: GraphTitleAlignment;
    fontFamily: string;
    fontSize: number;
    colour: string;
};

type GraphTitlePosition = "top";
type GraphTitleAlignment = "start" | "center" | "end";

type GraphPadding = {
    top: number;
    left: number;
    right: number;
    bottom: number;
    textPadding: number;
};

type GraphLengths = {
    x_begin: number;
    y_begin: number;
    x_end: number;
    y_end: number;
    x_center: number;
    y_center: number;
};

/**
 * @since v0.0.1 Default values for options within the object, however this will
 * soon be phased out in favour of core/config * */
const defaultConfig: BasicGraphOptions = {
    // internal settings
    debug: false,

    // general graph settings
    x_label: "",
    y_label: "",
    padding: 14,

    title: {
        draw: true,
        content: "Graph",
        position: "top",
        alignment: "center",
        fontFamily: "monospace",
        fontSize: 24,
        colour: config.axisColour,
    },

    axisColour: colours.BLACK,
    labelFont: '"Roboto Mono", monospace',

    // default grid settings
    grid: {
        gridded: true,
        gridLineStyle: "solid",
        optimiseSquareSize: true,
        sharedAxisZero: true,
        strict: false,
    },

    // default scale settings
    scale: {
        shorthandNumerics: false,
        x: {
            ticks: 10,
            optimiseTicks: true,
            drawTicks: true,
            drawLabels: true,
            labelDirection: "horizontal",
            axisColour: config.axisColour,
        },
        y: {
            ticks: 10,
            drawTicks: true,
            drawLabels: true,
            startAtZero: false,
            axisColour: config.axisColour,
        },
    },

    // default legend settings
    legend: {
        draw: false,
        position: "top",
        alignment: "center",
    },
}; // TODO: create a validation schema function

/**
 * Class that represent the basis graph drawing option
 */
class BasicGraph {
    /**
     * @since v0.0.1 Graph options, this contain x-labels, y-label, tittle, legends, points
     * style, gridded, etc. More on graph options can be read in the documentation * */
    public options: BasicGraphOptions;

    /**
     * @since v0.0.1 DataManager object which contains the data for the lines the graph should
     * plot, the object also contains various utility functions to fetch stats on the data. * */
    public dataManager: DataManager;

    /**
     * @since v0.0.1 LegendManager is the interface to use when dealing with the legend on the graph,
     * it contains the data for the legend and the methods to draw the legend on the graph.
     */
    private legendManager?: LegendManager;

    /**
     * This is the font size of the labels, initially it is set to 0, later on it is set if
     * the labels are not empty strings or null.
     *
     * @@TODO: move this into options?
     * */
    labelFontSize: number;

    /**
     * @since v0.0.1 AxisManager object is a manager class for the Axis objects of this Graph object,
     * The AxisManager contains the xAxis & yAxis objects, it also handles the synchronisation of scales &
     * negative axis modes.
     * */
    axisManager: AxisManager;

    /**
     * @since v0.0.1 Drawer object is the interface to use when dealing with the drawing of the graph,
     * it contains the canvas element, the canvas context and the methods to draw on the canvas.
     */
    drawer: Drawer;

    /**
     * @since v0.0.1 A reference to the canvas element.
     */
    canvas: HTMLCanvasElement;

    /**
     * @since v0.0.1 The canvas context object, this is used to draw on the canvas element.
     */
    ctx: CanvasRenderingContext2D;

    // @@TODO: move all of this into GraphMeasurements
    padding: GraphPadding;
    gridRectSize: { x: number; y: number };
    xLength: number;
    yLength: number;
    lengths: GraphLengths = {
        x_begin: 0,
        y_begin: 0,
        x_end: 0,
        y_end: 0,
        x_center: 0,
        y_center: 0,
    };

    constructor(
        private readonly id: string,
        options: BasicGraphOptions,
        data: DataSource[]
    ) {
        this.dataManager = new DataManager(data);

        // This is the global 'options' object for the whole settings range including grid, scale and
        // general settings.
        this.options = merge(defaultConfig, options);

        // find canvas element and tittle element.
        const { canvas } = utils.findObjectElements(this.id);
        assert(isDef(canvas), "Canvas element not found in the graph container.");

        this.canvas = canvas;
        this.ctx = utils.setupCanvas(canvas);

        this.drawer = new Drawer(this.canvas, this.ctx, { labelFont: this.options.labelFont });
        this.drawer.toTextMode(16, this.options.axisColour);

        this.labelFontSize = 0;

        // if no labels provided, they are disabled as in no room is provided
        // for them to be drawn.
        if (this.options.y_label !== "" && this.options.x_label !== "") {
            this.labelFontSize = this.fontSize();
        }

        this.axisManager = new AxisManager(this);

        // check if we need to draw the legend for this graph.
        if (this.options.legend.draw) {
            this.legendManager = new LegendManager(this, this.dataManager.generateLegendInfo());
        }

        // initial padding configuration
        this.padding = {
            top: this.options.padding,
            left: 0,
            right: this.options.padding,
            bottom: 0,
            textPadding: 4,
        };

        this.calculatePadding();
        this.xLength = this.canvas.clientWidth - (this.padding.right + this.padding.left + this.labelFontSize);
        this.yLength = this.canvas.clientHeight - (this.padding.top + this.padding.bottom);

        // Subtract a 1 from each length because we actually don't need to worry about the first
        // iteration. Having an extra pole will make the square size less than it should be, We're
        // actually only really concerned about how many 'gaps' there are between each item
        this.gridRectSize = {
            x: this.xLength / (this.axisManager.xAxis.scaleLabels.length - 1),
            y: this.yLength / (this.axisManager.yAxis.scaleLabels.length - 1),
        };

        // if 'strict' grid mode is enabled, we select the smallest grid size out of x and y
        // and set this to being the grid size lengths
        if (this.options.grid.strict) {
            const gridRectLength = Math.min(this.gridRectSize.x, this.gridRectSize.y);

            this.gridRectSize.x = gridRectLength;
            this.gridRectSize.y = gridRectLength;
        }

        // Calculate all the necessary length the graph requires to draw itself.
        this.calculateLengths();
    }

    fontSize() {
        return parseInt(this.ctx.font.substr(0, 2), 10);
    }

    /**
     * @since v0.0.1
     * @API This method is used to remove a line by a given 'label' which is present with every line that
     * is present on the graph. If the developer does not specify a label, a random string is generated and that
     * is used as a label instead.
     * */
    // TODO: most likely not random string, just use incremental labeling like 'line_2', 'line_3' etc.
    removeLineByLabel(label: string) {
        let foundLine = false;

        for (let k = 0; k < this.dataManager.data.length; k++) {
            if (this.dataManager.data[k].label === label && !foundLine) {
                this.dataManager.data.splice(k, 1);
                foundLine = true;
            }
        }

        // re-draw the graph regardless if a line was found found or not
        this.draw();

        assert(foundLine, "No line with label '" + label + "' found on this graph.");
    }

    /**
     * @since v0.0.1
     * @API This method is used to fetch all line labels that are present on this graph.
     *
     * */
    getLineLabels() {
        return this.dataManager.data.map((lineData) => {
            return lineData.label;
        });
    }

    #determinePositionFromSetting(): { offset: number; alignment: CanvasTextAlign } {
        const { alignment, position } = this.options.title;

        // @@Future: support `left`, `right`, and `bottom` positions
        assert(position === "top", "Only top position is supported for title");

        if (alignment === "start") {
            return { offset: this.lengths.x_begin, alignment: "left" };
        } else if (alignment === "center") {
            return { offset: this.lengths.x_center, alignment: "center" };
        } else if (alignment === "end") {
            return { offset: this.lengths.x_end, alignment: "right" };
        } else {
            assert(false, "Positional setting did not match any of the presets");
        }
    }

    #drawTitle() {
        if (!this.options.title.draw) {
            return;
        }

        // draw the graph title at the specified position with font size and family specified
        const { offset, alignment } = this.#determinePositionFromSetting();

        this.ctx.save();

        // add the title
        this.drawer.text(
            this.options.title.content,
            offset,
            (this.options.title.fontSize + this.padding.textPadding) / 2, // so the text is vertically centred
            this.options.title.fontSize,
            this.options.title.colour,
            alignment
        );

        this.ctx.restore();
    }

    #drawLabels() {
        if (this.labelFontSize === 0) return;

        let labelXOffset = 0;
        let labelYOffset = 0;

        // check if we need to offset the x-label
        if (this.legendManager) {
            if (this.options.legend.draw && this.legendManager.position === "bottom") {
                labelXOffset = this.legendManager.requiredSpace;
            }

            // check if we need to offset the y-label
            if (this.options.legend.draw && this.legendManager.position === "left") {
                labelYOffset = this.legendManager.requiredSpace;
            }
        }

        // add x-axis label
        this.drawer.text(
            this.options.x_label,
            this.lengths.x_center,
            this.drawer.height - (this.fontSize() / 2 + labelXOffset),
            this.fontSize(),
            config.axisColour
        );

        // add y-axis label
        this.ctx.save();
        this.ctx.translate(this.fontSize() + labelYOffset, this.lengths.y_center);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(this.options.y_label, 0, 0);
        this.ctx.restore();
    }

    #drawAxisGrid() {
        this.ctx.lineWidth = config.gridLineWidth;
        this.ctx.strokeStyle = rgba(config.axisColour, 40);

        this.ctx.setLineDash(this.options.grid.gridLineStyle === "dashed" ? [5, 5] : []);

        // get the number of ticks on the axis
        const xTicks = this.axisManager.xAxis.scaleLabels.length;
        const yTicks = this.axisManager.yAxis.scaleLabels.length;

        const y_len = this.options.grid.gridded ? 9 + this.yLength : 9;
        const x_len = this.options.grid.gridded ? 9 + this.xLength : 9;

        let offset = 0;

        while (offset <= Math.max(yTicks - 1, xTicks)) {
            // The X-Axis drawing
            if (offset < xTicks) {
                const x_offset = offset * this.gridRectSize.x;
                this.drawer.verticalLine(this.lengths.x_begin + x_offset, this.yLength + this.padding.top, -y_len + 9);
            }

            // The Y-Axis drawing
            if (offset < this.axisManager.yAxis.scaleLabels.length) {
                const y_offset = offset * this.gridRectSize.y;
                this.drawer.horizontalLine(this.lengths.x_begin, this.lengths.y_begin + y_offset, x_len - 9);
            }
            offset++;
        }
    }

    #drawData() {
        for (const lineData of this.dataManager.get()) {
            const { style, area, colour, interpolation, label, annotatePoints, data } = lineData;

            // don't even init the line if no data is supplied
            if (lineData.data.constructor === Float64Array && lineData.data.length > 0) {
                const line = new Line(data, this, {
                    style,
                    area,
                    colour,
                    interpolation,
                    label,
                    annotatePoints: annotatePoints ?? false,
                });

                line.draw();
            }
        }
    }

    calculateLengths() {
        this.xLength = this.canvas.clientWidth - (this.padding.right + this.padding.left + this.labelFontSize);

        this.yLength = this.canvas.clientHeight - (this.padding.top + this.padding.bottom + this.labelFontSize);

        this.lengths = {
            x_begin: this.padding.left + this.labelFontSize,
            y_begin: this.padding.top,
            x_end: this.drawer.width - this.padding.right,
            y_end: this.drawer.height - this.padding.bottom,
            x_center: this.padding.left + this.labelFontSize + this.xLength / 2,
            y_center: this.padding.top + this.labelFontSize / 2 + this.yLength / 2,
        };
    }

    calculatePadding() {
        // get the specified font size for title and the standard text padding so there
        // is a gap between the graph (and maybe a legend)
        this.padding.top += this.options.title.draw ? this.options.title.fontSize + this.padding.textPadding : 0;

        const longestItem = arrays.longest(this.axisManager.yAxis.getScaleLabels());

        // Set the config font size of axis labels, and then we can effectively 'measure' the width of the text
        this.drawer.toTextMode(config.axisLabelFontSize, config.axisColour);
        this.padding.left = Math.ceil(
            this.options.padding + 9 + 3 * this.padding.textPadding + this.ctx.measureText(longestItem).width
        );

        // get last label on x-axis
        const lastItemOnXAxis = this.axisManager.xAxis.scaleLabels[this.axisManager.xAxis.scaleLabels.length - 1];

        this.padding.right = Math.ceil(this.options.padding + this.ctx.measureText(lastItemOnXAxis).width);

        // measure the right padding to determine if we need to add padding to
        // fit in the last scale label if it goes out of bounds.

        this.padding.bottom = Math.ceil(this.options.padding + this.labelFontSize + this.fontSize());

        // apply legend padding if legends are enabled
        if (this.options.legend.draw && isDef(this.legendManager)) {
            this.padding[this.legendManager.position] += this.legendManager.requiredSpace;
        }
    }

    /**
     * Method that draws the whole graph, computing all pre-requisites and then invoking
     * draw on children components.
     *  */
    draw() {
        // clear the rectangle and reset colour
        this.ctx.clearRect(0, 0, this.drawer.width, this.drawer.height);
        this.ctx.strokeStyle = config.axisColour;
        this.ctx.fillStyle = colours.BLACK;
        this.ctx.translate(0.5, 0.5);

        // optimise x-square-size if float
        if (this.options.grid.optimiseSquareSize && this.gridRectSize.x % 1 !== 0) {
            let preferredSquareSize = Math.round(this.gridRectSize.x);
            const numberOfSquares = this.axisManager.xAxis.scaleLabels.length - 1;

            // If the square size was some round up, rather than down, we need to check if
            // we can actually apply the 'scale' up with the padding space available to the right
            // of the graph. If we can't fit in the scale up, we will have to go down as we are
            // guaranteed to have enough space.
            if (
                preferredSquareSize > this.gridRectSize.x &&
                this.padding.right - (preferredSquareSize - this.gridRectSize.x) * numberOfSquares < 0
            ) {
                preferredSquareSize--;
            }
            this.gridRectSize.x = preferredSquareSize;

            // If 'strict' mode is set in options.grid, we also need to set the value of the 'y' length
            // to be the same as the x length.
            if (this.options.grid.strict) {
                this.gridRectSize.y = preferredSquareSize;
            }

            // we need to re-calculate right padding before we can call calculateLengths() as it is dependant on the
            // right padding value, which has now changed.
            this.padding.right =
                this.canvas.clientWidth - (this.gridRectSize.x * numberOfSquares + this.lengths.x_begin);

            this.xLength = this.canvas.clientWidth - (this.padding.right + this.padding.left + this.labelFontSize);
        }

        this.calculateLengths();

        // TODO: this should be used as a general form for the Y-Axis length of the graph.
        this.yLength = (this.axisManager.yAxis.scaleLabels.length - 1) * this.gridRectSize.y;

        /* Draw our Axis', including negative scales & scale labels */
        this.axisManager.draw();

        /* Draw the title on the graph */
        this.#drawTitle();

        /* Draw the legend if it is enabled */
        this.legendManager?.draw();

        /* Draw the 'X-Label' & 'Y-Label' labels on the graph canvas */
        this.#drawLabels();

        /* Draw the Grid on the Graph lines & axis ticks, if enabled */
        this.#drawAxisGrid();

        /* Draw the data sets on the graph, using the provided dataset configurations  */
        this.#drawData();

        // draw boundaries over graph if we're in debug view.
        if (this.options.debug) {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset translation

            this.ctx.lineWidth = 2;

            // draw canvas boundary in red
            this.ctx.strokeStyle = "red";
            this.ctx.strokeRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

            this.ctx.strokeStyle = colours.DEBUG;
            this.ctx.fillStyle = colours.DEBUG;

            // draw box around graph boundary
            this.ctx.strokeRect(this.lengths.x_begin, this.lengths.y_begin, this.xLength, this.yLength);

            // draw line at center of the graph
            this.ctx.beginPath();
            this.ctx.moveTo(this.lengths.x_begin, this.lengths.y_center);
            this.ctx.lineTo(this.lengths.x_end, this.lengths.y_center);

            this.ctx.moveTo(this.lengths.x_center, this.lengths.y_begin);
            this.ctx.lineTo(this.lengths.x_center, this.lengths.y_end);

            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
}

export default BasicGraph;
