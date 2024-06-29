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
 * Combine two objects into one.
 *
 * @param target The initial object that will be used as a based to merge.
 * @param source The object that will be merged into target.
 * @return A merged object from target and source.
 *  */
export function merge<T extends object>(target: T, source: T): T {
    for (const key of Object.keys(source)) {
        // @ts-expect-error - We know that the key exists
        if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]));
    }

    // Join `target` and modified `source`
    Object.assign(target || {}, source);
    return target;
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
