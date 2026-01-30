[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / tooltip/types

# tooltip/types

## Interfaces

### TooltipRenderer

Defined in: [tooltip/types.ts:129](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L129)

Interface for tooltip renderers.

Implementations of this interface handle the visual rendering of the tooltip,
including the tracking line, indicator dots, and tooltip content box.

#### Methods

##### clear()

```ts
clear(): void;
```

Defined in: [tooltip/types.ts:142](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L142)

Clear/hide the tooltip.

Called when the cursor leaves the graph area.

###### Returns

`void`

##### destroy()

```ts
destroy(): void;
```

Defined in: [tooltip/types.ts:149](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L149)

Cleanup resources.

Called when the tooltip manager is destroyed.

###### Returns

`void`

##### render()

```ts
render(state): void;
```

Defined in: [tooltip/types.ts:135](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L135)

Render the tooltip with the current state.

###### Parameters

| Parameter | Type                            | Description                                                           |
| --------- | ------------------------------- | --------------------------------------------------------------------- |
| `state`   | [`TooltipState`](#tooltipstate) | The current tooltip state containing cursor position and line values. |

###### Returns

`void`

## Type Aliases

### LineValue

```ts
type LineValue = {
    canvasX: number;
    canvasY: number;
    colour: string;
    label: string;
    value: number;
};
```

Defined in: [tooltip/types.ts:99](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L99)

Interpolated value for a single line.

#### Properties

| Property                       | Type     | Description                                              | Defined in                                                                                     |
| ------------------------------ | -------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| <a id="canvasx"></a> `canvasX` | `number` | Canvas X coordinate of the interpolated point.           | [tooltip/types.ts:109](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L109) |
| <a id="canvasy"></a> `canvasY` | `number` | Canvas Y coordinate of the interpolated point.           | [tooltip/types.ts:107](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L107) |
| <a id="colour"></a> `colour`   | `string` | Line colour.                                             | [tooltip/types.ts:103](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L103) |
| <a id="label"></a> `label`     | `string` | Line label.                                              | [tooltip/types.ts:101](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L101) |
| <a id="value"></a> `value`     | `number` | Interpolated Y value at current X (in data coordinates). | [tooltip/types.ts:105](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L105) |

---

### RequiredTooltipOptions

```ts
type RequiredTooltipOptions = {
    content: Required<TooltipContentOptions>;
    enabled: boolean;
    format: {
        yValue: (y, label) => string;
    };
    indicators: Required<TooltipIndicatorOptions>;
    mode: TooltipMode;
    renderMode: "canvas";
    trackingLine: Required<TrackingLineOptions>;
};
```

Defined in: [tooltip/types.ts:113](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L113)

Required tooltip options with all fields populated.

#### Properties

| Property                                 | Type                                                                | Defined in                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| <a id="content"></a> `content`           | `Required`\<[`TooltipContentOptions`](#tooltipcontentoptions)\>     | [tooltip/types.ts:118](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L118) |
| <a id="enabled"></a> `enabled`           | `boolean`                                                           | [tooltip/types.ts:114](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L114) |
| <a id="format"></a> `format`             | \{ `yValue`: (`y`, `label`) => `string`; \}                         | [tooltip/types.ts:119](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L119) |
| `format.yValue`                          | (`y`, `label`) => `string`                                          | [tooltip/types.ts:119](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L119) |
| <a id="indicators"></a> `indicators`     | `Required`\<[`TooltipIndicatorOptions`](#tooltipindicatoroptions)\> | [tooltip/types.ts:120](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L120) |
| <a id="mode"></a> `mode`                 | [`TooltipMode`](#tooltipmode)                                       | [tooltip/types.ts:115](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L115) |
| <a id="rendermode"></a> `renderMode`     | `"canvas"`                                                          | [tooltip/types.ts:116](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L116) |
| <a id="trackingline"></a> `trackingLine` | `Required`\<[`TrackingLineOptions`](#trackinglineoptions)\>         | [tooltip/types.ts:117](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L117) |

---

### TooltipContentOptions

```ts
type TooltipContentOptions = {
    backgroundColor?: string;
    borderRadius?: number;
    fontSize?: number;
    padding?: number;
    show?: boolean;
    textColour?: string;
};
```

Defined in: [tooltip/types.ts:25](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L25)

Options for the tooltip content box.

#### Properties

| Property                                        | Type      | Description                                                                   | Defined in                                                                                   |
| ----------------------------------------------- | --------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| <a id="backgroundcolor"></a> `backgroundColor?` | `string`  | Background color of the tooltip box. Defaults to 'rgba(255, 255, 255, 0.95)'. | [tooltip/types.ts:29](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L29) |
| <a id="borderradius"></a> `borderRadius?`       | `number`  | Border radius of the tooltip box. Defaults to 4.                              | [tooltip/types.ts:37](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L37) |
| <a id="fontsize"></a> `fontSize?`               | `number`  | Font size in pixels. Defaults to 12.                                          | [tooltip/types.ts:33](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L33) |
| <a id="padding"></a> `padding?`                 | `number`  | Padding inside the tooltip box. Defaults to 8.                                | [tooltip/types.ts:35](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L35) |
| <a id="show"></a> `show?`                       | `boolean` | Whether to show the tooltip box with values. Defaults to true.                | [tooltip/types.ts:27](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L27) |
| <a id="textcolour"></a> `textColour?`           | `string`  | Text color. Defaults to '#333'.                                               | [tooltip/types.ts:31](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L31) |

---

### TooltipFormatOptions

```ts
type TooltipFormatOptions = {
    yValue?: (y, label) => string;
};
```

Defined in: [tooltip/types.ts:41](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L41)

Options for value formatting in the tooltip.

#### Properties

| Property                      | Type                       | Description                                                   | Defined in                                                                                   |
| ----------------------------- | -------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| <a id="yvalue"></a> `yValue?` | (`y`, `label`) => `string` | Custom formatter for Y values. Receives value and line label. | [tooltip/types.ts:43](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L43) |

---

### TooltipIndicatorOptions

```ts
type TooltipIndicatorOptions = {
    radius?: number;
    show?: boolean;
};
```

Defined in: [tooltip/types.ts:47](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L47)

Options for indicator dots shown on lines at the cursor position.

#### Properties

| Property                      | Type      | Description                                                | Defined in                                                                                   |
| ----------------------------- | --------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| <a id="radius"></a> `radius?` | `number`  | Radius of indicator dots. Defaults to 4.                   | [tooltip/types.ts:51](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L51) |
| <a id="show-1"></a> `show?`   | `boolean` | Whether to show indicator dots on lines. Defaults to true. | [tooltip/types.ts:49](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L49) |

---

### TooltipMode

```ts
type TooltipMode = "interpolated" | "nearest";
```

Defined in: [tooltip/types.ts:55](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L55)

Mode for determining Y values at cursor position.

---

### TooltipOptions

```ts
type TooltipOptions = {
    content?: TooltipContentOptions;
    enabled?: boolean;
    format?: TooltipFormatOptions;
    indicators?: TooltipIndicatorOptions;
    mode?: TooltipMode;
    renderMode?: "canvas";
    trackingLine?: TrackingLineOptions;
};
```

Defined in: [tooltip/types.ts:58](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L58)

Options for the tooltip feature.

#### Properties

| Property                                    | Type                                                  | Description                                                                                                                                                               | Defined in                                                                                   |
| ------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| <a id="content-1"></a> `content?`           | [`TooltipContentOptions`](#tooltipcontentoptions)     | Tooltip content box configuration.                                                                                                                                        | [tooltip/types.ts:76](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L76) |
| <a id="enabled-1"></a> `enabled?`           | `boolean`                                             | Whether to enable the tooltip feature. Defaults to false.                                                                                                                 | [tooltip/types.ts:60](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L60) |
| <a id="format-1"></a> `format?`             | [`TooltipFormatOptions`](#tooltipformatoptions)       | Value formatting configuration.                                                                                                                                           | [tooltip/types.ts:79](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L79) |
| <a id="indicators-1"></a> `indicators?`     | [`TooltipIndicatorOptions`](#tooltipindicatoroptions) | Indicator dots configuration.                                                                                                                                             | [tooltip/types.ts:82](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L82) |
| <a id="mode-1"></a> `mode?`                 | [`TooltipMode`](#tooltipmode)                         | Mode for determining Y values at cursor position. - 'interpolated': Smoothly interpolate between data points (default) - 'nearest': Snap to the nearest actual data point | [tooltip/types.ts:67](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L67) |
| <a id="rendermode-1"></a> `renderMode?`     | `"canvas"`                                            | Rendering mode: 'canvas' draws directly to canvas. Defaults to 'canvas'.                                                                                                  | [tooltip/types.ts:70](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L70) |
| <a id="trackingline-1"></a> `trackingLine?` | [`TrackingLineOptions`](#trackinglineoptions)         | Tracking line configuration.                                                                                                                                              | [tooltip/types.ts:73](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L73) |

---

### TooltipState

```ts
type TooltipState = {
    active: boolean;
    canvasX: number;
    canvasY: number;
    dataX: number;
    lineValues: LineValue[];
};
```

Defined in: [tooltip/types.ts:86](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L86)

Current tooltip state.

#### Properties

| Property                             | Type                        | Description                                                    | Defined in                                                                                   |
| ------------------------------------ | --------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| <a id="active"></a> `active`         | `boolean`                   | Whether the cursor is currently within the graph area.         | [tooltip/types.ts:88](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L88) |
| <a id="canvasx-1"></a> `canvasX`     | `number`                    | Current cursor position in canvas coordinates.                 | [tooltip/types.ts:90](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L90) |
| <a id="canvasy-1"></a> `canvasY`     | `number`                    | -                                                              | [tooltip/types.ts:91](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L91) |
| <a id="datax"></a> `dataX`           | `number`                    | Current cursor position in data X coordinate.                  | [tooltip/types.ts:93](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L93) |
| <a id="linevalues"></a> `lineValues` | [`LineValue`](#linevalue)[] | Interpolated Y values for each line at the current X position. | [tooltip/types.ts:95](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L95) |

---

### TrackingLineOptions

```ts
type TrackingLineOptions = {
    colour?: string;
    show?: boolean;
    style?: "solid" | "dashed";
    width?: number;
};
```

Defined in: [tooltip/types.ts:13](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L13)

Options for the tracking line that follows the cursor.

#### Properties

| Property                        | Type                    | Description                                                   | Defined in                                                                                   |
| ------------------------------- | ----------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| <a id="colour-1"></a> `colour?` | `string`                | Color of the tracking line. Defaults to 'rgba(0, 0, 0, 0.5)'. | [tooltip/types.ts:17](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L17) |
| <a id="show-2"></a> `show?`     | `boolean`               | Whether to show the vertical tracking line. Defaults to true. | [tooltip/types.ts:15](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L15) |
| <a id="style"></a> `style?`     | `"solid"` \| `"dashed"` | Line style: 'solid' or 'dashed'. Defaults to 'solid'.         | [tooltip/types.ts:21](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L21) |
| <a id="width"></a> `width?`     | `number`                | Line width in pixels. Defaults to 1.                          | [tooltip/types.ts:19](https://github.com/feds01/Graphika/blob/main/src/tooltip/types.ts#L19) |
