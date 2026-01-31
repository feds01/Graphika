/**
 * src/legend/draw-item.ts
 *
 * Module description:
 *
 * Shared utility for drawing legend-style items (colored box + label).
 * Used by both LegendManager and tooltip renderers.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import { BorderStyle } from "../core/drawing";

export type LegendItemOptions = {
    /** The text label to display. */
    label: string;
    /** The colour for the legend box. */
    colour: string;
    /** Border style: 'solid' or 'dashed'. */
    style: BorderStyle;
    /** X coordinate for the legend box. */
    x: number;
    /** Y coordinate for the legend box. */
    y: number;
    /** Font size for the label (also determines box size). */
    fontSize: number;
    /** Colour for the label text. */
    textColour: string;
    /** Font family for the label text. */
    font: string;
};

/**
 * Draw a legend-style item (colored box + label) on the canvas.
 *
 * @param ctx - The canvas rendering context.
 * @param options - Configuration for the legend item.
 */
export function drawLegendItem(ctx: CanvasRenderingContext2D, options: LegendItemOptions): void {
    const { label, colour, style, x, y, fontSize, textColour, font } = options;

    // Setup colour and style
    ctx.lineWidth = 1;
    ctx.strokeStyle = colour;
    ctx.fillStyle = colour;

    // Set the line dash
    ctx.setLineDash(style === "dashed" ? [4, 4] : []);
    ctx.strokeRect(x, y, fontSize, fontSize);

    // Reduce the alpha to distinct fill between stroke
    ctx.globalAlpha = 0.6;
    ctx.fillRect(x, y, fontSize, fontSize);
    ctx.globalAlpha = 1.0;

    // Draw label text (offset by fontSize + 8 as padding)
    ctx.fillStyle = textColour;
    ctx.strokeStyle = textColour;
    ctx.textAlign = "left";
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillText(label, x + fontSize + 8, y + fontSize / 2);
}
