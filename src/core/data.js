/**
 * Module description: src/core/data.js
 *
 * This module holds the utility and CRUD methods for a graph
 * data object. Sorting data, joining and getting basic statistical
 * analysis on the data.
 *
 * Created on 01/10/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */


class Data {
    constructor(data) {
        this.data = data;

        // Ensure that the provided data can be accessed and is not empty data, this
        // is simple sanitization
        for(let entry of this.data) {
            if (!Array.isArray(entry.data) || entry.data.length === 0) {
                throw Error("Graph.js (graph) data must be a non-empty array");
            }
        }
    }

    get() {
        return this.data;
    }

    join() {
        return [].concat.apply([], this.data.map(x => x.data))
    }

    lengths() {
        return this.data.map(x => x.data.length);
    };

    maxLen() {
        return Math.max(...this.data.map(x => x.data.length));
    };

    minLen() {
        return Math.min(...this.data.map(x => x.data.length));
    };

    max() {
        return Math.max(...[].concat.apply([], this.data.map(x => x.data)));
    };

    min() {
        return Math.min(...[].concat.apply([], this.data.map(x => x.data)));
    };

    colourList() {
        return this.data.map(x => x.colour);
    };

    toPos() {
        for (let entry = 0; entry < this.data.length; entry++) {
            this.data[entry].pos_data = [];

            for (let idx = 0; idx < this.data[entry].data.length; idx++) {
                this.data[entry].pos_data.push({
                    x: idx,
                    y: this.data[entry].data[idx]
                });
            }
        }
    };
}

module.exports = {
    Data: Data
};