const TWO_PI = 2 * Math.PI;

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

function rgba(hex, opacity) {
    let alpha = Number(opacity / 100).toPrecision(2);

    return hex.replace(')', `,${parseFloat(alpha).toFixed(2)})`);
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
        //region convert options, id, data into workable objects
        let defaultConfig = {
            x_label: '',
            y_label: '',
            tittle: 'Graph',
            tittle_pos: 'top-center',
            scale: 1,
            gridded: false,
            padding: 12,
            join_points: true,
            axis_colour: 'rgb(94,94,94)',
            data_colour: 'rgb(156,39,176)'
        };

        if ((options !== null) && (options !== undefined)) {

            Object.keys(options).forEach((option) => {
                if (defaultConfig.hasOwnProperty(option)) {
                    defaultConfig[option] = options[option];
                }
            });
        }
        this.options = defaultConfig;
        //endregion

        this.findElements();
        //region setup canvas and tittle
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
        //endregion

        if(Array.isArray(data)) {
            for(let idx in data) {
                data[idx].data = this.convertDataToPositions(data[idx].data);
            }
        }
        this.data = data;

        if (this.label_size !== 0) {
            this.drawLabels();
        }
        this.drawAxis();
        this.drawData();
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

    drawLabels() {
        let graph = this.graph;
        // add x-axis label
        this.ctx.fillText(this.options.x_label, graph.x_center, this.c_height);

        // add y-axis label
        this.ctx.save();
        this.ctx.translate(parseInt(this.getFontSize()), graph.y_center);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText(this.options.y_label, 0, 0);
        this.ctx.restore();
    }

    drawAxis() {
        let graph = this.graph,
            offset = 0;

        // the y-limit is the y coordinate up to where everything should be drawn
        this.ctx.strokeRect(graph.x_begin, 0, 1, graph.y_length);
        this.ctx.strokeRect(graph.x_begin, graph.y_end, graph.x_length, 1);

        // change the stroke style to rgba(colour, 0.6), so apply 60% opacity.
        this.ctx.strokeStyle = rgba(this.options.axis_colour, 60);

        while ((offset <= graph.x_length) || (offset <= graph.y_length)) {
            let x_len = this.options.gridded ? 9 + graph.y_length : 9,
                y_len = this.options.gridded ? 9 + graph.x_length : 9;

            if (offset <= graph.x_length) {
                this.ctx.strokeRect(graph.x_begin + offset, graph.y_end + 9, 1, -x_len);
            }

            if (offset <= graph.y_length) {
                this.ctx.strokeRect(graph.x_begin - 9, graph.y_end - offset, y_len, 1);
            }
            offset += this.gridSquareSize;
        }
    }

    convertDataToPositions(data) {
        this.gridSquareSize = 50;

        let positions = [];
        
        console.log(data);
        
        for (let i in data) {
            positions.push({
                x: this.graph.x_begin + (i * this.gridSquareSize),
                y: this.graph.y_end - (data[i]  * this.gridSquareSize)
            });
        }
        return positions;
    }

    drawData() {
        let graph = this.graph;

        for (let line of this.data) {
            console.log(line);
            this.ctx.beginPath();

            if(parseInt(line.data[0].x) === graph.x_begin) {
                this.ctx.moveTo(line.data[0].x, line.data[0].y);
            } else {
                // move to fake origin if a point does not exist which is
                // on the Y-Axis.
                this.ctx.moveTo(graph.x_begin, graph.y_end);
            }
            
            // data line
            for(let pos of line.data) {
                // line to next point, then a circle to represent a dot at that point
                this.ctx.strokeStyle = rgba(line.colour, 60);
                this.ctx.lineWidth = 4;
                this.ctx.lineTo(pos.x, pos.y);
            }
            this.ctx.stroke();

            // data point dots
            this.ctx.fillStyle = rgba(line.colour, 80);
            this.ctx.strokeStyle = rgba(line.colour, 60);

            for (let pos of line.data) {
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 4, 0, TWO_PI);
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
    }
}