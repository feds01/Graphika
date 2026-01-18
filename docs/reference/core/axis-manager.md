[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/axis-manager

# core/axis-manager

## Classes

### default

Defined in: [core/axis-manager.ts:17](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L17)

#### Constructors

##### Constructor

```ts
new default(graph): default;
```

Defined in: [core/axis-manager.ts:26](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L26)

###### Parameters

| Parameter | Type                                   |
| --------- | -------------------------------------- |
| `graph`   | [`default`](../basic.graph.md#default) |

###### Returns

[`default`](#default)

#### Properties

| Property                                     | Modifier   | Type                                    | Default value | Defined in                                                                                           |
| -------------------------------------------- | ---------- | --------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------- |
| <a id="data"></a> `data`                     | `readonly` | `Float64Array`                          | `undefined`   | [core/axis-manager.ts:24](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L24) |
| <a id="graph"></a> `graph`                   | `readonly` | [`default`](../basic.graph.md#default)  | `undefined`   | [core/axis-manager.ts:26](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L26) |
| <a id="negativescale"></a> `negativeScale`   | `public`   | `boolean`                               | `false`       | [core/axis-manager.ts:23](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L23) |
| <a id="scalenumbers"></a> `scaleNumbers`     | `public`   | \{ `x`: `string`[]; `y`: `string`[]; \} | `undefined`   | [core/axis-manager.ts:20](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L20) |
| `scaleNumbers.x`                             | `public`   | `string`[]                              | `undefined`   | [core/axis-manager.ts:20](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L20) |
| `scaleNumbers.y`                             | `public`   | `string`[]                              | `undefined`   | [core/axis-manager.ts:20](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L20) |
| <a id="sharedaxiszero"></a> `sharedAxisZero` | `public`   | `boolean`                               | `false`       | [core/axis-manager.ts:22](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L22) |
| <a id="xaxis"></a> `xAxis`                   | `public`   | [`default`](axis.md#default)            | `undefined`   | [core/axis-manager.ts:18](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L18) |
| <a id="yaxis"></a> `yAxis`                   | `public`   | [`default`](axis.md#default)            | `undefined`   | [core/axis-manager.ts:19](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L19) |

#### Methods

##### draw()

```ts
draw(): void;
```

Defined in: [core/axis-manager.ts:57](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L57)

Method to draw on axis on the current graph. Takes into account graph settings
and then invokes the draw method on the individual drawing methods for each axis.

###### Returns

`void`
