/**
 * src/utils/number.ts
 *
 * Module description:
 *
 * Various helpers for working with numbers.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import { assert } from "./assert";

/**
 * Returns a number whose value is limited to the given range.
 *
 * @param min The lower boundary of the output range.
 * @param max The upper boundary of the output range.
 *
 * @return A number in the range [min, max].
 */
export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

/**
 * Function to round a number to the nearest boundary. For example, round a 5 to a boundary
 * of 8 would round the number to 8. Rounding the number 11 with a boundary of 8 would round
 * the number down to 8.
 *
 * @param num A number that is to be rounded to the nearest number (with the same parity as the specified boundary)
 * @param bound The specified boundary that the number should be rounded to.
 */
export function round(num: number, bound: number): number {
    assert(Number.isInteger(bound), "round function accepts only integer decimal places");
    assert(bound > 0, "Round boundary must be non-zero positive.");

    return Math.round(num / bound + Number.EPSILON) * bound;
}

/**
 * Function to floor a number to the nearest boundary. For example, floor a 5 to a boundary
 * of 8 would round the number to 0. Flooring 11 with boundary of 8 would floor it to 8.
 *
 * @param num A number that is to be floored to the nearest number (with the same parity as the specified boundary)
 * @param bound The specified boundary that the number should be floored to.
 *
 * @return the original number that is floored.
 */
export function floor(num: number, dp: number): number {
    assert(Number.isInteger(dp), "floor function accepts only integer decimal places");

    return Math.floor(num / dp + Number.EPSILON) * dp;
}
