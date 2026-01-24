# Getting Started

Graphika is a fast JavaScript library to draw elegant graphs in the browser.

## Installation

::: code-group

```bash [npm]
npm install @feds01/graphika
```

```bash [yarn]
yarn add @feds01/graphika
```

```bash [pnpm]
pnpm add @feds01/graphika
```

:::

Or include via script tag:

```html
<script src="path/to/graphika.min.js"></script>
```

## Quick Start

### 1. Create a Container

```html
<div id="graph">
    <canvas width="800" height="600"></canvas>
</div>
```

### 2. Initialize and Draw

```ts
import Graph from "@feds01/graphika";

const graph = new Graph.Graph(
    "graph",
    {
        title: { content: "My First Graph" },
        x_label: "X-Axis",
        y_label: "Y-Axis",
    },
    [
        {
            label: "Series A",
            data: [1, 5, 3, 8, 4, 9, 2, 7, 6, 10],
            colour: Graph.Colours.PURPLE,
            interpolation: "cubic",
        },
    ],
);

graph.draw();
```

### Result

<GraphDemo
    :options="{
        title: { content: 'My First Graph', alignment: 'center' },
        x_label: 'X-Axis',
        y_label: 'Y-Axis',
        grid: { gridded: true },
        legend: { draw: true, position: 'top' }
    }"
    :lines="[
        {
            label: 'Series A',
            interpolation: 'cubic',
            data: [1, 5, 3, 8, 4, 9, 2, 7, 6, 10],
            colour: '#800080',
            style: 'dashed',
            area: { fill: true }
        },
        {
            label: 'Series B',
            interpolation: 'cubic',
            data: [2, 4, 6, 3, 8, 5, 9, 1, 7, 4],
            colour: '#008816',
            annotatePoints: true,
            area: { fill: true }
        }
    ]"
/>

## Next Steps

- Explore more [examples](./basic)
- Try the interactive [playground](./playground)
- Learn about configuration options:
    - [Lines](/api/line-options) - Colors, styles, interpolation
    - [Grid](/api/grid-options) - Background grid options
    - [Scale](/api/scale-options) - Axis ticks and labels
    - [Title](/api/title-options) - Title text and alignment
    - [Legend](/api/legend-options) - Legend display options
