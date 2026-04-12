# Graph

The main entry point for creating visualizations with Graphika.

## Quick Start

<GraphDemo
    :options="{
        title: { content: 'Sales Performance', alignment: 'center' },
        x_label: 'Month',
        y_label: 'Revenue ($K)',
        grid: { gridded: true, sharedAxisZero: true },
        legend: { draw: true, position: 'top' }
    }"
    :lines="[
        {
            label: 'This Year',
            interpolation: 'cubic',
            data: [45, 52, 48, 61, 55, 67, 72, 68, 80, 75, 88, 92],
            colour: '#009FE5',
            area: { fill: true }
        },
        {
            label: 'Last Year',
            interpolation: 'cubic',
            style: 'dashed',
            data: [38, 45, 42, 52, 48, 58, 62, 60, 70, 65, 78, 82],
            colour: '#FF6782'
        }
    ]"
/>

## Constructor

```ts
import Graph from "@feds01/graphika";

const graph = new Graph.Graph(containerId, options, lines);
graph.draw();
```

| Parameter     | Type            | Description                                    |
| ------------- | --------------- | ---------------------------------------------- |
| `containerId` | `string`        | ID of the HTML element containing a `<canvas>` |
| `options`     | `GraphOptions`  | Configuration object for the graph             |
| `lines`       | `LineOptions[]` | Array of line configurations                   |

## Options Overview

| Option      | Type     | Description                                |
| ----------- | -------- | ------------------------------------------ |
| `title`     | `object` | Graph title text, position, and styling    |
| `x_label`   | `string` | Label for the X-axis                       |
| `y_label`   | `string` | Label for the Y-axis                       |
| `grid`      | `object` | Grid lines visibility and styling          |
| `scale`     | `object` | Axis ticks, labels, and numeric formatting |
| `legend`    | `object` | Legend visibility, position, and alignment |
| `animation` | `object` | Animation settings for drawing             |

## Configuration Sections

Each aspect of the graph can be customized independently:

### [Lines](./line-options)

Configure line appearance: colors, interpolation, styles, area fills, and point annotations.

<GraphDemo
    :options="{
        title: { content: 'Line Customization', alignment: 'center' },
        grid: { gridded: true }
    }"
    :lines="[
        { label: 'Cubic + Area', interpolation: 'cubic', data: [20, 45, 30, 55, 40, 60], colour: '#009FE5', area: { fill: true } },
        { label: 'Linear + Dashed', interpolation: 'linear', style: 'dashed', data: [15, 35, 25, 45, 35, 50], colour: '#FF6782', annotatePoints: true }
    ]"
    :height="280"
/>

### [Grid](./grid-options)

Control grid visibility and line styles.

<GraphDemo
    :options="{
        title: { content: 'Dashed Grid', alignment: 'center' },
        grid: { gridded: true, gridLineStyle: 'dashed' }
    }"
    :lines="[
        { label: 'Data', interpolation: 'cubic', data: [25, 50, 35, 60, 45, 70], colour: '#3a243b' }
    ]"
    :height="260"
/>

### [Scale](./scale-options)

Customize axis ticks and labels.

<GraphDemo
    :options="{
        title: { content: 'Custom Labels', alignment: 'center' },
        grid: { gridded: true },
        scale: { x: { ticks: 6, tickLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], optimiseTicks: true } }
    }"
    :lines="[
        { label: 'Activity', interpolation: 'cubic', annotatePoints: true, data: [5, 8, 6, 10, 7, 3], colour: '#008816' }
    ]"
    :height="260"
/>

### [Title](./title-options)

Set the graph title text and alignment.

### [Legend](./legend-options)

Position and style the legend for multi-series graphs.

## Complete Example

```ts
import Graph from "@feds01/graphika";

const graph = new Graph.Graph(
    "my-chart",
    {
        title: {
            content: "Monthly Performance",
            alignment: "center",
        },
        x_label: "Month",
        y_label: "Value",
        grid: {
            gridded: true,
            gridLineStyle: "solid",
        },
        scale: {
            x: {
                ticks: 12,
                tickLabels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
                optimiseTicks: true,
            },
        },
        legend: {
            draw: true,
            position: "top",
        },
    },
    [
        {
            label: "Revenue",
            data: [45, 52, 48, 61, 55, 67, 72, 68, 80, 75, 88, 92],
            colour: "#009FE5",
            interpolation: "cubic",
            area: { fill: true },
        },
        {
            label: "Target",
            data: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
            colour: "#FF6782",
            interpolation: "linear",
            style: "dashed",
        },
    ]
);

graph.draw();
```

::: tip Type Reference
For full TypeScript definitions, see [`BasicGraphOptions`](/reference/basic.graph).
:::
