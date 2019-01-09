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

const config = require( "./config");
const assert = require("./../utils/assert").assert;

const TWO_PI = Math.PI * 2;
const debug_prefix = "[debug/draw] ";

class Drawer {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
    }

    _coordinateSafetyCheck(x, y) {
        assert(x >= 0 && x <= this.canvas.width, "Drawer request failed since x-coordinate is out of bounds");
        assert(y >= 0 && y <= this.canvas.height, "Drawer request failed since y-coordinate is out of bounds");
    }

    circle(x, y, rad) {
        this._coordinateSafetyCheck(x, y);

        if(config.debug_draw) {
            console.log(`${debug_prefix}circle, args->{${x}, ${y}, ${rad}}`);
        }

        // begin new path, draw circle and then close path.
        this.context.beginPath();
        this.context.arc(x, y, rad, 0, TWO_PI);
        this.context.fill();
        this.context.closePath();
    }

    horizontalLine(x, y, len) {
        this._coordinateSafetyCheck(x, y);

        if(config.debug_draw) {
            console.log(`${debug_prefix}horizontalLine, args->{x=${x}, y=${y}, len=${len}}`);
        }

        assert((x + len) >= 0 && (x + len) <= this.canvas.width);

        this.context.beginPath();
        this.context.strokeRect(x, y, len, 1);
        this.context.closePath();
    }

    verticalLine(x, y, len) {
        this._coordinateSafetyCheck(x, y);

        if(config.debug_draw) {
            console.log(`${debug_prefix}verticalLine, args->{x=${x}, y=${y}, len=${len}}`);
        }

        assert((y + len) >= 0 && (y + len) <= this.canvas.width);

        this.context.beginPath();
        this.context.strokeRect(x, y, 1, len);
        this.context.closePath();
    }

    /**
     * This simply switches the canvas context to be text mode ready,
     * set the font size and style, set text alignment to middle, and
     * change stroke colour to the axis' colour.
     *
     * @since v0.0.1 * */
    toTextMode(size, colour) {
        if(config.debug_draw) {
            console.log(`${debug_prefix}toTextMode, args-{${size}, ${colour}`);
        }

        this.context.strokeStyle = colour;
        this.context.textAlign = "center";
        this.context.font = `${size}px "Robot Mono", monospace`;
    }

    text(text, x, y, size, colour){
        this._coordinateSafetyCheck(x, y);

        this.toTextMode(size, colour);
        this.context.fillText(text, x, y);

    }

    get width() { return this.canvas.width; }

    get height() { return this.canvas.height; }
}

module.exports = {
    Drawer: Drawer
};