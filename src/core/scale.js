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

import {isUndefOrNaN} from "./../utils/object";
import * as arrays from "./../utils/arrays";
import {assert} from "./../utils/assert";
import {floor, round} from "./../utils/number";

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

        if (isUndefOrNaN(this.min) || isUndefOrNaN(this.max)) {
            console.log(options);
            throw ("Min/Max value of scale cannot be NaN or undefined.");
        }

        /*
        * Target number of ticks on the axis which will be displayed. * */
        this.tickCount = options.tickCount;
        this.isNegativeScale = options.isNegativeScale ? options.isNegativeScale : false;
        this.scaleLabels = [];
        this.scaleStep = 0;

        this.calculate();

        // recalculate to get proper tick range
        while (this.scaleStep * this.tickCount > this.range) {
            this.tickCount -= 1;
        }
        this.calculate();

        // reduction by checking if data is present within the 'tick' area. If not, we simply reduce
        // the tick count until it reaches a tick that's in use. We don't re-calculate every single
        // time because this will change the 'scaleStep' value and therefore lead to an infinite reduction loop.
        const precision = Math.ceil(Math.abs(Math.log10(this.scaleStep)));
        const range = round(this.max - this.min / 10 ** precision, precision);
        const initialTick = floor(this.min , this.scaleStep);

        while (range < round(this.scaleStep * (this.tickCount - 1) + initialTick, precision)) {
            this.tickCount -= 1;
        }
        this.generateScaleLabels();
    }

    calculate() {
        this.range = Scale.niceNum(this.max - this.min, false);
        this.scaleStep = Scale.niceNum(this.range / (this.tickCount - 1), true);
        this.roundedMinimum = Math.floor(this.min / this.scaleStep) * this.scaleStep;

        this.generateScaleLabels();
    }

    generateScaleLabels() {
        const logarithmicScaleStep = Math.log((this.scaleStep));
        const precision = Math.floor(Math.abs(logarithmicScaleStep));

        // fill array with labels.
        this.scaleLabels = arrays.fillRange(this.tickCount + 1).map(x => {
            let scaleLabel  = this.roundedMinimum + (x * this.scaleStep);

            // pass the zero, so we don't convert say '0' to '0.00'
            if (logarithmicScaleStep < 0 && scaleLabel !== 0) {

                // TODO: unhandled case where we have a float that is larger than log(n) > 1
                if (Math.log10(this.roundedMinimum) > 0) {
                    return scaleLabel.toFixed(precision);
                }

                return scaleLabel.toPrecision(precision).slice(0, 2 + precision);
            }

            return scaleLabel;
        });
    }

    setTickCount(val) {
        assert(!isNaN(val) && val > 0, "Cannot have negative ticks / non-numerical tick max for Scale");

        this.tickCount = val;
        this.calculate();
    }

    setTickStep(val) {
        this.scaleStep = val;
        this.tickCount = Math.ceil(this.max / val);

        this.generateScaleLabels(this.tickCount);
    }

    getTickCount() {
        return this.tickCount;
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
     * @returns {string[]} the scale labels.
     * */
    getScaleLabels(natural = true, rtl = false) {
        let scaleLabels = this.scaleLabels;

        if (natural && this.isNegativeScale) scaleLabels = scaleLabels.map((x) => -x);
        if (rtl) scaleLabels = scaleLabels.reverse();
        return scaleLabels.map(x => x.toString());
    }

    getScaleStep() {
        return this.scaleStep;
    }

    static niceNum(range, round) {
        let exponent = Math.floor(Math.log10(range));
        let fraction = range / (10 ** exponent);
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
        return niceFraction * (10 ** exponent);
    }
}

export default Scale;