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

import { assert } from "../utils/assert";
import * as arrays from "../utils/arrays";
import { LegendBoxBorderStyle } from "../legend/manager";

export type DataSource = {
    data: number[] | Float64Array;
    label: string;
    colour: string;
    style: LegendBoxBorderStyle;
    area: {
        fill: boolean;
        opacity: number;
    };
    annotatePoints?: boolean;
    interpolation: "linear" | "cubic";
};

type OptionalDataSource = DataSource & {
    style?: LegendBoxBorderStyle;
};

class DataManager {
    data: DataSource[];

    constructor(public readonly _data: OptionalDataSource[]) {
        this.data = _data.map((item) => ({
            ...item,
            style: item.style ?? "solid",
        }));

        // Assert that each data 'label' is unique
        // TODO: show/display the conflicting labels. Could probably done by using a 'reduce'
        assert(
            arrays.uniqueValues(this.labels()).size === this.labels().length,
            "data must have unique labels for each data set"
        );

        // Ensure that the provided data can be accessed and is not empty data, this is simple sanitization
        for (let entry of this.data) {
            assert(Array.isArray(entry.data) && entry.data.length !== 0, "data must be a non-empty array.");

            // convert the actual entry data into a Float64Array
            entry.data = new Float64Array(entry.data);
        }
    }

    get() {
        return this.data;
    }

    join() {
        // return new Float64Array(this.data.map((x) => [...new Float64Array(x.data.buffer)]).flat());
        return new Float64Array(this.data.map((x) => [...x.data]).flat());
    }

    lengths() {
        return this.data.map((x) => x.data.length);
    }

    maxLen() {
        return Math.max(...this.data.map((x) => x.data.length));
    }

    minLen() {
        return Math.min(...this.data.map((x) => x.data.length));
    }

    /**
     * Generate legend data from the provided line configurations.
     *  */
    generateLegendInfo(): DataSource[] {
        return this.data;
    }

    colourList() {
        return this.data.map((x) => x.colour);
    }

    labels() {
        return this.data.map((x) => x.label);
    }
}

export default DataManager;
