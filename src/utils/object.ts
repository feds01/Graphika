/**
 *
 * @param {Object} target The initial object that will be used as a based to merge
 * @param {Object} source The object that will be merged into target
 *
 * @return {Object} A merged object from target and source
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

export function isUndefOrNull<T>(o: T | null | undefined): o is null | undefined {
    return typeof o === "undefined" || o === null;
}

export function isDef<T>(o: T | null | undefined): o is T {
    return typeof o !== "undefined" && o !== null;
}

export function isUndefOrNaN<T>(o: T | undefined | null): o is undefined | null {
    return Number.isNaN(o) || typeof o === "undefined";
}
