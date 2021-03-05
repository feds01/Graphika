/**
 * Module description:   src/legends/legend.js.js
 *
 * Created on 04/01/2019
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import { assert } from "../utils/assert";

const LegendPosition = {
  LEFT: "left",
  RIGHT: "right",
  TOP: "top",
  BOTTOM: "bottom",
};


const LegendAlignment = {
    START: "start",
    CENTER: "center",
    END: "end"
}

class LegendManager {
  constructor(graph, data, options) {
    assert(data !== null, "Legend data must not be null");

    this.graph = graph;

    /* data is just an array of simple objects containing two fields, a legend label and a colour */
    this.data = data;

    /* Position of the legend container on the graph object */
    this.position = options.position ?? LegendPosition.TOP;

    // check that the position is valid
    if(!Object.values(LegendPosition).includes(this.position)) {
        this.position = LegendPosition.TOP;
    }

    this.alignment = options.alignment ?? LegendAlignment.CENTER;

     // check that the alignment is valid
     if(!Object.values(LegendAlignment).includes(this.alignment)) {
        this.alignment = LegendAlignment.CENTER;
    }
  }

  draw() {
    switch (this.position) {
        case LegendPosition.TOP:
        case LegencPosition.BOTTOM: {
            console.log(this.data, this.alignment);
            break;
        }
        case LegendPosition.LEFT:
        case LegencPosition.RIGHT: {
            break;
        }
        default: {
            // if this happens, then something wrong happened and we should avoid 
            // drawing the axis and just set a warning.
            assert(false, "Invalid legend position");

            return;
        }
    }
  }
}

export default LegendManager;