# Lines

Configure the appearance and behaviour of line.

<GraphDemo
    :options="{
        title: { content: 'Line Styles Overview', alignment: 'center' },
        grid: { gridded: true },
        legend: { draw: true, position: 'top' }
    }"
    :lines="[
        {
            label: 'Cubic + Dashed',
            data: [10, 35, 20, 45, 30, 50, 25, 55, 35, 60],
            colour: '#FF6782',
            interpolation: 'cubic',
            style: 'dashed',
            annotatePoints: true
        },
        {
            label: 'Linear + Area',
            data: [5, 25, 15, 35, 25, 40, 20, 45, 30, 50],
            colour: '#009FE5',
            interpolation: 'linear',
            area: { fill: true }
        }
    ]"
/>

## Options

| Option           | Type            | Default   | Description                        |
| ---------------- | --------------- | --------- | ---------------------------------- |
| `data`           | `number[]`      | —         | **Required.** Array of data points |
| `colour`         | `string`        | `#000000` | Hex color for the line             |
| `label`          | `string`        | `line-0`  | Unique label for the series        |
| `interpolation`  | `linear\|cubic` | `linear`  | Line curve style                   |
| `style`          | `solid\|dashed` | `solid`   | Line stroke pattern                |
| `annotatePoints` | `boolean`       | `false`   | Show circles at data points        |
| `area`           | `object`        | —         | Area fill configuration            |

## Interpolation

Choose how points are connected:

| Value    | Description                   |
| -------- | ----------------------------- |
| `linear` | Straight lines between points |
| `cubic`  | Smooth curves through points  |

<GraphDemo
    :options="{
        title: { content: 'Linear vs Cubic', alignment: 'center' },
        grid: { gridded: true },
        legend: { draw: true, position: 'top' }
    }"
    :lines="[
        {
            label: 'Linear',
            interpolation: 'linear',
            data: [20, 80, 30, 70, 40, 90, 25, 60, 50, 85],
            colour: '#3a243b',
            annotatePoints: true
        },
        {
            label: 'Cubic',
            interpolation: 'cubic',
            data: [20, 80, 30, 70, 40, 90, 25, 60, 50, 85],
            colour: '#008816',
            annotatePoints: true
        }
    ]"
/>

## Line Styles

| Value    | Description               |
| -------- | ------------------------- |
| `solid`  | Continuous line (default) |
| `dashed` | Dashed line pattern       |

<GraphDemo
    :options="{
        title: { content: 'Solid vs Dashed', alignment: 'center' },
        grid: { gridded: true },
        legend: { draw: true, position: 'top' }
    }"
    :lines="[
        {
            label: 'Solid',
            style: 'solid',
            interpolation: 'cubic',
            data: [25, 50, 35, 60, 45, 70, 55, 75],
            colour: '#009FE5'
        },
        {
            label: 'Dashed',
            style: 'dashed',
            interpolation: 'cubic',
            data: [20, 42, 30, 52, 38, 62, 48, 68],
            colour: '#FF6782'
        }
    ]"
    :height="280"
/>

## Area Fill

Fill the region under a line:

```ts
{
    area: {
        fill: true;
    }
}
```

<GraphDemo
    :options="{
        title: { content: 'Area Charts', alignment: 'center' },
        grid: { gridded: true },
        legend: { draw: true, position: 'top' }
    }"
    :lines="[
        {
            label: 'Revenue',
            interpolation: 'cubic',
            data: [25, 40, 35, 55, 45, 65, 50, 70, 60, 80],
            colour: '#009FE5',
            area: { fill: true }
        },
        {
            label: 'Costs',
            interpolation: 'cubic',
            data: [15, 28, 22, 38, 30, 45, 35, 50, 42, 58],
            colour: '#FF6782',
            area: { fill: true }
        }
    ]"
/>

::: info
When area color matches line color, 60% opacity is applied automatically.
:::

## Point Annotations

Show markers at each data point with `annotatePoints: true`:

<GraphDemo
    :options="{
        title: { content: 'Data Point Markers', alignment: 'center' },
        grid: { gridded: true }
    }"
    :lines="[
        {
            label: 'Annotated',
            interpolation: 'cubic',
            annotatePoints: true,
            data: [15, 45, 25, 60, 35, 70, 40, 55, 50, 75],
            colour: '#800080'
        }
    ]"
    :height="280"
/>
