const utils = require('./utils');
const arrays = require("./utils/arrays");
const draw = require("./core/drawing");
const config = require("./core/config");
const interpolation = require('./core/interpolation');

const scale = require('./core/scale');
const axis = require('./core/axis');
const data = require('./core/data');
const point = require("./core/point");
const colours = require("./utils/colours");


/**
 * @property x_label -> The label which is present on the x-axis of the graph
 * @property y_label -> The label which is present on the y-axis of the graph
 * @property tittle  -> The tittle of the graph, if 'null' is passed, no tittle is displayed.
 *
 * @property tittle_pos -> The position of where the tittle text is shown, options include:
 *           top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
 *
 * @property scale -> The scale/zoom level of the graph, if not passed as a setting, the scaling
 *                    will be automatically adjusted to fit entire data set.
 *
 * @property gridded -> if true, the graph will be drawn with lines at the intervals on the graph.
 * */
class BasicGraph {
    constructor(id, options, _data) {
        this.id = id;
        this.options = options;
        this.data = new data.Data(_data);
        this.lengths = {};
        this.squareSize = {x: 0, y: 0};
        this.canvas = undefined;
        this.ctx = undefined;
        this.defaultConfig = {
            x_label: '',
            y_label: '',
            tittle: 'Graph',
            tittle_pos: 'top-center',
            scale: 1,
            gridded: false,
            padding: 14,
            join_points: true,
            zero_scale: true,
            axis_colour: 'rgb(94,94,94)',
            data_colour: 'rgb(156,39,176)'
        };

        let clazz = this;

        if ((this.options !== null) && (this.options !== undefined)) {
            Object.keys(this.options).forEach((option) => {
                if (this.defaultConfig.hasOwnProperty(option)) {
                    this.defaultConfig[option] = this.options[option];
                }
            });
        }

        this.options = this.defaultConfig;
        this.elementMap = utils.findObjectElements(this.id, this.options);

        // find canvas element and tittle element.
        try {
            this.canvas = this.elementMap.canvas;
            this.ctx = this.canvas.getContext('2d');
            draw.toTextMode(this.ctx, 16, this.options.axis_colour);

            this.c_width = this.canvas.width;
            this.c_height = this.canvas.height;

        } catch (e) {
            if (this.canvas === null) {
                throw ('Provided canvas does not exist!\n' + e);
            }
        }

        this.font_size = function () {
            return parseInt(clazz.ctx.font.substr(0, 2))
        }();


        this.padding = {
            top: this.options.padding,
            left: undefined,
            right: this.options.padding,
            bottom: undefined,
            val: this.options.padding
        };

        // if no labels provided, they are disabled as in no room is provided
        // for them to be drawn.
        if (this.options.y_label.toString() !== "" &&
            this.options.x_label.toString() !== "") {
            this.label_size = this.font_size;

        } else {
            this.label_size = 0;
        }
    }

    drawLabels() {
        // don't draw if no labels are given
        if (this.label_size === 0) {return;}

        // add x-axis label
        draw.toTextMode(this.ctx, this.options.font_size, this.options.axis_colour);
        this.ctx.fillText(this.options.x_label, this.lengths.x_center, this.c_height - (this.font_size / 2));

        // add y-axis label
        this.ctx.save();
        this.ctx.translate(parseInt(this.font_size), this.lengths.y_center);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(this.options.y_label, 0, 0);
        this.ctx.restore();
    };


    drawAxis() {
        this.ctx.lineWidth = 1;
        let offset = 0;

        while (offset <= Math.max(this.yAxis.scaleNumbers.length, this.data.maxLen() + 1)) {
            this.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 40);

            // grid drawing
            let x_len = this.options.gridded ? 9 + this.y_length : 9,
                y_len = this.options.gridded ? 9 + this.x_length : 9;

            /*// draw the centered zero and skip drawing zero's on neighbouring ticks.
            if (this.options.zero_scale && this.scale_num.x[offset] === 0
                && this.scale_num.y[offset] === 0) {
                this.ctx.fillText('0',
                    this.lengths.x_begin - this.padding.val,
                    this.lengths.y_end + this.padding.val
                );
                skip_text = true;
            }*/

            // The X-Axis drawing
            if (offset <= this.max_xTicks + 1) {
                let x_offset = offset * this.squareSize.x;

                draw.verticalLine(this.ctx,
                    this.lengths.x_begin + x_offset,
                    this.lengths.y_end + 9,
                    -x_len
                );
            }
            // The Y-Axis drawing
            if (offset <= this.yAxis.scaleNumbers.length) {
                let y_offset = offset * this.squareSize.y;

                draw.horizontalLine(this.ctx,
                    this.lengths.x_begin - 9,
                    this.lengths.y_end - y_offset,
                    y_len
                );
            }
            offset++;
        }
    };


    drawData() {
        let lineWidth = config.lineWidth;
        let clazz = this;

        for (let line of this.data.get()) {
            // alter the line width if there are more data points than maximum ticks on graph.
            // reduce it to one pixel.
            if (this.data.maxLen() > config.xTicks) {
                lineWidth = 2;
            }

            // setup for drawing
            this.ctx.lineJoin = 'round';
            this.ctx.strokeStyle = utils.rgba(line.colour, 40);
            this.ctx.fillStyle = utils.rgba(line.colour, 40);
            this.ctx.setLineDash(line['style'] === 'dashed' ? [5, 5] : []);
            this.ctx.lineWidth = lineWidth;

            let points = [];

            line.pos_data.forEach((x) => {
                points.push(new point.Point(x, clazz));
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
                if (this.xAxis.scaleNumbers.indexOf(p.data.x) > -1) {
                    // convert the data point into a graphical point
                    draw.circle(this.ctx, p.x, p.y, lineWidth);
                }
            }
        }
    };


    calculatePadding() {
        let longestItem = arrays.longest(this.yAxis.scaleNumbers.map(x => x.toString()));

        draw.toTextMode(this.ctx, 14, this.options.axis_colour);
        this.padding.left = this.options.padding + this.ctx.measureText(longestItem).width + this.label_size;
        this.padding.bottom = this.options.padding + this.label_size + this.font_size;
    };

    draw() {
        // initialise the y-axis & x-axis
        this.yAxis = new axis(this, "y-axis", {axis_colour: this.options.axis_colour});
        this.xAxis = new axis(this, "x-axis", {axis_colour: this.options.axis_colour});

        this.calculatePadding();

        this.max_xTicks = Math.min(this.data.maxLen(), config.xTicks);
        this.x_length = this.c_width - this.padding.right - this.padding.left - this.label_size;
        this.y_length = this.c_height - this.padding.top - this.padding.bottom - this.label_size;

        this.lengths = {
                x_begin: this.padding.left + this.label_size,
                y_begin: this.padding.top,
                x_end: this.c_width - this.padding.right,
                y_end: this.c_height - this.padding.bottom,
                x_center: this.padding.left + this.label_size + this.x_length / 2,
                y_center: this.label_size + this.y_length / 2,
        };

        this.yAxis.draw();
        this.xAxis.draw();


        this.data.toPos();
        this.drawLabels();
        this.drawAxis();
        this.drawData();
    };

    redraw() {
        // clear the rectangle and reset colour
        this.ctx.clearRect(0, 0, this.c_width, this.c_height);
        this.ctx.strokeStyle = this.options.axis_colour;
        this.ctx.fillStyle = colours.BLACK;

        this.draw();
    }
}

module.exports = function () {
    let Graph = function (id, config, data) {
        return new BasicGraph(id, config, data);
    };
    Graph.Graph = Graph;

    return Graph;
};
