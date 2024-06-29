# Configuring the Graph grid

When creating a new graph, you can customise the look and feel of the grid. The grid customisations are quite rich but aim to not bloat the whole library with meaningless 'features'.

## Sample

From this sample, it's easy to see how someone could configure the grid options for some object:

```ts
 let graph = new Graph('g', {
            ...
            // generic grid options
            grid: {
                gridded: true,
                sharedAxisZero: true
                ...
            },
            ...
        },
        [ ... ]
}

```

## Options

Here's a table of all the options that are provided for grids, what they mean and what are the defaults:

| Name               | Type            | Default | Description                                                                                                              |
| ------------------ | --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| gridded            | `boolean`       | `true`  | Whether or not the graph should draw a grid where the data is drawn.                                                     |
| gridLineStyle      | `solid|dashed`  | `solid` | This is an option to specify whether the grid lines should be drawn using the 'solid' or 'dashed' line style.            |
| optimiseSquareSize | `boolean`       | `true`  | Ensure that the grid square size are rounded to integers. This could impact the sharpness of the drawn grid content.     |
| sharedAxisZero     | `boolean`       | `true`  | If both the X & Y Axis' start at 0, they can share the zero rather than painting two zeroes                              |
| strict             | `boolean`       | `false` | This mode enforces the drawn grid to be as close as possible to using squares as grid cells.                             |
