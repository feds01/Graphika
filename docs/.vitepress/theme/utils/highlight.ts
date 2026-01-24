import { codeToHtml } from "shiki";

/**
 * Highlights TypeScript/JavaScript code using Shiki.
 * Uses CSS variables to match VitePress's active theme.
 */
export async function highlightCode(code: string): Promise<string> {
    return await codeToHtml(code, {
        lang: "typescript",
        themes: {
            light: "github-light",
            dark: "github-dark",
        },
        defaultColor: false,
    });
}
