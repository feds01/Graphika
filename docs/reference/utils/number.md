[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / utils/number

# utils/number

## Variables

### TWO_PI

```ts
const TWO_PI: number;
```

Defined in: [utils/number.ts:15](https://github.com/feds01/Graphika/blob/main/src/utils/number.ts#L15)

Pre-computed constant for 2π, commonly used in arc/circle drawing.

## Functions

### clamp()

```ts
function clamp(num, min, max): number;
```

Defined in: [utils/number.ts:25](https://github.com/feds01/Graphika/blob/main/src/utils/number.ts#L25)

Returns a number whose value is limited to the given range.

#### Parameters

| Parameter | Type     | Description                             |
| --------- | -------- | --------------------------------------- |
| `num`     | `number` | -                                       |
| `min`     | `number` | The lower boundary of the output range. |
| `max`     | `number` | The upper boundary of the output range. |

#### Returns

`number`

A number in the range [min, max].

---

### floor()

```ts
function floor(num, dp): number;
```

Defined in: [utils/number.ts:52](https://github.com/feds01/Graphika/blob/main/src/utils/number.ts#L52)

Function to floor a number to the nearest boundary. For example, floor a 5 to a boundary
of 8 would round the number to 0. Flooring 11 with boundary of 8 would floor it to 8.

#### Parameters

| Parameter | Type     | Description                                                                                            |
| --------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `num`     | `number` | A number that is to be floored to the nearest number (with the same parity as the specified boundary). |
| `dp`      | `number` | -                                                                                                      |

#### Returns

`number`

the original number that is floored.

---

### isNum()

```ts
function isNum(o): o is number;
```

Defined in: [utils/number.ts:61](https://github.com/feds01/Graphika/blob/main/src/utils/number.ts#L61)

Check if the given object is a number and is not NaN.

#### Parameters

| Parameter | Type      | Description                            |
| --------- | --------- | -------------------------------------- |
| `o`       | `unknown` | The object to check if it is a number. |

#### Returns

`o is number`

---

### lerp()

```ts
function lerp(a, b, t): number;
```

Defined in: [utils/number.ts:73](https://github.com/feds01/Graphika/blob/main/src/utils/number.ts#L73)

Linear interpolation between two values.

#### Parameters

| Parameter | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `a`       | `number` | Start value.                |
| `b`       | `number` | End value.                  |
| `t`       | `number` | Interpolation factor (0-1). |

#### Returns

`number`

Interpolated value between a and b.

---

### round()

```ts
function round(num, bound): number;
```

Defined in: [utils/number.ts:37](https://github.com/feds01/Graphika/blob/main/src/utils/number.ts#L37)

Function to round a number to the nearest boundary. For example, round a 5 to a boundary
of 8 would round the number to 8. Rounding the number 11 with a boundary of 8 would round
the number down to 8.

#### Parameters

| Parameter | Type     | Description                                                                                            |
| --------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `num`     | `number` | A number that is to be rounded to the nearest number (with the same parity as the specified boundary). |
| `bound`   | `number` | The specified boundary that the number should be rounded to.                                           |

#### Returns

`number`
