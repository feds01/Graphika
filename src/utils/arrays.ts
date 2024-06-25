/**
 * src/utils/arrays.ts
 *
 * Module description:
 *
 * Various helpers for working with arrays.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

/**
 * fills an empty array from 0 to size with integers and then returns the new array.
 *
 * @param {number} size Fill the array up to the given size
 * @returns {Array<number>} array with numbers 0 up to size
 * */
export function fillRange(size: number): Array<number> {
    return Array.from(Array(size).keys());
}

/**
 * Returns the longest string within a given array. It does not return the actual length
 * of the longest item, just the longest item.
 *
 * @param {Array<string>} arr Array of strings to find the longest item
 *
 * @returns {string} Longest string from the array
 * */
export function longest(arr: string[]): string {
    return arr.reduce((a, b) => {
        return a.toString().length > b.toString().length ? a : b;
    });
}

/**
 * Get the previous element of an array, this method is created for safety, if the
 * given index is zero or less than zero, the function will return the element at zero
 * rather than undefined.
 *
 * @template T
 * @param {Number} index Current position in the array
 * @param {Array<T>} data The array to index for the previous item
 *
 * @returns {T} the previous item from the array, the same one if the index is 0
 * */
export function getPrevious<T>(index: number, data: T[]): T {
    return index <= 0 ? data[0] : data[index - 1];
}

/**
 * Get the next element of an array, this method is also a safety wrapper function, if the
 * given index is equal to the length of the array - 1, or larger, return the last element
 * of the array, rather than undefined.
 *
 * @template T
 * @param {Number} index Current position in the array
 * @param {Array<T>} arr The array to index for the next item
 *
 * @returns {T} the previous item from the array, the same one if the index is length of the array
 * */
export function getNext<T>(index: number, arr: T[]): T {
    return arr[index >= arr.length - 1 ? arr.length - 1 : index + 1];
}

/**
 * Get all only negative values from a given array.
 *
 * @param {Array<number>} arr The array to filter out positive and zero values from.
 *
 * @returns {Array<number>} Negative only items
 * */
export function negativeValues(arr: number[] | Float64Array): number[] | Float64Array {
    return arr.filter(function (value) {
        return value < 0;
    });
}

/**
 * Get all unique values from a given array.
 *
 * @param {Array<*>} arr The array to convert into a set
 *
 * @returns {Set<*>} the set of the array
 */
export function uniqueValues<T>(arr: T[]): Set<T> {
    return new Set(arr);
}

/**
 * Function to get maximum element within array, we don't want to
 * use Math.max if it is a large array
 *
 * @param {Array<Number>} arr Source array
 *
 * @returns {Number} largest number in the array
 */
export function getMax(arr: number[] | Float64Array): number {
    let len = arr.length;
    let max = -Infinity;

    while (len--) {
        max = arr[len] > max ? arr[len] : max;
    }
    return max;
}

/**
 * Function to get maximum element within array, we don't want to
 * use Math.max if it is a large array
 *
 * @param {Array<Number>} arr Source array
 *
 * @returns {Number} smallest number in the array
 */
export function getMin(arr: number[]): number {
    let len = arr.length;
    let min = Infinity;

    while (len--) {
        min = arr[len] < min ? arr[len] : min;
    }
    return min;
}

/**
 * Function to get maximum and minimum element within array, this will get both elements
 * within a single iteration of the array instead of calling both min and max and doing
 * double the work.
 *
 * @param {Array<Number>} arr Source array
 *
 * @returns {{min: Number, max: Number}} smallest and largest numbers within the array
 */
export function getMinMax(arr: number[] | Float64Array): { min: number; max: number } {
    let min = arr[0];
    let max = arr[0];
    let i = arr.length;

    while (i--) {
        min = arr[i] < min ? arr[i] : min;
        max = arr[i] > max ? arr[i] : max;
    }
    return { min, max };
}

/**
 * Array sum function
 *
 * @param {Array<Number>} arr Number array to be summed.
 * @returns {Number} sum of the array
 */
export function sum(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0);
}

/**
 * Get all only positive and zero values from a given array.
 *
 * @param {Array<Number>} array The array that is to be filtered
 *
 * @returns {Array<Number>} the array with only natural numbers
 *  */
export function positiveAndZeroValues(array: number[] | Float64Array): number[] | Float64Array {
    return array.filter((value) => value >= 0);
}
