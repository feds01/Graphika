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
        let clazz = this;

        this.settings = {
            x_size : 500,
            y_size : 500,
            x_label   : 'x-axis',
            y_label   : 'y-axis',
            tittle    : 'Graph',
            tittle_pos: 'top-center',
            scale     : 1,
            gridded   : false,
            padding   : 15,
            axis_colour: 'rgba(0,0,0, 0.6)'
        };

        try {
            this.canvas = document.getElementById(canvas);
            this.context = this.canvas.getContext('2d');

            this.context.imageSmoothingEnabled = true;
            this.context.strokeStyle = this.settings.axis_colour;

            this.context.font = '10px arial';

            this.settings.x_size = this.canvas.width;
            this.settings.y_size = this.canvas.height;

        } catch (e) {
            if(this.canvas === null) {
                throw ('err: provided canvas does not exist!');
            }
        }

        if((settings !== null) && (settings !== undefined)) {
            for(let setting of Object.keys(settings)) {
                this.setSetting(setting, settings[setting]);
            }
        }

        // data settings
        if(data === undefined || null) {
           this.data = {'x': [], 'y': []}
        } else {
            this.data = data;
        }
        // attach key method to the json object


        if(typeof Object.keys !== 'function') {
            this.data.keys = function () {
                let keys = [];

                for(let name in this) {
                    if(clazz.data.hasOwnProperty(name)) {
                        keys.push(name);
                    }
                }
                return keys;
            }
        } else {
            this.data.keys = function () {
                return Object.keys(this);
            }
        }

        // axis
        this.drawAxis();
    }

    setSetting(setting, val) {
        if(this.settings.hasOwnProperty(setting)) {
            this.settings[setting] = val;
        }
    }

    drawAxis() {
        let y_offset = 0;
        let padding = this.settings.padding;

        if(this.settings.tittle != null &&
           this.settings.tittle_pos.substr(0, 3) !== 'top')
        {
           y_offset += 10;
        }
        // the y-limit is the y coordinate up to where everything should be drawn
        let y_limit = this.settings.y_size - (padding + y_offset);

        this.context.strokeRect(padding, y_offset, 1, y_limit);
        this.context.strokeRect(padding, y_limit, this.settings.x_size - 5, 1);

        // now draw axis strokes
        let counter = 0;

        for(let offset = 0; offset < y_limit; offset += 20) {
            this.context.strokeRect(padding + offset, y_limit, 1, 9);
            this.context.strokeRect(padding, y_limit - offset, -9, 1);

            this.context.fillText(counter.toString(), padding + offset + 2, y_limit + 12);
            this.context.fillText(counter.toString(), padding - 9, y_limit - offset);
            counter++;
        }

        this.render();
    }

    render() {
        this.context.drawImage(this.canvas, 0,0);
        requestAnimationFrame(this.render);
    }
}