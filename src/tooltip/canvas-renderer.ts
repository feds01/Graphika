/**
 * src/tooltip/canvas-renderer.ts
 *
 * Module description:
 *
 * Canvas-based implementation of the tooltip renderer. Draws the tooltip
 * directly on the canvas context.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import BasicGraph from "../basic.graph";
import config from "../config";
import { drawLegendItem } from "../legend/draw-item";
import { TooltipRenderer } from "./types";
import { LineValue, RequiredTooltipOptions, TooltipState } from "./types";

const LEGEND_PADDING = 4;

/**
 * Canvas-based tooltip renderer.
 *
 * Renders the tooltip directly onto the canvas, including:
 * - Vertical tracking line
 * - Indicator dots on each line at the intersection point
 * - Tooltip box with formatted values
 */
export class CanvasTooltipRenderer implements TooltipRenderer {
    constructor(
        private readonly graph: BasicGraph,
        private readonly options: RequiredTooltipOptions,
    ) {}

    /**
     * Render the tooltip with the current state.
     */
    render(state: TooltipState): void {
        if (!state.active) return;

        const { ctx } = this.graph;

        // Save context state
        ctx.save();

        // Draw tracking line
        if (this.options.trackingLine.show) {
            this.#drawTrackingLine(ctx, state.canvasX);
        }

        // Draw indicator dots on lines
        if (this.options.indicators.show) {
            this.#drawIndicators(ctx, state.lineValues);
        }

        // Draw tooltip box
        if (this.options.content.show && state.lineValues.length > 0) {
            this.#drawTooltipBox(ctx, state);
        }

        // Restore context state
        ctx.restore();
    }

    /**
     * Draw the vertical tracking line.
     */
    #drawTrackingLine(ctx: CanvasRenderingContext2D, canvasX: number): void {
        const { lengths } = this.graph;
        const { trackingLine } = this.options;

        ctx.beginPath();
        ctx.strokeStyle = trackingLine.colour;
        ctx.lineWidth = trackingLine.width;
        ctx.setLineDash(trackingLine.style === "dashed" ? [5, 5] : []);

        ctx.moveTo(canvasX, lengths.yBegin);
        ctx.lineTo(canvasX, lengths.yBegin + lengths.yLength);
        ctx.stroke();
        ctx.closePath();

        // Reset line dash
        ctx.setLineDash([]);
    }

    /**
     * Draw indicator dots on each line at the intersection point.
     */
    #drawIndicators(_ctx: CanvasRenderingContext2D, lineValues: LineValue[]): void {
        const { indicators } = this.options;

        for (const lv of lineValues) {
            this.graph.drawer.pointIndicator(lv.canvasX, lv.canvasY, indicators.radius, lv.colour);
        }
    }

    /**
     * Draw a legend-style item (colored box + label).
     */
    #drawLegendItemAt(label: string, colour: string, x: number, y: number): void {
        const labelFontSize = this.graph.options.labelFontSize ?? config.axisLabelFontSize;
        const axisColour = this.graph.options.axisColour ?? config.axisColour;
        const labelFont = this.graph.options.labelFont ?? config.labelFont;

        drawLegendItem(this.graph.ctx, {
            label,
            colour,
            style: "solid",
            x,
            y,
            fontSize: labelFontSize,
            textColour: axisColour,
            font: labelFont,
        });
    }

    /**
     * Draw the tooltip box with values.
     */
    #drawTooltipBox(ctx: CanvasRenderingContext2D, state: TooltipState): void {
        const { content, format } = this.options;
        const { lengths } = this.graph;
        const labelFontSize = this.graph.options.labelFontSize ?? config.axisLabelFontSize;

        // Format the content lines
        const lines: { text: string; colour: string }[] = [];
        for (const lv of state.lineValues) {
            lines.push({
                text: format.yValue(lv.value, lv.label),
                colour: lv.colour,
            });
        }

        // Calculate box dimensions
        const lineHeight = labelFontSize + LEGEND_PADDING * 2;
        const boxInnerPadding = content.padding;

        // Measure max width needed
        this.graph.drawer.toTextMode(labelFontSize, config.axisColour);
        let maxWidth = 0;
        for (const line of lines) {
            // Box width + padding + text width
            const width = labelFontSize + 8 + ctx.measureText(line.text).width;
            maxWidth = Math.max(maxWidth, width);
        }

        const boxWidth = maxWidth + boxInnerPadding * 2;
        const boxHeight = lines.length * lineHeight + boxInnerPadding * 2 - LEGEND_PADDING;

        // Calculate position (prefer right of cursor, but flip if needed)
        const cursorOffset = 12;
        let boxX = state.canvasX + cursorOffset;
        let boxY = state.canvasY - boxHeight / 2;

        // Flip to left if would overflow right edge
        if (boxX + boxWidth > lengths.xEnd) {
            boxX = state.canvasX - boxWidth - cursorOffset;
        }

        // Clamp vertical position to stay within graph
        boxY = Math.max(lengths.yBegin, Math.min(boxY, lengths.yBegin + lengths.yLength - boxHeight));

        // Draw box background with shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = content.backgroundColor;
        this.#roundRect(ctx, boxX, boxY, boxWidth, boxHeight, content.borderRadius);
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw border (adapt to background brightness)
        const borderColor = this.#isDarkBackground(content.backgroundColor)
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(0, 0, 0, 0.1)";
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        this.#roundRect(ctx, boxX, boxY, boxWidth, boxHeight, content.borderRadius);
        ctx.stroke();

        // Draw legend items (same style as LegendManager)
        let y = boxY + boxInnerPadding;
        for (const line of lines) {
            this.#drawLegendItemAt(line.text, line.colour, boxX + boxInnerPadding, y);
            y += lineHeight;
        }
    }

    /**
     * Check if a color string represents a dark background.
     * Simple heuristic based on rgba values.
     */
    #isDarkBackground(color: string): boolean {
        // Parse rgba or rgb colors
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const r = parseInt(match[1], 10);
            const g = parseInt(match[2], 10);
            const b = parseInt(match[3], 10);
            // Calculate relative luminance (simplified)
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance < 0.5;
        }
        // Default to light background if can't parse
        return false;
    }

    /**
     * Draw a rounded rectangle path.
     */
    #roundRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
    ): void {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    /**
     * Clear the tooltip (no-op for canvas renderer as it's cleared on redraw).
     */
    clear(): void {
        // Canvas-based rendering is cleared automatically on redraw
    }

    /**
     * Cleanup resources (no-op for canvas renderer).
     */
    destroy(): void {
        // No cleanup needed for canvas renderer
    }
}
