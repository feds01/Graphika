[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/axis-manager

# core/axis-manager

## Classes

### default

Defined in: [core/axis-manager.ts:18](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L18)

#### Constructors

##### Constructor

```ts
new default(graph): default;
```

Defined in: [core/axis-manager.ts:27](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L27)

###### Parameters

| Parameter | Type                                   |
| --------- | -------------------------------------- |
| `graph`   | [`default`](../basic.graph.md#default) |

###### Returns

[`default`](#default)

#### Properties

| Property                                     | Modifier   | Type                                    | Default value | Defined in                                                                                           |
| -------------------------------------------- | ---------- | --------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------- |
| <a id="data"></a> `data`                     | `readonly` | `Float64Array`                          | `undefined`   | [core/axis-manager.ts:25](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L25) |
| <a id="graph"></a> `graph`                   | `readonly` | [`default`](../basic.graph.md#default)  | `undefined`   | [core/axis-manager.ts:27](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L27) |
| <a id="negativescale"></a> `negativeScale`   | `public`   | `boolean`                               | `false`       | [core/axis-manager.ts:24](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L24) |
| <a id="scalenumbers"></a> `scaleNumbers`     | `public`   | \{ `x`: `string`[]; `y`: `string`[]; \} | `undefined`   | [core/axis-manager.ts:21](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L21) |
| `scaleNumbers.x`                             | `public`   | `string`[]                              | `undefined`   | [core/axis-manager.ts:21](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L21) |
| `scaleNumbers.y`                             | `public`   | `string`[]                              | `undefined`   | [core/axis-manager.ts:21](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L21) |
| <a id="sharedaxiszero"></a> `sharedAxisZero` | `public`   | `boolean`                               | `false`       | [core/axis-manager.ts:23](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L23) |
| <a id="xaxis"></a> `xAxis`                   | `public`   | [`default`](axis.md#default)            | `undefined`   | [core/axis-manager.ts:19](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L19) |
| <a id="yaxis"></a> `yAxis`                   | `public`   | [`default`](axis.md#default)            | `undefined`   | [core/axis-manager.ts:20](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L20) |

#### Methods

##### draw()

```ts
draw(): void;
```

Defined in: [core/axis-manager.ts:69](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L69)

Method to draw on axis on the current graph. Takes into account graph settings
and then invokes the draw method on the individual drawing methods for each axis.

###### Returns

`void`

##### getColour()

```ts
getColour(): string;
```

Defined in: [core/axis-manager.ts:54](https://github.com/feds01/Graphika/blob/main/src/core/axis-manager.ts#L54)

###### Returns

`string`
