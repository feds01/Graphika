[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / legend/draw-item

# legend/draw-item

## Type Aliases

### LegendItemOptions

```ts
type LegendItemOptions = {
    colour: string;
    font: string;
    fontSize: number;
    label: string;
    style: BorderStyle;
    textColour: string;
    x: number;
    y: number;
};
```

Defined in: [legend/draw-item.ts:15](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L15)

#### Properties

| Property                             | Type                                            | Description                                         | Defined in                                                                                         |
| ------------------------------------ | ----------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| <a id="colour"></a> `colour`         | `string`                                        | The colour for the legend box.                      | [legend/draw-item.ts:19](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L19) |
| <a id="font"></a> `font`             | `string`                                        | Font family for the label text.                     | [legend/draw-item.ts:31](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L31) |
| <a id="fontsize"></a> `fontSize`     | `number`                                        | Font size for the label (also determines box size). | [legend/draw-item.ts:27](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L27) |
| <a id="label"></a> `label`           | `string`                                        | The text label to display.                          | [legend/draw-item.ts:17](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L17) |
| <a id="style"></a> `style`           | [`BorderStyle`](../core/drawing.md#borderstyle) | Border style: 'solid' or 'dashed'.                  | [legend/draw-item.ts:21](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L21) |
| <a id="textcolour"></a> `textColour` | `string`                                        | Colour for the label text.                          | [legend/draw-item.ts:29](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L29) |
| <a id="x"></a> `x`                   | `number`                                        | X coordinate for the legend box.                    | [legend/draw-item.ts:23](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L23) |
| <a id="y"></a> `y`                   | `number`                                        | Y coordinate for the legend box.                    | [legend/draw-item.ts:25](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L25) |

## Functions

### drawLegendItem()

```ts
function drawLegendItem(ctx, options): void;
```

Defined in: [legend/draw-item.ts:40](https://github.com/feds01/Graphika/blob/main/src/legend/draw-item.ts#L40)

Draw a legend-style item (colored box + label) on the canvas.

#### Parameters

| Parameter | Type                                      | Description                        |
| --------- | ----------------------------------------- | ---------------------------------- |
| `ctx`     | `CanvasRenderingContext2D`                | The canvas rendering context.      |
| `options` | [`LegendItemOptions`](#legenditemoptions) | Configuration for the legend item. |

#### Returns

`void`
