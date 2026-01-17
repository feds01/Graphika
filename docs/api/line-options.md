# Line Options

Configure the appearance and behavior of lines drawn on the graph.

::: tip Type Reference
For the full type definition, see [`LineOptions`](/reference/core/line#lineoptions).
:::

## Sample

```ts
let graph = new Graph(
    "g",
    {
        /* graph options */
    },
    [
        {
            label: "student_1",
            data: getRandomArray(11, 0, 20),
            colour: Graph.Colours.FLAMINGO_RED,
            interpolation: "cubic",
            style: "dashed",
            annotatePoints: true,
            area: {
                fill: true,
                colour: Graph.Colours.FLAMINGO_RED,
            },
        },
    ],
);
```

## Options

| Name             | Type            | Default   | Description                                                                                               |
| ---------------- | --------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| `data`           | `number[]`      | -         | **Required.** The data points for this line.                                                              |
| `colour`         | `string`        | `#000000` | Hex colour code for the line stroke.                                                                      |
| `label`          | `string`        | `line-0`  | Label for the data set. Must be unique across all lines.                                                  |
| `interpolation`  | `linear\|cubic` | `linear`  | How points are connected. `linear` uses straight lines, `cubic` draws smooth curves.                      |
| `style`          | `dashed\|solid` | `solid`   | Line stroke style.                                                                                        |
| `annotatePoints` | `boolean`       | `false`   | Whether to draw circles at each data point.                                                               |
| `area`           | `object`        | -         | Area fill settings. See [`LineAreaOptions`](/reference/core/line#lineareaoptions).                        |
| `animation`      | `object`        | -         | Animation settings for the line. See [`LineAnimationOptions`](/reference/core/line#lineanimationoptions). |

## Area Fill

To fill the area under (or over) a line:

```ts
{
    area: {
        fill: true,
        colour: Graph.Colours.PURPLE,  // Optional, defaults to line colour
    }
}
```

When the area colour matches the line colour, an alpha of `0.6` is applied automatically.
