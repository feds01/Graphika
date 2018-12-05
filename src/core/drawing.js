/**
 * Module description: src/core/drawing.js
 *
 * This module holds utility functions to draw various shapes and basic
 * structures. In the future, this will become the API to draw items, rather than
 * directly calling the <canvas> context.
 *
 * Created on 01/10/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

const TWO_PI = Math.PI * 2;

module.exports = {
    circle: function(ctx, x, y, rad) {
        // begin new path, draw circle and then close path.
        ctx.beginPath();

        ctx.arc(x, y, rad, 0, TWO_PI);
        ctx.fill();

        ctx.closePath()

    },

    horizontalLine: function (ctx, x, y, len) {
        ctx.beginPath();
        ctx.strokeRect(x, y, len, 1);
        ctx.closePath();
    },

    verticalLine: function (ctx, x, y, len) {
        ctx.beginPath();
        ctx.strokeRect(x, y, 1, len);
        ctx.closePath();
    },

    /**
     * This simply switches the canvas context to be text mode ready,
     * set the font size and style, set text alignment to middle, and
     * change stroke colour to the axis' colour.
     *
     * @since v0.0.1 * */
    toTextMode: function (ctx, size, colour) {
        ctx.strokeStyle = colour;
        ctx.textAlign = 'center';
        ctx.font = `${size}px "Robot Mono", monospace`;
    }
};