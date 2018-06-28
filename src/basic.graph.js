let utils = require('./utils');
let Scale = require('./scale');
const arrays = require("./utils/arrays");
const draw = require("./core/drawing");

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
function BasicGraph(id, options, data) {
    this.id = id;
    this.data = data;
    this.options = options;
    this.graph = Object;
    this.canvas = undefined;
    this.ctx = undefined;

    //region convert options, id, data into workable objects
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

    this.data.lengths = function () {
        return this.map(x => x.data.length);
    };

    this.data.maxLen = function () {
        return Math.max(...this.map(x => x.data.length));
    };

    this.data.minLen = function () {
        return Math.min(...this.map(x => x.data.length));
    };

    this.data.max = function () {
        return Math.max(...[].concat.apply([], this.map(x => x.data)));
    };

    this.data.min = function () {
        return Math.min(...[].concat.apply([], this.map(x => x.data)));
    };

    this.data.colourList = function () {
        return this.map(x => x.colour);
    };

    if ((this.options !== null) && (this.options !== undefined)) {
        Object.keys(this.options).forEach((option) => {
            if (this.defaultConfig.hasOwnProperty(option)) {
                this.defaultConfig[option] = this.options[option];
            }
        });
    }

    this.options = this.defaultConfig;
    this.elementMap = utils.findObjectElements(this.id, this.options);
}

/**
 * This simply switches the canvas context to be text mode ready,
 * set the font size and style, set text alignment to middle, and
 * change stroke colour to the axis' colour.
 *
 * @since v0.0.1
 * */
BasicGraph.prototype.textMode = function (size) {
    this.ctx.strokeStyle = this.options.axis_colour;
    this.ctx.textAlign = 'center';
    this.ctx.font = `${size}px "Robot Mono", monospace`;
};

BasicGraph.prototype.drawLabels = function () {
    // don't draw if no labels are given
    if (this.label_size === 0) {
        return;
    }

    let graph = this.graph;
    // add x-axis label
    this.ctx.fillText(this.options.x_label, graph.x_center, this.c_height);

    // add y-axis label
    this.ctx.save();
    this.ctx.translate(parseInt(graph.fontSize()), graph.y_center);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText(this.options.y_label, 0, 0);
    this.ctx.restore();
};

BasicGraph.prototype.drawAxis = function () {
    let graph = this.graph,
        offset = 0,
        scale_offset = undefined;

    this.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 60);
    // the y-limit is the y coordinate up to where everything should be drawn
    draw.verticalLine(this.ctx, graph.x_begin, graph.y_end, -graph.y_length);
    draw.horizontalLine(this.ctx, graph.x_begin, graph.y_end, graph.x_length);

    // change the stroke style to rgba(colour, 0.6), so apply 60% opacity.
    this.ctx.textBaseline = 'middle';
    this.textMode(14);

    let scale_num = {
        x : arrays.fillRange(this.data.maxLen() + 1).map(x => x.toString()),
        y : this.graph.scale.getTickLabels
    };


    while ((offset <= 10) || (offset <= this.data.maxLen())) {
        this.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 40);

        let x_len = this.options.gridded ? 9 + graph.y_length : 9,
            y_len = this.options.gridded ? 9 + graph.x_length : 9,
            skip_text = false;

        // draw the centered zero and skip drawing zero's on neighbouring ticks.
        if (this.options.zero_scale && scale_num.x[offset] === '0'
            && scale_num.y[offset] === '0')
        {
            this.ctx.fillText('0',
                graph.x_begin - graph.padding.val,
                graph.y_end + graph.padding.val
            );
            skip_text = true;
        }

        // The X-Axis drawing
        if (offset <= this.data.maxLen()) {
            let x_offset = offset * this.graph.squareSize.x;
            scale_offset = graph.fontSize() / 2;

            draw.verticalLine(this.ctx, graph.x_begin + x_offset, graph.y_end + 9, -x_len);

            if (!skip_text) {
                this.ctx.fillText(scale_num.x[offset],
                    graph.x_begin + x_offset,
                    graph.y_end + 9 + scale_offset
                );
            }
        }
        // The Y-Axis drawing
        if (offset <= 10) {
            let y_offset = offset * this.graph.squareSize.y;
            scale_offset = Math.ceil(this.ctx.measureText(scale_num.y[offset]).width / 1.5);

            draw.horizontalLine(this.ctx, graph.x_begin - 9, graph.y_end - y_offset, y_len);
            
            if (!skip_text) {
                this.ctx.fillText(scale_num.y[offset],
                    graph.x_begin - 9 - scale_offset,
                    graph.y_end - y_offset
                );
            }
        }
        offset++;
    }
};

BasicGraph.prototype.drawData = function () {
    // TODO: programmatically calculate this value
    let lineWidth = 2.5;

    for (let line of this.data) {
        // begin the path and move to the first point of the y-intercept
        this.ctx.beginPath();
        this.ctx.moveTo(line.pos_data[0].x, line.pos_data[0].y);

        // setup for drawing
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = utils.rgba(line.colour, 40);
        this.ctx.fillStyle = utils.rgba(line.colour, 40);
        this.ctx.lineWidth = lineWidth;

        for (let pos of line.pos_data) {
            this.ctx.setLineDash(line.style === 'dashed' ? [5,5] : [0]);
            // line to next point, then a circle to represent a dot at that point
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();

            // draw the point, before reset line dash, messes with circle
            this.ctx.setLineDash([]);
            draw.circle(this.ctx, pos.x, pos.y, lineWidth);

            // reset the pen back to center of the circle
            this.ctx.moveTo(pos.x, pos.y);
            this.ctx.stroke();
        }
    }
};

BasicGraph.prototype.calculateLabelPadding = function () {
    const PADDING = this.options.padding;

    let longestItem = arrays.longest(this.graph.scale.getTickLabels);

    // if no labels provided, they are disabled as in no room is provided
    // for them to be drawn.
    if (this.options.y_label.toString() !== "" &&
        this.options.x_label.toString() !== "") {
        this.label_size = this.graph.fontSize();

    } else {
        this.label_size = 0;
    }

    this.textMode(14);
    this.graph.padding.left = PADDING + this.ctx.measureText(longestItem).width + this.label_size;
    this.graph.padding.bottom = PADDING + this.label_size + 14;

    return this.graph.padding;
};

BasicGraph.prototype.convertDataToPositions = function (data) {
    let positions = [],
        actualSize = 0;

    // check if scale has actually been calculated
    if (this.graph.scale === undefined) {
        this.calculateScale();
    }

    for (let i = 0; i < data.length; i++) {
        if (data !== 0) {
            actualSize = (data[i] / this.graph.scale.getTickSpacing).toFixed(2);
        }

        positions.push({
            x: Math.round(this.graph.x_begin + (i * this.graph.squareSize.x)),
            y: Math.round(this.graph.y_end - (actualSize * this.graph.squareSize.y))
        });
    }
    return positions;
};

/**
 * Creates a @see Scale() object, retrieves data max and min, then uses this
 * to determine an aesthetic scale, then uses the calculation to determine the
 * value per grid y-stroke. Currently, the calculation is done for Y-Axis.
 *
 * @since v0.0.1
 * */
BasicGraph.prototype.calculateScale = function () {
    let min = this.options.zero_scale ? 0 : this.data.min();

    this.graph.scale = new Scale(min, this.data.max());
};

BasicGraph.prototype.draw = function () {
    let clazz = this;

    //region setup canvas and tittle
    try {
        this.canvas = this.elementMap.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.textMode(16);

        this.c_width = this.canvas.width;
        this.c_height = this.canvas.height;

    } catch (e) {
        if (this.canvas === null) {
            throw ('err: provided canvas does not exist!\n' + e);
        }
    } finally {
        const PADDING = this.options.padding;

        this.graph.squareSize = {x: 0, y: 0};

        this.graph.padding = {
                top: PADDING,
                left: undefined,
                right: PADDING,
                bottom: undefined,
                val: PADDING
        };

        this.graph.prototype.fontSize = function () {
            return parseInt(clazz.ctx.font.substr(0, 2));
        };

        this.calculateScale();
        // left and bottom need to be calculated & and temporarily use padding_map
        // for cross-referencing
        let padding_map = this.calculateLabelPadding();

        let y_length = this.c_height - padding_map.top - padding_map.bottom - this.label_size,
            x_length = this.c_width - padding_map.right - padding_map.left - this.label_size;
        //
        // // square size normalisation
        // this.normalise({val: x_length, which: 'x'}, this.data.maxLen());
        // this.normalise({val: y_length, which: 'y'}, 10);
        this.graph.squareSize.x = x_length / this.data.maxLen();
        this.graph.squareSize.y = y_length / 10;

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
         }
         );
    }
    //endregion
    this.data.toPos = function () {
        for (let entry of this) {
            entry.pos_data = clazz.convertDataToPositions(entry.data);
        }
    };

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
