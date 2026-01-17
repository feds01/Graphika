# Title Options

Configure the graph title appearance and position.

::: tip Type Reference
For the full type definition, see [`TitleOptions`](/reference/basic.graph).
:::

## Sample

```ts
let graph = new Graph(
    "g",
    {
        title: {
            draw: true,
            content: "My Graph",
            position: "top",
            alignment: "center",
            fontFamily: "monospace",
            fontSize: 24,
            colour: "black",
        },
    },
    [
        /* lines */
    ],
);
```

## Options

| Name         | Type                 | Default       | Description                        |
| ------------ | -------------------- | ------------- | ---------------------------------- |
| `draw`       | `boolean`            | `true`        | Whether to draw the title.         |
| `content`    | `string`             | `"Graph"`     | The title text.                    |
| `position`   | `top`                | `top`         | Position of the title.             |
| `alignment`  | `start\|center\|end` | `center`      | Horizontal alignment of the title. |
| `fontFamily` | `string`             | `"monospace"` | Font family for the title text.    |
| `fontSize`   | `number`             | `24`          | Font size in pixels.               |
| `colour`     | `string`             | `"black"`     | Text colour.                       |
