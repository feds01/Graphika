# Graph Options

Configure the main graph settings including labels, title, grid, scale, and legend.

::: tip Type Reference
For the full type definition, see [`BasicGraphOptions`](/reference/basic.graph).
:::

## Sample

```ts
let graph = new Graph(
    "g",
    {
        title: {
            content: "A new graph!",
        },
        x_label: "X-Axis",
        y_label: "Y-Axis",
        grid: {
            gridded: true,
            sharedAxisZero: true,
        },
        scale: {
            shorthandNumerics: false,
            x: { ticks: 10 },
            y: { startAtZero: true },
        },
        legend: {
            draw: true,
            position: "top",
        },
    },
    [
        /* lines */
    ],
);
```

## Options

| Name        | Type     | Default | Description                               |
| ----------- | -------- | ------- | ----------------------------------------- |
| `x_label`   | `string` | `""`    | Label drawn at the x-axis.                |
| `y_label`   | `string` | `""`    | Label drawn at the y-axis.                |
| `title`     | `object` | -       | Title settings. See [Title Options].      |
| `grid`      | `object` | -       | Grid settings. See [Grid Options].        |
| `scale`     | `object` | -       | Scale settings. See [Scale Options].      |
| `legend`    | `object` | -       | Legend settings. See [Legend Options].    |
| `animation` | `object` | -       | Animation settings for drawing the graph. |

## Customise Specific Parts

- [Title Options](./title-options.md) - Customize graph title appearance
- [Grid Options](./grid-options.md) - Configure grid lines and appearance
- [Line Options](./line-options.md) - Style individual data lines
- [Scale Options](./scale-options.md) - Configure axis scales and ticks
- [Legend Options](./legend-options.md) - Position and style the legend

[Title Options]: ./title-options.md
[Grid Options]: ./grid-options.md
[Scale Options]: ./scale-options.md
[Legend Options]: ./legend-options.md
