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

export function findCanvas(id: string): HTMLCanvasElement | undefined {
    const element = document.getElementById(id);
    let canvas = undefined;

    assert(isDef(element), `Graph Container with id: '${id}' doesn't exist.`);

    for (const childNode of element.childNodes) {
        const tagName = childNode.nodeName.toLowerCase();
        if (tagName === "canvas") {
            canvas = childNode as HTMLCanvasElement;
        }
    }

    // DOM modifications
    if (!isUndefOrNull(canvas)) {
        element.style.width = canvas.width.toString() + "px";
    } else {
        throw Error(`Graph Container with id: '${id}' doesn't contain <canvas/> element.`);
    }

    return canvas;
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
