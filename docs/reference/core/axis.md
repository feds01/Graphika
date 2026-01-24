[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/axis

# core/axis

## Classes

### default

Defined in: [core/axis.ts:37](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L37)

#### Constructors

##### Constructor

```ts
new default(
   manager,
   type,
   options): default;
```

Defined in: [core/axis.ts:45](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L45)

###### Parameters

| Parameter | Type                                 |
| --------- | ------------------------------------ |
| `manager` | [`default`](axis-manager.md#default) |
| `type`    | [`AxisType`](#axistype)              |
| `options` | [`AxisOptions`](#axisoptions)        |

###### Returns

[`default`](#default)

#### Properties

| Property                     | Modifier | Type     | Default value | Defined in                                                                           |
| ---------------------------- | -------- | -------- | ------------- | ------------------------------------------------------------------------------------ |
| <a id="start"></a> `start`   | `public` | `number` | `0`           | [core/axis.ts:39](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L39) |
| <a id="ystart"></a> `yStart` | `public` | `number` | `0`           | [core/axis.ts:38](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L38) |

#### Accessors

##### max

###### Get Signature

```ts
get max(): number;
```

Defined in: [core/axis.ts:160](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L160)

###### Returns

`number`

##### min

###### Get Signature

```ts
get min(): number;
```

Defined in: [core/axis.ts:152](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L152)

###### Returns

`number`

##### roundedMin

###### Get Signature

```ts
get roundedMin(): number;
```

Defined in: [core/axis.ts:156](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L156)

###### Returns

`number`

##### scaleLabels

###### Get Signature

```ts
get scaleLabels(): string[];
```

Defined in: [core/axis.ts:164](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L164)

###### Returns

`string`[]

##### scaleStep

###### Get Signature

```ts
get scaleStep(): number;
```

Defined in: [core/axis.ts:148](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L148)

###### Returns

`number`

#### Methods

##### determineAxisPosition()

```ts
determineAxisPosition(): void;
```

Defined in: [core/axis.ts:69](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L69)

###### Returns

`void`

###### Since

v0.0.1 Takes in input as the lengths object from a graph object.

##### draw()

```ts
draw(): void;
```

Defined in: [core/axis.ts:177](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L177)

###### Returns

`void`

##### generateScaleNumbers()

```ts
generateScaleNumbers(): string[];
```

Defined in: [core/axis.ts:124](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L124)

###### Returns

`string`[]

## Type Aliases

### AxisOptions

```ts
type AxisOptions = {
    axisColour?: string;
    drawLabels?: boolean;
    drawTicks?: boolean;
    labelDirection?: string;
    optimiseTicks?: boolean;
    startAtZero?: boolean;
    tickLabels?: string[];
    ticks?: number;
};
```

Defined in: [core/axis.ts:26](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L26)

#### Properties

| Property                                      | Type       | Defined in                                                                           |
| --------------------------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| <a id="axiscolour"></a> `axisColour?`         | `string`   | [core/axis.ts:27](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L27) |
| <a id="drawlabels"></a> `drawLabels?`         | `boolean`  | [core/axis.ts:28](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L28) |
| <a id="drawticks"></a> `drawTicks?`           | `boolean`  | [core/axis.ts:29](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L29) |
| <a id="labeldirection"></a> `labelDirection?` | `string`   | [core/axis.ts:30](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L30) |
| <a id="optimiseticks"></a> `optimiseTicks?`   | `boolean`  | [core/axis.ts:31](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L31) |
| <a id="startatzero"></a> `startAtZero?`       | `boolean`  | [core/axis.ts:32](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L32) |
| <a id="ticklabels"></a> `tickLabels?`         | `string`[] | [core/axis.ts:33](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L33) |
| <a id="ticks"></a> `ticks?`                   | `number`   | [core/axis.ts:34](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L34) |

---

### AxisType

```ts
type AxisType = "x" | "y";
```

Defined in: [core/axis.ts:24](https://github.com/feds01/Graphika/blob/main/src/core/axis.ts#L24)
