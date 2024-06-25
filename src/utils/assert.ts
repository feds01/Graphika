/**
 * src/utils/assert.ts
 *
 * Module description:
 *
 * Extensions and typing helpers.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import config from "./../config";

export function assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
        const assertMessage = `Assertion failed: ${message}`;

        if (config.warnOnFailedAssert) {
            // warn instead of throwing an error
            console.warn(assertMessage);
            console.trace(assertMessage);
        } else {
            throw new Error(assertMessage);
        }
    }
}
