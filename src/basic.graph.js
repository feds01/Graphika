

const utils = require("./utils");
const arrays = require("./utils/arrays");
const config = require("./core/config");
const colours = require("./utils/colours");
const {assert} = require("./utils/assert");

const {Line} = require("./core/line");
const {Drawer} = require("./core/drawing");
const {GridOptions} = require("./options");
const {AxisManager} = require("./core/axis-manager");
const {DataManager} = require("./core/dataManager");


/**
 * @since v0.0.1 Default values for options within the object, however this will
 * soon be phased out in favour of core/config * */
const defaultConfig = {
    x_label: "",
    y_label: "",
    title: "Graph",
    title_pos: "top-center",
    padding: 14,

    /* This will draw a 'circle' every time a point intersects a grid boundary  */
    annotatePoints: true,
};

/**
 * @property x_label -> The label which is present on the x-axis of the graph
 * @property y_label -> The label which is present on the y-axis of the graph
 * @property title  -> The title of the graph, if 'null' is passed, no tittle is displayed.
 *
 * @property title_pos -> The position of where the tittle text is shown, options include:
 *           top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
 *
 *
 * @property gridded -> if true, the graph will be drawn with lines at the intervals on the graph.
 * */
class BasicGraph {
    constructor(HtmlElementId, options, data) {
        /**
         * @since v0.0.1 The id of the html container that the graph should
         * be drawn within * */
        this.HtmlElementId = HtmlElementId;

        /**
         * @since v0.0.1 Graph options, this contain x-labels, y-label, tittle, legends, points
         * style, gridded, etc. More on graph options can be read in the documentation * */
        this.options = defaultConfig;

        /**
         * @since v0.0.1 DataManager() object which contains the data for the lines the graph should
         * plot, the object also contains various utility functions to fetch stats on the data. * */
        this.dataManager = new DataManager(data);

        /**
         *  @since v0.0.1 This is the font size of the labels, initially it is set to 0, later on it is set if
         * the labels are not empty strings or null.
         * */
        this.labelFontSize = 0;

        /**
         * @since v0.0.1 This is the grid options data store class, it stores all options which are related with a
         * graphics griding options such as using a sharedAxisZero or using strict mode to determine the grid.
         * */
        this.gridOptions = new GridOptions(options["gridOptions"]);

        // Loop through provided options, and overwrite default options if the user provided
        // options contain a value
        if (!utils.isUndefOrNull(options)) {
            Object.keys(options).forEach((option) => {
                // let's move away from this approach
                if (defaultConfig.hasOwnProperty(option)) {
                    this.options[option] = options[option];
                }
            });
        }

        // find canvas element and tittle element.
        const {canvas} = utils.findObjectElements(this.HtmlElementId, this.options);

        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.drawer = new Drawer(this.canvas, this.ctx);
        this.drawer.toTextMode(16, this.options.axisColour);

        // if no labels provided, they are disabled as in no room is provided
        // for them to be drawn.
        if (this.options.y_label !== "" && this.options.x_label !== "") {
            this.labelFontSize = this.fontSize();
        }

        /**
         * @since v0.0.1 AxisManager object is a manager class for the Axis objects of this Graph object,
         * The AxisManager contains the xAxis & yAxis objects, it also handles the synchronisation of scales &
         * negative axis modes.
         * */
        this.axisManager = new AxisManager(this);

        this.padding = {
            top: this.options.padding,
            left: null,
            right: this.options.padding,
            bottom: null
        };

        this.calculatePadding();

        this.xLength = this.canvas.width - (this.padding.right + this.padding.left + this.labelFontSize);
        this.yLength = this.canvas.height - (this.padding.top + this.padding.bottom);


        // Subtract a 1 from each length because we actually don't need to worry about the first
        // iteration. Having an extra pole will make the square size less than it should be, We're
        // actually only really concerned about how many 'gaps' there are between each item
        this.gridRectSize = {
            x: this.xLength / (this.axisManager.xAxisScaleNumbers.length - 1),
            y: this.yLength / (this.axisManager.yAxisScaleNumbers.length - 1)
        };

        // if 'strict' grid mode is enabled, we select the smallest grid size out of x and y
        // and set this to being the grid size lengths
        if (this.gridOptions.strict) {
            let gridRectLength = Math.min(this.gridRectSize.x, this.gridRectSize.y);

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
     *
     * // TODO: most likely not random string, just use incremental labeling like 'line_2', 'line_3' etc.
     * */
    removeLineByLabel(label) {
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

    _drawLabels() {
        if (this.labelFontSize !== 0) {
            // add x-axis label
            this.drawer.text(
                this.options.x_label, this.lengths.x_center,
                this.drawer.height - (this.fontSize() / 2),
                this.ctx, this.fontSize(), config.axisColour
            );

            // add y-axis label
            this.ctx.save();
            this.ctx.translate(parseInt(this.fontSize(), 10), this.lengths.y_center);
            this.ctx.rotate(-Math.PI / 2);
            this.ctx.fillText(this.options.y_label, 0, 0);
            this.ctx.restore();
        }
    }

    _drawAxisGrid() {
        this.ctx.lineWidth = config.gridLineWidth;
        this.ctx.strokeStyle = utils.rgba(config.axisColour, 40);

        // grid drawing
        const xMaxTicks = Math.min(this.dataManager.maxLen(), config.xTicks);
        const y_len = this.gridOptions.gridded ? 9 + this.yLength : 9;
        const x_len = this.gridOptions.gridded ? 9 + this.xLength : 9;

        let offset = 0;

        while (offset <= Math.max(this.axisManager.yAxisScaleNumbers.length - 1, xMaxTicks)) {
            // The X-Axis drawing
            if (offset < xMaxTicks) {
                let x_offset = offset * this.gridRectSize.x;

                this.drawer.verticalLine(
                    this.lengths.x_begin + x_offset,
                    this.yLength + this.padding.top + 9,
                    -y_len
                );
            }
            // The Y-Axis drawing
            if (offset < this.axisManager.yAxisScaleNumbers.length) {
                let y_offset = offset * this.gridRectSize.y;

                this.drawer.horizontalLine(
                    this.lengths.x_begin - 9,
                    this.lengths.y_begin + y_offset,
                    x_len,
                );
            }
            offset++;
        }
    }

    _drawData() {
        for (let lineData of this.dataManager.get()) {
            const {style, area, colour, interpolation, label} = lineData;

            let line = new Line(lineData.data, this, {style, area, colour, interpolation, label});
            line.draw();
        }
    }

    calculateLengths() {
        this.xLength = this.canvas.width - (this.padding.right + this.padding.left + this.labelFontSize);
        this.yLength = this.canvas.height - (this.padding.top + this.padding.bottom + this.labelFontSize);

        this.lengths = {
            x_begin: this.padding.left + this.labelFontSize,
            y_begin: this.padding.top,
            x_end: this.drawer.width - this.padding.right,
            y_end: this.drawer.height - (this.padding.bottom + this.labelFontSize),
            x_center: this.padding.left + this.labelFontSize + this.xLength / 2,
            y_center: this.labelFontSize + this.yLength / 2,
        };
    }

    calculatePadding() {
        let longestItem = arrays.longest(this.axisManager.joinedScaleNumbers);

        // Set the config font size of axis labels, and then we can effectively 'measure' the width of the text
        this.drawer.toTextMode(config.axisLabelFontSize, config.axisColour);
        this.padding.left = Math.ceil(this.options.padding + this.ctx.measureText(longestItem).width + this.labelFontSize);
        this.padding.bottom = Math.ceil(this.options.padding + this.labelFontSize + this.fontSize());
    }

    draw() {
        // clear the rectangle and reset colour
        this.ctx.clearRect(0, 0, this.drawer.width, this.drawer.height);
        this.ctx.strokeStyle = config.axisColour;
        this.ctx.fillStyle = colours.BLACK;

        /* optimise x-square-size if float */
        if (this.gridOptions.optimiseSquareSize && this.gridRectSize.x % 1 !== 0) {
            let preferredSquareSize = Math.round(this.gridRectSize.x);
            let numberOfSquares = this.axisManager.xAxisScaleNumbers.length - 1;

            /* If the square size was some round up, rather than down, we need to check if
             * we can actually apply the 'scale' up with the padding space available to the right
             * of the graph. If we can't fit in the scale up, we will have to go down as we are
             * guaranteed to have enough space. */
            if (preferredSquareSize > this.gridRectSize.x) {
                if (this.padding.right - (preferredSquareSize - this.gridRectSize.x) * numberOfSquares < 0) {
                    preferredSquareSize--;
                }
            }
            this.gridRectSize.x = preferredSquareSize;

            // If 'strict' mode is set in gridOptions, we also need to set the value of the 'y' length
            // to be the same as the x length.
            if (this.gridOptions.strict) {
                this.gridRectSize.y = preferredSquareSize;
            }

            /* we need to re-calculate right padding before we can call calculateLengths() as it is dependant on the
             * right padding value, which has now changed. */
            this.padding.right = this.canvas.width - ((this.gridRectSize.x * numberOfSquares) + this.lengths.x_begin);
            this.xLength = this.canvas.width - (this.padding.right + this.padding.left + this.labelFontSize);
        }

        this.calculateLengths();

        // TODO: this should be used as a general form for the Y-Axis length of the graph.
        this.yLength = (this.axisManager.yAxisScaleNumbers.length - 1) * this.gridRectSize.y;

        /* Draw our Axis', including negative scales & scale labels */
        this.axisManager.draw();

        /* Draw the 'X-Label' & 'Y-Label' labels on the graph canvas */
        this._drawLabels();

        /* Draw the Grid on the Graph lines & axis ticks, if enabled */
        this._drawAxisGrid();

        /* Draw the data sets on the graph, using the provided dataset configurations  */
        this._drawData();
    }
}

module.exports = function () {
    let Graph = function (id, config, data) {
        return new BasicGraph(id, config, data);
    };

    Graph.Graph = Graph;

    return Graph;
};
