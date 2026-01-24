<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

// Import Graphika library
import * as Graphika from "../../../../src/index";
import type { DataSource, Graph } from "../../../../src/index";
import { highlightCode } from "../utils/highlight";

const props = defineProps({
    /** Number of data points to generate */
    dataPoints: {
        type: Number,
        default: 10000,
    },
    /** Height of the graph container */
    height: {
        type: Number,
        default: 400,
    },
});

const containerId = ref(`stress-${Math.random().toString(36).slice(2, 9)}`);
const showCode = ref(false);
const showDebug = ref(false);
const copied = ref(false);
let graphInstance: InstanceType<typeof Graph.default> | null = null;

// Generate stress test data
const stressTestData = computed(() =>
    Array.from({ length: props.dataPoints }, (_, i) => Math.sin(i * 0.01) * 50 + 50 + (Math.random() - 0.5) * 10),
);

const graphOptions = computed(
    () =>
        ({
            title: {
                draw: true,
                content: `Performance Stress Test (${props.dataPoints.toLocaleString()} points)`,
                alignment: "center" as const,
            },
            x_label: "Sample",
            y_label: "Value",
            grid: { gridded: true },
            animation: { enabled: false }, // Disable animation for stress test
        }) satisfies Partial<Graph.BasicGraphOptions>,
);

interface LineOptions {
    label: string;
    data: number[];
    colour?: string;
    interpolation?: "linear" | "step" | "bezier";
    style?: "solid" | "dashed" | "dotted";
    areaFill?: boolean;
    annotatePoints?: boolean;
}

const lineOptions = computed(
    () =>
        [
            {
                label: "Signal",
                interpolation: "linear" as const,
                data: stressTestData.value,
                colour: "#009FE5",
            },
        ] satisfies LineOptions[],
);

// Debug metrics
const debugMetrics = ref({
    renderTime: 0,
    canvasWidth: 600,
    canvasHeight: props.height,
    dataPoints: props.dataPoints,
    seriesCount: 1,
});

// Generate the code string for display
const codeString = computed(() => {
    return `import Graph from "@feds01/graphika";

// Generate ${props.dataPoints.toLocaleString()} data points
const data = Array.from({ length: ${props.dataPoints} }, (_, i) =>
    Math.sin(i * 0.01) * 50 + 50 + (Math.random() - 0.5) * 10
);

const graph = new Graph.Graph(
    "container",
    {
        title: { content: "Performance Stress Test", alignment: "center" },
        x_label: "Sample",
        y_label: "Value",
        grid: { gridded: true },
        animation: { enabled: false }
    },
    [
        {
            label: "Signal",
            interpolation: "linear",
            data: data,
            colour: "#009FE5"
        }
    ]
);
graph.draw();`;
});

const highlightedCode = ref("");

onMounted(async () => {
    highlightedCode.value = await highlightCode(codeString.value);
    renderGraph();
});

function renderGraph() {
    const container = document.getElementById(containerId.value);
    if (!container) return;

    const canvas = container.querySelector("canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        canvas.width = 600;
        canvas.height = props.height;
    }

    const startTime = performance.now();

    graphInstance = new Graph(containerId.value, graphOptions.value, lineOptions.value);
    graphInstance.draw();

    const endTime = performance.now();

    debugMetrics.value = {
        renderTime: Math.round((endTime - startTime) * 100) / 100,
        canvasWidth: 600,
        canvasHeight: props.height,
        dataPoints: props.dataPoints,
        seriesCount: 1,
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
                        <span class="debug-value">{{ debugMetrics.dataPoints.toLocaleString() }}</span>
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
