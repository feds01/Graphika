module.exports = {
    /*
    * fills an empty array from 0 to max with integers and then returns the new array.
    * */
    fillRange: function (max) {
        return Array.apply(null, {length: max}).map(Number.call, Number);
    },

    /*
    * Returns the longest string within a given array. It does not return the actual length
    * of the longest item, just the longest item.
    * */
    longest: function (arr) {
        return arr.reduce((a, b) => {
           return a.length > b.length ? a : b;
        });
    }
};