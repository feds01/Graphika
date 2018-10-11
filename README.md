# graph.js

A fast and robust library to draw graphs and charts in the browser. The current version supports drawing graphs with positive and negative scales. It also enables the user to add custom labels and tittles to the graphs.

## Getiting started 

To create a new graph you must import the minified or combined version into the html document by adding this line in the `` <body>`` or ``<head>`` tag. Insert this script tag into the html document:
``` html

<script src="js/graph-js/dist/graph.min.js">
```
Once you have done this, to create a new graph you must initialise a graph object by providing it a ``<div>`` element id, where the graph object should insert the given tittle and canvas (if no canvas exists within the element). To this, simply create a new variable and associate a 'new' graph object like so:
```javascript

// where elementId is the given id of the div you wish for the graph to use

let graphObject = new Graph("elementId", {
  tittle: "A new graph!",
  x_label: "X-Axis",
  y_label: "Y-Axis"
});

// let's draw the graph
graphObject.draw();
```
