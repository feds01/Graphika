/**
 * src/legends/legend.ts
 *
 * Module description:
 *
 * This module is responsible for drawing the legend on the graph. The legend is a
 * component that is used to describe the data that is being displayed on the graph.
 *
 * Find documentation and examples in the `docs/api/legend-options.md`
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import config from "../config";
import * as arrays from "../utils/arrays";
import colours from "../utils/colours";
import BasicGraph from "../basic.graph";
import { DataSource } from "../core/data-manager";

export type LegendOptions = {
    draw?: boolean;
    position?: LegendPosition;
    alignment?: LegendAlignment;
};

export type LegendAlignment = "start" | "center" | "end";
export type LegendPosition = "left" | "right" | "top" | "bottom";
export type LegendBoxBorderStyle = "solid" | "dashed";

class LegendManager {
    private static PADDING = 4;

    /**
     *  @since v0.0.1 The position of where the legend box is drawn on the graph.
     */
    public position: LegendPosition;

    /**
     * @since v0.0.1 The alignment of the legend box on the graph.
     */
    public alignment: LegendAlignment;

    /**
     * @since v0.0.1 The required space for the legend box to be drawn.
     */
    public requiredSpace: number;

    private readonly boxSize: number;

    /**
     * Constructor for a legend manager object. This object is responsible for drawing the legend
     * on the graph.
     *
     * @param graph - The graph object that the legend is drawn on
     * @param data - The data sources that the legend is drawn for
     */
    public constructor(
        private readonly graph: BasicGraph,
        private readonly data: DataSource[],
    ) {
        this.position = this.graph.options.legend?.position ?? "top";
        this.alignment = this.graph.options.legend?.alignment ?? "center";

        // the actual legend box size
        const labelFontSize = this.graph.options.labelFontSize ?? config.axisLabelFontSize;
        this.boxSize = labelFontSize + 4; // 2px padding each side

        switch (this.position) {
            // @@Todo: if the `title` position changes here, we may or may not need to
            // account for the `base` padding, since it means that the drawn legend
            // item is between the title and the graph area.
            case "top":
                this.requiredSpace = this.boxSize;
                break;
            case "bottom":
                // We need to account for the offset of the `base` padding that is
                // applied to the graph.
                this.requiredSpace = this.boxSize + this.graph.padding.base;
                break;
            case "left":
            case "right": {
                // determine the relevant size that the padding needs to increase by based on the position
                // of the legend. If the orientation of the legend is vertical, only the 'max width' matters,
                // and if the orientation is horizontal, only the height of the legend matters.
                const longestItem = arrays.longest(this.data.map((item) => item.label));
                this.requiredSpace = this.getRequiredSpaceFor(longestItem);
                break;
            }
        }
    }

    getRequiredSpaceFor(item: string): number {
        // add add 2px padding on top and bottom
        let size = this.graph.fontSize() + LegendManager.PADDING;

        size += this.graph.ctx.measureText(item).width + LegendManager.PADDING;

        return size;
    }

    /**
     * Function to draw a label with a key box denoting one of the graph legends
     *
     * @param {string} label - The name of the line that represents this legend
     * @param {string} colour - The colour of the key box
     * @param {solid|dashed} style - Border style of the key box
     * @param {number} x - x coordinate of where to draw the label
     * @param {number} y - y coordinate of where to draw the label
     *  */
    drawLegend(label: string, colour: string, style: LegendBoxBorderStyle, x: number, y: number) {
        const labelFontSize = this.graph.options.labelFontSize ?? config.axisLabelFontSize;
        const { ctx, drawer } = this.graph;

        // Setup colour and style
        ctx.lineWidth = 1;
        ctx.strokeStyle = colour;
        ctx.fillStyle = colour;

        // set the line dash
        ctx.setLineDash(style === "dashed" ? [4, 4] : []);
        ctx.strokeRect(x, y, labelFontSize, labelFontSize);

        // reduce the alpha to distinct fill between stroke
        ctx.globalAlpha = 0.6;
        ctx.fillRect(x, y, labelFontSize, labelFontSize);

        // move by the fontSize + 8 as the padding
        drawer.text(label, x + labelFontSize + 8, y + labelFontSize / 2, labelFontSize, config.axisColour, "left");
    }

    /**
     * Function that draws this component.
     */
    draw() {
        let { orientation, xBegin, yBegin } = (() => {
            switch (this.position) {
                case "top": {
                    let yBegin = this.graph.padding.base;

                    const isTopTitle = this.graph.options.title?.draw && this.graph.options.title.position === "top";
                    if (isTopTitle) {
                        yBegin += (this.graph.options.title?.fontSize ?? 24) + this.graph.padding.textPadding;
                    }

                    return {
                        orientation: "horizontal" as const,
                        xBegin: this.graph.lengths.xBegin,
                        yBegin,
                    };
                }
                case "bottom": {
                    return {
                        orientation: "horizontal" as const,
                        // offset the requiredSpace by textPadding so we avoid not having any padding
                        // between the legend and the x-axis label.
                        yBegin: this.graph.canvas.height - this.requiredSpace + this.graph.padding.textPadding,
                        xBegin: this.graph.lengths.xBegin,
                    };
                }
                case "left":
                    return {
                        orientation: "vertical" as const,
                        xBegin: LegendManager.PADDING,
                        yBegin: this.graph.lengths.yBegin,
                    };
                case "right": {
                    return {
                        orientation: "vertical" as const,
                        xBegin: this.graph.lengths.xEnd + LegendManager.PADDING * 2,
                        yBegin: this.graph.lengths.yBegin,
                    };
                }
            }
        })();

        // pre-compute all the required space per legend
        const requiredSpaces = this.data.map((item, index) => {
            const initial = LegendManager.PADDING * 2;

            if (orientation === "horizontal") {
                // add padding between each item if it's not the end item
                const additional = index !== this.data.length - 1 ? initial * 2 : 0;
                return initial + this.getRequiredSpaceFor(item.label) + additional;
            } else {
                // add padding between each item if it's not the end item
                const additional = index !== this.data.length - 1 ? initial : initial / 2;
                return additional + this.boxSize;
            }
        });

        // adjust begin values in correspondence to alignment
        if (orientation === "horizontal") {
            switch (this.alignment) {
                case "start":
                    break; // we don't need to do anything here since we assume that it is the initial condition
                case "center": {
                    const offset = arrays.sum(requiredSpaces.slice(0, Math.round(requiredSpaces.length / 2)));

                    // we add one padding unit to account for the space between each legend
                    xBegin = this.graph.lengths.xCenter - offset + LegendManager.PADDING;
                    break;
                }
                case "end": {
                    const offset = arrays.sum(requiredSpaces);
                    xBegin = this.graph.lengths.xEnd - offset;
                    break;
                }
            }
        } else {
            switch (this.alignment) {
                case "start":
                    break; // we don't need to do anything here since we assume that it is the initial condition
                case "center": {
                    const offset = arrays.sum(requiredSpaces) / 2;
                    yBegin = this.graph.lengths.yCenter - offset;
                    break;
                }
                case "end": {
                    const offset = arrays.sum(requiredSpaces);
                    yBegin = this.graph.lengths.yBegin + this.graph.lengths.yLength - offset;
                    break;
                }
            }
        }

        // if we need to draw debug boundary, then do so
        if (this.graph.options.debug) {
            const lineWidth = this.graph.ctx.lineWidth;
            const strokeStyle = this.graph.ctx.strokeStyle;

            this.graph.ctx.lineWidth = 2;
            this.graph.ctx.strokeStyle = colours.PURPLE;

            const xLength =
                orientation === "horizontal" ? arrays.sum(requiredSpaces) : this.requiredSpace - LegendManager.PADDING;
            const yLength =
                orientation === "vertical" ? arrays.sum(requiredSpaces) : this.requiredSpace - LegendManager.PADDING;

            this.graph.ctx.strokeRect(xBegin, yBegin, xLength, yLength);

            // reset stroke width and stroke colour
            this.graph.ctx.lineWidth = lineWidth;
            this.graph.ctx.strokeStyle = strokeStyle;
        }

        // draw legend for each provided line from the basics
        for (let idx = 0; idx < this.data.length; idx++) {
            const item = this.data[idx];

            this.drawLegend(item.label, item.colour, item.style ?? "solid", xBegin, yBegin);

            // compute new offsets
            if (orientation === "horizontal") {
                xBegin += requiredSpaces[idx];
            } else {
                // we have to use vertical spacing rather than horizontal spacing.
                yBegin += requiredSpaces[idx];
            }
        }
    }
}

export default LegendManager;
