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

import { assert } from "./../utils/assert";
import * as arrays from "./../utils/arrays";
import { floor, round } from "./../utils/number";
import { isUndefOrNaN } from "./../utils/object";

export type ScaleOptions = {
    axisColour?: string;
    drawLabels?: boolean;
    drawTicks?: boolean;
    labelDirection?: string;
    optimiseTicks?: boolean;
    startAtZero?: boolean;
    tickLabels?: string[] | null; // @@FIXME

    ticks?: number;
    /* Minimum data value within the data set.* */
    min: number;
    /* Maximum data value within the data set.* */
    max: number;

    /* Whether or not to optimise the tickCount  */
    minimumScaleStep?: number;

    /* flag to denote if scale is working with negatives. */
    isNegativeScale?: boolean;

    /* Target number of ticks on the axis which will be displayed. * */
    tickCount: number;
};

class Scale {
    public range: number;
    public scaleStep: number;
    public scaleLabels: (number | string)[]; // @@TODO: make it always a string
    public roundedMinimum: number = Number.NEGATIVE_INFINITY;

    constructor(private readonly options: ScaleOptions) {
        /* The range of the values, simply a max - min subtraction */
        this.range = 0;

        /* Boolean flag to denote whether or not to optimise tick count */
        this.options.optimiseTicks = options.optimiseTicks ?? true;

        this.scaleLabels = [];
        this.scaleStep = 0;

        assert(
            !(isUndefOrNaN(this.options.min) || isUndefOrNaN(this.options.max)),
            "Min/Max value of scale cannot be NaN or undefined."
        );

        // initial calculation before tick optimisations
        this.calculate();

        // recalculate to get proper tick range if there is an underflow
        while (this.scaleStep * this.options.tickCount > this.range) {
            this.options.tickCount -= 1;
        }

        // avoid too little ticks if the user didn't strictly specify so many ticks.
        while (this.scaleStep * this.options.tickCount < this.options.max - this.options.min) {
            this.options.tickCount += 1;
        }

        this.calculate();

        if (this.options.optimiseTicks) {
            // reduction by checking if data is present within the 'tick' area. If not, we simply reduce
            // the tick count until it reaches a tick that's in use. We don't re-calculate every single
            // time because this will change the 'scaleStep' value and therefore lead to an infinite reduction loop.
            const precision = Math.max(1, Math.ceil(Math.abs(Math.log10(this.scaleStep))));

            const range = round(this.options.max - this.options.min / 10 ** precision, precision);
            const initialTick = floor(this.options.min, this.scaleStep);

            while (range <= round(this.scaleStep * (this.options.tickCount - 1) + initialTick, precision)) {
                this.options.tickCount -= 1;
            }
        }

        this.generateScaleLabels();
    }

    calculate() {
        this.range = Scale.niceNum(this.options.max - this.options.min, false);
        this.scaleStep = Scale.niceNum((this.options.max - this.options.min) / (this.tickCount - 1), true);

        if (this.options.minimumScaleStep) {
            this.scaleStep = Math.max(this.options.minimumScaleStep, this.scaleStep);
        }

        this.roundedMinimum = Math.floor(this.options.min / this.scaleStep) * this.scaleStep;

        this.generateScaleLabels();
    }

    generateScaleLabels() {
        const logarithmicScaleStep = Math.log(this.scaleStep);
        const precision = Math.abs(Math.floor(logarithmicScaleStep));

        // fill array with labels.
        this.scaleLabels = arrays.fillRange(this.tickCount + 1).map((x) => {
            let scaleLabel = this.roundedMinimum + x * this.scaleStep;

            // pass the zero, so we don't convert say '0' to '0.00'
            if (logarithmicScaleStep < 0 && scaleLabel !== 0) {
                // TODO: unhandled case where we have a float that is larger than log(n) > 1
                if (Math.log10(this.roundedMinimum) > 0) {
                    return scaleLabel.toFixed(precision);
                }

                return scaleLabel; //.toPrecision(precision); //.slice(0, 2 + precision);
            }

            return scaleLabel;
        });
    }

    get tickCount() {
        return this.options.tickCount;
    }

    set tickCount(val: number) {
        assert(val > 0, "Cannot have negative ticks / non-numerical tick max for Scale");

        this.options.tickCount = val;
        this.calculate();
    }

    set tickStep(val: number) {
        this.scaleStep = val;
        this.options.tickCount = Math.ceil(this.options.max / val);
        this.generateScaleLabels();
    }

    getTickCount(): number {
        return this.options.tickCount;
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
    getScaleLabels(natural = true, rtl = false): string[] {
        let scaleLabels = this.scaleLabels;

        if (natural && this.options.isNegativeScale) scaleLabels = scaleLabels.map((x) => -x);
        if (rtl) scaleLabels = scaleLabels.reverse();

        return scaleLabels.map((x) => x.toString());
    }

    getScaleStep() {
        return this.scaleStep;
    }

    static niceNum(range: number, round: boolean): number {
        const exponent = Math.floor(Math.log10(range));
        const fraction = range / 10 ** exponent;
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
        return niceFraction * 10 ** exponent;
    }
}

export default Scale;
