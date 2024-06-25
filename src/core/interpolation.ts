/**
 * src/core/interpolation.ts
 *
 * Module description:
 *
 * This module currently holds the mathematical splineCurve() function,
 * used for cubic interpolation.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import Point from "./point";
import { clamp } from "./../utils/number";
import BasicGraph from "../basic.graph";

export type ControlPoint = {
    prev: Point;
    next: Point;
};

/**
 *
 * x0,y0,x1,y1 are the coordinates of the end (knot) pts of this segment
 * x2,y2 is the next knot -- not connected here but needed to calculate p2
 * p1 is the control point calculated here, from x1 back toward x0.
 * p2 is the next control point, calculated here and returned to become the
 * next segment's p1.
 *
 * @param {Point} prev - the previous point
 * @param {Point} current - the current point
 * @param {Point} next  - the next point
 * @param {Number} t - tension coefficient
 * @param {Object} graph - graph object
 */

export function splineCurve(prev: Point, current: Point, next: Point, t: number, graph: BasicGraph): ControlPoint {
    //  Scaling factors: distances from this knot to the previous and following knots.
    const d01 = Math.sqrt((current.data.x - prev.data.x) ** 2 + (current.data.y - prev.data.y) ** 2);
    const d12 = Math.sqrt((next.data.x - current.data.x) ** 2 + (next.data.y - current.data.y) ** 2);

    const fa = (t * d01) / (d01 + d12);
    const fb = t - fa;

    // clamp ys so interpolation doesn't go out of bounds
    const yMin = graph.axisManager.yAxis.min;
    const yMax = graph.axisManager.yAxis.max;

    const y1 = clamp(current.data.y + fa * (prev.data.y - next.data.y), yMin, yMax);
    const y2 = clamp(current.data.y - fb * (prev.data.y - next.data.y), yMin, yMax);

    return {
        prev: new Point(
            {
                x: current.data.x + fa * (prev.data.x - next.data.x),
                y: y1,
            },
            graph
        ),

        next: new Point(
            {
                x: current.data.x - fb * (prev.data.x - next.data.x),
                y: y2,
            },
            graph
        ),
    };
}
