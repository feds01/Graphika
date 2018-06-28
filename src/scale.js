const arrays = require('./utils/arrays');

class Scale {
    constructor(min, max) {
        this.minPoint = min;
        this.maxPoint = max;
        this.maxTicks = 10;
        this.tickLabels = [];
        this.tickSpacing = 0;
        this.range = 0;
        //this.niceMin = 0;
        //this.niceMax = 0;

        this.calculate();
    }

    calculate() {
        // first calculate the range, maximum point and minimum point,
        // after so, calculate tick spacing based on the max number of ticks.
        this.range = Scale.niceNum(this.maxPoint - this.minPoint, false);
        this.tickSpacing = Scale.niceNum(this.range / (this.maxTicks - 1), true);


        // fill array with labels.
        this.tickLabels = arrays.fillRange(this.maxTicks + 1)
            .map(x => (x * this.tickSpacing).toString());

        //this.niceMin = Math.floor(this.minPoint / this.tickSpacing) * this.tickSpacing;
        //this.niceMax = Math.ceil(this.maxPoint / this.tickSpacing) * this.tickSpacing;
    }

    get getTickLabels() {
        return this.tickLabels;
    }

    get getTickSpacing() {
        return this.tickSpacing;
    }

    static niceNum(range, round) {
        let exponent, fraction, niceFraction = undefined;

        exponent = Math.floor(Math.log10(range));
        fraction = range / Math.pow(10, exponent);

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

module.exports = Scale;