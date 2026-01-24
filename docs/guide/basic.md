# Basic Graphs

This guide covers the core features of Graphika with interactive examples.

## Your First Graph

Create a simple graph with two data series:

<GraphDemo
    :options="{
        x_label: 'X-Label',
        y_label: 'Y-Label',
        title: {
            content: 'Simple Graph',
            alignment: 'center'
        },
        grid: {
            gridded: true,
            sharedAxisZero: true
        }
    }"
    :lines="[
        {
            style: 'dashed',
            label: 'Student 1',
            interpolation: 'cubic',
            data: [5, 12, 8, 15, 10, 18, 7, 14, 9, 16, 11],
            colour: '#FF6782'
        },
        {
            label: 'Student 2',
            interpolation: 'cubic',
            data: [20, 45, 30, 60, 40, 75, 35, 55, 50, 80, 65],
            colour: '#009FE5'
        }
    ]"
/>

## Line Styles

Graphika supports two line styles: `solid` (default) and `dashed`.

<GraphDemo
    :options="{
        title: { content: 'Line Styles Comparison', alignment: 'center' },
        x_label: 'Time',
        y_label: 'Value',
        grid: { gridded: true }
    }"
    :lines="[
        {
            label: 'Solid Line',
            style: 'solid',
            data: [10, 25, 15, 30, 20, 35, 25, 40, 30, 45],
            colour: '#009FE5'
        },
        {
            label: 'Dashed Line',
            style: 'dashed',
            data: [5, 20, 10, 25, 15, 30, 20, 35, 25, 40],
            colour: '#FF6782'
        }
    ]"
/>

## Interpolation Modes

Choose between `linear` (straight lines) and `cubic` (smooth curves):

<GraphDemo
    :options="{
        title: { content: 'Linear vs Cubic Interpolation', alignment: 'center' },
        x_label: 'X',
        y_label: 'Y',
        grid: { gridded: true }
    }"
    :lines="[
        {
            label: 'Linear',
            interpolation: 'linear',
            data: [10, 45, 20, 55, 30, 40, 50, 25, 60, 35],
            colour: '#3a243b'
        },
        {
            label: 'Cubic',
            interpolation: 'cubic',
            data: [10, 45, 20, 55, 30, 40, 50, 25, 60, 35],
            colour: '#008816'
        }
    ]"
/>

## Point Annotations

Enable `annotatePoints` to draw circles at each data point:

<GraphDemo
    :options="{
        title: { content: 'Annotated Data Points', alignment: 'center' },
        x_label: 'Month',
        y_label: 'Sales',
        grid: { gridded: true }
    }"
    :lines="[
        {
            label: 'Sales',
            interpolation: 'cubic',
            annotatePoints: true,
            data: [120, 150, 180, 140, 200, 220, 190, 240, 210, 260],
            colour: '#800080'
        }
    ]"
/>

## Area Fills

Fill the area under a line using the `area` option:

<GraphDemo
    :options="{
        title: { content: 'Area Chart', alignment: 'center' },
        x_label: 'Quarter',
        y_label: 'Revenue ($K)',
        grid: { gridded: true }
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

### Multiple Area Fills

Combine multiple area fills to compare datasets:

<GraphDemo
    :options="{
        title: { content: 'Revenue Comparison', alignment: 'center' },
        x_label: 'Month',
        y_label: 'Revenue',
        grid: { gridded: true },
        legend: { draw: true, position: 'top' }
    }"
    :lines="[
        {
            label: 'Product A',
            interpolation: 'cubic',
            data: [30, 45, 35, 50, 42, 55, 48, 60, 52, 65],
            colour: '#FF6782',
            area: { fill: true }
        },
        {
            label: 'Product B',
            interpolation: 'cubic',
            data: [20, 35, 28, 40, 35, 48, 40, 52, 45, 58],
            colour: '#009FE5',
            area: { fill: true }
        }
    ]"
/>

## Negative Scale Support

The library handles datasets with negative numbers:

<GraphDemo
    :options="{
        title: { content: 'Profit & Loss', alignment: 'center' },
        x_label: 'Month',
        y_label: 'P&L ($K)',
        grid: { gridded: true }
    }"
    :lines="[
        {
            label: 'P&L',
            interpolation: 'cubic',
            annotatePoints: true,
            data: [-10, 5, -8, 12, -3, 15, -5, 8, -12, 10, 2, 18],
            colour: '#008816'
        }
    ]"
/>

## Legends

Display a legend to identify multiple data series:

<GraphDemo
    :options="{
        title: { content: 'Monthly Performance', alignment: 'center' },
        x_label: 'Week',
        y_label: 'Score',
        grid: { gridded: true },
        legend: {
            draw: true,
            position: 'top',
            alignment: 'center'
        }
    }"
    :lines="[
        {
            label: 'Team Alpha',
            interpolation: 'cubic',
            data: [72, 78, 75, 82, 80, 85, 83, 88, 86, 90],
            colour: '#FF6782'
        },
        {
            label: 'Team Beta',
            interpolation: 'cubic',
            data: [65, 70, 68, 75, 72, 78, 76, 82, 80, 85],
            colour: '#009FE5'
        },
        {
            label: 'Team Gamma',
            interpolation: 'cubic',
            data: [58, 62, 60, 68, 65, 72, 70, 76, 74, 80],
            colour: '#800080'
        }
    ]"
/>

## Grid Styles

Customize the grid appearance with `gridLineStyle`:

<GraphDemo
    :options="{
        title: { content: 'Dashed Grid Lines', alignment: 'center' },
        x_label: 'X',
        y_label: 'Y',
        grid: {
            gridded: true,
            gridLineStyle: 'dashed'
        }
    }"
    :lines="[
        {
            label: 'Data',
            interpolation: 'cubic',
            data: [15, 28, 22, 35, 30, 42, 38, 50, 45, 55],
            colour: '#3a243b'
        }
    ]"
/>

## Custom Axis Labels

Use `tickLabels` to display custom labels on the X-axis:

<GraphDemo
    :options="{
        title: { content: 'Monthly Sales Report', alignment: 'center' },
        x_label: 'Month',
        y_label: 'Units Sold',
        grid: { gridded: true },
        scale: {
            x: {
                ticks: 12,
                tickLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            }
        }
    }"
    :lines="[
        {
            label: 'Sales',
            interpolation: 'cubic',
            data: [150, 180, 200, 175, 220, 250, 230, 260, 240, 280, 300, 320],
            colour: '#009FE5'
        }
    ]"
/>

## Complete Example

Combining multiple features for a polished visualization:

<GraphDemo
    :options="{
        title: { content: 'Quarterly Performance Review', alignment: 'center' },
        x_label: 'Quarter',
        y_label: 'Performance Score',
        grid: {
            gridded: true,
            sharedAxisZero: true
        },
        scale: {
            x: {
                ticks: 8,
                tickLabels: ['Q1 23', 'Q2 23', 'Q3 23', 'Q4 23', 'Q1 24', 'Q2 24', 'Q3 24', 'Q4 24'],
            }
        },
        legend: {
            draw: true,
            position: 'top',
            alignment: 'center'
        }
    }"
    :lines="[
        {
            label: 'Actual',
            interpolation: 'cubic',
            annotatePoints: true,
            data: [72, 78, 82, 85, 83, 88, 92, 95],
            colour: '#008816',
            area: { fill: true }
        },
        {
            label: 'Target',
            style: 'dashed',
            interpolation: 'linear',
            data: [75, 78, 81, 84, 87, 90, 93, 96],
            colour: '#FF6782'
        }
    ]"
    :height="400"
/>

## Stress Test

Testing performance with 10,000 data points. Click the **Debug** button to see render metrics:

<StressTestDemo :dataPoints="10000" />
