/**
 * Module description: src/core/point.js
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
 * Created on 01/10/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

class Point {
    constructor(data, graph) {
        this.data = data;
        this.graph = graph;
        this.manager = graph.axisManager;

        if(this.graph === undefined) {
            throw "Point class must be provided with the relevant graph."
        }

        // calculate actual graphical coordinates
        let actual_ySize = data.y / this.manager.telemetry.yAxis.tickStep;

        this.x = graph.lengths.x_begin + (data.x * graph.squareSize.x);
        this.y = this.manager.telemetry.xAxis.yStart - (actual_ySize * graph.squareSize.y);
    }
}

module.exports = {
    Point: Point
};