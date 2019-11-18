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
         * @property min Minimum data value within the data set.* */
        this.min = options.min;
        /**
         * @property max Maximum data value within the data set.* */
        this.max = options.max;

        /**
         * @property range The range of the values, simply a max - min subtraction
         * */
        this.range = 0;

        /**
         * @property isNegativeScale boolean flag to denote if scale is working with negatives.
         * */
        this.isNegativeScale = false;

        if (utils.isUndefOrNaN(this.min) || utils.isUndefOrNaN(this.max)) {
            throw ("Min/Max value of scale cannot be NaN or undefined.");
        }

        /*
        * Target number of ticks on the axis which will be displayed. * */
        this.maxTicks = options.maxTicks;
        this.isNegativeScale = options.isNegativeScale ? options.isNegativeScale : false;
        this.scaleLabels = [];
        this.scaleStep = 0;

        this.calculate();

        // recalculate to get proper tick range
        while (this.scaleStep * this.maxTicks < this.range) {
            this.maxTicks--;

            this.calculate();
        }
    }

    calculate() {
        this.range = Scale.niceNum(this.max - this.min, false);
        this.scaleStep = Scale.niceNum(this.range / (this.maxTicks - 1), true);

        // this.niceMin = Math.floor(this.min / this.tickStep) * this.tickStep;
        // this.niceMax = Math.ceil(this.max / this.tickStep) * this.tickStep;

        this.generateTickValues();
    }

    generateTickValues() {
        // fill array with labels.
        this.scaleLabels = arrays.fillRange(this.maxTicks + 1)
            .map(x => (x * this.scaleStep));
    }

    setMaxTicks(val) {
        assert(!isNaN(val) && val > 0, "Cannot have negative ticks / non-numerical tick max for Scale");

        this.maxTicks = val;
        this.calculate();
    }

    setTickStep(val) {
        this.scaleStep = val;
        this.maxTicks = Math.ceil(this.max / val);

        this.generateTickValues();
    }

    getMaxTicks() {
        return this.maxTicks;
    }

    /**
     * Function to get scale values for the given scale object. The function
     * also accepts values that allow the scale values to be transformed to be
     * represented on a axis/graph.
     *
     * @param natural {boolean} If the scale labels should be returned as what they truly
     * are. This is because the scale does not handle negative numbers and thus masks them
     * as positive numbers. The natural parameter will return them as negatives, if this scale
     * is a negative scale.
     *
     * @param rtl {boolean} If the numbers should be returned from Right-To-Left (largest to
     * smallest) or else.
     *
     * @returns {Array<number>} the scale labels.
     * */
    getScaleLabels(natural = true, rtl = false) {
        let scaleLabels = this.scaleLabels;

        if (natural && this.isNegativeScale) scaleLabels = scaleLabels.map((x) => -x);
        if (rtl) scaleLabels = scaleLabels.reverse();

        return scaleLabels;
    }

    getScaleStep() {
        return this.scaleStep;
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