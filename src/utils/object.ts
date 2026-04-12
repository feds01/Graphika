/**
 * src/utils/object.ts
 *
 * Module description:
 *
 * Various helpers for objects and configs.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

/**
 * Deep clone an object.
 */
function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => deepClone(item)) as T;
    }
    const cloned = {} as T;
    for (const key of Object.keys(obj)) {
        // @ts-expect-error - We know that the key exists
        cloned[key] = deepClone(obj[key]);
    }
    return cloned;
}

/**
 * Combine two objects into one without mutating the originals.
 *
 * @param target The initial object that will be used as a base to merge.
 * @param source The object that will be merged into target.
 * @return A new merged object from target and source.
 *  */
export function merge<T extends object>(target: T, source: T): T {
    // Deep clone target to avoid mutating the original
    const result = deepClone(target);

    for (const key of Object.keys(source)) {
        // @ts-expect-error - We know that the key exists
        const sourceValue = source[key];
        // @ts-expect-error - We know that the key exists
        const targetValue = result[key];

        if (
            sourceValue instanceof Object &&
            targetValue instanceof Object &&
            !Array.isArray(sourceValue)
        ) {
            // @ts-expect-error - We know that the key exists
            result[key] = merge(targetValue, sourceValue);
        } else {
            // @ts-expect-error - We know that the key exists
            result[key] = deepClone(sourceValue);
        }
    }

    return result;
}

/**
 * Check whether some item is not null and not undefined.
 *
 * @param o - The item to check.
 * @return Whether the item is defined, as a type assertion.
 */
export function isDef<T>(o: T | null | undefined): o is T {
    return typeof o !== "undefined" && o !== null;
}

export function expr<T>(cb: () => T): T {
    return cb();
}
