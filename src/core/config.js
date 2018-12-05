/**
 * Module description: src/core/config.js
 *
 * This module holds the default configuration values and parameters for
 * graph objects.
 *
 * Created on 01/10/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

module.exports = {
    /* this value is the default line width size for a linear graph.
     * It may change depending on if there are more data points than
     * the default value of ticks on the x-axis. */
    lineWidth: 3,

    /* this is the maximum amount of ticks which are available on the x-axis */
    xTicks: 20,

    /* this is the maximum amount of ticks which are available on the y-axis */
    yTicks: 10,

    /* This value is used to determine the curvature of cubic interpolation, higher
     * values result in more curved connections and lower values are closer to linear
     * interpolation
     * */
    tension: 0.5,

    /* Default value for the axis colour */
    axis_colour: 'rgb(94,94,94)'


};