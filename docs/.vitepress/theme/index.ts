import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import GraphDemo from "./components/GraphDemo.vue";
import InteractiveDemo from "./components/InteractiveDemo.vue";
import StressTestDemo from "./components/StressTestDemo.vue";
import "./custom.css";

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component("GraphDemo", GraphDemo);
        app.component("InteractiveDemo", InteractiveDemo);
        app.component("StressTestDemo", StressTestDemo);
    },
} satisfies Theme;
