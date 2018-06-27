module.exports = {
    TWO_PI: Math.PI * 2,

    rgba: function (hex, opacity) {
        return hex.replace(')', `,${parseFloat((opacity / 100).toFixed(2))})`);
    }
};