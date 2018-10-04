const utils = require('./utils');
const arrays = require("./utils/arrays");
const draw = require("./core/drawing");
const config = require("./core/config");
const interpolation = require('./core/interpolation');

let Scale = require('./core/scale');
let data = require('./core/data');
const point = require("./core/point");


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
function BasicGraph(id, options, _data) {
    this.id = id;
    this.options = options;
    this.graph = Object;
    this.data = new data.Data(_data);
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
            throw ('err: provided canvas does not exist!\n' + e);
        }
    }

    this.graph.prototype.fontSize = function () {
        return parseInt(clazz.ctx.font.substr(0, 2));
    };
}

BasicGraph.prototype.drawLabels = function () {
    // don't draw if no labels are given
    if (this.label_size === 0) {
        return;
    }

    let graph = this.graph;
    // add x-axis label
    this.ctx.fillText(this.options.x_label, graph.x_center, this.c_height - (this.graph.fontSize() / 2));

    // add y-axis label
    this.ctx.save();
    this.ctx.translate(parseInt(graph.fontSize()), graph.y_center);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText(this.options.y_label, 0, 0);
    this.ctx.restore();
};

BasicGraph.prototype.drawAxis = function () {
    let offset = 0;

    this.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 60);
    // the y-limit is the y coordinate up to where everything should be drawn
    draw.verticalLine(this.ctx, this.graph.x_begin, this.graph.y_end, -this.graph.y_length);
    draw.horizontalLine(this.ctx, this.graph.x_begin, this.graph.y_end, this.graph.x_length);

    // change the stroke style to rgba(colour, 0.6), so apply 60% opacity.
    this.ctx.textBaseline = 'middle';
    draw.toTextMode(this.ctx, 14, this.options.axis_colour);

    this.scale_num = {
        x: arrays.fillRange(this.max_xTicks + 1).map(
            x => Math.floor(this.data.maxLen() * (x / this.max_xTicks))
        ),
        y: this.graph.scale.getTickLabels
    };


    while ((offset <= this.graph.scale.getMaxTicks) || (offset <= this.data.maxLen())) {
        this.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 40);

        let x_len = this.options.gridded ? 9 + this.graph.y_length : 9,
            y_len = this.options.gridded ? 9 + this.graph.x_length : 9,
            skip_text = false,
            scale_offset = 0;

        // draw the centered zero and skip drawing zero's on neighbouring ticks.
        if (this.options.zero_scale && this.scale_num.x[offset] === '0'
            && this.scale_num.y[offset] === '0') {
            this.ctx.fillText('0',
                this.graph.x_begin - this.graph.padding.val,
                this.graph.y_end + this.graph.padding.val
            );
            skip_text = true;
        }

        // The X-Axis drawing
        if (offset <= this.max_xTicks) {
            let x_offset = offset * this.graph.squareSize.x;
            scale_offset = this.graph.fontSize() / 2;

            draw.verticalLine(this.ctx, this.graph.x_begin + x_offset, this.graph.y_end + 9, -x_len);

            if (!skip_text) {
                this.ctx.fillText(this.scale_num.x[offset].toString(),
                    this.graph.x_begin + x_offset,
                    this.graph.y_end + 9 + scale_offset
                );
            }
        }
        // The Y-Axis drawing
        if (offset <= this.graph.scale.getMaxTicks) {
            let y_offset = offset * this.graph.squareSize.y;
            scale_offset = Math.ceil(this.ctx.measureText(this.scale_num.y[offset]).width / 1.5);

            draw.horizontalLine(this.ctx,
                this.graph.x_begin - 9,
                this.graph.y_end - y_offset,
                y_len
            );

            if (!skip_text) {
                this.ctx.fillText(this.scale_num.y[offset].toString(),
                    this.graph.x_begin - 9 - scale_offset,
                    this.graph.y_end - y_offset
                );
            }
        }
        offset++;
    }
};

BasicGraph.prototype.drawData = function () {
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
        this.ctx.setLineDash(line.style === 'dashed' ? [5, 5] : []);
        this.ctx.lineWidth = lineWidth;

        // assign the graph object it's data
        this.graph.data = this.data;
        let points = [];

        line.pos_data.forEach((x) => {
            points.push(new point.Point(x, clazz.graph));
        });


        if(line["interpolation"] === "cubic") {
            let controlPoints = [];

            // start from point 1 and not point 0, as point one and last point will
            // be quadratic curves and not splines
            for(let k = 1; k < points.length - 1; k++) {
                controlPoints.push(interpolation.splineCurve(
                    arrays.getPrevious(k, points),
                    points[k], arrays.getNext(k, points),
                    config.tension, this.graph
                ));
            }

            // draw the cubic spline curves
            for(let i = 1; i < points.length - 2; i++) {
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
            for(let p = 0; p < points.length - 1; p++) {
                this.ctx.beginPath();
                this.ctx.moveTo(points[p].x, points[p].y);
                this.ctx.lineTo(points[p + 1].x, points[p + 1].y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }


        // draw the points
        for (let p of points) {
            if (this.scale_num.x.indexOf(p.data.x) > -1) {
                // convert the data point into a graphical point
                draw.circle(this.ctx, p.x, p.y, lineWidth);
            }
        }
    }
};

BasicGraph.prototype.calculateLabelPadding = function () {
    let longestItem = arrays.longest(this.graph.scale.getTickLabels);

    // if no labels provided, they are disabled as in no room is provided
    // for them to be drawn.
    if (this.options.y_label.toString() !== "" &&
        this.options.x_label.toString() !== "") {
        this.label_size = this.graph.fontSize();

    } else {
        this.label_size = 0;
    }

    draw.toTextMode(this.ctx, 14, this.options.axis_colour);
    this.graph.padding.left = this.options.padding + this.ctx.measureText(longestItem).width + this.label_size;
    this.graph.padding.bottom = this.options.padding + this.label_size + this.graph.fontSize();

    return this.graph.padding;
};


BasicGraph.prototype.draw = function () {
    const PADDING = this.options.padding;

    this.graph.squareSize = {x: 0, y: 0};
    this.graph.padding = {
        top: PADDING,
        left: undefined,
        right: PADDING,
        bottom: undefined,
        val: PADDING
    };

    this.graph.scale = new Scale({
        max: this.data.max(),
        min: this.options.zero_scale ? 0 : this.data.min(),
        maxTicks: config.yTicks
    });

    // left and bottom need to be calculated & and temporarily use padding_map
    // for cross-referencing
    let padding_map = this.calculateLabelPadding();

    this.max_xTicks = Math.min(this.data.maxLen(), config.xTicks);

    let y_length = this.c_height - padding_map.top - padding_map.bottom - this.label_size,
        x_length = this.c_width - padding_map.right - padding_map.left - this.label_size;

    // calculate the each axis square size.
    this.graph.squareSize.x = x_length / this.max_xTicks;
    this.graph.squareSize.y = y_length / this.graph.scale.getMaxTicks;

    // concatenate all previous calculations with current ones.
    this.graph = Object.assign({},
        {squareSize: this.graph.squareSize},
        {padding: this.graph.padding},
        {
            x_begin: padding_map.left + this.label_size,
            y_begin: padding_map.top,

            x_end: this.c_width - padding_map.right,
            y_end: this.c_height - padding_map.bottom,

            x_length: x_length,
            y_length: y_length,

            x_center: padding_map.left + this.label_size + x_length / 2,
            y_center: this.label_size + y_length / 2,
            scale: this.graph.scale
        }
    );

    this.data.toPos();
    this.drawLabels();
    this.drawAxis();
    this.drawData();
};

module.exports = function () {
    let Graph = function (id, config, data) {
        return new BasicGraph(id, config, data);
    };
    Graph.Graph = Graph;

    return Graph;
};
