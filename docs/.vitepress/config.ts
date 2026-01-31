import { defineConfig } from "vitepress";

export default defineConfig({
    title: "Graphika",
    description: "A fast JavaScript library to draw elegant graphs",
    base: "/Graphika/",

    vite: {
        resolve: {
            alias: {
                // Relative path from docs/.vitepress/ to src/
                "@feds01/graphika": "../../src/index.ts",
            },
        },
    },

    head: [["link", { rel: "icon", href: "/Graphika/favicon.ico" }]],

    themeConfig: {
        logo: "/img/logo.svg",

        nav: [
            { text: "Home", link: "/" },
            { text: "Docs", link: "/guide/getting-started" },
            { text: "Playground", link: "/guide/playground" },
            { text: "Reference", link: "/reference/" },
        ],

        sidebar: {
            "/guide/": [
                {
                    text: "Getting Started",
                    items: [
                        { text: "Installation", link: "/guide/getting-started" },
                        { text: "Examples", link: "/guide/basic" },
                        { text: "Playground", link: "/guide/playground" },
                    ],
                },
                {
                    text: "Graph Types",
                    items: [{ text: "Line Graphs", link: "/api/line-options" }],
                },
                {
                    text: "Configuration",
                    items: [
                        { text: "Graph", link: "/api/graph" },
                        { text: "Lines", link: "/api/line-options" },
                        { text: "Grid", link: "/api/grid-options" },
                        { text: "Scale", link: "/api/scale-options" },
                        { text: "Title", link: "/api/title-options" },
                        { text: "Legend", link: "/api/legend-options" },
                        { text: "Tooltip", link: "/api/tooltip-options" },
                    ],
                },
            ],
            "/api/": [
                {
                    text: "Getting Started",
                    items: [
                        { text: "Installation", link: "/guide/getting-started" },
                        { text: "Examples", link: "/guide/basic" },
                        { text: "Playground", link: "/guide/playground" },
                    ],
                },
                {
                    text: "Graph Types",
                    items: [{ text: "Line Graphs", link: "/api/line-options" }],
                },
                {
                    text: "Configuration",
                    items: [
                        { text: "Graph", link: "/api/graph" },
                        { text: "Lines", link: "/api/line-options" },
                        { text: "Grid", link: "/api/grid-options" },
                        { text: "Scale", link: "/api/scale-options" },
                        { text: "Title", link: "/api/title-options" },
                        { text: "Legend", link: "/api/legend-options" },
                        { text: "Tooltip", link: "/api/tooltip-options" },
                    ],
                },
            ],
            "/reference/": [
                {
                    text: "Type Reference",
                    items: [
                        { text: "Overview", link: "/reference/" },
                        { text: "Graph", link: "/reference/basic.graph" },
                        { text: "Config", link: "/reference/config" },
                    ],
                },
                {
                    text: "Core",
                    items: [
                        { text: "Line", link: "/reference/core/line" },
                        { text: "Axis", link: "/reference/core/axis" },
                        { text: "Scale", link: "/reference/core/scale" },
                        { text: "Animation", link: "/reference/core/animation" },
                        { text: "Interpolation", link: "/reference/core/interpolation" },
                    ],
                },
                {
                    text: "Legend",
                    items: [{ text: "Manager", link: "/reference/legend/manager" }],
                },
                {
                    text: "Utilities",
                    items: [
                        { text: "Colours", link: "/reference/utils/colours" },
                        { text: "Arrays", link: "/reference/utils/arrays" },
                    ],
                },
            ],
        },

        socialLinks: [{ icon: "github", link: "https://github.com/feds01/Graphika" }],

        footer: {
            message: "Released under the ISC License.",
            copyright: "Copyright Alexander Fedotov",
        },

        search: {
            provider: "local",
        },
    },
});
