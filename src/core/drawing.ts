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

import { assert } from "./../utils/assert";

const TWO_PI = Math.PI * 2;

type DrawerOptions = {
    labelFont: string;
};

type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";

/**
 * Utility class for drawing items on the canvas.
 */
class Drawer {
    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly context: CanvasRenderingContext2D,
        private readonly options: DrawerOptions
    ) {}

    _coordinateSafetyCheck(x: number, y: number) {
        assert(x >= 0 && x <= this.canvas.clientWidth, "Drawer request failed since x-coordinate is out of bounds");
        assert(y >= 0 && y <= this.canvas.clientHeight, "Drawer request failed since y-coordinate is out of bounds");
    }

    circle(x: number, y: number, rad: number) {
        this._coordinateSafetyCheck(x, y);

        // begin new path, draw circle and then close path.
        this.context.beginPath();
        this.context.arc(x, y, rad, 0, TWO_PI);
        this.context.fill();
        this.context.closePath();
    }

    horizontalLine(x: number, y: number, len: number) {
        this._coordinateSafetyCheck(x, y); // @Speed: remove this from production?
        assert(x + len >= 0 && x + len <= this.canvas.width, "Line length is out of bounds.");

        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x + len, y);
        this.context.stroke();
        this.context.closePath();
    }

    verticalLine(x: number, y: number, len: number) {
        this._coordinateSafetyCheck(x, y); // @Speed: remove this from production?
        assert(y + len >= 0 && y + len <= this.canvas.width, "Line length is out of bounds.");

        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x, y + len);
        this.context.stroke();
        this.context.closePath();
    }

    /**
     * @since v0.0.1
     * This simply switches the canvas context to be text mode ready,
     * set the font size and style, set text alignment to middle, and
     * change stroke colour to the axis' colour.
     *
     * @param {Number} size The font size of the text
     * @param {String} colour RGBA style colour string
     * @param {String} alignment One of the specified alignments for text
     *
     * @returns nothing, just changes the drawing context
     * */
    toTextMode(size: number, colour: string, alignment: CanvasTextAlign = "center") {
        this.context.strokeStyle = colour;
        this.context.fillStyle = colour;

        // reset global alpha
        this.context.globalAlpha = 1.0;

        this.context.textAlign = alignment;
        this.context.font = `${size}px ` + this.options.labelFont;
    }

    /**
     * @since v0.0.1
     * Function to draw text on the canvas at a given location with a particular
     * colour and alignment.
     *
     * @param {string} text the actual label
     * @param {number} x x-coordinate of where to draw the string
     * @param {number} y x-coordinate of where to draw the string
     * @param {Number} size The font size of the text
     * @param {String} colour RGBA style colour string
     * @param {String} alignment One of the specified alignments for text
     *
     * @returns nothing, just changes the drawing context
     * */
    text(text: string, x: number, y: number, size: number, colour: string, alignment: CanvasTextAlign = "center") {
        this._coordinateSafetyCheck(x, y);

        const oldColour = this.context.strokeStyle;

        this.toTextMode(size, colour, alignment);
        this.context.fillText(text, x, y);

        // restore old colour
        this.context.strokeStyle = oldColour;
    }

    get width() {
        return this.canvas.clientWidth;
    }

    get height() {
        return this.canvas.clientHeight;
    }

    get ctx() {
        return this.context;
    }
}

export default Drawer;
