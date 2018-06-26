const TWO_PI = 2 * Math.PI;


function rgba(hex, opacity) {
    let alpha = Number(opacity / 100).toPrecision(2);

    return hex.replace(')', `,${parseFloat(alpha).toFixed(2)})`);
}

class Scale {
    constructor(min, max) {
        this.minPoint = min;
        this.maxPoint = max;
        this.maxTicks = 10;
        this.tickSpacing = 0;
        this.range = 0;
        this.niceMin = 0;
        this.niceMax = 0;

        this.calculate();
    }

    calculate() {
        this.range = Scale.niceNum(this.maxPoint - this.minPoint, false);
        this.tickSpacing = Scale.niceNum(this.range / (this.maxTicks - 1), true);

        this.niceMin = Math.floor(this.minPoint / this.tickSpacing) * this.tickSpacing;
        this.niceMax = Math.ceil(this.maxPoint / this.tickSpacing) * this.tickSpacing;
    }

    static niceNum(range, round) {
        let exponent, fraction, niceFraction = undefined;

        exponent = Math.floor(Math.log10(range));
        fraction = range / Math.pow(10, exponent);

        if (round) {
            if (fraction < 1.5)    niceFraction = 1;
            else if (fraction < 3) niceFraction = 2;
            else if (fraction < 7) niceFraction = 5;
            else niceFraction = 10;
        } else {
            if (fraction <= 1) niceFraction = 1;
            else if (fraction <= 2) niceFraction = 2;
            else if (fraction <= 5) niceFraction = 5;
            else niceFraction = 10;
        }
        return niceFraction * Math.pow(10, exponent);
    }

    getTickSpacing() { return this.tickSpacing;}
    getNiceMin() { return this.niceMin;}
    getNiceMax() { return this.niceMax;}
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
        let clazz = this;

        this.id = id;
        this.data = data;
        this.graph = Object;
        this.gridSquareSize = null;
        this.canvas = undefined;
        this.scale = new Scale();
        this.ctx = undefined;

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
        this.elementMap = this.findElements();
        //endregion
        //region setup canvas and tittle
        try {
            this.canvas = this.elementMap.canvas;
            this.ctx = this.canvas.getContext('2d');
            this.ctx.strokeStyle = this.options.axis_colour;
            this.ctx.textAlign = 'center';
            this.ctx.font = '16px "Robot Mono", monospace';

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

            // if no labels provided, they are disabled as in no room is provided
            // for them to be drawn.
            if (this.options.y_label.toString() !== "" && this.options.x_label.toString() !== "") {
                this.label_size = this.graph.fontSize();
            } else {
                this.label_size = 0;
            }

            let padding = this.options.padding,
                y_limit = this.c_height,
                y_end = y_limit - (padding + this.label_size),
                x_size = this.c_width - (padding + this.label_size);

            this.graph = {
                x_begin :padding + this.label_size,
                y_begin : 0,
                x_end : this.c_width,
                y_end : y_end,
                x_length : x_size,
                y_length : y_end,
                x_center : padding + this.label_size + x_size / 2,
                y_center : this.label_size + y_end / 2,
            };
        }
        //endregion

        if(Array.isArray(this.data)) {
            this.data.lengths = function () {
                return this.map(x => x.data.length);
            };

            this.data.max = function() {
                return Math.max(...this.map(x => x.data.length));
            };

            this.data.min = function() {
                return Math.min(...this.map(x => x.data.length));
            };

            this.data.colourList = function () {
                return this.map(x => x.colour);
            };

            this.data.toPos = function () {
                clazz.gridSquareSize = clazz.graph.x_length / this.max();

                for(let entry of this) {
                    entry.pos_data = clazz.convertDataToPositions(entry.data);
                }
            };
        }
        this.data.toPos();

        this.drawLabels();
        this.drawAxis();
        this.drawData();
    }

    findElements() {
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
    }

    drawLabels() {
        // don't draw if no labels are given
        if (this.label_size === 0)  { return; }

        let graph = this.graph;
        // add x-axis label
        this.ctx.fillText(this.options.x_label, graph.x_center, this.c_height);

        // add y-axis label
        this.ctx.save();
        this.ctx.translate(parseInt(graph.fontSize()), graph.y_center);
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

    drawData() {
        let graph = this.graph;

        for (let line of this.data) {
            this.ctx.beginPath();

            if(parseInt(line.pos_data[0].x) === graph.x_begin) {
                this.ctx.moveTo(line.pos_data[0].x, line.pos_data[0].y);
            } else {
                // move to fake origin if a point does not exist which is
                // on the Y-Axis.
                this.ctx.moveTo(graph.x_begin, graph.y_end);
            }

            // data line
            for(let pos of line.pos_data) {
                // line to next point, then a circle to represent a dot at that point
                this.ctx.strokeStyle = rgba(line.colour, 60);
                this.ctx.lineWidth = 4;
                this.ctx.lineTo(pos.x, pos.y);
            }
            this.ctx.stroke();

            // data point dots
            this.ctx.fillStyle = rgba(line.colour, 80);
            this.ctx.strokeStyle = rgba(line.colour, 60);

            for (let pos of line.pos_data) {
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 4, 0, TWO_PI);
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
    }

    convertDataToPositions(data) {
        let positions = [];
        for (let i = 0; i < data.length; i++) {
            positions.push({
                x: Math.round(this.graph.x_begin + (i * this.gridSquareSize)),
                y: Math.round(this.graph.y_end - (data[i]  * this.gridSquareSize))
            });
        }
        return positions;
    }
}