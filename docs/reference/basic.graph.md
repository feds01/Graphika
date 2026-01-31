[**@feds01/graphika**](README.md)

---

[@feds01/graphika](README.md) / basic.graph

# basic.graph

## Classes

### default

Defined in: [basic.graph.ts:220](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L220)

Class that represent the basis graph drawing option

#### Constructors

##### Constructor

```ts
new default(
   id,
   options,
   data): default;
```

Defined in: [basic.graph.ts:297](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L297)

###### Parameters

| Parameter | Type                                              |
| --------- | ------------------------------------------------- |
| `id`      | `string`                                          |
| `options` | [`BasicGraphOptions`](#basicgraphoptions)         |
| `data`    | [`DataSource`](core/data-manager.md#datasource)[] |

###### Returns

[`default`](#default)

#### Properties

| Property                                 | Modifier | Type                                      | Description                                                                                                                                                                                                                | Defined in                                                                                 |
| ---------------------------------------- | -------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| <a id="axismanager"></a> `axisManager`   | `public` | [`default`](core/axis-manager.md#default) | **Since** v0.0.1 AxisManager object is a manager class for the Axis objects of this Graph object, The AxisManager contains the xAxis & yAxis objects, it also handles the synchronisation of scales & negative axis modes. | [basic.graph.ts:247](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L247) |
| <a id="canvas"></a> `canvas`             | `public` | `HTMLCanvasElement`                       | **Since** v0.0.1 A reference to the canvas element.                                                                                                                                                                        | [basic.graph.ts:258](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L258) |
| <a id="ctx"></a> `ctx`                   | `public` | `CanvasRenderingContext2D`                | **Since** v0.0.1 The canvas context object, this is used to draw on the canvas element.                                                                                                                                    | [basic.graph.ts:263](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L263) |
| <a id="datamanager"></a> `dataManager`   | `public` | [`default`](core/data-manager.md#default) | **Since** v0.0.1 DataManager object which contains the data for the lines the graph should plot, the object also contains various utility functions to fetch stats on the data. \*                                         | [basic.graph.ts:229](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L229) |
| <a id="drawer"></a> `drawer`             | `public` | [`default`](core/drawing.md#default)      | **Since** v0.0.1 Drawer object is the interface to use when dealing with the drawing of the graph, it contains the canvas element, the canvas context and the methods to draw on the canvas.                               | [basic.graph.ts:253](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L253) |
| <a id="gridrectsize"></a> `gridRectSize` | `public` | \{ `x`: `number`; `y`: `number`; \}       | -                                                                                                                                                                                                                          | [basic.graph.ts:267](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L267) |
| `gridRectSize.x`                         | `public` | `number`                                  | -                                                                                                                                                                                                                          | [basic.graph.ts:267](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L267) |
| `gridRectSize.y`                         | `public` | `number`                                  | -                                                                                                                                                                                                                          | [basic.graph.ts:267](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L267) |
| <a id="lengths"></a> `lengths`           | `public` | `Lengths`                                 | -                                                                                                                                                                                                                          | [basic.graph.ts:286](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L286) |
| <a id="options"></a> `options`           | `public` | [`BasicGraphOptions`](#basicgraphoptions) | **Since** v0.0.1 Graph options, this contain x-labels, y-label, tittle, legends, points style, gridded, etc. More on graph options can be read in the documentation \*                                                     | [basic.graph.ts:224](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L224) |
| <a id="padding"></a> `padding`           | `public` | `Padding`                                 | -                                                                                                                                                                                                                          | [basic.graph.ts:266](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L266) |

#### Methods

##### calculateLengths()

```ts
calculateLengths(): void;
```

Defined in: [basic.graph.ts:567](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L567)

###### Returns

`void`

##### calculatePadding()

```ts
calculatePadding(): void;
```

Defined in: [basic.graph.ts:589](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L589)

Calculates the padding around the graph grid, taking into account font sizes
of labels, title, legends and any other parameters that could affect the size
that needs to be reserved around the area.

###### Returns

`void`

##### destroy()

```ts
destroy(): void;
```

Defined in: [basic.graph.ts:843](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L843)

Cleanup resources used by the graph.

Call this method when the graph is no longer needed to remove event listeners
and free up resources.

###### Returns

`void`

##### draw()

```ts
draw(): void;
```

Defined in: [basic.graph.ts:697](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L697)

Method that draws the whole graph, computing all pre-requisites and then invoking
draw on children components.

###### Returns

`void`

##### fontSize()

```ts
fontSize(): number;
```

Defined in: [basic.graph.ts:372](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L372)

###### Returns

`number`

##### getLineLabels()

```ts
getLineLabels(): string[];
```

Defined in: [basic.graph.ts:404](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L404)

###### Returns

`string`[]

###### Since

v0.0.1

This method is used to fetch all line labels that are present on this graph.

##### removeLineByLabel()

```ts
removeLineByLabel(label): void;
```

Defined in: [basic.graph.ts:383](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L383)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `label`   | `string` |

###### Returns

`void`

###### Since

v0.0.1

This method is used to remove a line by a given 'label' which is present with every line that
is present on the graph. If the developer does not specify a label, a random string is generated and that
is used as a label instead.

## Type Aliases

### AnimationOptions

```ts
type AnimationOptions = {
    duration?: number;
    easing?: EasingAnimationFn;
    enabled: boolean;
};
```

Defined in: [basic.graph.ts:38](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L38)

Animation options for the graph.

#### Properties

| Property                          | Type                                                       | Description                                | Defined in                                                                               |
| --------------------------------- | ---------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| <a id="duration"></a> `duration?` | `number`                                                   | Duration of the animation in milliseconds. | [basic.graph.ts:42](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L42) |
| <a id="easing"></a> `easing?`     | [`EasingAnimationFn`](core/animation.md#easinganimationfn) | Easing function for the animation.         | [basic.graph.ts:44](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L44) |
| <a id="enabled"></a> `enabled`    | `boolean`                                                  | Whether to animate the lines when drawing. | [basic.graph.ts:40](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L40) |

---

### BasicGraphOptions

```ts
type BasicGraphOptions = {
    animation?: AnimationOptions;
    axisColour?: string;
    debug?: boolean;
    grid?: GridOptions;
    labelFont?: string;
    labelFontSize?: number;
    legend?: LegendOptions;
    padding?: number;
    scale?: {
        shorthandNumerics?: boolean;
        x?: AxisOptions;
        y?: AxisOptions;
    };
    title?: TitleOptions;
    tooltip?: TooltipOptions;
    x_label?: string;
    y_label?: string;
};
```

Defined in: [basic.graph.ts:47](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L47)

#### Properties

| Property                                    | Type                                                                                                                                     | Description                                                                           | Defined in                                                                               |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| <a id="animation"></a> `animation?`         | [`AnimationOptions`](#animationoptions)                                                                                                  | Animation settings for the graph.                                                     | [basic.graph.ts:83](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L83) |
| <a id="axiscolour"></a> `axisColour?`       | `string`                                                                                                                                 | Colour of the axes.                                                                   | [basic.graph.ts:64](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L64) |
| <a id="debug"></a> `debug?`                 | `boolean`                                                                                                                                | Debug mode for the graph. Enables additional logging and visual aids for development. | [basic.graph.ts:89](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L89) |
| <a id="grid"></a> `grid?`                   | [`GridOptions`](#gridoptions)                                                                                                            | Grid options for the graph.                                                           | [basic.graph.ts:67](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L67) |
| <a id="labelfont"></a> `labelFont?`         | `string`                                                                                                                                 | -                                                                                     | [basic.graph.ts:58](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L58) |
| <a id="labelfontsize"></a> `labelFontSize?` | `number`                                                                                                                                 | -                                                                                     | [basic.graph.ts:61](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L61) |
| <a id="legend"></a> `legend?`               | [`LegendOptions`](legend/manager.md#legendoptions)                                                                                       | Legend options for the graph.                                                         | [basic.graph.ts:80](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L80) |
| <a id="padding-1"></a> `padding?`           | `number`                                                                                                                                 | Padding around the graph content.                                                     | [basic.graph.ts:49](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L49) |
| <a id="scale"></a> `scale?`                 | \{ `shorthandNumerics?`: `boolean`; `x?`: [`AxisOptions`](core/axis.md#axisoptions); `y?`: [`AxisOptions`](core/axis.md#axisoptions); \} | Scale options for the graph axes.                                                     | [basic.graph.ts:73](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L73) |
| `scale.shorthandNumerics?`                  | `boolean`                                                                                                                                | -                                                                                     | [basic.graph.ts:74](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L74) |
| `scale.x?`                                  | [`AxisOptions`](core/axis.md#axisoptions)                                                                                                | -                                                                                     | [basic.graph.ts:75](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L75) |
| `scale.y?`                                  | [`AxisOptions`](core/axis.md#axisoptions)                                                                                                | -                                                                                     | [basic.graph.ts:76](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L76) |
| <a id="title"></a> `title?`                 | [`TitleOptions`](#titleoptions)                                                                                                          | Title options for the graph.                                                          | [basic.graph.ts:70](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L70) |
| <a id="tooltip"></a> `tooltip?`             | [`TooltipOptions`](tooltip/types.md#tooltipoptions)                                                                                      | Tooltip settings for interactive data display.                                        | [basic.graph.ts:86](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L86) |
| <a id="x_label"></a> `x_label?`             | `string`                                                                                                                                 | -                                                                                     | [basic.graph.ts:52](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L52) |
| <a id="y_label"></a> `y_label?`             | `string`                                                                                                                                 | -                                                                                     | [basic.graph.ts:55](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L55) |

---

### GridOptions

```ts
type GridOptions = {
    gridded?: boolean;
    gridLineStyle?: string;
    optimiseSquareSize?: boolean;
    sharedAxisZero?: boolean;
    strict?: boolean;
};
```

Defined in: [basic.graph.ts:29](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L29)

#### Properties

| Property                                              | Type      | Defined in                                                                               |
| ----------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------- |
| <a id="gridded"></a> `gridded?`                       | `boolean` | [basic.graph.ts:30](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L30) |
| <a id="gridlinestyle"></a> `gridLineStyle?`           | `string`  | [basic.graph.ts:31](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L31) |
| <a id="optimisesquaresize"></a> `optimiseSquareSize?` | `boolean` | [basic.graph.ts:32](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L32) |
| <a id="sharedaxiszero"></a> `sharedAxisZero?`         | `boolean` | [basic.graph.ts:33](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L33) |
| <a id="strict"></a> `strict?`                         | `boolean` | [basic.graph.ts:34](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L34) |

---

### TitleAlignment

```ts
type TitleAlignment = "start" | "center" | "end";
```

Defined in: [basic.graph.ts:103](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L103)

---

### TitleOptions

```ts
type TitleOptions = {
    alignment?: TitleAlignment;
    colour?: string;
    content: string;
    draw?: boolean;
    fontFamily?: string;
    fontSize?: number;
    position?: TitlePosition;
};
```

Defined in: [basic.graph.ts:92](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L92)

#### Properties

| Property                              | Type                                | Defined in                                                                               |
| ------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| <a id="alignment"></a> `alignment?`   | [`TitleAlignment`](#titlealignment) | [basic.graph.ts:96](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L96) |
| <a id="colour"></a> `colour?`         | `string`                            | [basic.graph.ts:99](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L99) |
| <a id="content"></a> `content`        | `string`                            | [basic.graph.ts:94](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L94) |
| <a id="draw-2"></a> `draw?`           | `boolean`                           | [basic.graph.ts:93](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L93) |
| <a id="fontfamily"></a> `fontFamily?` | `string`                            | [basic.graph.ts:97](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L97) |
| <a id="fontsize-2"></a> `fontSize?`   | `number`                            | [basic.graph.ts:98](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L98) |
| <a id="position"></a> `position?`     | [`TitlePosition`](#titleposition)   | [basic.graph.ts:95](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L95) |

---

### TitlePosition

```ts
type TitlePosition = "top";
```

Defined in: [basic.graph.ts:102](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L102)
