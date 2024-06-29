# Configuring the Graph - adding labels and titles

When creating a new graph, you can customise the graph by adding a title and X-AXIS and Y-AXIS labels.
You can do this my modyfying the settings when creating a new graph object as shown in the sample.

## Sample

From this sample, it's easy to see how someone could configure general options for a graph:

```ts
 let graph = new Graph('g', {
            title: {
                content: "A new graph!",
            },
            x_label: "X-Axis",
            y_label: "Y-Axis",
            ... // scale, grid, title, legend options...
            }
        },
        [ ... ]  // lines
}
```

## Options

Here's a table of all the options that are provided for general options on charts, what they mean and what are the defaults:

| Name      | Type                              | Default      | Description                                                                                      | Required |
|-----------|-----------------------------------|--------------|--------------------------------------------------------------------------------------------------|----------|
| title     | `object`                          | ``  | The title settings of the graph.                                                                          | `false`  |
| x_label   | `string`                          | ``           | The label that is drawn at the x-axis, typically used to describe what the axis is representing. | `false`  |
| y_label   | `string`                          | ``           | The label that is drawn at the y-axis, typically used to describe what the axis is representing. | `false`  |

## Customise specific parts

If you want to customise specific parts of a chart like the grid, or a line, check out the docs:

- Read about customising title options go [here](title-options.md).
- Read about customising grid options go [here](grid-options.md).
- Read about customising line options go [here](line-options.md).
- Read about customising scale options go [here](scale-options.md).
- Read about customising legend options go [here](legend-options.md).
