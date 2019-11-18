/**
 * Module description: src/core/dataManager.js
 *
 * This module holds the utility and CRUD methods for a graph
 * data object. Sorting data, joining and getting basic statistical
 * analysis on the data.
 *
 * Created on 01/10/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

const arrays = require("../utils/arrays");
const assert = require("./../utils/assert").assert;

class DataManager {
    constructor(data) {
        this.data = data;
        // Assert that each data 'label' is unique
        // TODO: show/display the conflicting labels. Could probably done by using a 'reduce'
        assert(arrays.uniqueValues(this.labels()).size === this.labels().length,
            "data must have unique labels for each data set");

        // Ensure that the provided data can be accessed and is not empty data, this is simple sanitization
        for (let entry of this.data) {
            assert(Array.isArray(entry.data) && entry.data.length !== 0, "data must be a non-empty array.");
        }
    }

    get() {
        return this.data;
    }

    join() {
        return [].concat.apply([], this.data.map(x => x.data));
    }

    lengths() {
        return this.data.map(x => x.data.length);
    }

    maxLen() {
        return Math.max(...this.data.map(x => x.data.length));
    }

    minLen() {
        return Math.min(...this.data.map(x => x.data.length));
    }

    max() {
        return Math.max(...[].concat.apply([], this.data.map(x => x.data)));
    }

    min() {
        return Math.min(...[].concat.apply([], this.data.map(x => x.data)));
    }

    colourList() {
        return this.data.map(x => x.colour);
    }

    labels() {
        return this.data.map(x => x.label);
    }
}

module.exports = {
    DataManager: DataManager
};