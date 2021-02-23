/**
 * Module description: src/core/axis.js
 *
 * This module holds the general object for a graph/chart axis scale.
 * It determine if the axis should be negative, and also includes methods
 * to draw the scale, provided the graph object.
 *
 * Created on 29/06/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import Scale from "./scale";
import config from "./config";
import * as utils from "../general";
import * as arrays from "../utils/arrays";
import { assert } from "./../utils/assert";
import conversions from "../utils/conversions";

const defaultOptions = {
  minTicks: 10,
  maxTicks: 20,
  drawNotches: true,
  drawNumbers: true,
  startAtZero: true,
};

export const AxisType = {
  X_AXIS: "x-axis",
  Y_AXIS: "y-axis",
};

class Axis {
  constructor(manager, type, options) {
    this.manager = manager;
    this.data = this.manager.data;
    this.graph = this.manager.graph;
    this.options = options;
    this.type = type;

    // This is the variable which holds the tick step of the axis.
    this.scaleStep = 0;

    // we have negative values in the data set and therefore will require two
    // different scales
    this.positveScale = null;
    this.negativeScale = null;

    // fill in missing option values with default values
    for (let option of Object.keys(defaultOptions)) {
      if (this.options[option] === undefined) {
        this.options[option] = defaultOptions[option];
      }
    }

    // Ensure that minTicks & maxTicks don't overflow and aren't negative, otherwise they would cause a
    // DivisionByZero or Infinity issues
    assert(
      this.options.maxTicks > 0 && this.options.minTicks > 0,
      "Max/Min ticks cannot be 0 or negative"
    );

    this._computeAxisScale();
    this.generateScaleNumbers();
  }

  /**
   * @since v0.0.1 Takes in input as the lengths object from a graph object.
   * */
  determineAxisPosition() {
    // Y & X positions which represent the start of the drawing line
    // @Cleanup: this must be determined here because the graph 'lengths' haven't been
    // calculated yet.
    this.yStart = this.graph.padding.top + this.graph.yLength;

    // position the x-axis then in the center of the y-axis, calculate this offset by indexing
    // where the zero '0' value in the scale label array (reversed), and multiplying this by the
    // amount of squares there are between the zero and the last axis value. We need to reverse
    // the labels because the Axis position is calculated from the top of the graph, where as
    // the numbers are drawn from the bottom of the graph.

    // TODO: maybe just change the calculation to compute the position of the x-axis from the
    //      bottom of the graph.
    if (this.type === AxisType.X_AXIS && this.manager.negativeScale) {
      let zeroIndex = this.manager.scaleNumbers.y.reverse().indexOf("0");

      // The zero index must not be '-1' or in other words, not found.
      assert(
        zeroIndex !== -1,
        `couldn't find the '0' scale position in Axis{${this.type}}`
      );

      this.yStart =
        this.graph.lengths.y_begin + this.graph.gridRectSize.y * zeroIndex;
    }
  }

  _computeAxisScale() {
    if (this.type === AxisType.X_AXIS) {
      // TODO: at runtime we should be able to eat away some ticks that aren't utilised
      this.options.maxTicks = Math.min(
        this.graph.dataManager.maxLen(),
        config.xTicks
      );

      this.positveScale = new Scale({
        min: 0,
        max: this.graph.dataManager.maxLen() - 1,
        tickCount: this.options.maxTicks,
      });

      this.scaleStep = this.positveScale.getScaleStep();
    } else if (this.type === AxisType.Y_AXIS) {
      let positiveValues = arrays.positiveAndZeroValues(this.data);

      if (this.manager.negativeScale) {
        let negativeDataSet = arrays
          .negativeValues(this.data)
          .map((x) => Math.abs(x));
        // divide the max ticks by two since negative and positive are sharing the scale.
        this.negativeScale = new Scale({
          min: 0,
          max: arrays.getMax(negativeDataSet),
          tickCount: this.options.maxTicks / 2,
          isNegativeScale: true,
        });
      }

      this.positveScale = new Scale({
        ...arrays.getMinMax(positiveValues),
        tickCount: this.manager.negativeScale
          ? this.options.maxTicks / 2
          : this.options.maxTicks,
      });

      /*
            // Get the largest tick step of the two and set the other scale tick step to the same one. This is
            // because the tick steps must be consistent for both negative and positive scales. Synchronise the
            // tickSteps basically.
            */
      if (this.manager.negativeScale) {
        this.scaleStep = Math.max(
          this.positveScale.getScaleStep(),
          this.negativeScale.getScaleStep()
        );

        this.positveScale.setTickStep(this.scaleStep);
        this.negativeScale.setTickStep(this.scaleStep);
        this.start = 0;
      } else {
        this.scaleStep = this.positveScale.getScaleStep();
        this.start = this.positveScale.roundedMinimum;
      }
    } else {
      throw Error(`Graphika: Unrecognised Axis type '${this.type}'`);
    }
  }

  generateScaleNumbers() {
    this.scaleLabels = [];

    if (this.type === AxisType.X_AXIS) {
      this.scaleLabels = arrays
        .fillRange(this.options.maxTicks)
        .map((x) => (this.positveScale.scaleStep * x).toString());
    } else {
      if (this.manager.negativeScale) {
        this.scaleLabels = this.negativeScale.getScaleLabels(true, true);

        // check if 0 & -0 exist, if so remove the negative 0
        if (
          this.scaleLabels[this.scaleLabels.length - 1] === "0" &&
          this.positveScale.getScaleLabels().includes("0")
        ) {
          this.scaleLabels.pop();
        }

        this.scaleLabels = [
          ...this.scaleLabels,
          ...this.positveScale.getScaleLabels(),
        ];
      } else {
        this.scaleLabels = this.positveScale.getScaleLabels();
      }
    }
  }

  // @Cleanup: There must be some cleaner way to get this value, maybe using
  // AxisManager store this value.
  get yStartingPosition() {
    return this.yStart;
  }

  draw() {
    // determine the positions of the x-axis
    this.determineAxisPosition();
    let offset = this.manager.sharedAxisZero ? 1 : 0;

    // get the context ready to draw
    this.graph.ctx.lineWidth = config.gridLineWidth;
    this.graph.ctx.strokeStyle = utils.rgba(this.options.axisColour, 60);

    // Apply numerical conversion magic.
    // TODO: add configuration for exactly which axis' should use these conversions.
    let scaleNumericsToDraw = this.scaleLabels;

    if (this.graph.scaleOptions.shorthandNumerics) {
      scaleNumericsToDraw = scaleNumericsToDraw.map((numeric) => {
        // TODO: unhandled case where we have a float that is larger than log(n) > 1
        if (Number.isInteger(parseFloat(numeric))) {
          return conversions.convertFromNumerical(numeric);
        } else {
          return numeric;
        }
      });
    }

    // Y-Axis Drawing !
    if (this.type === AxisType.Y_AXIS) {
      this.graph.drawer.verticalLine(
        this.graph.lengths.x_begin,
        this.graph.lengths.y_begin,
        this.graph.yLength + 9
      );
      this.graph.ctx.textBaseline = "middle";

      for (let number of scaleNumericsToDraw) {
        if (!(this.manager.sharedAxisZero && number.toString() === "0")) {
          let y_offset = offset * this.graph.gridRectSize.y;
          let scale_offset = Math.ceil(
            this.graph.ctx.measureText(number).width / 1.5
          );

          this.graph.drawer.text(
            number,
            this.graph.lengths.x_begin - 9 - scale_offset,
            this.graph.padding.top + this.graph.yLength - y_offset,
            config.scaleLabelFontSize,
            this.options.axisColour
          );
          offset++;
        }
      }
    } else {
      this.graph.drawer.horizontalLine(
        this.graph.lengths.x_begin,
        this.yStart,
        this.graph.xLength
      );

      // We also need to draw a horizontal line at the bottom of the graph
      // if it includes a negative quadrant. We can check this by accessing the
      // manager.negativeScale constant, if so draw the horizontal line at the
      // bottom of the graph.
      if (this.manager.negativeScale && !this.graph.gridOptions.gridded) {
        this.graph.drawer.horizontalLine(
          this.graph.lengths.x_begin,
          this.graph.yLength + this.graph.padding.top,
          this.graph.xLength
        );
      }

      for (let number of scaleNumericsToDraw) {
        // if sharedAxisZero isn't enabled and the number isn't zero, draw the number label
        if (!(this.manager.sharedAxisZero && number.toString() === "0")) {
          let x_offset = offset * this.graph.gridRectSize.x;
          let scale_offset = this.graph.padding.top + this.graph.fontSize();

          this.graph.drawer.text(
            number,
            this.graph.lengths.x_begin + x_offset,
            this.graph.yLength + 9 + scale_offset,
            config.scaleLabelFontSize,
            this.options.axisColour
          );
          offset++;
        }
      }
    }
  }
}


export default Axis;
