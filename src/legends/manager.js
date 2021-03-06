/**
 * Module description:   src/legends/legend.js.js
 *
 * Created on 04/01/2019
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import { assert } from "../utils/assert";
import * as arrays from "../utils/arrays";


class LegendManager {
  constructor(graph, data, options) {
    assert(data !== null, "Legend data must not be null");

    this.graph = graph;

    /* data is just an array of simple objects containing two fields, a legend label and a colour */
    this.data = data;

    /* Position of the legend container on the graph object */
    this.position = options.position ?? LegendManager.Pos.TOP;

    // check that the position is valid
    if (!Object.values(LegendManager.Pos).includes(this.position)) {
      this.position = LegendManager.Pos.TOP;
    }

    this.alignment = options.alignment ?? LegendManager.Alignment.CENTER;

    // check that the alignment is valid
    if (!Object.values(LegendManager.Alignment).includes(this.alignment)) {
      this.alignment = LegendManager.Alignment.CENTER;
    }
  }

  static Pos = {
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOM: "bottom",
  };

  static Alignment = {
    START: "start",
    CENTER: "center",
    END: "end",
  };

  getRequiredSpace() {
    // add add 2px padding on top and bottom
    let size = this.graph.fontSize() + 8;

    if (
      this.position == LegendManager.Pos.LEFT ||
      this.position == LegendManager.Pos.RIGHT
    ) {
      const longestItem = arrays.longest(this.data.map((item) => item.label));

      size += this.graph.ctx.measureText(longestItem).width + 8;
    }

    return size;
  }

  draw() {
    switch (this.position) {
      case LegendManager.Pos.TOP:
      case LegendManager.Pos.BOTTOM: {
        break;
      }
      case LegendManager.Pos.LEFT:
      case LegendManager.Pos.RIGHT: {
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
