/**
 * Module description:   src/legends/legend.js.js
 *
 * Created on 04/01/2019
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import config from "../config";
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

    const longestItem = arrays.longest(this.data.map((item) => item.label));

    if (
      this.position == LegendManager.Pos.LEFT ||
      this.position == LegendManager.Pos.RIGHT
    ) {
      this.requiredSpace = this.getRequiredSpaceFor(longestItem);
    } else {
      this.requiredSpace = this.graph.fontSize() + LegendManager.PADDING;
    }
  }

  static PADDING = 4;

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

  getRequiredSpaceFor(item) {
    // add add 2px padding on top and bottom
    let size = this.graph.fontSize() + LegendManager.PADDING;

    size += this.graph.ctx.measureText(item).width + LegendManager.PADDING;
    
    return size;
  }

  /**
   * Function to draw a label with a key box denoting one of the graph legends
   * 
   * @param {string} label - The name of the line that represents this legend
   * @param {string} colour - The colour of the key box
   * @param {solid|dashed} style - Border style of the key box
   * @param {number} x - x coordinate of where to draw the label
   * @param {number} y - y coordinate of where to draw the label
   *  */
  drawLegend(label, colour, style, x, y) {

    this.graph.ctx.lineWidth = 2;
    this.graph.ctx.strokeStyle = colour;
    this.graph.ctx.fillStyle = colour;

    // set the line dash
    this.graph.ctx.setLineDash(style === "dashed" ? [4, 4] : []);
    this.graph.ctx.strokeRect(x, y, this.graph.labelFontSize, this.graph.labelFontSize);

    // reduce the alpha to distinct fill between stroke
    this.graph.ctx.globalAlpha = 0.6;

    this.graph.ctx.fillRect(x, y, this.graph.labelFontSize, this.graph.labelFontSize);

    // move by the fontSize + 8 as the padding
    this.graph.drawer.text(label, x + this.graph.labelFontSize + 8, y + this.graph.labelFontSize / 2, this.graph.labelFontSize, config.axisColour, "left");

  }


  draw() {
    let orientation = "",
      xBegin = this.graph.lengths.x_begin,
      yBegin = 0;
    

    switch (this.position) {
      case LegendManager.Pos.TOP:
        orientation = "horizontal";

        break;
      case LegendManager.Pos.BOTTOM: {
        orientation = "horizontal";
        yBegin = this.graph.canvas.height - this.requiredSpace;

        break;
      }
      case LegendManager.Pos.LEFT:
        orientation = "vertical";

        xBegin = LegendManager.PADDING;
        yBegin = this.graph.lengths.y_begin;

        break;
      case LegendManager.Pos.RIGHT: {
        orientation = "vertical";
        // xBegin = this.graph.canvas.width - this.requiredSpace;
        xBegin = this.graph.lengths.x_end + LegendManager.PADDING * 2;
        yBegin = this.graph.lengths.y_begin;

        break;
      }
      default: {
        // if this happens, then something wrong happened and we should avoid
        // drawing the axis and just set a warning.
        assert(false, "Invalid legend position");

        return;
      }
    }

    // adjust begin values in correspondence to alignment
    if (orientation == "horizontal") {
      // TODO: handle alignment settings

    } else {
      // TODO: handle alignment settings
    }

    // draw legend for each provided line from the basics
    for (let idx = 0; idx < this.data.length; idx++) {
      const item = this.data[idx];

      this.drawLegend(item.label, item.colour, item.style, xBegin, yBegin);

      const newOffset = this.getRequiredSpaceFor(item.label);

      // compute new offsets
      if (orientation == "horizontal") {
        xBegin += this.getRequiredSpaceFor(item.label) + LegendManager.PADDING * 2;
  
      } else {
        // we have to use vertical spacing rather than horizontal spacing.
        yBegin += this.graph.fontSize() + LegendManager.PADDING * 2;
      }

    }
  }
}

export default LegendManager;
