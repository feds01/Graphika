const scale = require("./scale");
const arrays = require("../utils/arrays");
const config = require("./config");
const draw = require("./drawing");
const utils = require("./../utils");
const defaultOptions = {
    minTicks: 10,
    maxTicks: 20,
    drawNotches: true,
    drawNumbers: true,
    startAtZero: true
};

class Axis {
    constructor(graph, type, options) {
        this.maxDataPoints = graph.data.maxLen();
        this.data = graph.data.join();
        this.options = options;
        this.graph = graph;
        this.type = type;

        // fill in missing option values with default values
        for (let option of Object.keys(defaultOptions)) {
            if (this.options[option] === undefined) {
                this.options[option] = defaultOptions[option];
            }
        }

        if (this.options.maxTicks <= 0 || this.options.minTicks <= 0) {
            throw ("Max/Min ticks cannot be 0 or negative");
        }

        if (this.type === 'x-axis') {
            this.options['maxTicks'] = Math.min(graph.data.maxLen(), config.xTicks);
        }

        // we have negative values in the data set and therefore will require two
        // different scales
        this.scales = {};

        if (arrays.negativeValues(this.data).length > 0) {
            let negativeDataSet = arrays.negativeValues(this.data).map(x => Math.abs(x));

            // divide the max ticks by two since negative and positive are sharing the scale.
            this.scales.negative = new scale.scale({
                min: Math.min(...negativeDataSet),
                max: Math.max(...negativeDataSet),
                maxTicks: this.options.maxTicks / 2,
                name: "negative scale"
            });

            this.negativeScale = true;
        } else {
            this.negativeScale = false;
        }

        let positiveValues = arrays.positiveValues(this.data);

        this.scales.positive = new scale.scale({
            min: Math.min(...positiveValues),
            max: Math.max(...positiveValues),
            maxTicks: this.negativeScale ? this.options.maxTicks / 2 : this.options.maxTicks,
            name: 'positive scale'
        });

        // Get the largest tick step of the two and set the other scale
        // tick step to the same one. This is because the tick steps must be
        // consistent for both negative and positive scales.
        if (this.negativeScale) {
            this.sharedTickStep = Math.max(this.scales["positive"].getTickStep(), this.scales["negative"].getTickStep());

            this.scales["positive"].setTickStep(this.sharedTickStep);
            this.scales["negative"].setTickStep(this.sharedTickStep);

        }

        this.generateScaleNumbers();
    };


    /**
     * @since v0.0.1
     * Takes in input as the lengths object from a graph object.
     * * */
    determineAxisPosition() {
        this.yStart = this.graph.lengths.y_end;
        this.xStart = this.graph.lengths.x_begin;

        if(this.type === "y-axis") {
            console.log("SQUARE SIZE Y");
            this.graph.squareSize.y = this.graph.y_length / this.scaleNumbers.length;
        } else {
            this.graph.squareSize.x = this.graph.x_length / this.scaleNumbers.length;
        }

        if (this.type === 'x-axis') {
            // position the x-axis then in the center of the y-axis
            if (this.negativeScale) {
                let yOffset = this.graph.squareSize.y * this.graph.yAxis.scaleNumbers.indexOf(0);

                this.yStart = this.graph.lengths.y_end - yOffset;
                this.xStart = this.graph.lengths.x_begin;
            }
        }
    }

    generateScaleNumbers() {
        if (this.type === 'x-axis') {
            this.scaleNumbers = arrays.fillRange(this.maxDataPoints + 1).map(
                x => Math.floor(this.maxDataPoints * (x / this.options.maxTicks))
            )
        } else {
            this.scaleNumbers = this.scales['negative'].getTickLabels.map(x => x === 0 ?  x : x * -1).slice().reverse();
            if (this.negativeScale) {
                this.scaleNumbers = arrays.join(this.scaleNumbers, this.scales["positive"].getTickLabels);
            }

            // check if 0 & -0 exist, if so remove the negative 0
            for (let i = 0; i < this.scaleNumbers.length - 1; i++) {
                if (this.scaleNumbers[i] === this.scaleNumbers[i + 1] &&
                    this.scaleNumbers[i] === 0)
                {
                    this.scaleNumbers.splice(i + 1, 1);
                }
            }
        }
    }

    draw() {
        // determine the positions of the x-axis
        this.determineAxisPosition();
        let offset = 0;

        // get the context ready to draw
        this.graph.ctx.strokeStyle = utils.rgba(this.options.axis_colour, 60);
        this.graph.ctx.lineWidth = 1;

        if(this.type === "y-axis") {
            draw.verticalLine(this.graph.ctx, this.xStart, this.graph.lengths.y_end, -this.graph.y_length);

            for(let number of this.scaleNumbers) {
                let y_offset = offset * this.graph.squareSize.y;
                let scale_offset = Math.ceil(this.graph.ctx.measureText(number.toString()).width / 1.5);

                draw.toTextMode(this.graph.ctx, 14, this.options.axis_colour);
                this.graph.ctx.fillText(number.toString(),
                    this.graph.lengths.x_begin - 9 - scale_offset,
                    this.graph.lengths.y_end - y_offset
                );
                offset++;
            }
        } else {
            draw.horizontalLine(this.graph.ctx, this.xStart, this.yStart, this.graph.x_length);

            for (let number of this.scaleNumbers) {
                let x_offset = offset * this.graph.squareSize.x;
                let scale_offset = this.graph.font_size / 2;

                this.graph.ctx.textBaseline = 'middle';
                this.graph.ctx.fillText(number.toString(),
                    this.xStart + x_offset,
                    this.yStart + 9 + scale_offset
                );
                offset++;
            }
        }

    }
}

module.exports = Axis;