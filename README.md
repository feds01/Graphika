<h1 align='center'>Graphika :chart_with_upwards_trend: :bar_chart: </h1>

![basic chart](./docs/img/front.png)
Lightning fast, robust library to draw graphs and charts in the browser. The current version supports drawing graphs with positive and negative scales. It also enables the user to add custom labels and titles to the graphs. More coming in the future.

## Documentation

Documentation is split into seperate files regarding each sub-system of the drawing library.

- To read about customising grid options go [here](docs/api/grid-options.md)
- To read about customising line options go [here](docs/api/line-options.md)
- To read about customising graph legend options, go [here](docs/api/legend-options.md) (WIP)

## Getiting started

To create a new graph you must import the minified or combined version into the html document by adding this line in the ` <body>` or `<head>` tag. Insert this script tag into the html document:

```html

<script src="js/graphika/dist/graph.min.js">
```

Once you have done this, to create a new graph you must initialise a graph object by providing it a `<div>` element id, where the graph object should insert the given tittle and canvas (if no canvas exists within the element). To this, simply create a new variable and associate a 'new' graph object like so:

```html
<div id="graph">
  <div class="title"></div>
  <canvas width="800" height="600"></canvas>
</div>
```

Add some javascript:

```javascript

// some data, use a function to load it, fetch it, read csv
const dataset = [
  0: [...],
  1: [...]
];

// where `graph` is the given id of the div you wish for the graph to use
let graph = new Graph(
  "graph",
  {
    title: "Graphika!",
    x_label: "X-Axis",
    y_label: "Y-Axis",
  },
  [
    {
      style: "dashed",
      label: "line-1",
      interpolation: "cubic",
      data: dataset[0],
      annotatePoints: false,
      colour: Graph.Colours.FLAMINGO_PINK,
      area: {
        fill: true,
        colour: Graph.Colours.FLAMINGO_PINK,
      },
    },
    {
      label: "line-2",
      interpolation: "cubic",
      data: dataset[1],
      colour: Graph.Colours.ELECTRIC_BLUE,
      annotatePoints: true,
      area: {
        fill: true,
        colour: Graph.Colours.ELECTRIC_BLUE,
      },
    },
  ]
);

graph.draw(); // let's draw the graph
```

Result:
![basic chart](./docs/img/intro.png)

## Examples

Check out examples of graphs in the examples directory
