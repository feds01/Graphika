/**
 * Module description:   src/helpers/assert.js.js
 *
 * Created on 01/01/2019
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

module.exports = {
    assert: function (condition, message) {
        if (!condition) {
            throw(`Assertion failed: ${message}`);
        }
    }
};

