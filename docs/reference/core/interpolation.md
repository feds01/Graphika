[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/interpolation

# core/interpolation

## Type Aliases

### ControlPoint

```ts
type ControlPoint = {
    next: default;
    prev: default;
};
```

Defined in: [core/interpolation.ts:21](https://github.com/feds01/Graphika/blob/main/src/core/interpolation.ts#L21)

Control points for cubic Bezier curves.

#### Properties

| Property                 | Type                          | Defined in                                                                                             |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| <a id="next"></a> `next` | [`default`](point.md#default) | [core/interpolation.ts:23](https://github.com/feds01/Graphika/blob/main/src/core/interpolation.ts#L23) |
| <a id="prev"></a> `prev` | [`default`](point.md#default) | [core/interpolation.ts:22](https://github.com/feds01/Graphika/blob/main/src/core/interpolation.ts#L22) |

---

### InterpolationKind

```ts
type InterpolationKind = "linear" | "cubic";
```

Defined in: [core/interpolation.ts:18](https://github.com/feds01/Graphika/blob/main/src/core/interpolation.ts#L18)

Types of interpolation supported.

## Functions

### splineCurve()

```ts
function splineCurve(prev, current, next, t, graph): ControlPoint;
```

Defined in: [core/interpolation.ts:41](https://github.com/feds01/Graphika/blob/main/src/core/interpolation.ts#L41)

x0,y0,x1,y1 are the coordinates of the end (knot) pts of this segment
x2,y2 is the next knot -- not connected here but needed to calculate p2
p1 is the control point calculated here, from x1 back toward x0.
p2 is the next control point, calculated here and returned to become the
next segment's p1.

#### Parameters

| Parameter | Type                                   | Description         |
| --------- | -------------------------------------- | ------------------- |
| `prev`    | [`default`](point.md#default)          | the previous point  |
| `current` | [`default`](point.md#default)          | the current point   |
| `next`    | [`default`](point.md#default)          | the next point      |
| `t`       | `number`                               | tension coefficient |
| `graph`   | [`default`](../basic.graph.md#default) | graph object        |

#### Returns

[`ControlPoint`](#controlpoint)
