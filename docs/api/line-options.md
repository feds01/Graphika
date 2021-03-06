# Configuring the Graph grid

When creating a new graph, you can customise the look and feel of the datasets that are drawn on 
the graph. 

## Sample

From this sample, it's easy to see how someone could configure the line options for a graph:

```javascript
 let graph = new Graph('g', {
            ... // options
        },
        [
            {
                label: 'student_1',
                data: getRandomArray(11, 0, 20),
                colour: Graph.Colours.FLAMINGO_RED
                ...
            },
            ...
        ]
}

```

## Options

Here's a table of all the options that are provided for lines on line charts, what they mean and what are the defaults:

| Name            | Type            | Default   | Description                                                                                                                                                                                                                         | Required |
|-----------------|-----------------|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| annotatePoints  | `boolean`       | `false`   | A flag that represents whether or not each point that is on a x-axis tick boundary should be annoted with a circle or a specified `annotationShape`.                                                                                | `false`  |
| area.fill       | `boolean`       | `false`   | Whether or not this line should fill the under it (or over it if in the negative range).                                                                                                                                            | `false`  |
| area.colour     | `string`        | `#000000` | A hex colour code representing the colour that the line is covering should be shaded with. If you provide the same area colour and line stroke, the area colour will apply an alpha of `0.6` to visually differentiate the colours. | `false`  |
| colour          | `string`        | `#000000` | A hex colour code representing what colour the line should be stroked.                                                                                                                                                              | `false`  |
| data            | `number[]`      | `[]`      | The data that is represented by this series. If you do not provide this, the graph will not draw this line.                                                                                                                         | `true`   |
| interpolation   | `linear\|cubic` | `linear`  | A string to represent what interpolation mode the line should be using. Linear mode will just use straight lines to join individual data points, whereas cubic will attempt to draw smooth curves between data points.              | `false`  |
| label           | `string`        | `line-0`  | A string representing the data set label. If you do not provide one, the graph will automatically assign incrementing labels. **Note:** Providing multiple lines with the same label will prevent the graph from being drawn.       | `false`  |
| strokeThickness | `number`        | `1`       | A number representing the line thickness of the drawn line. (Not available yet)                                                                                                                                                     | `false`  |
| style           | `dashed\|full`  | `full`    | The style of the line stroke                                                                                                                                                                                                        | `false`  |


