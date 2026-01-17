[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / legend/manager

# legend/manager

## Classes

### default

Defined in: [legend/manager.ts:32](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L32)

#### Constructors

##### Constructor

```ts
new default(graph, data): default;
```

Defined in: [legend/manager.ts:59](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L59)

Constructor for a legend manager object. This object is responsible for drawing the legend
on the graph.

###### Parameters

| Parameter | Type                                                 | Description                                   |
| --------- | ---------------------------------------------------- | --------------------------------------------- |
| `graph`   | [`default`](../basic.graph.md#default)               | The graph object that the legend is drawn on  |
| `data`    | [`DataSource`](../core/data-manager.md#datasource)[] | The data sources that the legend is drawn for |

###### Returns

[`default`](#default)

#### Properties

| Property                                   | Modifier | Type                                  | Description                                                                  | Defined in                                                                                                                         |
| ------------------------------------------ | -------- | ------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| <a id="alignment"></a> `alignment`         | `public` | [`LegendAlignment`](#legendalignment) | **Since** v0.0.1 The alignment of the legend box on the graph.               | [legend/manager.ts:43](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L43) |
| <a id="position"></a> `position`           | `public` | [`LegendPosition`](#legendposition)   | **Since** v0.0.1 The position of where the legend box is drawn on the graph. | [legend/manager.ts:38](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L38) |
| <a id="requiredspace"></a> `requiredSpace` | `public` | `number`                              | **Since** v0.0.1 The required space for the legend box to be drawn.          | [legend/manager.ts:48](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L48) |

#### Methods

##### draw()

```ts
draw(): void;
```

Defined in: [legend/manager.ts:125](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L125)

Function that draws this component.

###### Returns

`void`

##### drawLegend()

```ts
drawLegend(
   label,
   colour,
   style,
   x,
   y): void;
```

Defined in: [legend/manager.ts:101](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L101)

Function to draw a label with a key box denoting one of the graph legends

###### Parameters

| Parameter | Type                                            | Description                                      |
| --------- | ----------------------------------------------- | ------------------------------------------------ |
| `label`   | `string`                                        | The name of the line that represents this legend |
| `colour`  | `string`                                        | The colour of the key box                        |
| `style`   | [`LegendBoxBorderStyle`](#legendboxborderstyle) | Border style of the key box                      |
| `x`       | `number`                                        | x coordinate of where to draw the label          |
| `y`       | `number`                                        | y coordinate of where to draw the label          |

###### Returns

`void`

##### getRequiredSpaceFor()

```ts
getRequiredSpaceFor(item): number;
```

Defined in: [legend/manager.ts:83](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L83)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `item`    | `string` |

###### Returns

`number`

## Type Aliases

### LegendAlignment

```ts
type LegendAlignment = "start" | "center" | "end";
```

Defined in: [legend/manager.ts:28](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L28)

---

### LegendBoxBorderStyle

```ts
type LegendBoxBorderStyle = "solid" | "dashed";
```

Defined in: [legend/manager.ts:30](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L30)

---

### LegendOptions

```ts
type LegendOptions = {
    alignment: LegendAlignment;
    draw: boolean;
    position: LegendPosition;
};
```

Defined in: [legend/manager.ts:22](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L22)

#### Properties

| Property                             | Type                                  | Defined in                                                                                                                         |
| ------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| <a id="alignment-1"></a> `alignment` | [`LegendAlignment`](#legendalignment) | [legend/manager.ts:25](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L25) |
| <a id="draw-2"></a> `draw`           | `boolean`                             | [legend/manager.ts:23](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L23) |
| <a id="position-1"></a> `position`   | [`LegendPosition`](#legendposition)   | [legend/manager.ts:24](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L24) |

---

### LegendPosition

```ts
type LegendPosition = "left" | "right" | "top" | "bottom";
```

Defined in: [legend/manager.ts:29](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/legend/manager.ts#L29)
