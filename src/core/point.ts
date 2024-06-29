/**
 * src/core/point.ts
 *
 * Module description:
 *
 * This module contains a simple constructor for a point, which can be assigned with
 * x, y and value. The purpose of the constructor is to also provide 'real' x and y
 * values with the 'virtual' ones. This is because the HTML canvas coordinate system
 * has an inverted y-coordinate system, like this:
 *
 *  * - - - - - - - - - - - -> x+
 *  |
 *  |
 *  |   * (x1, y1)
 *  |               * (x2, y2)
 *  |
 *  |   * (x3, y3)
 *  |                   * (x4, y4)
 *  |
 *  |
 *  y+
 *
 *  Therefore, performing any kind of calculations like interpolation does not make
 *  any sense and must converted into a 'real' coordinate. For example, if (x1, y1)
 *  was (1, 20) and the y limit was a 100, then the 'real' coordinates would be
 *  (1, 80). Therefore, once a point object is instantiated, the 'real' coordinate will
 *  also be given as a property of the object.
 *
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import BasicGraph from "../basic.graph";
import config from "./../config";
import { assert } from "./../utils/assert";

class Point {
    /**
     * @since v0.0.1 This is the 'real' x-coordinate of the point.
     */
    x: number;

    /**
     * @since v0.0.1 This is the 'real' y-coordinate of the point.
     */
    y: number;

    constructor(
        public readonly data: { x: number; y: number },
        private readonly graph: BasicGraph
    ) {
        const manager = graph.axisManager;

        assert(this.graph !== undefined, "Point class must be provided with the relevant graph.");

        // calculate actual graphical coordinates
        const yScalar = Math.abs(data.y) / manager.yAxis.scaleStep;
        const xScalar = data.x / manager.xAxis.scaleStep;

        /*
        // Work out fraction between the data 'x' and the longest data length. Then multiply it by the available
        // graph canvas length to get a 'ratio' of the length and then add the 'x_begin' value to counter for the
        // axis offset.
        */
        this.x = graph.lengths.x_begin + xScalar * graph.gridRectSize.x;

        /*
        // Get the ratio of the actual 'y' data value, divide it by the Y-Axis tick step and multiply it by the
        // Y square size. Negate the worked out value from the graph 'yStartingPosition' because the yStartingPosition
        // is not always at the 'y' beelining of the graph, this is due to the graph possibly containing negative
        // numbers, and therefore the graph must adjust the position of the Y-Axis.
        */
        const direction = data.y < 0 ? -1 : 1;
        this.y = manager.xAxis.yStart - direction * yScalar * graph.gridRectSize.y;
    }

    /**
     * @since v0.0.1 This function is a simple draw function which will just draw a circle at the calculated x & y
     * points, this saves higher level functions from accessing x, y and drawing circles. */
    draw() {
        this.graph.drawer.circle(this.x, this.y, config.lineWidth + 0.5);
    }
}

export default Point;
