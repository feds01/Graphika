/**
 * src/utils/conversions.ts
 *
 * Module description:
 *
 * This module holds the Scale tick conversion methods, the scale ticks are used
 * to represent the quantity of data and data itself. It is noted that natural scale
 * numbers are a perfect solution to use for representing scales, however many graphic
 * implementation will convert long labels such as '6,000,000' to '6M' to use less space.
 * This module holds methods which enable conversions that are described.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

/**
 * Function converts a number into a string representation of the number in a
 * more human readable format.
 *
 * @param num - If the scale labels should be returned as what they truly
 *                    are.
 * @returns Formatted numeric string.
 * */
export function convertFromNumerical(num: string | number): string {
    if (typeof num === "string") {
        num = parseFloat(num);
    }

    const exponent = Math.log10(Math.abs(num));

    if (exponent > 2) {
        if (exponent >= 3 && exponent < 6) return num / 10e2 + "k";
        if (exponent >= 6 && exponent < 9) return num / 10e5 + "m";
        if (exponent >= 9) return num / 10e8 + "b";
    }

    return num.toString();
}
