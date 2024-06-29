# Configuring the Graph title

When creating a new graph, you can customise the look and feel of the graph title.

## Sample

From this sample, it's easy to see how someone could configure the grid options for some object:

```ts
 let graph = new Graph('g', {
            title: {
                position: "top",
                content: "A new graph!",
                alignment: "center",
                ...
            },
            ...
        },
        [ ... ]
}

```

## Options

Here's a table of all the options that are provided for title, what they mean and what are the defaults:

| Name      | Type                       | Default       | Description                                                              |
|-----------|----------------------------|---------------|--------------------------------------------------------------------------|
| draw      | `boolean`                  | `true`        | Whether or not to draw a legend for the current graph.                   |
| content   | `string`                   | `"Graph"`     | The content of the title.                                                |
| position  | `top\|right\|bottom\|left` | `top`         | The position of the legend component.                                    |
| alignment | `start\|center\|end`       | `center`      | The alignment of the legend container within the current position space. |
| fontFamily| `string`                   | `"monospace"` | The font family to use for the title.                                    |
| fontSize  | `number`                   | `24`          | The font size to use for the title.                                      |
| colour    | `string`                   | `"black"`     | The colour to use for the title.                                         |
