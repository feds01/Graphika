# Configuring the Graph grid

When creating a new graph, you can customise the look and feel of the scales that are drawn on 
the graph. 

## Sample

From this sample, it's easy to see how someone could configure the scale options for a graph:

```javascript
 let graph = new Graph('g', {
            ...
            scale: {
                shorthandNumerics: false,
                x: {...}, // Not Implemented yet
                y: {...}  // Not Implemented yet
            }
        },
        [ ... ]
}

```

## Options

Here's a table of all the options that are provided for scales on charts, what they mean and what are the defaults:

**Note**: More options are coming soon, including custom labels for scales.

| Name              | Type      | Default | Description                                                                                                                                                                                 | Required |
|-------------------|-----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| shorthandNumerics | `boolean` | `false` | Whether to use short hand numerics when encountering data sets with large numbers. For example when using short hand numerics, rather than showing `9000000` the graph will just show `9M`. | `false`  |





