# Configuring the Graph - adding labels and titles

When creating a new graph, you can customise the graph by adding a title and X-AXIS and Y-AXIS labels.
You can do this my modyfying the settings when creating a new graph object as shown in the sample.

## Sample

From this sample, it's easy to see how someone could configure general options for a graph:

```javascript
 let graph = new Graph('g', {
            title: "A new graph!",
            x_label: "X-Axis",
            y_label: "Y-Axis",
            title_pos: "top-center",
            ...
            }
        },
        [ ... ]
}

```

## Options

Here's a table of all the options that are provided for general options on charts, what they mean and what are the defaults:

| Name      | Type                              | Default      | Description                                                                                      | Required |
|-----------|-----------------------------------|--------------|--------------------------------------------------------------------------------------------------|----------|
| title     | `string`                          | `New Graph`  | The title of the graph.                                                                          | `false`  |
| title_pos | `top-left\|top-center\|top-right` | `top-center` | The alignment and positioning of the graph title                                                 | `false`  |
| x_label   | `string`                          | ``           | The label that is drawn at the x-axis, typically used to describe what the axis is representing. | `false`  |
| y_label   | `string`                          | ``           | The label that is drawn at the y-axis, typically used to describe what the axis is representing. | `false`  |

## Customise specific parts

If you want to customise specific parts of a chart like the grid, or a line, check out the docs:

- To read about customising grid options go [here](docs/api/grid-options.md)
- To read about customising line options go [here](docs/api/line-options.md)
- More documentation is available in the docs folder
