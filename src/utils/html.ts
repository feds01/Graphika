/**
 * src/utils/html.ts
 *
 * Module description:
 *
 * Various DOM helpers.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import { assert } from "./assert";
import { isDef, isUndefOrNull } from "./object";

interface Config {
    title_pos: string;
    title: string;
}

type Elements = {
    canvas: HTMLCanvasElement | undefined;
    title: HTMLElement | undefined;
};

export function findObjectElements(id: string, options: Config): Elements {
    const element = document.getElementById(id);
    const elementMap: Elements = {
        canvas: undefined,
        title: undefined,
    };

    assert(isDef(element), `Graph Container with id: '${id}' doesn't exist.`);

    for (const childNode of element.childNodes) {
        const tagName = childNode.nodeName.toLowerCase();
        if (tagName === "canvas") {
            elementMap.canvas = childNode as HTMLCanvasElement;
        } else if (tagName === "div") {
            const div = childNode as HTMLDivElement;

            if (div.classList.contains("title")) {
                elementMap.title = div;
            }
        }
    }

    // DOM modifications
    if (!isUndefOrNull(elementMap.canvas)) {
        element.style.width = elementMap.canvas.width.toString() + "px";
    } else {
        throw Error(`Graph Container with id: '${id}' doesn't contain <canvas/> element.`);
    }

    if (!isUndefOrNull(elementMap.title)) {
        switch (options.title_pos) {
            case "top-left":
                elementMap.title.style.textAlign = "left";
                break;
            case "top-center":
                elementMap.title.style.textAlign = "center";
                break;
            case "top-right":
                elementMap.title.style.textAlign = "right";
        }
        elementMap.title.innerHTML = options.title;
    } else {
        throw Error(`Graph Container with id: '${id}' doesn't contain 'title' element.`);
    }

    return elementMap;
}

export function setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx = canvas.getContext("2d");
    assert(isDef(ctx), "Canvas 2D context is null or undefined.");

    // Get the device pixel ratio
    const scale = window.devicePixelRatio || 1;

    // Give the canvas pixel dimensions of their CSS and set canvas dimensions to
    // size * the device pixel ratio.
    const height = canvas.height;
    const width = canvas.width;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(scale, scale);
    return ctx;
}
