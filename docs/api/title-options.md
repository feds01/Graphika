# Title

Configure the graph title text and alignment.

<GraphDemo
    :options="{
        title: { content: 'Sales Dashboard', alignment: 'center' },
        x_label: 'Month',
        y_label: 'Revenue',
        grid: { gridded: true },
        scale: {
            x: {
                ticks: 10,
                tickLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                optimiseTicks: true
            }
        }
    }"
    :lines="[
        {
            label: 'Revenue',
            interpolation: 'cubic',
            data: [15, 35, 25, 45, 30, 50, 40, 55, 45, 60],
            colour: '#009FE5',
            area: { fill: true }
        }
    ]"
/>

## Options

| Option       | Type                 | Default       | Description          |
| ------------ | -------------------- | ------------- | -------------------- |
| `draw`       | `boolean`            | `true`        | Show/hide the title  |
| `content`    | `string`             | `"Graph"`     | Title text           |
| `alignment`  | `start\|center\|end` | `center`      | Horizontal alignment |
| `fontFamily` | `string`             | `"monospace"` | Font family          |
| `fontSize`   | `number`             | `24`          | Font size in pixels  |
| `colour`     | `string`             | `"black"`     | Text color           |

## Alignment

| Value    | Description   |
| -------- | ------------- |
| `start`  | Left-aligned  |
| `center` | Centered      |
| `end`    | Right-aligned |

<GraphDemo
    :options="{
        title: { content: 'Left Aligned', alignment: 'start' },
        grid: { gridded: true }
    }"
    :lines="[
        { label: 'Data', interpolation: 'cubic', data: [20, 40, 30, 50, 35, 55, 45, 60], colour: '#3a243b' }
    ]"
    :height="260"
/>

<GraphDemo
    :options="{
        title: { content: 'Center Aligned', alignment: 'center' },
        grid: { gridded: true }
    }"
    :lines="[
        { label: 'Data', interpolation: 'cubic', data: [20, 40, 30, 50, 35, 55, 45, 60], colour: '#009FE5' }
    ]"
    :height="260"
/>

<GraphDemo
    :options="{
        title: { content: 'Right Aligned', alignment: 'end' },
        grid: { gridded: true }
    }"
    :lines="[
        { label: 'Data', interpolation: 'cubic', data: [20, 40, 30, 50, 35, 55, 45, 60], colour: '#008816' }
    ]"
    :height="260"
/>

## No Title

Hide the title with `draw: false`:

<GraphDemo
    :options="{
        title: { draw: false },
        x_label: 'X-Axis',
        y_label: 'Y-Axis',
        grid: { gridded: true }
    }"
    :lines="[
        { label: 'Data', interpolation: 'cubic', data: [25, 45, 35, 55, 40, 60, 50, 65], colour: '#800080' }
    ]"
    :height="280"
/>

::: tip Type Reference
See [`TitleOptions`](/reference/basic.graph) for full TypeScript definitions.
:::
