[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/animation

# core/animation

## Interfaces

### EasingAnimationFn()

Defined in: [core/animation.ts:6](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L6)

Interface representing an easing function for animations.

```ts
EasingAnimationFn(t): number;
```

Defined in: [core/animation.ts:7](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L7)

Interface representing an easing function for animations.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

## Type Aliases

### Vec2

```ts
type Vec2 = {
    x: number;
    y: number;
};
```

Defined in: [core/animation.ts:81](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L81)

A 2D point for bezier calculations.

#### Properties

| Property           | Type     | Defined in                                                                                     |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------- |
| <a id="x"></a> `x` | `number` | [core/animation.ts:81](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L81) |
| <a id="y"></a> `y` | `number` | [core/animation.ts:81](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L81) |

## Functions

### easeInCubic()

```ts
function easeInCubic(t): number;
```

Defined in: [core/animation.ts:31](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L31)

Ease-in cubic easing function that starts slowly and accelerates towards the end.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeInOutCubic()

```ts
function easeInOutCubic(t): number;
```

Defined in: [core/animation.ts:41](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L41)

Ease-in-out cubic easing function that starts and ends slowly, with a faster middle phase.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeInOutQuad()

```ts
function easeInOutQuad(t): number;
```

Defined in: [core/animation.ts:26](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L26)

Ease-in-out quadratic easing function that starts and ends slowly, with a faster middle phase.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeInOutSine()

```ts
function easeInOutSine(t): number;
```

Defined in: [core/animation.ts:76](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L76)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeInQuad()

```ts
function easeInQuad(t): number;
```

Defined in: [core/animation.ts:16](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L16)

Ease-in quadratic easing function that starts slowly and accelerates towards the end.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeInSine()

```ts
function easeInSine(t): number;
```

Defined in: [core/animation.ts:68](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L68)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeOutBounce()

```ts
function easeOutBounce(t): number;
```

Defined in: [core/animation.ts:46](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L46)

Ease-out bounce easing function that simulates a bouncing effect at the end of the animation.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeOutCubic()

```ts
function easeOutCubic(t): number;
```

Defined in: [core/animation.ts:36](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L36)

Ease-out cubic easing function that starts quickly and decelerates towards the end.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeOutElastic()

```ts
function easeOutElastic(t): number;
```

Defined in: [core/animation.ts:62](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L62)

Elastic easing function that creates an oscillating effect, simulating a spring-like motion.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeOutQuad()

```ts
function easeOutQuad(t): number;
```

Defined in: [core/animation.ts:21](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L21)

Ease-out quadratic easing function that starts quickly and decelerates towards the end.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### easeOutSine()

```ts
function easeOutSine(t): number;
```

Defined in: [core/animation.ts:72](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L72)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### lerp()

```ts
function lerp(a, b, t): Vec2;
```

Defined in: [core/animation.ts:99](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L99)

Linear interpolation between two points.

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `a`       | [`Vec2`](#vec2) |
| `b`       | [`Vec2`](#vec2) |
| `t`       | `number`        |

#### Returns

[`Vec2`](#vec2)

---

### linearEasing()

```ts
function linearEasing(t): number;
```

Defined in: [core/animation.ts:11](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L11)

Linear easing function that returns the input value as is, resulting in a constant speed animation.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `t`       | `number` |

#### Returns

`number`

---

### splitCubicAt()

```ts
function splitCubicAt(p0, cp1, cp2, p1, t): PartialCubic;
```

Defined in: [core/animation.ts:126](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L126)

Splits a cubic bezier curve at parameter t and returns the first portion.
Uses de Casteljau's algorithm.

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `p0`      | [`Vec2`](#vec2) |
| `cp1`     | [`Vec2`](#vec2) |
| `cp2`     | [`Vec2`](#vec2) |
| `p1`      | [`Vec2`](#vec2) |
| `t`       | `number`        |

#### Returns

`PartialCubic`

---

### splitQuadraticAt()

```ts
function splitQuadraticAt(p0, cp, p1, t): PartialQuadratic;
```

Defined in: [core/animation.ts:110](https://github.com/feds01/Graphika/blob/main/src/core/animation.ts#L110)

Splits a quadratic bezier curve at parameter t and returns the first portion.
Uses de Casteljau's algorithm.

#### Parameters

| Parameter | Type            |
| --------- | --------------- |
| `p0`      | [`Vec2`](#vec2) |
| `cp`      | [`Vec2`](#vec2) |
| `p1`      | [`Vec2`](#vec2) |
| `t`       | `number`        |

#### Returns

`PartialQuadratic`
