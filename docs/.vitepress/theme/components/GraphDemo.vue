<script setup lang="ts">
import { ref, shallowRef, onMounted, watch, watchEffect, computed } from "vue";
import type { PropType } from "vue";

// Import Graphika library
import * as Graphika from "../../../../src/index";
import { highlightCode } from "../utils/highlight";

const Graph = Graphika.Graph.default;

interface LineOptions {
    data: number[];
    colour?: string;
    label?: string;
    style?: "solid" | "dashed";
    interpolation?: "linear" | "cubic";
    annotatePoints?: boolean;
    area?: boolean | { colour?: string; opacity?: number };
}

const props = defineProps({
    /** Graph configuration options */
    options: {
        type: Object as PropType<Graphika.Graph.BasicGraphOptions>,
        default: () => ({}),
    },
    /** Line data configurations */
    lines: {
        type: Array as PropType<LineOptions[]>,
        required: true,
    },
    /** Optional title override for the demo */
    title: {
        type: String,
        default: "",
    },
    /** Height of the graph container */
    height: {
        type: Number,
        default: 350,
    },
    /** Enable animation on render */
    animate: {
        type: Boolean,
        default: true,
    },
});

const containerId = ref(`graph-${Math.random().toString(36).slice(2, 9)}`);
const showCode = ref(false);
const showDebug = ref(false);
const copied = ref(false);
const graphInstance = shallowRef<InstanceType<typeof Graph> | null>(null);

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

    // Optimise x-axis ticks by default
    if (!baseOptions.scale) {
        baseOptions.scale = {};
    }
    if (!baseOptions.scale.x) {
        baseOptions.scale.x = {};
    }
    baseOptions.scale.x.optimiseTicks = true;

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
        canvas.width = 600;
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
        canvasWidth: 600,
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

onMounted(() => {
    renderGraph();
});

// Re-render when props change
watch(
    () => [props.options, props.lines],
    () => {
        renderGraph();
    },
    { deep: true },
);
</script>

<template>
    <div class="graph-demo">
        <!-- Live Preview -->
        <div class="graph-demo-preview">
            <div :id="containerId" class="graph-container" :style="{ height: `${height}px` }">
                <canvas :width="600" :height="height" />
            </div>
        </div>

        <!-- Actions Bar -->
        <div class="graph-demo-actions">
            <button :class="{ copied }" @click="copyCode">
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
            <button @click="toggleCode">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
                {{ showCode ? "Hide Code" : "View Code" }}
            </button>
            <button @click="toggleDebug">
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
