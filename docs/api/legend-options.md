# Legend Options

Configure the legend appearance and position.

::: tip Type Reference
For the full type definition, see [`LegendOptions`](/reference/legend/manager#legendoptions).
:::

## Sample

```ts
let graph = new Graph(
    "g",
    {
        legend: {
            draw: true,
            position: "top",
            alignment: "center",
        },
    },
    [
        /* lines */
    ],
);
```

## Options

| Name        | Type                       | Default  | Description                                  |
| ----------- | -------------------------- | -------- | -------------------------------------------- |
| `draw`      | `boolean`                  | `false`  | Whether to draw the legend.                  |
| `position`  | `top\|right\|bottom\|left` | `top`    | Position of the legend on the graph.         |
| `alignment` | `start\|center\|end`       | `center` | Alignment of the legend within its position. |

## Example

A graph with a legend showing two data series:

```ts
let graph = new Graph(
    "graph",
    {
        x_label: "Months",
        y_label: "Time procrastinating (hours)",
        title: {
            content: "Procrastinating statistics",
            alignment: "center",
        },
        scale: {
            x: {
                ticks: 12,
                tickLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            },
        },
        legend: {
            draw: true,
            position: "top",
            alignment: "center",
        },
    },
    [
        {
            style: "dashed",
            label: "You",
            interpolation: "cubic",
            data: dataset[0],
            annotatePoints: true,
            colour: Graph.Colours.FLAMINGO_RED,
            area: {
                fill: true,
                colour: Graph.Colours.FLAMINGO_RED,
            },
        },
        {
            label: "Average",
            interpolation: "cubic",
            data: dataset[1],
            colour: Graph.Colours.DEEP_PURPLE,
            annotatePoints: true,
            area: {
                fill: true,
                colour: Graph.Colours.DEEP_PURPLE,
            },
        },
    ],
);

graph.draw();
```

Result:

![chart_with_legend](/img/legend/default.png)
