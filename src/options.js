/**
 * Module description:   /options.js
 *
 * Created on 12/03/2019
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

const utils = require("./utils");

class GridOptions {
    constructor(gridded, strict) {
        this.gridded = !utils.isUndefOrNull(gridded)  ? gridded : true;
        this.strict = !utils.isUndefOrNull(strict) ? strict : false;
    }
}