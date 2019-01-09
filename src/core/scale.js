/**
 * Module description: src/core/scale.js
 *
 * This module holds the Scale class and it's methods, the scale class is used
 * to calculate the tick steps, tick number and other operations related with
 * graph/chart scales.
 *
 * Created on 29/06/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

const utils = require("./../utils");
const arrays = require("./../utils/arrays");
const assert = require("./../utils/assert").assert;

class Scale {
    constructor(options) {
        /**
         * @property Minimum data value within the data set.* */
        this.min = options.min;
        /**
         * @property Maximum data value within the data set.* */
        this.max = options.max;

        /*
        * The range of the values, simply a max - min subtraction*/
        this.range = 0;

        if (utils.isUndefOrNaN(this.min) || utils.isUndefOrNaN(this.max)) {
            throw ("Min/Max value of scale cannot be NaN or undefined.");
        }

        /*
        * Target number of ticks on the axis which will be displayed. * */
        this.maxTicks = options.maxTicks;
        this.tickLabels = [];
        this.tickStep = 0;

        this.calculate();

        // recalculate to get proper tick range
        while (this.tickStep * this.maxTicks < this.range) {
            this.maxTicks--;

            this.calculate();
        }
    }

    calculate() {
        this.range = Scale.niceNum(this.max - this.min, false);
        this.tickStep = Scale.niceNum(this.range / (this.maxTicks - 1), true);

        // this.niceMin = Math.floor(this.min / this.tickStep) * this.tickStep;
        // this.niceMax = Math.ceil(this.max / this.tickStep) * this.tickStep;

        this.generateTickValues();
    }

    generateTickValues() {
        // fill array with labels.
        this.tickLabels = arrays.fillRange(this.maxTicks + 1)
            .map(x => (x * this.tickStep));
    }

    setMaxTicks(val) {
        assert(!isNaN(val) && val > 0, "Cannot have negative ticks / non-numerical tick max for Scale");

        this.maxTicks = val;
        this.calculate();
    }

    setTickStep(val) {
        this.tickStep = val;
        this.maxTicks = Math.ceil(this.max / val);

        this.generateTickValues();
    }

    getMaxTicks() {
        return this.maxTicks;
    }

    getTickLabels() {
        return this.tickLabels;
    }

    getTickStep() {
        return this.tickStep;
    }

    static niceNum(range, round) {
        let exponent = Math.floor(Math.log10(range));
        let fraction = range / Math.pow(10, exponent);
        let niceFraction;

        if (round) {
            if (fraction < 1.5) niceFraction = 1;
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
}

module.exports = {
    Scale: Scale
};