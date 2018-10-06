class Data {
    constructor(data) {
        this.data = data;
    }

    get() {
        return this.data;
    }

    join() {
        return [].concat.apply([], this.data.map(x => x.data))
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
            this.data[entry].pos_data  = [];

            for(let idx = 0; idx < this.data[entry].data.length; idx++) {
                this.data[entry].pos_data.push({
                    x: idx,
                    y: this.data[entry].data[idx]
                });
            }
        }
    };
}

module.exports = {
    Data : Data
};