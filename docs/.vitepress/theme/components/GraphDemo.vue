<script setup lang="ts">
import { ref, shallowRef, onMounted, watch, watchEffect, computed, nextTick } from "vue";
import type { PropType } from "vue";
import { useData } from "vitepress";

import * as Graphika from "../../../../src/index";
import { highlightCode } from "../utils/highlight";

const Graph = Graphika.Graph.default;

interface WidgetOptions {
    copy?: boolean;
    codeView?: boolean;
    debugPanel?: boolean;
}

const props = defineProps({
    /** Graph configuration options */
    options: {
        type: Object as PropType<Graphika.Graph.BasicGraphOptions>,
        default: () => ({}),
    },
    widgets: {
        type: Object as PropType<WidgetOptions>,
        default: () => ({
            copy: true,
            codeView: true,
            debugPanel: true,
        }),
    },
    /** Line data configurations */
    lines: {
        type: Array as PropType<Graphika.DataSource[]>,
        required: true,
    },
    /** Height of the graph container */
    height: {
        type: Number,
        default: 350,
    },
    width: {
        type: Number,
        default: 600,
    },
    /** Enable animation on render */
    animate: {
        type: Boolean,
        default: true,
    },
});

const { isDark } = useData();

const containerId = ref(`graph-${Math.random().toString(36).slice(2, 9)}`);
const showCode = ref(false);
const showDebug = ref(false);
const copied = ref(false);
const graphInstance = shallowRef<InstanceType<typeof Graph> | null>(null);
const isClientReady = ref(false);

// Debug metrics
const debugMetrics = ref({
    renderTime: 0,
    canvasWidth: 600,
    canvasHeight: 350,
    dataPoints: 0,
    seriesCount: 0,
});

// Computed options with animation merged in
const computedOptions = computed(() => {
    // Deep clone to avoid shared references between component instances
    const baseOptions: Graphika.Graph.BasicGraphOptions = JSON.parse(JSON.stringify(props.options));
    if (props.animate) {
        baseOptions.animation = { enabled: true, duration: 800 };
    }

    // Build scale options with x-axis tick optimization
    const darkAxisColour = isDark.value ? { axisColour: "#dfdfd6" } : {};
    baseOptions.scale = {
        ...baseOptions.scale,
        x: { ...baseOptions.scale?.x, optimiseTicks: true, ...darkAxisColour },
        y: { ...baseOptions.scale?.y, ...darkAxisColour },
    };

    // Apply dark mode styling
    if (isDark.value) {
        baseOptions.axisColour = "#dfdfd6";
        if (baseOptions.title) {
            baseOptions.title = { ...baseOptions.title, colour: "#dfdfd6" };
        }
        // Apply dark mode tooltip styling
        if (baseOptions.tooltip?.enabled) {
            baseOptions.tooltip = {
                ...baseOptions.tooltip,
                trackingLine: {
                    ...baseOptions.tooltip?.trackingLine,
                    colour: baseOptions.tooltip?.trackingLine?.colour ?? "rgba(255, 255, 255, 0.5)",
                },
                content: {
                    ...baseOptions.tooltip?.content,
                    backgroundColor: baseOptions.tooltip?.content?.backgroundColor ?? "rgba(30, 30, 30, 0.95)",
                    textColour: baseOptions.tooltip?.content?.textColour ?? "#dfdfd6",
                },
            };
        }
    }

    return baseOptions;
});

// Generate the code string for display
const codeString = computed(() => {
    const optionsStr = JSON.stringify(computedOptions.value, null, 4);
    const linesStr = JSON.stringify(
        props.lines.map((line) => ({
            ...line,
            colour: line.colour || "Graph.Colours.ELECTRIC_BLUE",
        })),
        null,
        4,
    )
        // Replace colour string values with actual references
        .replace(/"Graph\.Colours\.(\w+)"/g, "Graph.Colours.$1");

    return `import Graph from "@feds01/graphika";

const graph = new Graph.Graph(
    "container",
    ${optionsStr},
    ${linesStr}
);
graph.draw();`;
});

const highlightedCode = ref("");

watchEffect(async () => {
    highlightedCode.value = await highlightCode(codeString.value);
});

function renderGraph() {
    const container = document.getElementById(containerId.value);
    if (!container) return;

    // Reset canvas for re-render
    const canvas = container.querySelector("canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        // Reset canvas dimensions (removes any scaling applied)
        canvas.width = props.width;
        canvas.height = props.height;
    }

    // Calculate total data points
    const totalDataPoints = props.lines.reduce((sum, line) => sum + line.data.length, 0);

    // Capture render time
    const startTime = performance.now();

    // Create new graph instance with computed options (includes animation)
    // Cast to any since the library merges partial options with defaults
    graphInstance.value = new Graph(containerId.value, computedOptions.value, props.lines);
    graphInstance.value.draw();

    const endTime = performance.now();

    // Update debug metrics
    debugMetrics.value = {
        renderTime: Math.round((endTime - startTime) * 100) / 100,
        canvasWidth: props.width,
        canvasHeight: props.height,
        dataPoints: totalDataPoints,
        seriesCount: props.lines.length,
    };
}

function toggleCode() {
    showCode.value = !showCode.value;
}

function toggleDebug() {
    showDebug.value = !showDebug.value;
}

async function copyCode() {
    try {
        await navigator.clipboard.writeText(codeString.value);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch {
        console.error("Failed to copy code");
    }
}

onMounted(async () => {
    // Render canvas via v-if, wait for DOM update, then draw after browser layout
    isClientReady.value = true;
    await nextTick();
    requestAnimationFrame(() => renderGraph());
});

// Re-render when props change or dark mode toggles
watch(
    () => [props.options, props.lines, isDark.value],
    () => {
        renderGraph();
    },
    { deep: true },
);
</script>

<template>
    <div class="graph-demo">
        <!-- Live Preview -->
        <div v-if="isClientReady" class="graph-demo-preview">
            <div :id="containerId" class="graph-container" :style="{ height: `${height}px`, width: `${width}px` }">
                <canvas :width="width" :height="height" />
            </div>
        </div>

        <!-- Actions Bar -->
        <div v-if="widgets.copy || widgets.codeView || widgets.debugPanel" class="graph-demo-actions">
            <button v-if="widgets.copy" :class="{ copied }" @click="copyCode">
                <svg
                    v-if="!copied"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg
                    v-else
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ copied ? "Copied!" : "Copy" }}
            </button>
            <button v-if="widgets.codeView" @click="toggleCode">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
                {{ showCode ? "Hide Code" : "View Code" }}
            </button>
            <button v-if="widgets.debugPanel" @click="toggleDebug">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                {{ showDebug ? "Hide Debug" : "Debug" }}
            </button>
        </div>

        <!-- Collapsible Code Block -->
        <div class="graph-demo-code" :class="showCode ? 'expanded' : 'collapsed'">
            <div class="code-wrapper" v-html="highlightedCode"></div>
        </div>

        <!-- Collapsible Debug Panel -->
        <div class="graph-demo-debug" :class="showDebug ? 'expanded' : 'collapsed'">
            <div class="debug-wrapper">
                <div class="debug-grid">
                    <div class="debug-item">
                        <span class="debug-label">Render Time</span>
                        <span class="debug-value">{{ debugMetrics.renderTime }} ms</span>
                    </div>
                    <div class="debug-item">
                        <span class="debug-label">Canvas Size</span>
                        <span class="debug-value"
                            >{{ debugMetrics.canvasWidth }} × {{ debugMetrics.canvasHeight }}</span
                        >
                    </div>
                    <div class="debug-item">
                        <span class="debug-label">Data Points</span>
                        <span class="debug-value">{{ debugMetrics.dataPoints }}</span>
                    </div>
                    <div class="debug-item">
                        <span class="debug-label">Series Count</span>
                        <span class="debug-value">{{ debugMetrics.seriesCount }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
