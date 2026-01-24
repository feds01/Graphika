# Legend

Display a legend to identify multiple data series.

<GraphDemo
    :options="{
        title: { content: 'Multi-Series Comparison', alignment: 'center' },
        x_label: 'Week',
        y_label: 'Value',
        grid: { gridded: true },
        legend: { draw: true, position: 'right', alignment: 'center' }
    }"
    :lines="[
        { label: 'A', interpolation: 'linear', data: [12, 18, 15, 22, 20, 25], colour: '#FF6782' },
        { label: 'B', interpolation: 'linear', data: [10, 15, 12, 18, 16, 20], colour: '#009FE5' },
        { label: 'C', interpolation: 'linear', data: [8, 12, 10, 15, 14, 18], colour: '#008816' },
        { label: 'D', interpolation: 'linear', data: [14, 20, 17, 24, 22, 28], colour: '#800080' },
        { label: 'E', interpolation: 'linear', data: [6, 10, 8, 12, 11, 15], colour: '#FF8C00' },
        { label: 'F', interpolation: 'linear', data: [16, 22, 19, 26, 24, 30], colour: '#4169E1' },
        { label: 'G', interpolation: 'linear', data: [9, 14, 11, 17, 15, 19], colour: '#DC143C' },
        { label: 'H', interpolation: 'linear', data: [11, 16, 13, 19, 17, 22], colour: '#2E8B57' },
        { label: 'I', interpolation: 'linear', data: [7, 11, 9, 13, 12, 16], colour: '#9932CC' },
        { label: 'J', interpolation: 'linear', data: [13, 19, 16, 23, 21, 27], colour: '#20B2AA' }
    ]"
    :height="400"
/>

## Options

| Option      | Type                       | Default  | Description               |
| ----------- | -------------------------- | -------- | ------------------------- |
| `draw`      | `boolean`                  | `false`  | Show/hide the legend      |
| `position`  | `top\|right\|bottom\|left` | `top`    | Legend placement          |
| `alignment` | `start\|center\|end`       | `center` | Alignment within position |

## Position

| Value    | Description               |
| -------- | ------------------------- |
| `top`    | Above the graph (default) |
| `right`  | Right side of graph       |
| `bottom` | Below the graph           |
| `left`   | Left side of graph        |

<GraphDemo
    :options="{
        title: { content: 'Top', alignment: 'center' },
        grid: { gridded: true },
        legend: { draw: true, position: 'top' }
    }"
    :lines="[
        { label: 'A', data: [10, 25, 18, 32, 28, 40], colour: '#FF6782' },
        { label: 'B', data: [8, 20, 15, 28, 22, 35], colour: '#009FE5' }
    ]"
    :height="280"
/>

<GraphDemo
    :options="{
        title: { content: 'Right', alignment: 'center' },
        grid: { gridded: true },
        legend: { draw: true, position: 'right' }
    }"
    :lines="[
        { label: 'A', data: [10, 25, 18, 32, 28, 40], colour: '#FF6782' },
        { label: 'B', data: [8, 20, 15, 28, 22, 35], colour: '#009FE5' }
    ]"
    :height="280"
/>

<GraphDemo
    :options="{
        title: { content: 'Bottom', alignment: 'center' },
        grid: { gridded: true },
        legend: { draw: true, position: 'bottom' }
    }"
    :lines="[
        { label: 'A', data: [10, 25, 18, 32, 28, 40], colour: '#FF6782' },
        { label: 'B', data: [8, 20, 15, 28, 22, 35], colour: '#009FE5' }
    ]"
    :height="280"
/>

## Multi-Series Comparison

Legends are essential for comparing multiple data series:

<GraphDemo
    :options="{
        title: { content: 'Sprint Velocity by Team', alignment: 'center' },
        x_label: 'Sprint',
        y_label: 'Story Points',
        grid: { gridded: true },
        legend: { draw: true, position: 'top' }
    }"
    :lines="[
        { label: 'Frontend', interpolation: 'cubic', data: [21, 25, 28, 24, 30, 32, 28, 35], colour: '#FF6782' },
        { label: 'Backend', interpolation: 'cubic', data: [18, 22, 25, 28, 26, 30, 32, 34], colour: '#009FE5' },
        { label: 'DevOps', interpolation: 'cubic', data: [12, 15, 18, 16, 20, 22, 24, 26], colour: '#008816' },
        { label: 'QA', interpolation: 'cubic', data: [15, 18, 20, 22, 24, 26, 25, 28], colour: '#800080' }
    ]"
/>

::: tip Type Reference
See [`LegendOptions`](/reference/legend/manager#legendoptions) for full TypeScript definitions.
:::
