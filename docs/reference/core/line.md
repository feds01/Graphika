[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/line

# core/line

## Classes

### default

Defined in: [core/line.ts:70](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L70)

Line class that represent the drawing mechanisms of each line that is drawn on a
graph.

#### Constructors

##### Constructor

```ts
new default(
   data,
   graph,
   options): default;
```

Defined in: [core/line.ts:74](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L74)

###### Parameters

| Parameter | Type                                              |
| --------- | ------------------------------------------------- |
| `data`    | `number`[] \| `Float64Array`\<`ArrayBufferLike`\> |
| `graph`   | [`default`](../basic.graph.md#default)            |
| `options` | [`LineOptions`](#lineoptions)                     |

###### Returns

[`default`](#default)

#### Methods

##### draw()

```ts
draw(progress): void;
```

Defined in: [core/line.ts:522](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L522)

###### Parameters

| Parameter  | Type     | Default value | Description                                                                           |
| ---------- | -------- | ------------- | ------------------------------------------------------------------------------------- |
| `progress` | `number` | `1`           | Value from 0 to 1 indicating how much of the line to draw. Defaults to 1 (full line). |

###### Returns

`void`

###### Since

v1.0.0

Function that can be called by a graph to draw the graph including the line
style and the line fill (if enabled).

## Type Aliases

### LineAnimationOptions

```ts
type LineAnimationOptions = {
    duration: number;
    easing: EasingAnimationFn;
};
```

Defined in: [core/line.ts:27](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L27)

Options for line animation.

#### Properties

| Property                         | Type                                                  | Defined in                                                                           |
| -------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| <a id="duration"></a> `duration` | `number`                                              | [core/line.ts:28](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L28) |
| <a id="easing"></a> `easing`     | [`EasingAnimationFn`](animation.md#easinganimationfn) | [core/line.ts:29](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L29) |

---

### LineAreaOptions

```ts
type LineAreaOptions = {
    colour?: string;
    fill: boolean;
};
```

Defined in: [core/line.ts:21](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L21)

Options for the line area.

#### Properties

| Property                      | Type      | Defined in                                                                           |
| ----------------------------- | --------- | ------------------------------------------------------------------------------------ |
| <a id="colour"></a> `colour?` | `string`  | [core/line.ts:23](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L23) |
| <a id="fill"></a> `fill`      | `boolean` | [core/line.ts:22](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L22) |

---

### LineOptions

```ts
type LineOptions = {
    animation?: LineAnimationOptions;
    annotatePoints: boolean;
    area?: LineAreaOptions;
    colour: string;
    interpolation: InterpolationKind;
    label?: string;
    style: string;
};
```

Defined in: [core/line.ts:43](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L43)

Options for a line on a graph.

#### Properties

| Property                                     | Type                                                      | Description                               | Defined in                                                                           |
| -------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| <a id="animation"></a> `animation?`          | [`LineAnimationOptions`](#lineanimationoptions)           | Optional animation settings for the line. | [core/line.ts:57](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L57) |
| <a id="annotatepoints"></a> `annotatePoints` | `boolean`                                                 | Whether to annotate points on the line.   | [core/line.ts:63](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L63) |
| <a id="area"></a> `area?`                    | [`LineAreaOptions`](#lineareaoptions)                     | Optional area settings for the line.      | [core/line.ts:54](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L54) |
| <a id="colour-1"></a> `colour`               | `string`                                                  | Colour of the line.                       | [core/line.ts:45](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L45) |
| <a id="interpolation"></a> `interpolation`   | [`InterpolationKind`](interpolation.md#interpolationkind) | Interpolation type for the line.          | [core/line.ts:51](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L51) |
| <a id="label"></a> `label?`                  | `string`                                                  | Optional label for the line.              | [core/line.ts:60](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L60) |
| <a id="style"></a> `style`                   | `string`                                                  | Style of the line: 'solid' or 'dashed'.   | [core/line.ts:48](https://github.com/feds01/Graphika/blob/main/src/core/line.ts#L48) |
