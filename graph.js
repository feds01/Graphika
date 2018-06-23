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

let err = "canvas element does not exist.";

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
    constructor(canvas, settings, data) {
        this.id = canvas;
        this.settings = new Config(settings).config;
        // this.data = data === undefined || null ? {'x': [], 'y': []} : data;


        try {
            this.canvas = BasicGraph.findCanvas(this.id);
            this.context = this.canvas.getContext('2d');

            this.context.imageSmoothingEnabled = true;
            this.context.strokeStyle = this.settings.axis_colour;

            //this.context.font = '20px "Roboto Mono", monospace';

            this.settings.x_size = this.canvas.width;
            this.settings.y_size = this.canvas.height;

        } catch (e) {
            if (this.canvas === null) {
                throw ('err: provided canvas does not exist!\n' + e);
            }
        }
        // axis
        this.setTittlePosition();
        this.drawAxis();
    }

    static findCanvas(root) {
        let element = document.getElementById(root);
        let canvasElement = null;

        if (element === null) {
            throw err;
        } else {
            for (let child of element.childNodes) {
                if (child.nodeName.toLowerCase() === 'canvas') {
                    canvasElement = child;
                }
            }
        }

        if (canvasElement !== null) {
            element.style.width = (canvasElement.width).toString() + 'px';
        }
        return canvasElement;
    }

    static findTittle(root) {
        console.log(root);
        let rootElement = document.getElementById(root);

        if(rootElement === null) {
            throw err;

        } else {
            for (let child of rootElement.childNodes) {
                if (child.nodeName.toLowerCase() === 'div' &&
                    child.classList.contains('tittle'))
                {
                    return child;
                }
            }
        }
    }

    setTittlePosition() {
        if(this.settings.tittle != null) {
            let tittleElement = BasicGraph.findTittle(this.id);

            switch (this.settings.tittle_pos) {
                case 'top-left':
                    tittleElement.style.textAlign = 'left';
                    break;

                case 'top-center':
                    tittleElement.style.textAlign = 'center';
                    break;

                case 'top-right':
                    tittleElement.style.textAlign = 'right';
            }
            tittleElement.innerHTML = this.settings.tittle;
        }
    }

    drawAxis() {
        // the y-limit is the y coordinate up to where everything should be drawn
        let offset = 0,
            padding = this.settings.padding,
            y_limit = this.settings.y_size - padding,
            graph = {
                x_begin: padding,
                y_begin: padding,
                x_end: this.settings.x_size - padding,
                y_end: y_limit,
                x_size: this.settings.x_size - (2 * padding),
                y_size: y_limit - padding
            };

        this.context.strokeRect(padding, padding, 1, graph.y_size);
        this.context.strokeRect(padding, y_limit, graph.x_size, 1);

        // change the stroke style to rgba(colour, 0.6), so apply 60% opacity to
        // whataver colour is selected.
        this.context.strokeStyle = hexToOpacityHex(this.settings.axis_colour, '99');

        while(offset < graph.x_size && offset < graph.y_size) {
            let x_len = this.settings.gridded ? 9 + graph.y_size : 9,
                y_len = this.settings.gridded ? 9 + graph.x_size : 9;

            this.context.strokeRect(graph.x_begin + offset, graph.y_end + 9, 1, -x_len);
            this.context.strokeRect(graph.x_begin - 9, graph.y_end - offset, y_len, 1);

            offset += 20;
        }
    }
}

class Config {
    constructor(config) {
        this.config = {
            x_size: 500,
            y_size: 500,
            x_label: 'x-axis',
            y_label: 'y-axis',
            tittle: 'Graph',
            tittle_pos: 'top-center',
            scale: 1,
            gridded: false,
            padding: 10,
            axis_colour: '#5e5e5e'
        };

        if ((config !== null) && (config !== undefined)) {
            for (let setting of Object.keys(config)) {
                this.setConfig(setting, config[setting]);
            }
        }

        // add config keys to the class properties
    }

    setConfig(key, val) {
        if (this.config.hasOwnProperty(key)) {
            this.config[key] = val;
        }
    }
}
