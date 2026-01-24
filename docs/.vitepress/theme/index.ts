import { h } from "vue";

import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import GraphDemo from "./components/GraphDemo.vue";
import InteractiveDemo from "./components/InteractiveDemo.vue";
import "./custom.css";

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component("GraphDemo", GraphDemo);
        app.component("InteractiveDemo", InteractiveDemo);
    },
    Layout() {
        return h(DefaultTheme.Layout, null, {
            "home-hero-image": () =>
                h(GraphDemo, {
                    widgets: {
                        codeView: false,
                        debugPanel: false,
                        copy: false,
                    },
                    options: {
                        title: { content: "Traffic", alignment: "center" },
                        grid: { gridded: true },
                        legend: { draw: true, position: "top" },
                        scale: {
                            x: {
                                tickLabels: [
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec",
                                ],
                            },
                        },
                    },
                    lines: [
                        {
                            label: "Visitors",
                            interpolation: "cubic",
                            data: [25, 40, 35, 55, 45, 65, 50, 70, 60, 80],
                            colour: "#009FE5",
                            area: { fill: true },
                        },
                        {
                            label: "Unique Visitors",
                            interpolation: "cubic",
                            data: [15, 28, 22, 38, 30, 45, 35, 50, 42, 58],
                            colour: "#FF6782",
                            area: { fill: true },
                        },
                    ],
                    height: 280,
                    width: 480,
                }),
        });
    },
} satisfies Theme;
