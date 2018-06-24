// attach key method to the json object
if (typeof Object.keys !== 'function') {
    Object.keys = function () {
        let keys = [];

        for (let name in this) {
            if (Object.hasOwnProperty(name)) {
                keys.push(name);
            }
        }
        return keys;
    }
}

function hexToOpacityHex(hex, opacity) {
    return `#${opacity}${hex.substr(1)}`;
}


class BasicGraph {
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
    constructor(id, options, data) {
        this.id = id;
        this.options = new Config(options).config;
        // this.data = data === undefined || null ? {'x': [], 'y': []} : data;

        this.findElements();

        try {
            this.canvas = this.elementMap.canvas;
            this.ctx = this.canvas.getContext('2d');

            this.ctx.strokeStyle = this.options.axis_colour;
            this.ctx.textAlign = 'center';
            this.ctx.font = '16px "Roboto Mono", monospace';

            this.c_width = this.canvas.width;
            this.c_height = this.canvas.height;

        } catch (e) {
            if (this.canvas === null) {
                throw ('err: provided canvas does not exist!\n' + e);
            }
        } finally {
            // if no labels provided, they are disabled as in no room is provided
            // for them to be drawn.
            if (this.options.y_label.toString() !== "" && this.options.x_label.toString() !== "") {
                this.label_size = this.getFontSize();
            } else {
                this.label_size = 0;
            }

            let padding = this.options.padding,
                y_limit = this.c_height,
                y_end = y_limit - (padding + this.label_size),
                x_size = this.c_width - (padding + this.label_size);

            this.graph = {
                x_begin: padding + this.label_size,
                y_begin: 0,
                x_end: this.c_width,
                y_end: y_end,
                x_length: x_size,
                y_length: y_end,
                x_center: padding + this.label_size + x_size / 2,
                y_center: this.label_size + y_end / 2
            };
        }

        if (this.label_size !== 0) {
            this.drawLabels(this.graph);
        }
        this.drawAxis(this.graph);
    }

    findElements() {
        let element = document.getElementById(this.id);
        this.elementMap = {
            canvas: undefined,
            tittle: undefined
        };

        for (let childNode of element.childNodes) {
            const tagName = childNode.nodeName.toLowerCase();
            if (tagName === 'canvas') {
                this.elementMap.canvas = childNode;

            } else if (tagName === 'div') {
                if (childNode.classList.contains('tittle')) {
                    this.elementMap.tittle = childNode;
                }
            }
        }

        // DOM modifications
        if (this.elementMap.canvas !== null) {
            element.style.width = this.elementMap.canvas.width.toString() + 'px';
        } else {
            // TODO: create the canvas element ?, same for tittle ?
            throw 'canvas element does not exist'
        }

        if (this.elementMap.tittle !== null) {
            switch (this.options.tittle_pos) {
                case 'top-left':
                    this.elementMap.tittle.style.textAlign = 'left';
                    break;
                case 'top-center':
                    this.elementMap.tittle.style.textAlign = 'center';
                    break;
                case 'top-right':
                    this.elementMap.tittle.style.textAlign = 'right';
            }
            this.elementMap.tittle.innerHTML = this.options.tittle;
        }
    }

    getFontSize() {
        return parseInt(this.ctx.font.substr(0, 2));
    }

    drawLabels(graph) {
        // add x-axis label
        this.ctx.fillText(this.options.x_label, graph.x_center, this.c_height);

        // add y-axis label
        this.ctx.save();
        this.ctx.translate(parseInt(this.getFontSize()), graph.y_center);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(this.options.y_label, 0, 0);
        this.ctx.restore();
    }

    drawAxis(graph) {
        let offset = 0;

        // the y-limit is the y coordinate up to where everything should be drawn
        this.ctx.strokeRect(graph.x_begin, 0, 1, graph.y_length);
        this.ctx.strokeRect(graph.x_begin, graph.y_end, graph.x_length, 1);

        // change the stroke style to rgba(colour, 0.6), so apply 60% opacity.
        this.ctx.strokeStyle = hexToOpacityHex(this.options.axis_colour, '99');

        while ((offset <= graph.x_length) || (offset <= graph.y_length)) {
            this.ctx.strokeStyle = hexToOpacityHex(this.options.axis_colour, '99');
            let x_len = this.options.gridded ? 9 + graph.y_length : 9,
                y_len = this.options.gridded ? 9 + graph.x_length : 9;

            if (offset <= graph.x_length) {
                this.ctx.strokeRect(graph.x_begin + offset, graph.y_end + 9, 1, -x_len);
            }

            if (offset <= graph.y_length) {
                this.ctx.strokeRect(graph.x_begin - 9, graph.y_end - offset, y_len, 1);
            }
            offset += 20;
        }
    }
}

class Config {
    constructor(config) {
        this.config = {
            x_label: '',
            y_label: '',
            tittle: 'Graph',
            tittle_pos: 'top-center',
            scale: 1,
            gridded: false,
            padding: 12,
            axis_colour: '#5e5e5e'
        };

        if ((config !== null) && (config !== undefined)) {
            for (let setting of Object.keys(config)) {
                this.setConfig(setting, config[setting]);
            }
        }
    }

    setConfig(key, val) {
        if (this.config.hasOwnProperty(key)) {
            this.config[key] = val;
        }
    }
}
