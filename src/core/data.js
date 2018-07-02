class Data {
    constructor(data) {
        this.data = data;
    }

    get() {
        return this.data;
    }

    lengths() {
        return this.data.map(x => x.data.length);
    };

    maxLen() {
        return Math.max(...this.data.map(x => x.data.length));
    };

    minLen() {
        return Math.min(...this.data.map(x => x.data.length));
    };

    max() {
        return Math.max(...[].concat.apply([], this.data.map(x => x.data)));
    };

    min() {
        return Math.min(...[].concat.apply([], this.data.map(x => x.data)));
    };

    colourList() {
        return this.data.map(x => x.colour);
    };

    toPos(graph) {
        for (let entry of this.data) {
            entry.pos_data = Data.convertDataToPositions(entry.data, graph);
        }
    };

    static convertDataToPositions (data, graph) {
        let positions = [],
            actualSize = 0;

        for (let i = 0; i < data.length; i++) {
            if (data !== 0) {
                actualSize = (data[i] / graph.scale.getTickStep).toFixed(2);
            }

            positions.push({
                x: Math.round(graph.x_begin + (i * graph.squareSize.x)),
                y: Math.round(graph.y_end - (actualSize * graph.squareSize.y))
            });
        }
        return positions;
    };
}

module.exports = Data;