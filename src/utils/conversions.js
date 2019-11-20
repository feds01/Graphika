/**
 * Module description: src/utils/conversions.js
 *
 * This module holds the Scale tick conversion methods, the scale ticks are used
 * to represent the quantity of data and data itself. It is noted that natural scale
 * numbers are a perfect solution to use for representing scales, however many graphic
 * implementation will convert long labels such as '6,000,000' to '6M' to use less space.
 * This module holds methods which enable conversions that are described.
 *
 * Created on 29/06/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

module.exports = {
    convertFromNumerical(numerical) {
        let exponent = Math.log10(numerical);

        if (exponent > 2) {
            if (exponent >= 3 && exponent < 6) return numerical / 10E2 + "k";
            if (exponent >= 6 && exponent < 9) return numerical / 10E5 + "m";
            if (exponent >= 9) return numerical / 10E8 + "b";
        }

        return numerical;
    }
};