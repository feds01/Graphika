# Tooltip

Display interactive tooltips when hovering over the graph to show precise data values at any point.

<GraphDemo
    :options="{
        title: { content: 'Hover to see values', alignment: 'center' },
        x_label: 'Time',
        y_label: 'Value',
        grid: { gridded: true },
        legend: { draw: true, position: 'top' },
        tooltip: { enabled: true }
    }"
    :lines="[
        { label: 'Revenue', interpolation: 'cubic', data: [12, 18, 15, 22, 20, 25, 28, 24], colour: '#FF6782' },
        { label: 'Costs', interpolation: 'cubic', data: [8, 12, 10, 15, 14, 18, 20, 17], colour: '#009FE5' }
    ]"
    :height="350"
/>

## Basic Usage

Enable tooltips by setting `tooltip.enabled` to `true`:

```typescript
const graph = new Graph.Graph(
    "container",
    {
        tooltip: {
            enabled: true,
        },
    },
    lines,
);
```

## Options

| Option         | Type                          | Default     | Description                                    |
| -------------- | ----------------------------- | ----------- | ---------------------------------------------- |
| `enabled`      | `boolean`                     | `false`     | Enable/disable tooltip feature                 |
| `mode`         | `"interpolated" \| "nearest"` | `"nearest"` | How Y values are determined at cursor position |
| `trackingLine` | `TrackingLineOptions`         | See below   | Vertical line that follows the cursor          |
| `content`      | `TooltipContentOptions`       | See below   | Tooltip box appearance                         |
| `indicators`   | `TooltipIndicatorOptions`     | See below   | Dots shown on lines at intersection            |
| `format`       | `TooltipFormatOptions`        | See below   | Value formatting                               |

## Mode

The `mode` option determines how Y values are calculated when hovering:

| Value          | Description                                      |
| -------------- | ------------------------------------------------ |
| `nearest`      | Snaps to the nearest actual data point (default) |
| `interpolated` | Smoothly interpolates between data points        |

### Nearest Mode (Default)

Snaps to actual data points with a smooth animation:

<GraphDemo
    :options="{
        title: { content: 'Nearest Mode', alignment: 'center' },
        grid: { gridded: true },
        tooltip: { enabled: true, mode: 'nearest' }
    }"
    :lines="[
        { label: 'Data', interpolation: 'linear', data: [10, 25, 18, 32, 28, 40], colour: '#FF6782', annotatePoints: true }
    ]"
    :height="280"
/>

### Interpolated Mode

Shows values at any position along the line:

<GraphDemo
    :options="{
        title: { content: 'Interpolated Mode', alignment: 'center' },
        grid: { gridded: true },
        tooltip: { enabled: true, mode: 'interpolated' }
    }"
    :lines="[
        { label: 'Data', interpolation: 'linear', data: [10, 25, 18, 32, 28, 40], colour: '#009FE5' }
    ]"
    :height="280"
/>

## Tracking Line Options

Configure the vertical line that follows the cursor:

| Option   | Type                  | Default                | Description             |
| -------- | --------------------- | ---------------------- | ----------------------- |
| `show`   | `boolean`             | `true`                 | Show/hide tracking line |
| `colour` | `string`              | `"rgba(0, 0, 0, 0.5)"` | Line color              |
| `width`  | `number`              | `1`                    | Line width in pixels    |
| `style`  | `"solid" \| "dashed"` | `"solid"`              | Line style              |

### Dashed Tracking Line

<GraphDemo
    :options="{
        title: { content: 'Dashed Tracking Line', alignment: 'center' },
        grid: { gridded: true },
        tooltip: {
            enabled: true,
            trackingLine: { style: 'dashed', colour: 'rgba(0, 100, 200, 0.6)' }
        }
    }"
    :lines="[
        { label: 'Series A', data: [15, 28, 22, 35, 30, 42], colour: '#FF6782' },
        { label: 'Series B', data: [10, 20, 18, 28, 25, 35], colour: '#009FE5' }
    ]"
    :height="280"
/>

## Content Options

Configure the tooltip box appearance:

| Option            | Type      | Default                       | Description             |
| ----------------- | --------- | ----------------------------- | ----------------------- |
| `show`            | `boolean` | `true`                        | Show/hide tooltip box   |
| `backgroundColor` | `string`  | `"rgba(255, 255, 255, 0.95)"` | Background color        |
| `textColour`      | `string`  | `"#333"`                      | Text color              |
| `fontSize`        | `number`  | `12`                          | Font size in pixels     |
| `padding`         | `number`  | `8`                           | Inner padding in pixels |
| `borderRadius`    | `number`  | `4`                           | Corner radius in pixels |

## Indicator Options

Configure the dots shown on lines at the cursor position:

| Option   | Type      | Default | Description              |
| -------- | --------- | ------- | ------------------------ |
| `show`   | `boolean` | `true`  | Show/hide indicator dots |
| `radius` | `number`  | `4`     | Dot radius in pixels     |

### Hidden Indicators

<GraphDemo
    :options="{
        title: { content: 'No Indicator Dots', alignment: 'center' },
        grid: { gridded: true },
        tooltip: {
            enabled: true,
            indicators: { show: false }
        }
    }"
    :lines="[
        { label: 'Series A', data: [15, 28, 22, 35, 30, 42], colour: '#FF6782' },
        { label: 'Series B', data: [10, 20, 18, 28, 25, 35], colour: '#009FE5' }
    ]"
    :height="280"
/>

## Format Options

Customize how values are displayed in the tooltip:

| Option   | Type                                       | Default                                       | Description            |
| -------- | ------------------------------------------ | --------------------------------------------- | ---------------------- |
| `yValue` | `(value: number, label: string) => string` | `(y, label) => \`${label}: ${y.toFixed(2)}\`` | Custom value formatter |

### Custom Formatting

```typescript
const graph = new Graph.Graph(
    "container",
    {
        tooltip: {
            enabled: true,
            format: {
                yValue: (value, label) => `${label}: $${value.toLocaleString()}`,
            },
        },
    },
    lines,
);
```

## Complete Example

<GraphDemo
    :options="{
        title: { content: 'Sales Performance', alignment: 'center' },
        x_label: 'Quarter',
        y_label: 'Revenue ($K)',
        grid: { gridded: true },
        legend: { draw: true, position: 'top' },
        tooltip: {
            enabled: true,
            mode: 'nearest',
            trackingLine: { style: 'dashed', colour: 'rgba(100, 100, 100, 0.5)' },
            indicators: { radius: 5 }
        }
    }"
    :lines="[
        { label: 'Product A', interpolation: 'cubic', data: [120, 145, 132, 168, 155, 182, 175, 195], colour: '#FF6782' },
        { label: 'Product B', interpolation: 'cubic', data: [80, 95, 88, 110, 102, 125, 118, 135], colour: '#009FE5' },
        { label: 'Product C', interpolation: 'cubic', data: [45, 58, 52, 72, 65, 85, 78, 92], colour: '#008816' }
    ]"
    :height="380"
/>

## TypeScript Types

```typescript
type TooltipOptions = {
    enabled?: boolean;
    mode?: "interpolated" | "nearest";
    trackingLine?: {
        show?: boolean;
        colour?: string;
        width?: number;
        style?: "solid" | "dashed";
    };
    content?: {
        show?: boolean;
        backgroundColor?: string;
        textColour?: string;
        fontSize?: number;
        padding?: number;
        borderRadius?: number;
    };
    indicators?: {
        show?: boolean;
        radius?: number;
    };
    format?: {
        yValue?: (value: number, label: string) => string;
    };
};
```

::: tip
Tooltips work best with the `legend` enabled so users can identify which series each value belongs to.
:::
