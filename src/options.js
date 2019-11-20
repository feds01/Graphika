/**
 * Module description:   src/options.js
 *
 * This module holds methods for graph objects to merge default values
 * for configuration and options that are passed to the actial object.
 *
 * Created on 12/03/2019
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

// defaults
const utils = require("./utils");

class GridOptions {
    constructor(options) {
        this.gridded = !utils.isUndefOrNull(options.gridded)  ? options.gridded : true;
        this.strict = !utils.isUndefOrNull(options.strict) ? options.strict : false;

        /* In the case of both axis' beginning with zero, it will replace it with a single centralised zero */
        this.sharedAxisZero = !utils.isUndefOrNull(options.sharedZero) ? options.sharedZero : true;

        /* This will ensure that the X-Axis gris square length is an integer. */
        this.optimiseSquareSize = !utils.isUndefOrNull(options.optimiseSquareSize) ? options.sharedZero : true;
    }
}

module.exports = {
    GridOptions: GridOptions
};