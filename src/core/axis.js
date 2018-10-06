const scale = require("./scale");
const arrays = require("../utils/arrays");
const config = require("./config");
const defaultOptions = {
    minTicks: 10,
    maxTicks: 20,
    drawNotches: true,
    drawNumbers: true,
    startAtZero: true
};

class Axis {
    constructor(ctx, data, type, options) {
        this.data = [].concat.apply([], data.data.map(x => x.data));
        this.maxDataPoints = data.maxLen();
        this.options = options;
        this.type = type;
        this.ctx = ctx;

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
            this.options['maxTicks'] = Math.min(this.data.maxLen(), config.xTicks);
        }

        // we have negative values in the data set and therefore will require two
        // different scales
        this.scales = {};

        if (arrays.negativeValues(this.data).length > 0) {
            let negativeDataSet = arrays.negativeValues(this.data).map(x => Math.abs(x));


            this.scales.negative = new scale.scale({
                min: Math.min(...negativeDataSet),
                max: Math.max(...negativeDataSet),
                maxTicks: this.options.maxTicks,
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
            maxTicks: this.options.maxTicks,
            name: 'positive scale'
        });

        // Get the largest tick step of the two and set the other scale
        // tick step to the same one. This is because the tick steps must be
        // consistent for both negative and positive scales.
        if (this.negativeScale) {
            this.sharedTickStep = this.scales["positive"].getTickStep;

            if (this.scales["negative"].getTickStep > this.sharedTickStep) {
                this.sharedTickStep = this.scales["negative"].getTickStep;
            } else {
                this.scales["positive"].setTickStep(this.sharedTickStep);
            }
            this.scales["negative"].setTickStep(this.sharedTickStep);
        }
    };


    /**
     * @since v0.0.1
     * Takes in input as the lengths object from a graph object. * */
    determineAxisPosition(lengths) {
        if (this.type === 'x-axis') {
            // position the x-axis then in the center of the y-axis
            if (this.negativeScale) {
                console.log("gonna draw a x-axis negative scale");
                this.yStart = lengths.y_center;
                this.xStart = lengths.x_begin;
            } else {
                this.yStart = lengths.y_end;
                this.xStart = lengths.x_begin;
            }
        }
    }

    generateScaleNumbers() {
        if (this.type === 'x-axis') {
            this.scaleNumbers = arrays.fillRange(this.maxDataPoints + 1).map(
                x => Math.floor(this.maxDataPoints * (x / this.options.maxTicks))
            )
        } else {
            this.scaleNumbers = this.scales['positive'].getTickLabels;

            if (this.negativeScale) {
                this.scaleNumbers = this.scaleNumbers.concat(this.scales['negative'].getTickLabels.map(x => x * -1));
            }
        }
        console.log(this.scaleNumbers);

        //console.log(this.scaleNumbers)
    }

    draw(lengths) {
        this.determineAxisPosition(lengths);
        this.generateScaleNumbers();

    }
}

module.exports = Axis;