/**
 * Module description: src/core/interpolation.js
 *
 * This module currently holds the mathematical splineCurve() function,
 * used for cubic interpolation.
 *
 * Created on 01/10/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

const { Point } = require("./point");

module.exports = {
    splineCurve: function (prev, current, next, t, graph) {
        //  x0,y0,x1,y1 are the coordinates of the end (knot) pts of this segment
        //  x2,y2 is the next knot -- not connected here but needed to calculate p2
        //  p1 is the control point calculated here, from x1 back toward x0.
        //  p2 is the next control point, calculated here and returned to become the
        //  next segment's p1.
        //  t is the 'tension' which controls how far the control points spread.

        //  Scaling factors: distances from this knot to the previous and following knots.
        let d01 = Math.sqrt((current.data.x - prev.data.x) ** 2 + (current.data.y - prev.data.y) ** 2);
        let d12 = Math.sqrt((next.data.x - current.data.x) ** 2 + (next.data.y - current.data.y) ** 2);

        let fa = t * d01 / (d01 + d12);
        let fb = t - fa;


        return {
            prev: new Point({
                x: current.data.x + fa * (prev.data.x - next.data.x),
                y: current.data.y + fa * (prev.data.y - next.data.y)
            }, graph),

            next: new Point({
                x: current.data.x - fb * (prev.data.x - next.data.x),
                y: current.data.y - fb * (prev.data.y - next.data.y)
            }, graph)
        };
    }
};