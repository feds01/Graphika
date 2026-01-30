[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / utils/coordinates

# utils/coordinates

## Interfaces

### GraphLike

Defined in: [utils/coordinates.ts:118](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L118)

#### Properties

| Property                                 | Type                                                                                              | Defined in                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| <a id="axismanager"></a> `axisManager`   | \{ `xAxis`: [`CoordinateAxis`](#coordinateaxis); `yAxis`: [`CoordinateAxis`](#coordinateaxis); \} | [utils/coordinates.ts:129](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L129) |
| `axisManager.xAxis`                      | [`CoordinateAxis`](#coordinateaxis)                                                               | [utils/coordinates.ts:130](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L130) |
| `axisManager.yAxis`                      | [`CoordinateAxis`](#coordinateaxis)                                                               | [utils/coordinates.ts:131](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L131) |
| <a id="gridrectsize"></a> `gridRectSize` | \{ `x`: `number`; `y`: `number`; \}                                                               | [utils/coordinates.ts:125](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L125) |
| `gridRectSize.x`                         | `number`                                                                                          | [utils/coordinates.ts:126](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L126) |
| `gridRectSize.y`                         | `number`                                                                                          | [utils/coordinates.ts:127](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L127) |
| <a id="lengths"></a> `lengths`           | \{ `xBegin`: `number`; `xEnd`: `number`; `yBegin`: `number`; `yLength`: `number`; \}              | [utils/coordinates.ts:119](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L119) |
| `lengths.xBegin`                         | `number`                                                                                          | [utils/coordinates.ts:120](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L120) |
| `lengths.xEnd`                           | `number`                                                                                          | [utils/coordinates.ts:121](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L121) |
| `lengths.yBegin`                         | `number`                                                                                          | [utils/coordinates.ts:122](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L122) |
| `lengths.yLength`                        | `number`                                                                                          | [utils/coordinates.ts:123](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L123) |

## Type Aliases

### CoordinateAxis

```ts
type CoordinateAxis = {
    roundedMin: number;
    scaleStep: number;
    yStart: number;
};
```

Defined in: [utils/coordinates.ts:15](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L15)

Required axis properties for coordinate conversion.

#### Properties

| Property                             | Type     | Defined in                                                                                           |
| ------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------- |
| <a id="roundedmin"></a> `roundedMin` | `number` | [utils/coordinates.ts:16](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L16) |
| <a id="scalestep"></a> `scaleStep`   | `number` | [utils/coordinates.ts:17](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L17) |
| <a id="ystart"></a> `yStart`         | `number` | [utils/coordinates.ts:18](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L18) |

---

### CoordinateContext

```ts
type CoordinateContext = {
    gridRectSize: {
        x: number;
        y: number;
    };
    lengths: {
        xBegin: number;
        xEnd: number;
        yBegin: number;
        yLength: number;
    };
    xAxis: CoordinateAxis;
    yAxis: CoordinateAxis;
};
```

Defined in: [utils/coordinates.ts:22](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L22)

Required graph properties for coordinate conversion.

#### Properties

| Property                                   | Type                                                                                 | Defined in                                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| <a id="gridrectsize-1"></a> `gridRectSize` | \{ `x`: `number`; `y`: `number`; \}                                                  | [utils/coordinates.ts:29](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L29) |
| `gridRectSize.x`                           | `number`                                                                             | [utils/coordinates.ts:30](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L30) |
| `gridRectSize.y`                           | `number`                                                                             | [utils/coordinates.ts:31](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L31) |
| <a id="lengths-1"></a> `lengths`           | \{ `xBegin`: `number`; `xEnd`: `number`; `yBegin`: `number`; `yLength`: `number`; \} | [utils/coordinates.ts:23](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L23) |
| `lengths.xBegin`                           | `number`                                                                             | [utils/coordinates.ts:24](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L24) |
| `lengths.xEnd`                             | `number`                                                                             | [utils/coordinates.ts:25](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L25) |
| `lengths.yBegin`                           | `number`                                                                             | [utils/coordinates.ts:26](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L26) |
| `lengths.yLength`                          | `number`                                                                             | [utils/coordinates.ts:27](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L27) |
| <a id="xaxis"></a> `xAxis`                 | [`CoordinateAxis`](#coordinateaxis)                                                  | [utils/coordinates.ts:33](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L33) |
| <a id="yaxis"></a> `yAxis`                 | [`CoordinateAxis`](#coordinateaxis)                                                  | [utils/coordinates.ts:34](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L34) |

## Functions

### canvasXToDataX()

```ts
function canvasXToDataX(ctx, canvasX): number;
```

Defined in: [utils/coordinates.ts:88](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L88)

Convert canvas X coordinate to data X value.

This is the inverse of dataXToCanvasX.

#### Parameters

| Parameter | Type                                      | Description                                           |
| --------- | ----------------------------------------- | ----------------------------------------------------- |
| `ctx`     | [`CoordinateContext`](#coordinatecontext) | The coordinate context containing graph measurements. |
| `canvasX` | `number`                                  | The canvas X coordinate to convert.                   |

#### Returns

`number`

The data X value.

---

### createCoordinateContext()

```ts
function createCoordinateContext(graph): CoordinateContext;
```

Defined in: [utils/coordinates.ts:144](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L144)

Create a coordinate context from a graph instance.

This helper extracts the necessary properties from a graph to create
a CoordinateContext that can be used with the coordinate conversion functions.

#### Parameters

| Parameter | Type                      | Description                                                       |
| --------- | ------------------------- | ----------------------------------------------------------------- |
| `graph`   | [`GraphLike`](#graphlike) | An object with lengths, gridRectSize, and axisManager properties. |

#### Returns

[`CoordinateContext`](#coordinatecontext)

A CoordinateContext for use with coordinate conversion functions.

---

### dataXToCanvasX()

```ts
function dataXToCanvasX(ctx, dataX): number;
```

Defined in: [utils/coordinates.ts:44](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L44)

Convert data X value to canvas X coordinate.

#### Parameters

| Parameter | Type                                      | Description                                           |
| --------- | ----------------------------------------- | ----------------------------------------------------- |
| `ctx`     | [`CoordinateContext`](#coordinatecontext) | The coordinate context containing graph measurements. |
| `dataX`   | `number`                                  | The data X value to convert.                          |

#### Returns

`number`

The canvas X coordinate.

---

### dataYToCanvasY()

```ts
function dataYToCanvasY(ctx, dataY): number;
```

Defined in: [utils/coordinates.ts:65](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L65)

Convert data Y value to canvas Y coordinate.

#### Parameters

| Parameter | Type                                      | Description                                           |
| --------- | ----------------------------------------- | ----------------------------------------------------- |
| `ctx`     | [`CoordinateContext`](#coordinatecontext) | The coordinate context containing graph measurements. |
| `dataY`   | `number`                                  | The data Y value to convert.                          |

#### Returns

`number`

The canvas Y coordinate.

---

### isWithinGraphArea()

```ts
function isWithinGraphArea(ctx, canvasX, canvasY): boolean;
```

Defined in: [utils/coordinates.ts:107](https://github.com/feds01/Graphika/blob/main/src/utils/coordinates.ts#L107)

Check if canvas coordinates are within the graph plotting area.

#### Parameters

| Parameter | Type                                      | Description                                           |
| --------- | ----------------------------------------- | ----------------------------------------------------- |
| `ctx`     | [`CoordinateContext`](#coordinatecontext) | The coordinate context containing graph measurements. |
| `canvasX` | `number`                                  | The canvas X coordinate to check.                     |
| `canvasY` | `number`                                  | The canvas Y coordinate to check.                     |

#### Returns

`boolean`

True if the coordinates are within the graph area.
