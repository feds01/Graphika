let utils = require('./utils');
let Scale = require('./scale');

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
    this.gridSquareSize = null;
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
}

BasicGraph.prototype.findElements = function () {
    let element = document.getElementById(this.id);
    let elementMap = {
        canvas: undefined,
        tittle: undefined
    };

    for (let childNode of element.childNodes) {
        const tagName = childNode.nodeName.toLowerCase();
        if (tagName === 'canvas') {
            elementMap.canvas = childNode;

        } else if (tagName === 'div') {
            if (childNode.classList.contains('tittle')) {
                elementMap.tittle = childNode;
            }
        }
    }

    // DOM modifications
    if (elementMap.canvas !== null) {
        element.style.width = elementMap.canvas.width.toString() + 'px';
    } else {
        // TODO: create the canvas element ?, same for tittle ?
        throw 'canvas element does not exist'
    }

    if (elementMap.tittle !== null) {
        switch (this.options.tittle_pos) {
            case 'top-left':
                elementMap.tittle.style.textAlign = 'left';
                break;
            case 'top-center':
                elementMap.tittle.style.textAlign = 'center';
                break;
            case 'top-right':
                elementMap.tittle.style.textAlign = 'right';
        }
        elementMap.tittle.innerHTML = this.options.tittle;
    }
    return elementMap;
};


/**
 * This simply switches the canvas context to be text mode ready,
 * set the font size and style, set text alignment to middle, and
 * change stroke colour to the axis' colour.
 *
 * @since v0.0.1
 * */
BasicGraph.prototype.textMode = function(size) {
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
        offset = 0;

    // the y-limit is the y coordinate up to where everything should be drawn
    this.ctx.strokeRect(graph.x_begin, 0, 1, graph.y_length);
    this.ctx.strokeRect(graph.x_begin, graph.y_end, graph.x_length, 1);

    // change the stroke style to rgba(colour, 0.6), so apply 60% opacity.
    this.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 60);
    this.ctx.textBaseline = 'middle';
    this.textMode(14);

    while ((offset <= graph.x_length) || (offset <= graph.y_length)) {
        let x_len = this.options.gridded ? 9 + graph.y_length : 9,
            y_len = this.options.gridded ? 9 + graph.x_length : 9,
            tick_len = Math.round(offset / this.gridSquareSize);

        if (offset <= graph.x_length) {
            this.ctx.strokeRect(graph.x_begin + offset, graph.y_end + 9, 1, -x_len);
        }

        if (offset <= graph.y_length) {
            let scale_num = (tick_len * graph.scale.tickSpacing).toString();
            let scale_offset = Math.ceil(this.ctx.measureText(scale_num).width / 1.5);

            this.ctx.strokeRect(graph.x_begin - 9, graph.y_end - offset, y_len, 1);
            this.ctx.fillText(scale_num, graph.x_begin - 9 - scale_offset, graph.y_end - offset);
        }
        offset += this.gridSquareSize;
    }
};

BasicGraph.prototype.drawData = function () {
    let graph = this.graph;

    for (let line of this.data) {
        this.ctx.beginPath();

        if (parseInt(line.pos_data[0].x) === graph.x_begin) {
            this.ctx.moveTo(line.pos_data[0].x, line.pos_data[0].y);
        } else {
            // move to fake origin if a point does not exist which is
            // on the Y-Axis.
            this.ctx.moveTo(graph.x_begin, graph.y_end);
        }

        // data line
        for (let pos of line.pos_data) {
            // line to next point, then a circle to represent a dot at that point
            this.ctx.strokeStyle = utils.rgba(line.colour, 60);
            this.ctx.lineWidth = 4;
            this.ctx.lineTo(pos.x, pos.y);
        }
        this.ctx.stroke();

        // data point dots
        this.ctx.fillStyle = utils.rgba(line.colour, 80);
        this.ctx.strokeStyle = utils.rgba(line.colour, 60);

        for (let pos of line.pos_data) {
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 4, 0, utils.TWO_PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
};

BasicGraph.prototype.convertDataToPositions = function (data) {
    let positions = [],
        actualSize = 0;

    // check if scale has actually been calculated
    if(this.graph.scale === undefined) {
        this.calculateScale();
    }

    for (let i = 0; i < data.length; i++) {

        if(data !== 0) {
            actualSize = (data[i] / this.graph.scale.tickSpacing).toFixed(2);
        }

        positions.push({
            x: Math.round(this.graph.x_begin + (i * this.gridSquareSize)),
            y: Math.round(this.graph.y_end - (actualSize * this.gridSquareSize))
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
BasicGraph.prototype.calculateScale = function() {
    let min = this.options.zero_scale ? 0 : this.data.min();

    this.graph.scale = new Scale(min, this.data.max());
};

BasicGraph.prototype.draw = function () {
    let clazz = this;

    if ((this.options !== null) && (this.options !== undefined)) {

        Object.keys(this.options).forEach((option) => {
            if (this.defaultConfig.hasOwnProperty(option)) {
                this.defaultConfig[option] = this.options[option];
            }
        });
    }

    this.options = this.defaultConfig;
    this.elementMap = this.findElements();
    //endregion
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
        this.graph.prototype.fontSize = function () {
            return parseInt(clazz.ctx.font.substr(0, 2));
        };

        let x_padding;

        // if no labels provided, they are disabled as in no room is provided
        // for them to be drawn.
        if (this.options.y_label.toString() !== "" &&
            this.options.x_label.toString() !== "")
        {
            this.label_size = this.graph.fontSize();
            x_padding = Math.round(this.options.padding * 2.5);

        } else {
            this.label_size = 0;
            x_padding = this.options.padding * 2;
        }

        let padding = this.options.padding,
            y_limit = this.c_height,
            y_end = y_limit - (padding + this.label_size),
            x_size = this.c_width - (x_padding + this.label_size);

        this.graph = {
            x_begin: x_padding + this.label_size,
            y_begin: 0,
            x_end: this.c_width,
            y_end: y_end,
            x_length: x_size,
            y_length: y_end,
            x_center: x_padding + this.label_size + x_size / 2,
            y_center: this.label_size + y_end / 2,
        };
    }
    //endregion

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

    this.data.toPos = function () {
        clazz.gridSquareSize = clazz.graph.x_length / this.maxLen();

        for (let entry of this) {
            entry.pos_data = clazz.convertDataToPositions(entry.data);
        }
    };
    this.data.toPos(); // convert data to positions

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
