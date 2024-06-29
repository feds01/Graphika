# Configuring the Graph grid

When creating a new graph, you can customise the look and feel of the scales that are drawn on
the graph.

## Sample

From this sample, it's easy to see how someone could configure the scale options for a graph:

```ts
 const graph = new Graph('g', {
            ...
            scale: {
                shorthandNumerics: false,
                x: {...}, // configure axis options separately
                y: {...}
            }
        },
        [ ... ]
}

```

## General Options
**Note**: To configure an axis individually, scroll down for axis options.

Here's a table of all the generic options that are provided for scales on charts, what they mean and what are the defaults:


| Name              | Type      | Default | Description                                                                                                                                                                                 | Required |
|-------------------|-----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| shorthandNumerics | `boolean` | `false` | Whether to use short hand numerics when encountering data sets with large numbers. For example when using short hand numerics, rather than showing `9000000` the graph will just show `9M`. | `false`  |


## Axis Options

You can configure the X-Axis and Y-Axis seperately, both axis share many common settings but there are som subtle differences between the two.

Here are all the options for configuring the look and feel of the **X-Axis**:

| Name            | Type                            | Default      | Description                                                                                                                                                                                                |
|-----------------|---------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| drawTicks       | `boolean`                       | `true`       | Whether the graph should draw extensions of the lines that lead up to the labels on the x-axis.                                                                                                            |
| drawLabels      | `boolean`                       | `true`       | Whether the graph should draw labels for the ticks on the x-axis.                                                                                                                                          |
| labelDirection  | `horizontal\|vertical\|slanted` | `horizontal` | Which direction should the x-axis labels should be drawn.                                                                                                                                                  |
| axisColour      | `string`                        | `#5e5e5e`    | The colour in which the x-axis is painted.                                                                                                                                                                 |
| tickLabels      | `string[]`                      | `null`       | A list of labels that should be used instead of the generated ones. If you provide less than the number of drawn ticks, it will fill the extra ticks with the provided labels by just re-using the labels. |
| ticks           | `number`                        | `10`         | Number of ticks the x-axis should use.                                                                                                                                                                     |

Here are all the options for configuring the look and feel of the **Y-Axis**:

| Name            | Type                            | Default      | Description                                                                                                                                                                                                |
|-----------------|---------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| drawTicks       | `boolean`                       | `true`       | Whether the graph should draw extensions of the lines that lead up to the labels on the y-axis.                                                                                                            |
| drawLabels      | `boolean`                       | `true`       | Whether the graph should draw labels for the ticks on the y-axis.                                                                                                                                          |
| labelDirection  | `horizontal\|vertical\|slanted` | `horizontal` | Which direction should the y-axis labels should be drawn.                                                                                                                                                  |
| axisColour      | `string`                        | `#5e5e5e`    | The colour in which the y-axis is painted.                                                                                                                                                                 |
| ticks           | `number`                        | `10`         | Number of ticks the y-axis should use.                                                                                                                                                                     |
| startAtZero     | `boolean`                       | `false`      | Whether or not the scale should always start at zero.                                                                                                                                                      |
