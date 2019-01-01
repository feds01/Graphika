const utils = require("./utils");
const arrays = require("./utils/arrays");
const draw = require("./core/drawing");
const config = require("./core/config");
const interpolation = require("./core/interpolation");

const {Data} = require("./core/data");
const {Point} = require("./core/point");
const colours = require("./utils/colours");
const {AxisManager} = require("./core/axis-manager");

/**
 * @property x_label -> The label which is present on the x-axis of the graph
 * @property y_label -> The label which is present on the y-axis of the graph
 * @property tittle  -> The tittle of the graph, if 'null' is passed, no tittle is displayed.
 *
 * @property tittle_pos -> The position of where the tittle text is shown, options include:
 *           top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
 *
 *
 * @property gridded -> if true, the graph will be drawn with lines at the intervals on the graph.
 * */
class BasicGraph {
    constructor(graphContainerId, options, _data) {
        /**
         * @since v0.0.1 The id of the html container that the graph should
         * be drawn within * */
        this.graphContainerId = graphContainerId;

        /**
         * @since v0.0.1 Graph options, this contain x-labels, y-label, tittle, legends, points
         * style, gridded, etc. More on graph options can be read in the documentation * */
        this.options = options;

        /**
         * @since v0.0.1 Data() object which contains the data for the lines the graph should
         * plot, the object also contains various utility functions to fetch stats on the data. * */
        this.data = new Data(_data);

        /**
         * @since v0.0.1 Default values for options within the object, however this will
         * soon be phased out in favour of core/config * */
        this.defaultConfig = {
            x_label: "",
            y_label: "",
            title: "Graph",
            title_pos: "top-center",
            gridded: false,
            padding: 14,
            zero_scale: true,
        };

        let clazz = this;

        // Sanitise the configuration
        if ((this.options !== null) && (this.options !== undefined)) {
            Object.keys(this.options).forEach((option) => {
                if (this.defaultConfig.hasOwnProperty(option)) {
                    this.defaultConfig[option] = this.options[option];
                }
            });
        }

        this.options = this.defaultConfig;
        this.elementMap = utils.findObjectElements(this.graphContainerId, this.options);

        // find canvas element and tittle element.
        try {
            this.canvas = this.elementMap.canvas;
            this.ctx = this.canvas.getContext("2d");
            draw.toTextMode(this.ctx, 16, this.options.axis_colour);

            this.c_width = this.canvas.width;
            this.c_height = this.canvas.height;

        } catch (e) {
            if (this.canvas === null) {
                throw Error("Provided canvas does not exist!\n" + e);
            }
        }

        this.font_size = function () {
            return parseInt(clazz.ctx.font.substr(0, 2));
        }();


        // if no labels provided, they are disabled as in no room is provided
        // for them to be drawn.
        if (this.options.y_label.toString() !== "" &&
            this.options.x_label.toString() !== "") {
            this.label_size = this.font_size;

        } else {
            this.label_size = 0;
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
            bottom: null,
            val: this.options.padding
        };

        this.calculatePadding();

        this.max_xTicks = Math.min(this.data.maxLen(), config.xTicks);
        this.x_length = this.c_width - (this.padding.right + this.padding.left + this.label_size);
        this.y_length = this.c_height - (this.padding.top + this.padding.bottom + this.label_size);


        this.squareSize = {
            x: this.x_length / (this.axisManager.xAxisScaleNumbers.length - 1),
            y: this.y_length / this.axisManager.yAxisScaleNumbers.length
        };


        this.lengths = {
            x_begin: this.padding.left + this.label_size,
            y_begin: this.padding.top,
            x_end: this.c_width - this.padding.right,
            y_end: this.c_height - this.padding.bottom,
            x_center: this.padding.left + this.label_size + this.x_length / 2,
            y_center: this.label_size + this.y_length / 2,
        };
    }

    setData(_data) {
        // re-create the data object & call re-draw
        this.data = new Data(_data);
        this.redraw();
    }

    removeLineByLabel(label) {
        for (let k = 0; k < this.data.data.length - 1; k++) {
            if (this.data.data[k].label === label) {
                this.data.data.splice(k, 1);
            }
        }
        this.redraw(); // re-draw the graph
    }

    drawLabels() {
        // don't draw if no labels are given
        if (this.label_size === 0) {
            return;
        }

        // add x-axis label
        draw.toTextMode(this.ctx, this.options.font_size, config.axis_colour);
        this.ctx.fillText(this.options.x_label, this.lengths.x_center, this.c_height - (this.font_size / 2));

        // add y-axis label
        this.ctx.save();
        this.ctx.translate(parseInt(this.font_size), this.lengths.y_center);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(this.options.y_label, 0, 0);
        this.ctx.restore();
    }


    drawAxis() {
        this.ctx.lineWidth = 1;
        let offset = 0;

        while (offset <= Math.max(this.axisManager.yAxisScaleNumbers.length, this.data.maxLen() + 1)) {
            this.ctx.strokeStyle = utils.rgba(config.axis_colour, 40);

            // grid drawing
            let y_len = this.options.gridded ? 9 + this.axisManager.yAxisScaleNumbers.length * this.squareSize.y : 9,
                x_len = this.options.gridded ? 9 + this.axisManager.xAxisScaleNumbers.length * this.squareSize.x : 9;


            // The X-Axis drawing
            if (offset <= this.max_xTicks + 1) {
                let x_offset = offset * this.squareSize.x;

                draw.verticalLine(this.ctx,
                    this.lengths.x_begin + x_offset,
                    this.lengths.y_end + 9,
                    -y_len
                );
            }
            // The Y-Axis drawing
            if (offset <= this.axisManager.yAxisScaleNumbers.length) {
                let y_offset = offset * this.squareSize.y;

                draw.horizontalLine(this.ctx,
                    this.lengths.x_begin - 9,
                    this.lengths.y_end - y_offset,
                    x_len
                );
            }
            offset++;
        }
    }


    drawData() {
        let lineWidth = config.lineWidth;
        let clazz = this;

        // convert the data into {x, y} format
        this.data.toPos();

        for (let line of this.data.get()) {
            // alter the line width if there are more data points than maximum ticks on graph.
            // reduce it to one pixel.
            if (this.data.maxLen() > config.xTicks) {
                lineWidth = 2;
            }

            // setup for drawing
            this.ctx.lineJoin = "round";
            this.ctx.strokeStyle = utils.rgba(line.colour, 40);
            this.ctx.fillStyle = utils.rgba(line.colour, 40);
            this.ctx.setLineDash(line["style"] === "dashed" ? [5, 5] : []);
            this.ctx.lineWidth = lineWidth;

            let points = [];

            line.pos_data.forEach((x) => {
                points.push(new Point(x, clazz));
            });

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

            // draw the points
            for (let p of points) {
                if (this.axisManager.xAxisScaleNumbers.indexOf(p.data.x) > -1) {
                    // convert the data point into a graphical point
                    draw.circle(this.ctx, p.x, p.y, lineWidth);
                }
            }
        }
    }


    calculatePadding() {
        let longestItem = arrays.longest(this.axisManager.xAxisScaleNumbers.map(x => x.toString()));

        draw.toTextMode(this.ctx, 14, config.axis_colour);
        this.padding.left = Math.ceil(this.options.padding + this.ctx.measureText(longestItem).width + this.label_size);
        this.padding.bottom = Math.ceil(this.options.padding + this.label_size + this.font_size);
    }

    draw() {
        this.axisManager.draw();
        this.drawLabels();
        this.drawAxis();
        this.drawData();
    }

    redraw() {
        // clear the rectangle and reset colour
        this.ctx.clearRect(0, 0, this.c_width, this.c_height);
        this.ctx.strokeStyle = config.axis_colour;
        this.ctx.fillStyle = colours.BLACK;

        this.draw();
    }
}

module.exports = function () {
    let Graph = function (id, config, data) {
        return new BasicGraph(id, config, data);
    };

    Graph.Graph = Graph;
    Graph.Colours = require("./utils/colours");

    return Graph;
};
