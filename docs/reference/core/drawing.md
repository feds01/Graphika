[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/drawing

# core/drawing

## Classes

### default

Defined in: [core/drawing.ts:28](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L28)

Utility class for drawing items on the canvas.

#### Constructors

##### Constructor

```ts
new default(
   canvas,
   context,
   options): default;
```

Defined in: [core/drawing.ts:29](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L29)

###### Parameters

| Parameter | Type                       |
| --------- | -------------------------- |
| `canvas`  | `HTMLCanvasElement`        |
| `context` | `CanvasRenderingContext2D` |
| `options` | `DrawerOptions`            |

###### Returns

[`default`](#default)

#### Accessors

##### ctx

###### Get Signature

```ts
get ctx(): CanvasRenderingContext2D;
```

Defined in: [core/drawing.ts:129](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L129)

###### Returns

`CanvasRenderingContext2D`

##### height

###### Get Signature

```ts
get height(): number;
```

Defined in: [core/drawing.ts:125](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L125)

###### Returns

`number`

##### width

###### Get Signature

```ts
get width(): number;
```

Defined in: [core/drawing.ts:121](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L121)

###### Returns

`number`

#### Methods

##### \_coordinateSafetyCheck()

```ts
_coordinateSafetyCheck(x, y): void;
```

Defined in: [core/drawing.ts:35](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L35)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `x`       | `number` |
| `y`       | `number` |

###### Returns

`void`

##### circle()

```ts
circle(
   x,
   y,
   rad): void;
```

Defined in: [core/drawing.ts:40](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L40)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `x`       | `number` |
| `y`       | `number` |
| `rad`     | `number` |

###### Returns

`void`

##### horizontalLine()

```ts
horizontalLine(
   x,
   y,
   len): void;
```

Defined in: [core/drawing.ts:50](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L50)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `x`       | `number` |
| `y`       | `number` |
| `len`     | `number` |

###### Returns

`void`

##### text()

```ts
text(
   text,
   x,
   y,
   size,
   colour,
   alignment): void;
```

Defined in: [core/drawing.ts:109](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L109)

###### Parameters

| Parameter   | Type                                  | Default value | Description                              |
| ----------- | ------------------------------------- | ------------- | ---------------------------------------- |
| `text`      | `string`                              | `undefined`   | the actual label                         |
| `x`         | `number`                              | `undefined`   | x-coordinate of where to draw the string |
| `y`         | `number`                              | `undefined`   | x-coordinate of where to draw the string |
| `size`      | `number`                              | `undefined`   | The font size of the text                |
| `colour`    | `string`                              | `undefined`   | RGBA style colour string                 |
| `alignment` | [`CanvasTextAlign`](#canvastextalign) | `"center"`    | One of the specified alignments for text |

###### Returns

`void`

nothing, just changes the drawing context

###### Since

v0.0.1
Function to draw text on the canvas at a given location with a particular
colour and alignment.

##### toTextMode()

```ts
toTextMode(
   size,
   colour,
   alignment): void;
```

Defined in: [core/drawing.ts:84](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L84)

###### Parameters

| Parameter   | Type                                  | Default value       | Description                              |
| ----------- | ------------------------------------- | ------------------- | ---------------------------------------- |
| `size`      | `number`                              | `undefined`         | The font size of the text                |
| `colour`    | `string`                              | `config.axisColour` | RGBA style colour string                 |
| `alignment` | [`CanvasTextAlign`](#canvastextalign) | `"center"`          | One of the specified alignments for text |

###### Returns

`void`

nothing, just changes the drawing context

###### Since

v0.0.1
This simply switches the canvas context to be text mode ready,
set the font size and style, set text alignment to middle, and
change stroke colour to the axis' colour.

##### verticalLine()

```ts
verticalLine(
   x,
   y,
   len): void;
```

Defined in: [core/drawing.ts:61](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L61)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `x`       | `number` |
| `y`       | `number` |
| `len`     | `number` |

###### Returns

`void`

## Type Aliases

### CanvasTextAlign

```ts
type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";
```

Defined in: [core/drawing.ts:23](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/drawing.ts#L23)
