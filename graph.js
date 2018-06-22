// attach key method to the json object
if(typeof Object.keys !== 'function') {
    Object.keys = function () {
        let keys = [];

        for(let name in this) {
            if(Object.hasOwnProperty(name)) {
                keys.push(name);
            }
        }
        return keys;
    }
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
    constructor(canvas, settings, data) {
        this.settings = new Config(settings).config;
        this.data = data === undefined || null ? {'x': [], 'y': []} : data;


        try {
            this.canvas = document.getElementById(canvas);
            this.context = this.canvas.getContext('2d');

            this.context.imageSmoothingEnabled = true;
            this.context.strokeStyle = this.settings.axis_colour;

            this.context.font = '20px "Roboto Mono", monospace';

            this.settings.x_size = this.canvas.width;
            this.settings.y_size = this.canvas.height;

        } catch (e) {
            if(this.canvas === null) {
                throw ('err: provided canvas does not exist!');
            }
        }
        // axis
        this.drawAxis();

    }

    drawAxis() {
        let x_size = this.settings.x_size;

        let padding = this.settings.padding;
        let y_offset = 0;

        if(this.settings.tittle != null &&
           this.settings.tittle_pos.substr(0, 3) === 'top')
        {
           y_offset += 30;

            switch (this.settings.tittle_pos) {
                case "top-left":
                    this.context.fillText(this.settings.tittle, 0, 15);
                    break;
                case "top-center":
                    this.context.fillText(this.settings.tittle, x_size * 0.5, 15);
                    break;
                case "top-right":
                    this.context.fillText(this.settings.tittle, x_size * 0.75, 15);
                    break;
            }
        }

        // the y-limit is the y coordinate up to where everything should be drawn
        let y_limit = this.settings.y_size - (padding) + y_offset;

        this.context.strokeRect(padding, y_offset, 1, y_limit);
        this.context.strokeRect(padding, y_limit, this.settings.x_size - padding, 1);

        this.graph = {x_begin: padding, y_begin: y_offset, x_end : this.settings.x_size - padding, y_end: y_limit};

        // x-axis
        for(let offset = this.graph.x_begin; offset < this.graph.x_end; offset += 20) {
            this.context.strokeRect(offset, this.graph.y_end, 1, 9);
        }

     /*   for(let offset = this.graph.x_begin; offset < () ; offset -= 20) {
            console.log(padding + offset);
            // x-axis
            this.context.strokeRect(padding + offset, y_limit, 1, 9);

            // y-axis
            //this.context.strokeRect(padding, y_limit - offset + y_offset, -9, 1);
        }*/
    }
}

class Config {
    constructor(config) {
        this.config = {
            x_size : 500,
            y_size : 500,
            x_label   : 'x-axis',
            y_label   : 'y-axis',
            tittle    : 'Graph',
            tittle_pos: 'top-center',
            scale     : 1,
            gridded   : false,
            padding   : 40,
            axis_colour: '#5e5e5e'
        };

        if((config !== null) && (config !== undefined)) {
            for(let setting of Object.keys(config)) {
                this.setConfig(setting, config[setting]);
            }
        }

        // add config keys to the class properties
    }

    setConfig(key, val) {
        if(this.config.hasOwnProperty(key)) {
            this.config[key] = val;
        }
    }
}