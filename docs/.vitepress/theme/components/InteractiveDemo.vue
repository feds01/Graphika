<script setup lang="ts">
import { ref, reactive, onMounted, watch, watchEffect, computed } from "vue";

// Import Graphika library
import * as Graphika from "../../../../src/index";
import { highlightCode } from "../utils/highlight";

const Graph = Graphika.Graph.default;

const containerId = ref(`graph-${Math.random().toString(36).slice(2, 9)}`);
let graphInstance: InstanceType<typeof Graph> | null = null;

const showCode = ref(false);
const copied = ref(false);

// Color name mapping for code generation
const colorNameMap: Record<string, string> = {
    "#FF6782": "Graph.Colours.FLAMINGO_RED",
    "#009FE5": "Graph.Colours.ELECTRIC_BLUE",
    "#008816": "Graph.Colours.EMERALD_GREEN",
    "#3a243b": "Graph.Colours.DEEP_PURPLE",
    "#800080": "Graph.Colours.PURPLE",
    "#5e5e5e": "Graph.Colours.GREY",
};

// Available colors for selection
const colorOptions = [
    { name: "Flamingo Red", value: "#FF6782" },
    { name: "Electric Blue", value: "#009FE5" },
    { name: "Emerald Green", value: "#008816" },
    { name: "Deep Purple", value: "#3a243b" },
    { name: "Purple", value: "#800080" },
    { name: "Grey", value: "#5e5e5e" },
];

// Reactive state for controls
const controls = reactive({
    // Title options
    titleContent: "Interactive Graph Demo",
    titleAlignment: "center" as "start" | "center" | "end",

    // Grid options
    gridded: true,
    gridLineStyle: "solid" as "solid" | "dashed",
    sharedAxisZero: true,

    // Legend options
    showLegend: true,
    legendPosition: "top" as "top" | "right" | "bottom" | "left",

    // Line 1 options
    line1Interpolation: "cubic" as "linear" | "cubic",
    line1Style: "solid" as "solid" | "dashed",
    line1Color: "#009FE5",
    line1AnnotatePoints: false,
    line1AreaFill: false,

    // Line 2 options
    line2Interpolation: "cubic" as "linear" | "cubic",
    line2Style: "solid" as "solid" | "dashed",
    line2Color: "#FF6782",
    line2AnnotatePoints: false,
    line2AreaFill: false,

    // Animation
    animate: true,
});

// Sample data
const line1Data = [15, 35, 28, 45, 38, 52, 42, 58, 48, 62];
const line2Data = [10, 28, 22, 38, 32, 45, 35, 50, 42, 55];

// Computed graph options
const graphOptions = computed(() => ({
    title: {
        content: controls.titleContent,
        alignment: controls.titleAlignment,
    },
    x_label: "X-Axis",
    y_label: "Y-Axis",
    grid: {
        gridded: controls.gridded,
        gridLineStyle: controls.gridLineStyle,
        sharedAxisZero: controls.sharedAxisZero,
    },
    legend: {
        draw: controls.showLegend,
        position: controls.legendPosition,
    },
    animation: {
        enabled: controls.animate,
        duration: 800,
    },
}));

// Computed lines
const lines = computed(() => [
    {
        label: "Series A",
        data: line1Data,
        colour: controls.line1Color,
        interpolation: controls.line1Interpolation,
        style: controls.line1Style,
        annotatePoints: controls.line1AnnotatePoints,
        area: controls.line1AreaFill ? { fill: true } : undefined,
    },
    {
        label: "Series B",
        data: line2Data,
        colour: controls.line2Color,
        interpolation: controls.line2Interpolation,
        style: controls.line2Style,
        annotatePoints: controls.line2AnnotatePoints,
        area: controls.line2AreaFill ? { fill: true } : undefined,
    },
]);

// Generate code string for display
const codeString = computed(() => {
    const line1ColorRef = colorNameMap[controls.line1Color] || `"${controls.line1Color}"`;
    const line2ColorRef = colorNameMap[controls.line2Color] || `"${controls.line2Color}"`;

    const line1Area = controls.line1AreaFill ? `\n        area: { fill: true },` : "";
    const line2Area = controls.line2AreaFill ? `\n        area: { fill: true },` : "";

    return `import Graph from "@feds01/graphika";

const graph = new Graph.Graph(
    "container",
    {
        title: {
            content: "${controls.titleContent}",
            alignment: "${controls.titleAlignment}",
        },
        x_label: "X-Axis",
        y_label: "Y-Axis",
        grid: {
            gridded: ${controls.gridded},
            gridLineStyle: "${controls.gridLineStyle}",
        },
        legend: {
            draw: ${controls.showLegend},
            position: "${controls.legendPosition}",
        },
    },
    [
        {
            label: "Series A",
            data: [${line1Data.join(", ")}],
            colour: ${line1ColorRef},
            interpolation: "${controls.line1Interpolation}",
            style: "${controls.line1Style}",
            annotatePoints: ${controls.line1AnnotatePoints},${line1Area}
        },
        {
            label: "Series B",
            data: [${line2Data.join(", ")}],
            colour: ${line2ColorRef},
            interpolation: "${controls.line2Interpolation}",
            style: "${controls.line2Style}",
            annotatePoints: ${controls.line2AnnotatePoints},${line2Area}
        },
    ]
);

graph.draw();`;
});

const highlightedCode = ref("");

watchEffect(async () => {
    highlightedCode.value = await highlightCode(codeString.value);
});

function toggleCode() {
    showCode.value = !showCode.value;
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
        canvas.height = 380;
    }

    graphInstance = new Graph(containerId.value, graphOptions.value, lines.value);
    graphInstance.draw();
}

onMounted(() => {
    renderGraph();
});

watch(
    [graphOptions, lines],
    () => {
        renderGraph();
    },
    { deep: true },
);
</script>

<template>
    <div class="interactive-demo">
        <div class="interactive-demo-content">
            <!-- Graph Preview -->
            <div class="interactive-demo-preview">
                <div :id="containerId" class="graph-container">
                    <canvas width="600" height="380" />
                </div>
            </div>

            <!-- Actions Bar -->
            <div class="interactive-demo-actions">
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
            </div>

            <!-- Collapsible Code Block -->
            <div class="interactive-demo-code" :class="showCode ? 'expanded' : 'collapsed'">
                <div class="code-wrapper" v-html="highlightedCode"></div>
            </div>

            <!-- Controls Panel -->
            <div class="interactive-demo-controls">
                <div class="control-sections">
                    <!-- Title Section -->
                    <div class="control-section">
                        <h4>Title</h4>
                        <div class="control-group">
                            <label>
                                <span>Text</span>
                                <input type="text" v-model="controls.titleContent" />
                            </label>
                            <label>
                                <span>Alignment</span>
                                <select v-model="controls.titleAlignment">
                                    <option value="start">Start</option>
                                    <option value="center">Center</option>
                                    <option value="end">End</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <!-- Grid Section -->
                    <div class="control-section">
                        <h4>Grid</h4>
                        <div class="control-group">
                            <label class="checkbox">
                                <input type="checkbox" v-model="controls.gridded" />
                                <span>Show Grid</span>
                            </label>
                            <label>
                                <span>Line Style</span>
                                <select v-model="controls.gridLineStyle" :disabled="!controls.gridded">
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <!-- Legend Section -->
                    <div class="control-section">
                        <h4>Legend</h4>
                        <div class="control-group">
                            <label class="checkbox">
                                <input type="checkbox" v-model="controls.showLegend" />
                                <span>Show Legend</span>
                            </label>
                            <label>
                                <span>Position</span>
                                <select v-model="controls.legendPosition" :disabled="!controls.showLegend">
                                    <option value="top">Top</option>
                                    <option value="right">Right</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <!-- Line 1 Section -->
                    <div class="control-section">
                        <h4>Series A</h4>
                        <div class="control-group">
                            <label>
                                <span>Interpolation</span>
                                <select v-model="controls.line1Interpolation">
                                    <option value="linear">Linear</option>
                                    <option value="cubic">Cubic</option>
                                </select>
                            </label>
                            <label>
                                <span>Style</span>
                                <select v-model="controls.line1Style">
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                </select>
                            </label>
                            <label>
                                <span>Color</span>
                                <select v-model="controls.line1Color">
                                    <option v-for="c in colorOptions" :key="c.value" :value="c.value">
                                        {{ c.name }}
                                    </option>
                                </select>
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" v-model="controls.line1AnnotatePoints" />
                                <span>Show Points</span>
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" v-model="controls.line1AreaFill" />
                                <span>Area Fill</span>
                            </label>
                        </div>
                    </div>

                    <!-- Line 2 Section -->
                    <div class="control-section">
                        <h4>Series B</h4>
                        <div class="control-group">
                            <label>
                                <span>Interpolation</span>
                                <select v-model="controls.line2Interpolation">
                                    <option value="linear">Linear</option>
                                    <option value="cubic">Cubic</option>
                                </select>
                            </label>
                            <label>
                                <span>Style</span>
                                <select v-model="controls.line2Style">
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                </select>
                            </label>
                            <label>
                                <span>Color</span>
                                <select v-model="controls.line2Color">
                                    <option v-for="c in colorOptions" :key="c.value" :value="c.value">
                                        {{ c.name }}
                                    </option>
                                </select>
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" v-model="controls.line2AnnotatePoints" />
                                <span>Show Points</span>
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" v-model="controls.line2AreaFill" />
                                <span>Area Fill</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
