/**
 * @since v0.0.1
 * @module core/interpolation
 * @author Alexander. E. Fedotov <alexander.fedotov.uk@gmail.com>
 *
 * @description This module contains the libraries' interpolation of data sets
 * methods, The 'linear' interpolation method is not included here since it is the
 * default method to joining data points on the graph, however, this module currently
 * implements a cubic spline interpolation method.
 * */

module.exports = {
    splineCurve: function (previous, current, next, tension) {
        let dist01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
        let dist12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));

        let s01 = dist01 / (dist01 + dist12);
        let s12 = dist12 / (dist01 + dist12);

        s01 = isNaN(s01) ? 0 : s01;
        s12 = isNaN(s12) ? 0 : s12;

        // scaling factor for triangle Ta
        let fa = tension * s01;
        let fb = tension * s12;

        return {
            previous: {
                x: current.x - fa * (next.x - previous.x),
                y: current.y - fa * (next.y - previous.y)
            },

            next: {
                x: current.x + fb * (next.x - previous.x),
                y: current.y + fb * (next.y - previous.y)
            }
        }
    }
};