# Scale Options

Configure the axis scales and tick marks.

::: tip Type Reference
For the full type definition, see [`AxisOptions`](/reference/core/axis#axisoptions) and [`ScaleOptions`](/reference/core/scale#scaleoptions).
:::

## Sample

```ts
let graph = new Graph(
    "g",
    {
        scale: {
            shorthandNumerics: false,
            x: {
                ticks: 12,
                tickLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            },
            y: {
                ticks: 10,
                startAtZero: true,
            },
        },
    },
    [
        /* lines */
    ],
);
```

## General Options

| Name                | Type      | Default | Description                                                        |
| ------------------- | --------- | ------- | ------------------------------------------------------------------ |
| `shorthandNumerics` | `boolean` | `false` | Use shorthand for large numbers (e.g., `9M` instead of `9000000`). |

## Axis Options

Both X and Y axes share common settings:

| Name             | Type                            | Default      | Description                                          |
| ---------------- | ------------------------------- | ------------ | ---------------------------------------------------- |
| `ticks`          | `number`                        | `10`         | Number of ticks on the axis.                         |
| `drawTicks`      | `boolean`                       | `true`       | Whether to draw tick marks.                          |
| `drawLabels`     | `boolean`                       | `true`       | Whether to draw labels at tick positions.            |
| `labelDirection` | `horizontal\|vertical\|slanted` | `horizontal` | Direction for axis labels.                           |
| `axisColour`     | `string`                        | `#5e5e5e`    | Colour for the axis line.                            |
| `tickLabels`     | `string[]`                      | -            | Custom labels for ticks. Cycles if fewer than ticks. |

### Y-Axis Specific

| Name          | Type      | Default | Description                           |
| ------------- | --------- | ------- | ------------------------------------- |
| `startAtZero` | `boolean` | `false` | Force the y-axis scale to start at 0. |
