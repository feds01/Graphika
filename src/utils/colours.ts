/**
 * src/utils/colours.ts
 *
 * Module description:
 *
 * This is file module is used for storing the various colours available
 * for making graphs and charts.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

export function rgba(hex: string, opacity: number): string {
    return hex.replace(")", `,${parseFloat((opacity / 100).toFixed(2))})`);
}

export default {
    schemes: {
        s1: ["#7fc97f", "#beaed4", "#fdc086"],
        s2: ["#1b9e77", "#d95f02", "#7570b3"],
        s3: ["#a6cee3", "#1f78b4", "#b2df8a"],
        s4: ["#fbb4ae", "#b3cde3", "#ccebc5"],
        s5: ["#b3e2cd", "#fdcdac", "#cbd5e8"],
        s6: ["#e41a1c", "#377eb8", "#4daf4a"],
        s7: ["#66c2a5", "#fc8d62", "#8da0cb"],
        s8: ["#8dd3c7", "#ffffb3", "#bebada"],
    },

    FLAMINGO_RED: "#FF6782",
    EMERALD_GREEN: "#008816",
    ELECTRIC_BLUE: "#009FE5",
    DEEP_PURPLE: "#3a243b",
    BLACK: "#000000",
    PURPLE: "#800080",
    GREY: "#5e5e5e",

    // probably should be put into separate scope
    DEBUG: "#00b200",
};
