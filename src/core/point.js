class Point {
    constructor(data, graph) {
        this.data = data;
        this.graph = graph;

        if(this.graph === undefined) {
            throw "Point class must be provided with the relevant graph."
        }

        // calculate actual graphical coordinates
        let actual_xSize = graph.x_length / graph.data.maxLen();
        let actual_ySize = data.y  / graph.scale.getTickStep;

        this.x = Math.round(graph.x_begin + (data.x * actual_xSize));
        this.y = Math.round(graph.y_end -  (actual_ySize * graph.squareSize.y));
    }
}

module.exports = {
    Point: Point
};