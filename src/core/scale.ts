/**
 * src/core/scale.ts
 *
 * Module description:
 *
 * This module holds the Scale class and it's methods, the scale class is used
 * to calculate the tick steps, tick number and other operations related with
 * graph/chart scales.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import { assert } from "./../utils/assert";
import * as arrays from "./../utils/arrays";
import { floor, round, isNum } from "./../utils/number";

export type ScaleOptions = {
    axisColour?: string;
    drawLabels?: boolean;
    drawTicks?: boolean;
    labelDirection?: string;

    /* Boolean flag to denote whether or not to optimise tick count */
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

    /* Target number of ticks on the axis which will be displayed. * */
    tickCount: number;
};

class Scale {
    /* The range of the values, simply a max - min subtraction */
    public range: number;
    public scaleStep: number;
    public scaleLabels: (number | string)[]; // @@TODO: make it always a string
    public roundedMinimum: number = Number.NEGATIVE_INFINITY;

    constructor(private readonly options: ScaleOptions) {
        this.range = Scale.niceNum(this.options.max - this.options.min, false);
        this.scaleStep = Scale.niceNum((this.options.max - this.options.min) / (this.tickCount - 1), true);

        this.options.optimiseTicks = options.optimiseTicks ?? true;
        this.scaleLabels = [];

        assert(
            !(isNum(this.options.min) || isNum(this.options.max)),
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

            while (range < round(this.scaleStep * (this.options.tickCount - 1) + initialTick, precision)) {
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

    /**
     * Generate the ticks for the scale. This function will generate the numeric
     * ticks for the scale.
     */
    get ticks(): number[] {
        return arrays.fillRange(this.tickCount + 1).map((x) => {
            const scaleLabel = this.roundedMinimum + x * this.scaleStep;
            return scaleLabel;
        });
    }

    get min() {
        return this.options.min;
    }

    get max() {
        return this.options.max;
    }

    generateScaleLabels() {
        const logarithmicScaleStep = Math.log10(this.scaleStep);
        const precision = Math.abs(Math.floor(logarithmicScaleStep));

        return this.ticks.map((x) => {
            // pass the zero, so we don't convert say '0' to '0.00'
            if (logarithmicScaleStep < 0 && x !== 0) {
                return x.toPrecision(precision);
            }

            return x;
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
    }

    getTickCount(): number {
        return this.options.tickCount;
    }

    /**
     * Function to get scale values for the given scale object. The function
     * also accepts values that allow the scale values to be transformed to be
     * represented on a axis/graph.
     *
     * @param rtl If the numbers should be returned from Right-To-Left (largest to
     * smallest) or else.
     *
     * @returns {string[]} the scale labels.
     * */
    getScaleLabels(rtl: boolean = false): string[] {
        let scaleLabels = this.generateScaleLabels();
        if (rtl) scaleLabels = scaleLabels.reverse();

        return scaleLabels.map((x) => x.toString());
    }

    getScaleStep() {
        return this.scaleStep;
    }

    /**
     * Get the closest number to zero in the scale. This is a useful
     * utility to have when trying to work out the orientation of the
     * scale.
     *
     * @returns the closest number to zero in the scale.
     */
    get closestToZero(): number {
        let candidate = Math.abs(this.roundedMinimum);

        for (const tick of this.ticks) {
            if (tick === 0) return 0;

            if (Math.abs(tick) < candidate) {
                candidate = Math.abs(tick);
            }
        }

        return candidate;
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
