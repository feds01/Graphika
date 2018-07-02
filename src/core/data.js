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

    toPos() {
        for (let entry = 0; entry < this.data.length; entry++) {
            let positions = [];

            for(let i = 0; i < this.data[entry].data.length; i++) {
                positions.push({
                    x: i, y: this.data[entry].data[i]
                });
            }
            this.data[entry].pos_data = positions;
        }
    };
}

module.exports = {
    Data: Data,

    previousEntry: function (index, data) {
        return  index <= 0 ? data[0] : data[index - 1];
    },

    nextEntry: function (index, data) {
        return  index >= data.length - 1 ? data[data.length - 1] : data[index + 1];
    },

    /*
    * Quick function to convert a @see Point() {x,y} to a graph location. * */
    pointToPosition: function (point, graph) {
        let actualSize = parseFloat((point.y / graph.scale.getTickStep).toFixed(2));

        return Object.assign({}, point, {
            x_g: Math.round(graph.x_begin + (point.x * graph.squareSize.x)),
            y_g: Math.round(graph.y_end - (actualSize * graph.squareSize.y))
        });
    }
};