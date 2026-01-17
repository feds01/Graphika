# Getting Started

Graphika is a fast JavaScript library to draw elegant graphs in the browser. This guide will help you get up and running quickly.

## Installation

### Via NPM

```bash
npm install @feds01/graphika
```

### Via Script Tag

Include the minified version directly in your HTML:

```html
<script src="path/to/graphika.min.js"></script>
```

## Basic Setup

### 1. Create a Container

Add a container element with a canvas in your HTML:

```html
<div id="graph">
    <canvas width="800" height="600"></canvas>
</div>
```

### 2. Initialize the Graph

Create a new graph by providing the container ID, options, and line data:

```ts
import * as Graph from "@feds01/graphika";

// Your data - can be loaded from CSV, API, etc.
const dataset = [
    [1, 5, 3, 8, 4, 9, 2, 7, 6, 10],
    [2, 4, 6, 3, 8, 5, 9, 1, 7, 4],
];

// Create the graph
const graph = new Graph.Graph(
    "graph", // container element ID
    {
        title: {
            content: "My First Graph",
        },
        x_label: "X-Axis",
        y_label: "Y-Axis",
    },
    [
        {
            style: "dashed",
            label: "line-1",
            interpolation: "cubic",
            data: dataset[0],
            annotatePoints: false,
            colour: Graph.Colours.PURPLE,
            area: {
                fill: true,
                colour: Graph.Colours.PURPLE,
            },
        },
        {
            label: "line-2",
            interpolation: "cubic",
            data: dataset[1],
            colour: Graph.Colours.EMERALD_GREEN,
            annotatePoints: true,
            area: {
                fill: true,
                colour: Graph.Colours.EMERALD_GREEN,
            },
        },
    ],
);

// Draw the graph
graph.draw();
```

### Result

![Example Graph](/img/intro.png)

## Next Steps

- Learn about [basic usage patterns](./basic.md)
- Explore the [API Reference](/api/graph) for all configuration options
- Check out customization options for:
    - [Lines](/api/line-options)
    - [Grids](/api/grid-options)
    - [Scales](/api/scale-options)
    - [Titles](/api/title-options)
    - [Legends](/api/legend-options)
