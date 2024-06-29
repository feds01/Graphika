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

        // 1. calculate the number of tick lengths we are away from the "axis" origin.
        //
        // N.B. We must adjust for the minimum value of the axis, as the axis may not start at 0.
        let relX = Math.abs(data.x);
        if (manager.xAxis.roundedMin > 0) {
            relX -= manager.xAxis.roundedMin;
        }

        const xScalar = relX / manager.xAxis.scaleStep;

        let relY = Math.abs(data.y);

        if (manager.yAxis.roundedMin > 0) {
            relY -= manager.yAxis.roundedMin;
        }

        const yScalar = relY / manager.yAxis.scaleStep;

        // 2. Apply the direction of the x and y axis
        const xDirection = data.x < 0 ? -1 : 1;
        this.x = graph.lengths.xBegin + xDirection * xScalar * graph.gridRectSize.x;

        const yDirection = data.y < 0 ? -1 : 1;
        this.y = manager.xAxis.yStart - yDirection * yScalar * graph.gridRectSize.y;
    }

    /**
     * @since v0.0.1 This function is a simple draw function which will just draw a circle at the calculated x & y
     * points, this saves higher level functions from accessing x, y and drawing circles. */
    draw() {
        this.graph.drawer.circle(this.x, this.y, config.lineWidth + 0.5);
    }
}

export default Point;
