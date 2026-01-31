/**
 * src/tooltip/types.ts
 *
 * Module description:
 *
 * Type definitions for the tooltip feature.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

/** Options for the tracking line that follows the cursor. */
export type TrackingLineOptions = {
    /** Whether to show the vertical tracking line. Defaults to true. */
    show?: boolean;
    /** Color of the tracking line. Defaults to 'rgba(0, 0, 0, 0.5)'. */
    colour?: string;
    /** Line width in pixels. Defaults to 1. */
    width?: number;
    /** Line style: 'solid' or 'dashed'. Defaults to 'solid'. */
    style?: "solid" | "dashed";
};

/** Options for the tooltip content box. */
export type TooltipContentOptions = {
    /** Whether to show the tooltip box with values. Defaults to true. */
    show?: boolean;
    /** Background color of the tooltip box. Defaults to 'rgba(255, 255, 255, 0.95)'. */
    backgroundColor?: string;
    /** Text color. Defaults to '#333'. */
    textColour?: string;
    /** Font size in pixels. Defaults to 12. */
    fontSize?: number;
    /** Padding inside the tooltip box. Defaults to 8. */
    padding?: number;
    /** Border radius of the tooltip box. Defaults to 4. */
    borderRadius?: number;
};

/** Options for value formatting in the tooltip. */
export type TooltipFormatOptions = {
    /** Custom formatter for Y values. Receives value and line label. */
    yValue?: (y: number, label: string) => string;
};

/** Options for indicator dots shown on lines at the cursor position. */
export type TooltipIndicatorOptions = {
    /** Whether to show indicator dots on lines. Defaults to true. */
    show?: boolean;
    /** Radius of indicator dots. Defaults to 4. */
    radius?: number;
};

/** Mode for determining Y values at cursor position. */
export type TooltipMode = "interpolated" | "nearest";

/** Options for the tooltip feature. */
export type TooltipOptions = {
    /** Whether to enable the tooltip feature. Defaults to false. */
    enabled?: boolean;

    /**
     * Mode for determining Y values at cursor position.
     * - 'interpolated': Smoothly interpolate between data points (default)
     * - 'nearest': Snap to the nearest actual data point
     */
    mode?: TooltipMode;

    /** Rendering mode: 'canvas' draws directly to canvas. Defaults to 'canvas'. */
    renderMode?: "canvas";

    /** Tracking line configuration. */
    trackingLine?: TrackingLineOptions;

    /** Tooltip content box configuration. */
    content?: TooltipContentOptions;

    /** Value formatting configuration. */
    format?: TooltipFormatOptions;

    /** Indicator dots configuration. */
    indicators?: TooltipIndicatorOptions;
};

/** Current tooltip state. */
export type TooltipState = {
    /** Whether the cursor is currently within the graph area. */
    active: boolean;
    /** Current cursor position in canvas coordinates. */
    canvasX: number;
    canvasY: number;
    /** Current cursor position in data X coordinate. */
    dataX: number;
    /** Interpolated Y values for each line at the current X position. */
    lineValues: LineValue[];
};

/** Interpolated value for a single line. */
export type LineValue = {
    /** Line label. */
    label: string;
    /** Line colour. */
    colour: string;
    /** Interpolated Y value at current X (in data coordinates). */
    value: number;
    /** Canvas Y coordinate of the interpolated point. */
    canvasY: number;
    /** Canvas X coordinate of the interpolated point. */
    canvasX: number;
};

/** Required tooltip options with all fields populated. */
export type RequiredTooltipOptions = {
    enabled: boolean;
    mode: TooltipMode;
    renderMode: "canvas";
    trackingLine: Required<TrackingLineOptions>;
    content: Required<TooltipContentOptions>;
    format: { yValue: (y: number, label: string) => string };
    indicators: Required<TooltipIndicatorOptions>;
};

/**
 * Interface for tooltip renderers.
 *
 * Implementations of this interface handle the visual rendering of the tooltip,
 * including the tracking line, indicator dots, and tooltip content box.
 */
export interface TooltipRenderer {
    /**
     * Render the tooltip with the current state.
     *
     * @param state - The current tooltip state containing cursor position and line values.
     */
    render(state: TooltipState): void;

    /**
     * Clear/hide the tooltip.
     *
     * Called when the cursor leaves the graph area.
     */
    clear(): void;

    /**
     * Cleanup resources.
     *
     * Called when the tooltip manager is destroyed.
     */
    destroy(): void;
}
