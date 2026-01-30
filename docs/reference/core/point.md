[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/point

# core/point

## Classes

### default

Defined in: [core/point.ts:38](https://github.com/feds01/Graphika/blob/main/src/core/point.ts#L38)

#### Constructors

##### Constructor

```ts
new default(data, graph): default;
```

Defined in: [core/point.ts:49](https://github.com/feds01/Graphika/blob/main/src/core/point.ts#L49)

###### Parameters

| Parameter | Type                                   |
| --------- | -------------------------------------- |
| `data`    | \{ `x`: `number`; `y`: `number`; \}    |
| `data.x`  | `number`                               |
| `data.y`  | `number`                               |
| `graph`   | [`default`](../basic.graph.md#default) |

###### Returns

[`default`](#default)

#### Properties

| Property                 | Modifier   | Type                                | Description                                                    | Defined in                                                                             |
| ------------------------ | ---------- | ----------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| <a id="data"></a> `data` | `readonly` | \{ `x`: `number`; `y`: `number`; \} | -                                                              | [core/point.ts:50](https://github.com/feds01/Graphika/blob/main/src/core/point.ts#L50) |
| `data.x`                 | `public`   | `number`                            | -                                                              | [core/point.ts:50](https://github.com/feds01/Graphika/blob/main/src/core/point.ts#L50) |
| `data.y`                 | `public`   | `number`                            | -                                                              | [core/point.ts:50](https://github.com/feds01/Graphika/blob/main/src/core/point.ts#L50) |
| <a id="x"></a> `x`       | `public`   | `number`                            | **Since** v0.0.1 This is the 'real' x-coordinate of the point. | [core/point.ts:42](https://github.com/feds01/Graphika/blob/main/src/core/point.ts#L42) |
| <a id="y"></a> `y`       | `public`   | `number`                            | **Since** v0.0.1 This is the 'real' y-coordinate of the point. | [core/point.ts:47](https://github.com/feds01/Graphika/blob/main/src/core/point.ts#L47) |

#### Methods

##### draw()

```ts
draw(): void;
```

Defined in: [core/point.ts:61](https://github.com/feds01/Graphika/blob/main/src/core/point.ts#L61)

###### Returns

`void`

###### Since

v0.0.1 This function is a simple draw function which will just draw a circle at the calculated x & y
points, this saves higher level functions from accessing x, y and drawing circles.
