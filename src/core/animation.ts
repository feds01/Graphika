/**
 * Defines various easing functions for animations.
 */

/** Interface representing an easing function for animations. */
export interface EasingAnimationFn {
    (t: number): number;
}

/** Linear easing function that returns the input value as is, resulting in a constant speed animation. */
export function linearEasing(t: number): number {
    return t;
}

/** Ease-in quadratic easing function that starts slowly and accelerates towards the end. */
export function easeInQuad(t: number): number {
    return t * t;
}

/** Ease-out quadratic easing function that starts quickly and decelerates towards the end. */
export function easeOutQuad(t: number): number {
    return 1 - (1 - t) * (1 - t);
}

/** Ease-in-out quadratic easing function that starts and ends slowly, with a faster middle phase. */
export function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Ease-in cubic easing function that starts slowly and accelerates towards the end. */
export function easeInCubic(t: number): number {
    return t * t * t;
}

/** Ease-out cubic easing function that starts quickly and decelerates towards the end. */
export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

/** Ease-in-out cubic easing function that starts and ends slowly, with a faster middle phase. */
export function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Ease-out bounce easing function that simulates a bouncing effect at the end of the animation. */
export function easeOutBounce(t: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
}

/** Elastic easing function that creates an oscillating effect, simulating a spring-like motion. */
export function easeOutElastic(t: number): number {
    const c4 = (2 * Math.PI) / 3;

    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

export function easeInSine(t: number): number {
    return 1 - Math.cos((t * Math.PI) / 2);
}

export function easeOutSine(t: number): number {
    return Math.sin((t * Math.PI) / 2);
}

export function easeInOutSine(t: number): number {
    return -(Math.cos(Math.PI * t) - 1) / 2;
}


/** A 2D point for bezier calculations. */
export type Vec2 = { x: number; y: number };


/** Control points for drawing a partial quadratic bezier curve. */
type PartialQuadratic = {
    p0: Vec2;
    cp: Vec2;
    p1: Vec2;
};

/** Control points for drawing a partial cubic bezier curve. */
type PartialCubic = {
    p0: Vec2;
    cp1: Vec2;
    cp2: Vec2;
    p1: Vec2;
};

/** Linear interpolation between two points. */
export function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
    return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
    };
}

/**
 * Splits a quadratic bezier curve at parameter t and returns the first portion.
 * Uses de Casteljau's algorithm.
 */
export function splitQuadraticAt(p0: Vec2, cp: Vec2, p1: Vec2, t: number): PartialQuadratic {
    const q0 = lerp(p0, cp, t);
    const q1 = lerp(cp, p1, t);
    const endpoint = lerp(q0, q1, t);

    return {
        p0: p0,
        cp: q0,
        p1: endpoint,
    };
}

/**
 * Splits a cubic bezier curve at parameter t and returns the first portion.
 * Uses de Casteljau's algorithm.
 */
export function splitCubicAt(p0: Vec2, cp1: Vec2, cp2: Vec2, p1: Vec2, t: number): PartialCubic {
    const q0 = lerp(p0, cp1, t);
    const q1 = lerp(cp1, cp2, t);
    const q2 = lerp(cp2, p1, t);

    const r0 = lerp(q0, q1, t);
    const r1 = lerp(q1, q2, t);

    const endpoint = lerp(r0, r1, t);

    return {
        p0: p0,
        cp1: q0,
        cp2: r0,
        p1: endpoint,
    };
}
