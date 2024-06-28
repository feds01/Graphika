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

type NumberArray = Array<number> | Float64Array;

/**
 * fills an empty array from 0 to size with integers and then returns the new array.
 *
 * @param size Fill the array up to the given size.
 * @returns array with numbers 0 up to size.
 * */
export function fillRange(size: number): Array<number> {
    return Array.from(Array(size).keys());
}

/**
 * Returns the longest string within a given array. It does not return the actual length
 * of the longest item, just the longest item.
 *
 * @param arr - Array of strings to find the longest item.
 * @returns Longest string from the array.
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
 * @param index - Current position in the array.
 * @param data - The array to index for the previous item.
 * @returns the previous item from the array, the same one if the index is 0.
 * */
export function getPrevious<T>(index: number, data: T[]): T {
    return index <= 0 ? data[0] : data[index - 1];
}

/**
 * Get the next element of an array, this method is also a safety wrapper function, if the
 * given index is equal to the length of the array - 1, or larger, return the last element
 * of the array, rather than undefined.
 *
 * @param index - Current position in the array.
 * @param arr - The array to index for the next item.
 * @returns the previous item from the array, the same one if the index is length of the array.
 * */
export function getNext<T>(index: number, arr: T[]): T {
    return arr[index >= arr.length - 1 ? arr.length - 1 : index + 1];
}

/**
 * Get all only negative values from a given array.
 *
 * @param arr - The array to filter out positive and zero values from.
 * @returns Negative only items.
 * */
export function negativeValues(arr: NumberArray): NumberArray {
    return arr.filter(function (value) {
        return value < 0;
    });
}

/**
 * Get all unique values from a given array.
 *
 * @param arr - The array to convert into a set.
 * @returns the set of the array.
 */
export function uniqueValues<T>(arr: T[]): Set<T> {
    return new Set(arr);
}

/**
 * Function to get maximum element within array, we don't want to
 * use Math.max if it is a large array.
 *
 * @param arr - Source array.
 * @returns largest number in the array.
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
 * Function to get maximum element within array.
 *
 * @param arr - Source array.
 * @returns Smallest number in the array.
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
 * Function to get maximum and minimum element within array.
 *
 * @param arr - Source array.
 * @returns smallest and largest numbers within the array.
 */
export function getMinMax(arr: NumberArray): { min: number; max: number } {
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
 *
 * Array sum function.
 *
 * @param arr - Array to be summed.
 * @returns sum of the array.
 */
export function sum(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0);
}

/**
 * Get all only positive and zero values from a given array.
 *
 * @param array - The array that is to be filtered.
 * @returns the array with only natural numbers.
 *  */
export function nonNegativeValues(array: NumberArray): NumberArray {
    return array.filter((value) => value >= 0);
}
