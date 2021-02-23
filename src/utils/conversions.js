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



/**
 * Function converts a number into a smart numerical with a prefix with a
 * shortening for 
 *
 *
 * @param numerical {number,string} If the scale labels should be returned as what they truly
 * are. This is because the scale does not handle negative numbers and thus masks them
 * as positive numbers. The natural parameter will return them as negatives, if this scale
 * is a negative scale.
 *
 * @returns {String} the scale labels.
 * */
export function convertFromNumerical(numerical) {
    if (typeof numerical === "string") {
        numerical = parseFloat(numerical);
    }

    let exponent = Math.log10(numerical);

    if (exponent > 2) {
        if (exponent >= 3 && exponent < 6) return numerical / 10E2 + "k";
        if (exponent >= 6 && exponent < 9) return numerical / 10E5 + "m";
        if (exponent >= 9) return numerical / 10E8 + "b";
    }

    return numerical;
}

export function convertFromNumericalToK(numerical) {
    return;
}

export default {
    convertFromNumerical,
    convertFromNumericalToK,
}