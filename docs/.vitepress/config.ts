import { defineConfig } from "vitepress";

export default defineConfig({
    title: "Graphika",
    description: "A fast JavaScript library to draw elegant graphs",
    base: "/Graphika/",

    head: [["link", { rel: "icon", href: "/Graphika/favicon.ico" }]],

    themeConfig: {
        logo: "/img/front.png",

        nav: [
            { text: "Home", link: "/" },
            { text: "Guide", link: "/guide/getting-started" },
            { text: "API", link: "/api/graph" },
            { text: "Reference", link: "/reference/" },
        ],

        sidebar: {
            "/guide/": [
                {
                    text: "Introduction",
                    items: [
                        { text: "Getting Started", link: "/guide/getting-started" },
                        { text: "Basic Usage", link: "/guide/basic" },
                    ],
                },
            ],
            "/api/": [
                {
                    text: "API Reference",
                    items: [
                        { text: "Graph", link: "/api/graph" },
                        { text: "Line Options", link: "/api/line-options" },
                        { text: "Grid Options", link: "/api/grid-options" },
                        { text: "Scale Options", link: "/api/scale-options" },
                        { text: "Title Options", link: "/api/title-options" },
                        { text: "Legend Options", link: "/api/legend-options" },
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
