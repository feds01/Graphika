[**@feds01/graphika**](README.md)

---

[@feds01/graphika](README.md) / basic.graph

# basic.graph

## Classes

### default

Defined in: [basic.graph.ts:177](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L177)

Class that represent the basis graph drawing option

#### Constructors

##### Constructor

```ts
new default(
   id,
   options,
   data): default;
```

Defined in: [basic.graph.ts:237](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L237)

###### Parameters

| Parameter | Type                                              |
| --------- | ------------------------------------------------- |
| `id`      | `string`                                          |
| `options` | `BasicGraphOptions`                               |
| `data`    | [`DataSource`](core/data-manager.md#datasource)[] |

###### Returns

[`default`](#default)

#### Properties

| Property                                 | Modifier | Type                                      | Description                                                                                                                                                                                                                | Defined in                                                                                 |
| ---------------------------------------- | -------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| <a id="axismanager"></a> `axisManager`   | `public` | [`default`](core/axis-manager.md#default) | **Since** v0.0.1 AxisManager object is a manager class for the Axis objects of this Graph object, The AxisManager contains the xAxis & yAxis objects, it also handles the synchronisation of scales & negative axis modes. | [basic.graph.ts:199](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L199) |
| <a id="canvas"></a> `canvas`             | `public` | `HTMLCanvasElement`                       | **Since** v0.0.1 A reference to the canvas element.                                                                                                                                                                        | [basic.graph.ts:210](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L210) |
| <a id="ctx"></a> `ctx`                   | `public` | `CanvasRenderingContext2D`                | **Since** v0.0.1 The canvas context object, this is used to draw on the canvas element.                                                                                                                                    | [basic.graph.ts:215](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L215) |
| <a id="datamanager"></a> `dataManager`   | `public` | [`default`](core/data-manager.md#default) | **Since** v0.0.1 DataManager object which contains the data for the lines the graph should plot, the object also contains various utility functions to fetch stats on the data. \*                                         | [basic.graph.ts:186](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L186) |
| <a id="drawer"></a> `drawer`             | `public` | [`default`](core/drawing.md#default)      | **Since** v0.0.1 Drawer object is the interface to use when dealing with the drawing of the graph, it contains the canvas element, the canvas context and the methods to draw on the canvas.                               | [basic.graph.ts:205](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L205) |
| <a id="gridrectsize"></a> `gridRectSize` | `public` | \{ `x`: `number`; `y`: `number`; \}       | -                                                                                                                                                                                                                          | [basic.graph.ts:219](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L219) |
| `gridRectSize.x`                         | `public` | `number`                                  | -                                                                                                                                                                                                                          | [basic.graph.ts:219](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L219) |
| `gridRectSize.y`                         | `public` | `number`                                  | -                                                                                                                                                                                                                          | [basic.graph.ts:219](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L219) |
| <a id="lengths"></a> `lengths`           | `public` | `Lengths`                                 | -                                                                                                                                                                                                                          | [basic.graph.ts:226](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L226) |
| <a id="options"></a> `options`           | `public` | `BasicGraphOptions`                       | **Since** v0.0.1 Graph options, this contain x-labels, y-label, tittle, legends, points style, gridded, etc. More on graph options can be read in the documentation \*                                                     | [basic.graph.ts:181](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L181) |
| <a id="padding"></a> `padding`           | `public` | `Padding`                                 | -                                                                                                                                                                                                                          | [basic.graph.ts:218](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L218) |

#### Methods

##### calculateLengths()

```ts
calculateLengths(): void;
```

Defined in: [basic.graph.ts:473](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L473)

###### Returns

`void`

##### calculatePadding()

```ts
calculatePadding(): void;
```

Defined in: [basic.graph.ts:495](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L495)

Calculates the padding around the graph grid, taking into account font sizes
of labels, title, legends and any other parameters that could affect the size
that needs to be reserved around the area.

###### Returns

`void`

##### draw()

```ts
draw(): void;
```

Defined in: [basic.graph.ts:575](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L575)

Method that draws the whole graph, computing all pre-requisites and then invoking
draw on children components.

###### Returns

`void`

##### fontSize()

```ts
fontSize(): number;
```

Defined in: [basic.graph.ts:300](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L300)

###### Returns

`number`

##### getLineLabels()

```ts
getLineLabels(): string[];
```

Defined in: [basic.graph.ts:332](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L332)

###### Returns

`string`[]

###### Since

v0.0.1

###### API

This method is used to fetch all line labels that are present on this graph.

##### removeLineByLabel()

```ts
removeLineByLabel(label): void;
```

Defined in: [basic.graph.ts:311](https://github.com/feds01/Graphika/blob/main/src/basic.graph.ts#L311)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `label`   | `string` |

###### Returns

`void`

###### Since

v0.0.1

###### API

This method is used to remove a line by a given 'label' which is present with every line that
is present on the graph. If the developer does not specify a label, a random string is generated and that
is used as a label instead.
