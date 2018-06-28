const TWO_PI = Math.PI * 2;


module.exports = {
    circle: function(ctx, x, y, rad) {
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, TWO_PI);
        ctx.fill();
    },

    horizontalLine: function (ctx, x, y, len) {
        ctx.strokeRect(x, y, len, 1);

    },

    verticalLine: function (ctx, x, y, len) {
        ctx.strokeRect(x, y, 1, len);
    }
};