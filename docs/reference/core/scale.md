[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/scale

# core/scale

## Classes

### default

Defined in: [core/scale.ts:38](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L38)

#### Constructors

##### Constructor

```ts
new default(options): default;
```

Defined in: [core/scale.ts:45](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L45)

###### Parameters

| Parameter | Type                            |
| --------- | ------------------------------- |
| `options` | [`ScaleOptions`](#scaleoptions) |

###### Returns

[`default`](#default)

#### Properties

| Property                                     | Modifier | Type                     | Default value              | Defined in                                                                                                                 |
| -------------------------------------------- | -------- | ------------------------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| <a id="range"></a> `range`                   | `public` | `number`                 | `0`                        | [core/scale.ts:40](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L40) |
| <a id="roundedminimum"></a> `roundedMinimum` | `public` | `number`                 | `Number.NEGATIVE_INFINITY` | [core/scale.ts:43](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L43) |
| <a id="scalelabels"></a> `scaleLabels`       | `public` | (`string` \| `number`)[] | `undefined`                | [core/scale.ts:42](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L42) |
| <a id="scalestep"></a> `scaleStep`           | `public` | `number`                 | `0`                        | [core/scale.ts:41](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L41) |

#### Accessors

##### closestToZero

###### Get Signature

```ts
get closestToZero(): number;
```

Defined in: [core/scale.ts:156](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L156)

Get the closest number to zero in the scale. This is a useful
utility to have when trying to work out the orientation of the
scale.

###### Returns

`number`

the closest number to zero in the scale.

##### max

###### Get Signature

```ts
get max(): number;
```

Defined in: [core/scale.ts:90](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L90)

###### Returns

`number`

##### min

###### Get Signature

```ts
get min(): number;
```

Defined in: [core/scale.ts:86](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L86)

###### Returns

`number`

##### tickCount

###### Get Signature

```ts
get tickCount(): number;
```

Defined in: [core/scale.ts:108](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L108)

###### Returns

`number`

###### Set Signature

```ts
set tickCount(val): void;
```

Defined in: [core/scale.ts:112](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L112)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `val`     | `number` |

###### Returns

`void`

##### ticks

###### Get Signature

```ts
get ticks(): number[];
```

Defined in: [core/scale.ts:79](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L79)

Generate the ticks for the scale. This function will generate the numeric
ticks for the scale.

###### Returns

`number`[]

##### tickStep

###### Set Signature

```ts
set tickStep(val): void;
```

Defined in: [core/scale.ts:119](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L119)

###### Parameters

| Parameter | Type     |
| --------- | -------- |
| `val`     | `number` |

###### Returns

`void`

#### Methods

##### calculate()

```ts
calculate(): void;
```

Defined in: [core/scale.ts:50](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L50)

###### Returns

`void`

##### generateScaleLabels()

```ts
generateScaleLabels(): (string | number)[];
```

Defined in: [core/scale.ts:94](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L94)

###### Returns

(`string` \| `number`)[]

##### getScaleLabels()

```ts
getScaleLabels(rtl): string[];
```

Defined in: [core/scale.ts:138](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L138)

Function to get scale values for the given scale object. The function
also accepts values that allow the scale values to be transformed to be
represented on a axis/graph.

###### Parameters

| Parameter | Type      | Default value | Description                                                                         |
| --------- | --------- | ------------- | ----------------------------------------------------------------------------------- |
| `rtl`     | `boolean` | `false`       | If the numbers should be returned from Right-To-Left (largest to smallest) or else. |

###### Returns

`string`[]

the scale labels.

##### getScaleStep()

```ts
getScaleStep(): number;
```

Defined in: [core/scale.ts:145](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L145)

###### Returns

`number`

##### getTickCount()

```ts
getTickCount(): number;
```

Defined in: [core/scale.ts:124](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L124)

###### Returns

`number`

##### niceNum()

```ts
static niceNum(range, round): number;
```

Defined in: [core/scale.ts:170](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L170)

###### Parameters

| Parameter | Type      |
| --------- | --------- |
| `range`   | `number`  |
| `round`   | `boolean` |

###### Returns

`number`

## Type Aliases

### ScaleOptions

```ts
type ScaleOptions = {
    axisColour?: string;
    drawLabels?: boolean;
    drawTicks?: boolean;
    labelDirection?: string;
    max: number;
    min: number;
    minimumScaleStep?: number;
    startAtZero?: boolean;
    tickCount: number;
    tickLabels?: string[] | null;
    ticks?: number;
};
```

Defined in: [core/scale.ts:17](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L17)

#### Properties

| Property                                          | Type                 | Defined in                                                                                                                 |
| ------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| <a id="axiscolour"></a> `axisColour?`             | `string`             | [core/scale.ts:18](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L18) |
| <a id="drawlabels"></a> `drawLabels?`             | `boolean`            | [core/scale.ts:19](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L19) |
| <a id="drawticks"></a> `drawTicks?`               | `boolean`            | [core/scale.ts:20](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L20) |
| <a id="labeldirection"></a> `labelDirection?`     | `string`             | [core/scale.ts:21](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L21) |
| <a id="max-1"></a> `max`                          | `number`             | [core/scale.ts:29](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L29) |
| <a id="min-1"></a> `min`                          | `number`             | [core/scale.ts:27](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L27) |
| <a id="minimumscalestep"></a> `minimumScaleStep?` | `number`             | [core/scale.ts:32](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L32) |
| <a id="startatzero"></a> `startAtZero?`           | `boolean`            | [core/scale.ts:22](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L22) |
| <a id="tickcount-1"></a> `tickCount`              | `number`             | [core/scale.ts:35](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L35) |
| <a id="ticklabels"></a> `tickLabels?`             | `string`[] \| `null` | [core/scale.ts:23](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L23) |
| <a id="ticks-1"></a> `ticks?`                     | `number`             | [core/scale.ts:25](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/core/scale.ts#L25) |
