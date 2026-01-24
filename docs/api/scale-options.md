# Scale

Configure axis ticks, labels, and numeric formatting.

<GraphDemo
    :options="{
        title: { content: 'Custom Axis Labels', alignment: 'center' },
        x_label: 'Month',
        y_label: 'Revenue ($K)',
        grid: { gridded: true },
        scale: {
            x: {
                ticks: 12,
                tickLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                optimiseTicks: true
            }
        }
    }"
    :lines="[
        {
            label: 'Revenue',
            interpolation: 'cubic',
            data: [45, 52, 48, 61, 55, 67, 72, 68, 80, 75, 88, 92],
            colour: '#009FE5',
            area: { fill: true }
        }
    ]"
/>

## Options

### General

| Option              | Type      | Default | Description                    |
| ------------------- | --------- | ------- | ------------------------------ |
| `shorthandNumerics` | `boolean` | `false` | Show `9M` instead of `9000000` |

### Per-Axis (X and Y)

| Option           | Type                            | Default      | Description                      |
| ---------------- | ------------------------------- | ------------ | -------------------------------- |
| `ticks`          | `number`                        | `10`         | Number of tick marks             |
| `tickLabels`     | `string[]`                      | —            | Custom labels (cycles if needed) |
| `drawTicks`      | `boolean`                       | `true`       | Show tick marks                  |
| `drawLabels`     | `boolean`                       | `true`       | Show tick labels                 |
| `labelDirection` | `horizontal\|vertical\|slanted` | `horizontal` | Label orientation                |
| `axisColour`     | `string`                        | `#5e5e5e`    | Axis line color                  |

### Y-Axis Only

| Option        | Type      | Default | Description               |
| ------------- | --------- | ------- | ------------------------- |
| `startAtZero` | `boolean` | `false` | Force scale to start at 0 |

## Custom Labels

Replace numeric labels with text:

```ts
scale: {
    x: {
        ticks: 7,
        tickLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        optimiseTicks: true
    }
}
```

<GraphDemo
    :options="{
        title: { content: 'Weekly Activity', alignment: 'center' },
        x_label: 'Day',
        y_label: 'Tasks',
        grid: { gridded: true },
        scale: {
            x: {
                ticks: 7,
                tickLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                optimiseTicks: true
            }
        }
    }"
    :lines="[
        {
            label: 'Tasks',
            interpolation: 'cubic',
            annotatePoints: true,
            data: [5, 8, 6, 10, 7, 3, 2],
            colour: '#008816'
        }
    ]"
    :height="280"
/>

::: tip Type Reference
See [`AxisOptions`](/reference/core/axis#axisoptions) for full TypeScript definitions.
:::
