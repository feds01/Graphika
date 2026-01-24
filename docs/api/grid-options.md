# Grid

Control the background grid appearance.

<GraphDemo
    :options="{
        title: { content: 'Grid Styles', alignment: 'center' },
        grid: { gridded: true, gridLineStyle: 'solid' }
    }"
    :lines="[
        {
            label: 'Data',
            interpolation: 'cubic',
            data: [15, 35, 25, 45, 30, 50, 40, 55, 45, 60],
            colour: '#009FE5'
        }
    ]"
/>

## Options

| Option               | Type            | Default | Description                            |
| -------------------- | --------------- | ------- | -------------------------------------- |
| `gridded`            | `boolean`       | `true`  | Show/hide the grid                     |
| `gridLineStyle`      | `solid\|dashed` | `solid` | Grid line pattern                      |
| `sharedAxisZero`     | `boolean`       | `true`  | Share zero label between axes          |
| `optimiseSquareSize` | `boolean`       | `true`  | Round grid sizes for sharper rendering |
| `strict`             | `boolean`       | `false` | Force square grid cells                |

## Line Style

| Value    | Description           |
| -------- | --------------------- |
| `solid`  | Continuous lines      |
| `dashed` | Dotted/dashed pattern |

<GraphDemo
    :options="{
        title: { content: 'Solid Grid', alignment: 'center' },
        grid: { gridded: true, gridLineStyle: 'solid' }
    }"
    :lines="[
        { label: 'Data', interpolation: 'cubic', data: [20, 45, 30, 55, 40, 60, 35, 50], colour: '#3a243b' }
    ]"
    :height="260"
/>

<GraphDemo
    :options="{
        title: { content: 'Dashed Grid', alignment: 'center' },
        grid: { gridded: true, gridLineStyle: 'dashed' }
    }"
    :lines="[
        { label: 'Data', interpolation: 'cubic', data: [20, 45, 30, 55, 40, 60, 35, 50], colour: '#3a243b' }
    ]"
    :height="260"
/>

## No Grid

Set `gridded: false` for a minimal look:

<GraphDemo
    :options="{
        title: { content: 'No Grid', alignment: 'center' },
        grid: { gridded: false }
    }"
    :lines="[
        { label: 'Data', interpolation: 'cubic', data: [20, 45, 30, 55, 40, 60, 35, 50], colour: '#008816' }
    ]"
    :height="260"
/>

## Shared Axis Zero

When enabled (default), the origin "0" is shared between X and Y axes:

```ts
grid: {
    sharedAxisZero: true; // Prevents duplicate "0" labels
}
```

::: tip Type Reference
See [`GridOptions`](/reference/basic.graph) for full TypeScript definitions.
:::
