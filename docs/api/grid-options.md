# Grid Options

Configure the grid appearance and behavior.

::: tip Type Reference
For the full type definition, see [`GridOptions`](/reference/basic.graph).
:::

## Sample

```ts
let graph = new Graph(
    "g",
    {
        grid: {
            gridded: true,
            sharedAxisZero: true,
            gridLineStyle: "solid",
            optimiseSquareSize: true,
            strict: false,
        },
    },
    [
        /* lines */
    ],
);
```

## Options

| Name                 | Type            | Default | Description                                                                     |
| -------------------- | --------------- | ------- | ------------------------------------------------------------------------------- |
| `gridded`            | `boolean`       | `true`  | Whether to draw a grid where data is plotted.                                   |
| `gridLineStyle`      | `solid\|dashed` | `solid` | Style for grid lines.                                                           |
| `optimiseSquareSize` | `boolean`       | `true`  | Round grid square sizes to integers for sharper rendering.                      |
| `sharedAxisZero`     | `boolean`       | `true`  | When both axes start at 0, share the zero point instead of painting two zeroes. |
| `strict`             | `boolean`       | `false` | Enforce grid cells to be as close to squares as possible.                       |
