/**
 * src/tooltip/manager.ts
 *
 * Module description:
 *
 * TooltipManager orchestrates the tooltip feature, handling mouse events,
 * computing tooltip state, and delegating rendering to the appropriate renderer.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import BasicGraph from "../basic.graph";
import config from "../config";
import { CanvasTooltipRenderer } from "./canvas-renderer";
import { LineValue, RequiredTooltipOptions, TooltipOptions, TooltipState, TooltipRenderer } from "./types";
import {
    canvasXToDataX,
    createCoordinateContext,
    dataXToCanvasX,
    dataYToCanvasY,
    isWithinGraphArea,
} from "../utils/coordinates";
import { lerp } from "../utils/number";

/** Default tooltip options. */
const defaultTooltipOptions: RequiredTooltipOptions = {
    enabled: true,
    mode: "nearest",
    renderMode: "canvas",
    trackingLine: {
        show: true,
        colour: "rgba(0, 0, 0, 0.5)",
        width: 1,
        style: "solid",
    },
    content: {
        show: true,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        textColour: "#333",
        fontSize: 12,
        padding: 8,
        borderRadius: 4,
    },
    format: {
        yValue: (y: number, label: string) => `${label}: ${y.toFixed(2)}`,
    },
    indicators: {
        show: true,
        radius: config.pointIndicatorRadius,
    },
};

/**
 * Merge user options with defaults to create a complete options object.
 */
function mergeOptions(options: TooltipOptions): RequiredTooltipOptions {
    return {
        enabled: options.enabled ?? defaultTooltipOptions.enabled,
        mode: options.mode ?? defaultTooltipOptions.mode,
        renderMode: options.renderMode ?? defaultTooltipOptions.renderMode,
        trackingLine: {
            ...defaultTooltipOptions.trackingLine,
            ...options.trackingLine,
        },
        content: {
            ...defaultTooltipOptions.content,
            ...options.content,
        },
        format: {
            ...defaultTooltipOptions.format,
            ...options.format,
        },
        indicators: {
            ...defaultTooltipOptions.indicators,
            ...options.indicators,
        },
    };
}

/** Smoothing factor for snap animation (0-1, higher = faster snap). */
const SNAP_SMOOTHING = 0.15;

/** Threshold below which we consider the animation complete. */
const SNAP_THRESHOLD = 0.01;

/**
 * TooltipManager handles interactive tooltip display on the graph.
 *
 * It listens to mouse events on the canvas, computes interpolated values
 * at the cursor position, and renders the tooltip using the configured renderer.
 */
class TooltipManager {
    private state: TooltipState;
    private renderer: TooltipRenderer;
    private options: RequiredTooltipOptions;

    private boundMouseMove: (e: MouseEvent) => void;
    private boundMouseLeave: (e: MouseEvent) => void;
    private animationFrameId: number | null = null;
    private needsRedraw: boolean = false;

    // For smooth snapping animation
    private targetDataX: number = 0;
    private displayedDataX: number = 0;
    private isAnimatingSnap: boolean = false;
    private lastMouseCanvasY: number = 0;

    constructor(
        private readonly graph: BasicGraph,
        options: TooltipOptions,
    ) {
        this.options = mergeOptions(options);

        // Initialize state
        this.state = {
            active: false,
            canvasX: 0,
            canvasY: 0,
            dataX: 0,
            lineValues: [],
        };

        // Create renderer based on options
        this.renderer = new CanvasTooltipRenderer(graph, this.options);

        // Bind event handlers
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundMouseLeave = this.#handleMouseLeave.bind(this);

        // Attach event listeners
        this.#attachEventListeners();
    }

    /**
     * Attach mouse event listeners to the canvas.
     */
    #attachEventListeners(): void {
        this.graph.canvas.addEventListener("mousemove", this.boundMouseMove);
        this.graph.canvas.addEventListener("mouseleave", this.boundMouseLeave);
    }

    /**
     * Remove event listeners.
     */
    #detachEventListeners(): void {
        this.graph.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.graph.canvas.removeEventListener("mouseleave", this.boundMouseLeave);
    }

    /**
     * Handle mouse move events.
     */
    #handleMouseMove(event: MouseEvent): void {
        const graphCtx = createCoordinateContext(this.graph);
        const rect = this.graph.canvas.getBoundingClientRect();

        // Get position relative to canvas (in CSS pixels)
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        // Store mouse Y for animation updates
        this.lastMouseCanvasY = canvasY;

        // Check if within graph plotting area
        if (!isWithinGraphArea(graphCtx, canvasX, canvasY)) {
            if (this.state.active) {
                this.state.active = false;
                this.isAnimatingSnap = false;
                this.#requestRedraw();
            }
            return;
        }

        // Convert canvas X to data X
        const rawDataX = canvasXToDataX(graphCtx, canvasX);

        // Clamp dataX to valid range
        const maxLen = this.graph.dataManager.maxLen();
        const clampedDataX = Math.max(0, Math.min(rawDataX, maxLen - 1));

        // For "nearest" mode, use smooth snapping animation
        if (this.options.mode === "nearest") {
            const newTargetDataX = Math.round(clampedDataX);

            // Initialize displayed position on first activation
            if (!this.state.active) {
                this.displayedDataX = newTargetDataX;
            }

            this.targetDataX = newTargetDataX;
            this.state.active = true;

            // Start snap animation if not already running
            if (!this.isAnimatingSnap) {
                this.isAnimatingSnap = true;
                this.#animateSnap();
            }
        } else {
            // Interpolated mode: direct tracking, no animation needed
            const effectiveCanvasX = dataXToCanvasX(graphCtx, clampedDataX);
            const lineValues = this.#computeLineValues(clampedDataX, effectiveCanvasX);

            this.state = {
                active: true,
                canvasX: effectiveCanvasX,
                canvasY,
                dataX: clampedDataX,
                lineValues,
            };

            this.#requestRedraw();
        }
    }

    /**
     * Animate the smooth snap transition in nearest mode.
     */
    #animateSnap(): void {
        if (!this.state.active || !this.isAnimatingSnap) {
            this.isAnimatingSnap = false;
            return;
        }

        const graphCtx = createCoordinateContext(this.graph);

        // Lerp displayed position toward target
        const diff = this.targetDataX - this.displayedDataX;

        if (Math.abs(diff) < SNAP_THRESHOLD) {
            // Close enough, snap to exact target
            this.displayedDataX = this.targetDataX;
            this.isAnimatingSnap = false;
        } else {
            // Smooth interpolation toward target
            this.displayedDataX += diff * SNAP_SMOOTHING;
        }

        // Compute canvas position and line values for displayed position
        const effectiveCanvasX = dataXToCanvasX(graphCtx, this.displayedDataX);
        const lineValues = this.#computeLineValues(this.displayedDataX, effectiveCanvasX);

        // Update state
        this.state = {
            active: true,
            canvasX: effectiveCanvasX,
            canvasY: this.lastMouseCanvasY,
            dataX: this.displayedDataX,
            lineValues,
        };

        // Trigger redraw
        this.graph.draw();

        // Continue animation if needed
        if (this.isAnimatingSnap) {
            requestAnimationFrame(() => this.#animateSnap());
        }
    }

    /**
     * Handle mouse leave events.
     */
    #handleMouseLeave(_event: MouseEvent): void {
        if (this.state.active) {
            this.state.active = false;
            this.isAnimatingSnap = false;
            this.#requestRedraw();
        }
    }

    /**
     * Compute Y values for all lines at a given data X position.
     * Uses interpolation or nearest mode based on options.
     */
    #computeLineValues(dataX: number, canvasX: number): LineValue[] {
        const graphCtx = createCoordinateContext(this.graph);
        const results: LineValue[] = [];
        const dataSources = this.graph.dataManager.get();
        const isNearest = this.options.mode === "nearest";

        for (const source of dataSources) {
            const { label, colour, data } = source;

            // Skip if data is empty
            if (data.length === 0) continue;

            let value: number;

            if (isNearest) {
                // Nearest mode: use the actual data point value
                const index = Math.round(dataX);
                const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
                value = data[clampedIndex];
            } else {
                // Interpolated mode: linear interpolation between points
                const segment = Math.floor(dataX);
                const t = dataX - segment;

                // Bounds check
                if (segment < 0 || segment >= data.length) continue;

                if (segment >= data.length - 1) {
                    // At or past the last point, use the last value
                    value = data[data.length - 1];
                } else {
                    // Linear interpolation
                    value = lerp(data[segment], data[segment + 1], t);
                }
            }

            // Convert data Y to canvas Y
            const canvasY = dataYToCanvasY(graphCtx, value);

            results.push({
                label,
                colour,
                value,
                canvasX,
                canvasY,
            });
        }

        return results;
    }

    /**
     * Request a redraw on the next animation frame.
     */
    #requestRedraw(): void {
        this.needsRedraw = true;

        if (this.animationFrameId !== null) {
            return; // Already scheduled
        }

        this.animationFrameId = requestAnimationFrame(() => {
            this.animationFrameId = null;

            if (this.needsRedraw) {
                this.needsRedraw = false;
                this.graph.draw(); // Trigger full redraw
            }
        });
    }

    /**
     * Draw the tooltip. Called from BasicGraph.draw().
     */
    draw(): void {
        if (!this.state.active) {
            this.renderer.clear();
            return;
        }

        this.renderer.render(this.state);
    }

    /**
     * Get the current tooltip state.
     */
    getState(): Readonly<TooltipState> {
        return this.state;
    }

    /**
     * Check if the tooltip is currently active.
     */
    isActive(): boolean {
        return this.state.active;
    }

    /**
     * Cleanup resources.
     */
    destroy(): void {
        this.#detachEventListeners();
        this.renderer.destroy();
        this.isAnimatingSnap = false;

        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

export default TooltipManager;
