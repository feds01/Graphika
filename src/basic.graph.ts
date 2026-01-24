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
import { EasingAnimationFn, easeOutCubic } from "./core/animation";

export type GridOptions = {
    gridded?: boolean;
    gridLineStyle?: string;
    optimiseSquareSize?: boolean;
    sharedAxisZero?: boolean;
    strict?: boolean;
};

/** Animation options for the graph. */
export type AnimationOptions = {
    /** Whether to animate the lines when drawing. */
    enabled: boolean;
    /** Duration of the animation in milliseconds. */
    duration?: number;
    /** Easing function for the animation. */
    easing?: EasingAnimationFn;
};

export type BasicGraphOptions = {
    /** Padding around the graph content. */
    padding?: number;

    // @@TODO: move this potentially into `AxisOptions.LabelOptions`
    x_label?: string;

    // @@TODO: move this potentially into `AxisOptions.LabelOptions`
    y_label?: string;

    // @@TODO: move this potentially into `AxisOptions.LabelOptions`
    labelFont?: string;

    // @@TODO: move this potentially into `AxisOptions.LabelOptions`
    labelFontSize?: number;

    /** Colour of the axes. */
    axisColour?: string;

    /** Grid options for the graph. */
    grid?: GridOptions;

    /** Title options for the graph. */
    title?: TitleOptions;

    /** Scale options for the graph axes. */
    scale?: {
        shorthandNumerics?: boolean;
        x?: AxisOptions;
        y?: AxisOptions;
    };

    /** Legend options for the graph. */
    legend?: LegendOptions;

    /** Animation settings for the graph. */
    animation?: AnimationOptions;

    /** Debug mode for the graph. Enables additional logging and visual aids for development. */
    debug?: boolean;
};

export type TitleOptions = {
    draw?: boolean;
    content: string;
    position?: TitlePosition;
    alignment?: TitleAlignment;
    fontFamily?: string;
    fontSize?: number;
    colour?: string;
};

export type TitlePosition = "top";
export type TitleAlignment = "start" | "center" | "end";

type Padding = {
    /**
     * The base amount of padding that is applied around the border of the
     * graph canvas.
     */
    base: number;

    top: number;
    left: number;
    right: number;
    bottom: number;
    textPadding: number;
};

type Lengths = {
    xBegin: number;
    yBegin: number;
    xEnd: number;
    yEnd: number;
    xCenter: number;
    yCenter: number;
    xLength: number;
    yLength: number;
};

const DEFAULT_PADDING = 8;
const DEFAULT_TITLE_FONT_SIZE = 24;

/**
 * @since v0.0.1 Default values for options within the object, however this will
 * soon be phased out in favour of core/config * */
const defaultConfig: BasicGraphOptions = {
    // internal settings
    debug: false,

    // general graph settings
    padding: DEFAULT_PADDING,

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
    labelFontSize: 12,

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

    // default animation settings
    animation: {
        enabled: false,
        duration: 1000,
        easing: easeOutCubic,
    },
} as const; // TODO: create a validation schema function

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
    padding: Padding;
    gridRectSize: { x: number; y: number };

    /**
     * The Line instances created for this graph. These are populated during draw().
     */
    private lines: Line[] = [];

    lengths: Lengths = {
        xBegin: 0,
        yBegin: 0,
        xEnd: 0,
        yEnd: 0,
        xCenter: 0,
        yCenter: 0,
        yLength: 0,
        xLength: 0,
    };

    constructor(
        private readonly id: string,
        options: BasicGraphOptions,
        data: DataSource[],
    ) {
        this.dataManager = new DataManager(data);

        // This is the global 'options' object for the whole settings range including grid, scale and
        // general settings.
        this.options = merge(defaultConfig, options);

        // Canvas setup.
        const canvas = utils.findCanvas(this.id);
        assert(isDef(canvas), "Canvas element not found in the graph container.");
        this.canvas = canvas;
        this.ctx = utils.setupCanvas(canvas);

        const labelFont = this.options.labelFont ?? defaultConfig.labelFont!;
        const labelFontSize = this.options.labelFontSize ?? defaultConfig.labelFontSize!;
        this.drawer = new Drawer(this.canvas, this.ctx, { labelFont });
        this.drawer.toTextMode(16, this.options.axisColour);

        this.axisManager = new AxisManager(this);

        // 1. Initial padding configuration. This is a rudimentary padding setup, the actual
        // calculation of padding is done in `calculatePadding()`.
        const base = this.options.padding ?? DEFAULT_PADDING;
        this.padding = {
            base,
            top: base,
            left: base,
            right: base,
            bottom: base,
            textPadding: 4,
        };

        // 2. Initialise the `LegendManager` if legends are enabled.
        //
        // We do this after we've set up the basic `padding` as the `LegendManager` may need to
        // perform initial calculations based on the padding.
        if (this.options.legend?.draw) {
            this.legendManager = new LegendManager(this, this.dataManager.generateLegendInfo());
        }

        // @@Cleanup: move all this stuff into `draw()`
        this.calculatePadding();
        this.lengths.xLength = this.canvas.clientWidth - (this.padding.right + this.padding.left + labelFontSize);
        this.lengths.yLength = this.canvas.clientHeight - (this.padding.top + this.padding.bottom);

        // Subtract a 1 from each length because we actually don't need to worry about the first
        // iteration. Having an extra pole will make the square size less than it should be, We're
        // actually only really concerned about how many 'gaps' there are between each item
        this.gridRectSize = {
            x: this.lengths.xLength / (this.axisManager.xAxis.scaleLabels.length - 1),
            y: this.lengths.yLength / (this.axisManager.yAxis.scaleLabels.length - 1),
        };

        // if 'strict' grid mode is enabled, we select the smallest grid size out of x and y
        // and set this to being the grid size lengths
        if (this.options.grid?.strict) {
            const gridRectLength = Math.min(this.gridRectSize.x, this.gridRectSize.y);

            this.gridRectSize.x = gridRectLength;
            this.gridRectSize.y = gridRectLength;
        }

        // Calculate all the necessary length the graph requires to draw itself.
        this.calculateLengths();
    }

    fontSize() {
        return parseInt(this.ctx.font.substring(0, 2), 10);
    }

    /**
     * @since v0.0.1
     *
     * This method is used to remove a line by a given 'label' which is present with every line that
     * is present on the graph. If the developer does not specify a label, a random string is generated and that
     * is used as a label instead.
     * */
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
     *
     * This method is used to fetch all line labels that are present on this graph.
     * */
    getLineLabels() {
        return this.dataManager.data.map((lineData) => {
            return lineData.label;
        });
    }

    #determinePositionFromSetting(): { offset: number; alignment: CanvasTextAlign } {
        const { alignment, position } = this.options.title ?? {
            alignment: defaultConfig.title!.alignment!,
            position: defaultConfig.title!.position!,
        };

        // @@Future: support `left`, `right`, and `bottom` positions
        assert(position === "top", "Only top position is supported for title");

        if (alignment === "start") {
            return { offset: this.lengths.xBegin, alignment: "left" };
        } else if (alignment === "center") {
            return { offset: this.lengths.xCenter, alignment: "center" };
        } else if (alignment === "end") {
            return { offset: this.lengths.xEnd, alignment: "right" };
        } else {
            assert(false, "Positional setting did not match any of the presets");
        }
    }

    #drawTitle() {
        if (!this.options.title?.draw) {
            return;
        }

        // draw the graph title at the specified position with font size and family specified
        const { offset, alignment } = this.#determinePositionFromSetting();

        this.ctx.save();

        const legendOffset =
            this.legendManager && this.options.legend?.position === "top"
                ? this.legendManager.requiredSpace + 2 * this.padding.textPadding
                : 0;

        // add the title
        this.drawer.text(
            this.options.title.content,
            offset,
            (this.padding.top - legendOffset) / 2, // so the text is vertically centred
            this.options.title.fontSize ?? DEFAULT_TITLE_FONT_SIZE,
            this.options.title.colour ?? this.options.axisColour!,
            alignment,
        );

        this.ctx.restore();
    }

    #drawLabels() {
        let labelXOffset = 0;
        let labelYOffset = 0;

        const hasXLabel = this.options.x_label && this.options.x_label.length > 0;
        const hasYLabel = this.options.y_label && this.options.y_label.length > 0;

        // check if we need to offset the x-label
        if (this.legendManager) {
            if (this.options.legend?.draw && hasXLabel && this.legendManager.position === "bottom") {
                labelXOffset += this.legendManager.requiredSpace;
            }

            // check if we need to offset the y-label
            if (this.options.legend?.draw && hasYLabel && this.legendManager.position === "left") {
                labelYOffset += this.legendManager.requiredSpace;
            }
        }

        if (hasXLabel) {
            this.drawer.text(
                this.options.x_label!,
                this.lengths.xCenter,
                this.drawer.height - (this.fontSize() / 2 + this.padding.textPadding + labelXOffset),
                this.fontSize(),
                config.axisColour,
            );
        }

        if (hasYLabel) {
            this.ctx.save();
            this.ctx.translate(this.fontSize() + labelYOffset, this.lengths.yCenter);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillText(this.options.y_label!, 0, 0);
            this.ctx.restore();
        }
    }

    #drawAxisGrid() {
        this.ctx.lineWidth = config.gridLineWidth;
        this.ctx.strokeStyle = rgba(config.axisColour, 40);

        this.ctx.setLineDash(this.options.grid?.gridLineStyle === "dashed" ? [5, 5] : []);

        // get the number of ticks on the axis
        const xTicks = this.axisManager.xAxis.scaleLabels.length;
        const yTicks = this.axisManager.yAxis.scaleLabels.length;

        const y_len = this.options.grid?.gridded ? 9 + this.lengths.yLength : 9;
        const x_len = this.options.grid?.gridded ? 9 + this.lengths.xLength : 9;

        let offset = 0;

        while (offset <= Math.max(yTicks - 1, xTicks)) {
            // The X-Axis drawing
            if (offset < xTicks) {
                const x_offset = offset * this.gridRectSize.x;
                this.drawer.verticalLine(
                    this.lengths.xBegin + x_offset,
                    this.lengths.yLength + this.padding.top,
                    -y_len + 9,
                );
            }

            // The Y-Axis drawing
            if (offset < this.axisManager.yAxis.scaleLabels.length) {
                const y_offset = offset * this.gridRectSize.y;
                this.drawer.horizontalLine(this.lengths.xBegin, this.lengths.yBegin + y_offset, x_len - 9);
            }
            offset++;
        }
    }

    /**
     * Creates Line instances from the data. Called internally during draw().
     */
    #createLines(): Line[] {
        const lines: Line[] = [];

        for (const lineData of this.dataManager.get()) {
            const { style, area, colour, interpolation, label, annotatePoints, data } = lineData;

            // don't even init the line if no data is supplied
            if (lineData.data.constructor === Float64Array && lineData.data.length > 0) {
                lines.push(
                    new Line(data, this, {
                        style: style ?? "solid",
                        area,
                        colour,
                        interpolation,
                        label,
                        annotatePoints: annotatePoints ?? false,
                    }),
                );
            }
        }

        return lines;
    }

    calculateLengths() {
        const labelFontSize = this.options.labelFontSize ?? defaultConfig.labelFontSize!;
        const xLength = this.canvas.clientWidth - (this.padding.right + this.padding.left + labelFontSize);
        const yLength = this.canvas.clientHeight - (this.padding.top + this.padding.bottom + labelFontSize);

        this.lengths = {
            xBegin: this.padding.left + labelFontSize,
            yBegin: this.padding.top,
            xEnd: this.drawer.width - this.padding.right,
            yEnd: this.drawer.height - this.padding.bottom,
            xCenter: this.padding.left + labelFontSize + xLength / 2,
            yCenter: this.padding.top + labelFontSize / 2 + yLength / 2,
            xLength,
            yLength,
        };
    }

    /**
     * Calculates the padding around the graph grid, taking into account font sizes
     * of labels, title, legends and any other parameters that could affect the size
     * that needs to be reserved around the area.
     *  */
    calculatePadding() {
        const { legend, title } = this.options;

        // 1. Calculate the `top` padding adjustments.
        //
        // get the specified font size for title and the standard text padding so there
        // is a gap between the graph (and maybe a legend)
        const titleFontSize = title?.fontSize ?? DEFAULT_TITLE_FONT_SIZE;
        if (title?.draw) {
            this.padding.top += titleFontSize + this.padding.textPadding;
        }

        // 2. Calculate the `bottom` padding adjustments.
        const tickHeight = 9;
        const labelFontSize = this.options.labelFontSize ?? defaultConfig.labelFontSize!;
        const labelSpacing = labelFontSize + this.padding.textPadding;

        // Automatically add spacing for the tick and the labels on the axis.
        //
        // @@Todo: maybe move this to `Axis` responsibility?
        this.padding.bottom += labelSpacing + tickHeight;

        // Add spacing for the label if we have one.
        const hasXLabel = this.options.x_label && this.options.x_label.length > 0;
        if (hasXLabel) {
            this.padding.bottom += labelFontSize + this.padding.textPadding;
        }

        // 3. Calculate the `left` padding adjustments.
        //
        // Include space for: y-axis title + gap + tick labels + ticks + padding
        const { yAxis, xAxis } = this.axisManager;
        const longestItem = arrays.longest(yAxis.scaleLabels);

        // Set the config font size of axis labels, and then we can effectively 'measure' the width of the text
        this.drawer.toTextMode(config.axisLabelFontSize, config.axisColour);
        this.padding.left += Math.ceil(this.ctx.measureText(longestItem).width);

        // Add space for the y-label if we have one.
        const hasYLabel = this.options.y_label && this.options.y_label.length > 0;
        if (hasYLabel) {
            this.padding.left += labelFontSize + this.padding.textPadding;
        }

        // 4. Calculate the `right` padding adjustments.
        const lastItemOnXAxis = xAxis.scaleLabels.at(-1)!;
        const lastWidthCenter = Math.ceil(this.ctx.measureText(lastItemOnXAxis).width / 2);
        this.padding.right += lastWidthCenter;

        // 5. Apply legend padding if legends are enabled.
        if (legend?.draw && isDef(this.legendManager)) {
            this.padding[this.legendManager.position] += this.legendManager.requiredSpace;

            // If the legend is in the same place as the title, we need to add extra padding to account for both.
            if (title?.draw && title.position === legend.position) {
                this.padding[this.legendManager.position] += this.padding.textPadding;
            }
        }
    }

    /**
     * Performs initial setup and grid optimization. Called once at the start of draw().
     */
    #setupDraw() {
        // optimise x-square-size if float
        if (this.options.grid?.optimiseSquareSize && this.gridRectSize.x % 1 !== 0) {
            let preferredSquareSize = Math.round(this.gridRectSize.x);
            const numberOfSquares = this.axisManager.xAxis.scaleLabels.length - 1;
            const labelFontSize = this.options.labelFontSize ?? defaultConfig.labelFontSize!;

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
                this.canvas.clientWidth - (this.gridRectSize.x * numberOfSquares + this.lengths.xBegin);

            this.lengths.xLength = this.canvas.clientWidth - (this.padding.right + this.padding.left + labelFontSize);
        }

        this.calculateLengths();

        // TODO: this should be used as a general form for the Y-Axis length of the graph.
        this.lengths.yLength = (this.axisManager.yAxis.scaleLabels.length - 1) * this.gridRectSize.y;
    }

    /**
     * Method that draws the whole graph, computing all pre-requisites and then invoking
     * draw on children components.
     */
    draw() {
        // Reset transform (preserving DPI scale) and clear the rectangle
        const scale = window.devicePixelRatio || 1;
        this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
        this.ctx.clearRect(0, 0, this.drawer.width, this.drawer.height);
        this.ctx.strokeStyle = config.axisColour;
        this.ctx.fillStyle = colours.BLACK;
        this.ctx.translate(0.5, 0.5);

        // Setup calculations (grid optimization, lengths)
        this.#setupDraw();

        // Draw background elements
        this.axisManager.draw();
        this.#drawTitle();
        this.legendManager?.draw();
        this.#drawLabels();
        this.#drawAxisGrid();

        // Create line instances now (after all setup is complete)
        this.lines = this.#createLines();

        // If animation is enabled, run the animation loop
        if (this.options.animation?.enabled) {
            this.#runAnimation();
        } else {
            // Otherwise draw lines immediately
            this.#drawLinesWithProgress(1);
        }

        // Debug overlay
        this.#drawDebugOverlay();
    }

    /**
     * Clears the canvas and resets the context for a new frame.
     */
    #clearAndResetContext() {
        const scale = window.devicePixelRatio || 1;
        this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
        this.ctx.clearRect(0, 0, this.drawer.width, this.drawer.height);
        this.ctx.strokeStyle = config.axisColour;
        this.ctx.fillStyle = colours.BLACK;
        this.ctx.translate(0.5, 0.5);
    }

    /**
     * Draws the graph background (axes, grid, title, legend, labels) without drawing the data lines.
     */
    #drawBackground() {
        this.axisManager.draw();
        this.#drawTitle();
        this.legendManager?.draw();
        this.#drawLabels();
        this.#drawAxisGrid();
    }

    /**
     * Draws lines with the given progress value.
     */
    #drawLinesWithProgress(progress: number) {
        for (const line of this.lines) {
            line.draw(progress);
        }
    }

    /**
     * Runs the animation loop for drawing lines.
     */
    #runAnimation() {
        // @@Todo: move this kind of prop type resolution out of here, i.e. we should work with different types
        // so we don't have to adjust and check for defaults here.
        const { duration, easing } = {
            duration: 800,
            easing: easeOutCubic,
            ...this.options.animation,
        };
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const rawProgress = Math.min(elapsed / duration, 1);
            const progress = easing(rawProgress);

            this.#clearAndResetContext();
            this.#drawBackground();
            this.#drawLinesWithProgress(progress);
            this.#drawDebugOverlay();

            if (rawProgress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Draws the debug overlay if debug mode is enabled.
     */
    #drawDebugOverlay() {
        if (!this.options.debug) return;

        const scale = window.devicePixelRatio || 1;
        this.ctx.setTransform(scale, 0, 0, scale, 0, 0); // reset translation (preserve DPI scale)
        this.ctx.lineWidth = 2;

        // draw canvas boundary in red
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.ctx.strokeStyle = colours.DEBUG;
        this.ctx.fillStyle = colours.DEBUG;

        // draw box around graph boundary
        this.ctx.strokeRect(this.lengths.xBegin, this.lengths.yBegin, this.lengths.xLength, this.lengths.yLength);

        // draw line at center of the graph
        this.ctx.beginPath();
        this.ctx.moveTo(this.lengths.xBegin, this.lengths.yCenter);
        this.ctx.lineTo(this.lengths.xEnd, this.lengths.yCenter);

        this.ctx.moveTo(this.lengths.xCenter, this.lengths.yBegin);
        this.ctx.lineTo(this.lengths.xCenter, this.lengths.yEnd);

        this.ctx.stroke();
        this.ctx.closePath();
    }
}

export default BasicGraph;
