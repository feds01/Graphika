const utils = require("./utils");
const arrays = require("./utils/arrays");
const config = require("./core/config");
const colours = require("./utils/colours");
const interpolation = require("./core/interpolation");
const {assert} = require("./utils/assert");

const {Point} = require("./core/point");
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
        this.yLength = this.canvas.height - (this.padding.top + this.padding.bottom + this.labelFontSize);


        // Subtract a 1 from each length because we actually don't need to worry about the first
        // iteration. Having an extra pole will make the square size less than it should be, We're
        // actually only really concerned about how many 'gaps' there are between each item
        this.squareSize = {
            x: this.xLength / (this.axisManager.xAxisScaleNumbers.length - 1),
            y: this.yLength / (this.axisManager.yAxisScaleNumbers.length - 1)
        };

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
                let x_offset = offset * this.squareSize.x;

                this.drawer.verticalLine(
                    this.lengths.x_begin + x_offset,
                    this.lengths.y_end + 9,
                    -y_len
                );
            }
            // The Y-Axis drawing
            if (offset < this.axisManager.yAxisScaleNumbers.length) {
                let y_offset = offset * this.squareSize.y;

                this.drawer.horizontalLine(
                    this.lengths.x_begin - 9,
                    this.lengths.y_end - y_offset,
                    x_len,
                );
            }
            offset++;
        }
    }

    _drawData() {
        // convert the data into {x, y} format
        this.dataManager.toPos();

        for (let line of this.dataManager.get()) {
            // setup for drawing
            this.ctx.lineJoin = "round";
            this.ctx.lineWidth = config.lineWidth;
            this.ctx.fillStyle = utils.rgba(line.colour, 40);
            this.ctx.strokeStyle = utils.rgba(line.colour, 40);
            this.ctx.setLineDash(line["style"] === "dashed" ? [5, 5] : []);

            let points = [];

            for (let idx = 0; idx < line.pos_data.length; idx++) {
                points.push(new Point(line.pos_data[idx], this));
            }

            if (line["interpolation"] === "cubic") {
                let controlPoints = [];

                // start from point 1 and not point 0, as point one and last point will
                // be quadratic curves and not splines
                for (let k = 1; k < points.length - 1; k++) {
                    controlPoints.push(interpolation.splineCurve(
                        arrays.getPrevious(k, points),
                        points[k], arrays.getNext(k, points),
                        config.tension, this
                    ));

                    // perform a check to see if a control point goes out of the graph bounds,
                    // if so we correct this behaviour by setting the 'y' to the lengths.y_begin
                    // value.
                    // TODO: implement check for control points which go out of bounds on lower port.
                    if (controlPoints[k - 1].prev.y < this.lengths.y_begin) {
                        controlPoints[k - 1].prev.y = this.lengths.y_begin;
                    }

                    if (controlPoints[k - 1].next.y < this.lengths.y_begin) {
                        controlPoints[k - 1].next.y = this.lengths.y_begin;
                    }
                }

                // draw the cubic spline curves
                for (let i = 1; i < points.length - 2; i++) {
                    // begin current trajectory, by moving to starting point
                    this.ctx.beginPath();
                    this.ctx.moveTo(points[i].x, points[i].y);

                    // create bezier curve using the next control point of previous entry
                    // and previous control point of current entry and which leads to next
                    // point
                    this.ctx.bezierCurveTo(
                        controlPoints[i - 1].next.x, controlPoints[i - 1].next.y,
                        controlPoints[i].prev.x, controlPoints[i].prev.y,
                        points[i + 1].x, points[i + 1].y
                    );
                    this.ctx.stroke();
                    this.ctx.closePath();
                }

                // now draw the starting quadratic between first and second curve
                this.ctx.beginPath();
                this.ctx.moveTo(points[0].x, points[0].y);
                this.ctx.quadraticCurveTo(
                    controlPoints[0].prev.x, controlPoints[0].prev.y,
                    points[1].x, points[1].y
                );
                this.ctx.stroke();
                this.ctx.closePath();

                // now draw final quadratic curve, between last and the point before the last.
                this.ctx.beginPath();
                this.ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);

                this.ctx.quadraticCurveTo(
                    controlPoints[controlPoints.length - 1].next.x,
                    controlPoints[controlPoints.length - 1].next.y,
                    points[points.length - 2].x, points[points.length - 2].y
                );
                this.ctx.stroke();
                this.ctx.closePath();


            } else {
                for (let p = 0; p < points.length - 1; p++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(points[p].x, points[p].y);
                    this.ctx.lineTo(points[p + 1].x, points[p + 1].y);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }

            // if point annotation is enabled, draw the points.
            if (this.options.annotatePoints) {
                points.forEach((point) => {
                    if ((point.data.x / this.axisManager.xAxisTickStep) % 1 === 0) {
                        point.draw();
                    }
                });
            }
        }
    }

    calculateLengths() {
        this.lengths = {
            x_begin: this.padding.left + this.labelFontSize,
            y_begin: this.padding.top,
            x_end: this.drawer.width - this.padding.right,
            y_end: this.drawer.height - this.padding.bottom,
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
        if (this.gridOptions.optimizeSquareSize && this.squareSize.x % 1 !== 0) {
            let preferredSquareSize = Math.round(this.squareSize.x);
            let numberOfSquares = this.axisManager.xAxisScaleNumbers.length - 1;

            /* If the square size was some round up, rather than down, we need to check if
             * we can actually apply the 'scale' up with the padding space available to the right
             * of the graph. If we can't fit in the scale up, we will have to go down as we are
             * guaranteed to have enough space. */
            if (preferredSquareSize > this.squareSize.x) {
                if (this.padding.right - (preferredSquareSize - this.squareSize.x) * numberOfSquares < 0) {
                    preferredSquareSize--;
                }
            }
            this.squareSize.x = preferredSquareSize;

            /* we need to re-calculate right padding before we can call calculateLengths() as it is dependant on the
             * right padding value, which has now changed. */
            this.padding.right = this.canvas.width - ((this.squareSize.x * numberOfSquares) + this.lengths.x_begin);
            this.xLength = this.canvas.width - (this.padding.right + this.padding.left + this.labelFontSize);
        }

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
