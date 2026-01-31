[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/drawing

# core/drawing

## Classes

### default

Defined in: [core/drawing.ts:30](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L30)

Utility class for drawing items on the canvas.

#### Constructors

##### Constructor

```ts
new default(
   canvas,
   context,
   options): default;
```

Defined in: [core/drawing.ts:31](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L31)

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

Defined in: [core/drawing.ts:167](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L167)

###### Returns

`CanvasRenderingContext2D`

##### height

###### Get Signature

```ts
get height(): number;
```

Defined in: [core/drawing.ts:163](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L163)

###### Returns

`number`

##### width

###### Get Signature

```ts
get width(): number;
```

Defined in: [core/drawing.ts:159](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L159)

###### Returns

`number`

#### Methods

##### \_coordinateSafetyCheck()

```ts
_coordinateSafetyCheck(x, y): void;
```

Defined in: [core/drawing.ts:37](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L37)

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

Defined in: [core/drawing.ts:42](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L42)

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

Defined in: [core/drawing.ts:88](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L88)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `x`       | `number` |
| `y`       | `number` |
| `len`     | `number` |

###### Returns

`void`

##### pointIndicator()

```ts
pointIndicator(
   x,
   y,
   radius,
   fillColour,
   borderColour,
   borderWidth): void;
```

Defined in: [core/drawing.ts:62](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L62)

Draw a point indicator with a filled circle and border for visibility.

###### Parameters

| Parameter      | Type     | Default value | Description                                       |
| -------------- | -------- | ------------- | ------------------------------------------------- |
| `x`            | `number` | `undefined`   | X coordinate of the center.                       |
| `y`            | `number` | `undefined`   | Y coordinate of the center.                       |
| `radius`       | `number` | `undefined`   | Radius of the indicator circle.                   |
| `fillColour`   | `string` | `undefined`   | Fill colour of the indicator.                     |
| `borderColour` | `string` | `"white"`     | Border colour (defaults to white for visibility). |
| `borderWidth`  | `number` | `1.5`         | Width of the border (defaults to 1.5).            |

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

Defined in: [core/drawing.ts:147](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L147)

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

Defined in: [core/drawing.ts:122](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L122)

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

Defined in: [core/drawing.ts:99](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L99)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `x`       | `number` |
| `y`       | `number` |
| `len`     | `number` |

###### Returns

`void`

## Type Aliases

### BorderStyle

```ts
type BorderStyle = "solid" | "dashed";
```

Defined in: [core/drawing.ts:19](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L19)

The type of border to draw.

---

### CanvasTextAlign

```ts
type CanvasTextAlign = "center" | "end" | "left" | "right" | "start";
```

Defined in: [core/drawing.ts:25](https://github.com/feds01/Graphika/blob/main/src/core/drawing.ts#L25)
