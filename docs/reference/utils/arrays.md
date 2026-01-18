[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / utils/arrays

# utils/arrays

## Functions

### fillRange()

```ts
function fillRange(size): number[];
```

Defined in: [utils/arrays.ts:20](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L20)

fills an empty array from 0 to size with integers and then returns the new array.

#### Parameters

| Parameter | Type     | Description                          |
| --------- | -------- | ------------------------------------ |
| `size`    | `number` | Fill the array up to the given size. |

#### Returns

`number`[]

array with numbers 0 up to size.

---

### findClosestIndex()

```ts
function findClosestIndex(arr, value): [number, number];
```

Defined in: [utils/arrays.ts:153](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L153)

Find the index or indices or the closest elements to a given
values in an array. For example:

```ts
const arr = [-5, -4, -3, -1, 1, 2, 3, 4, 5];
findClosest(arr, 0); // returns [3, 4]
findClosest(arr, 2); // returns [5, 5]
findClosest(arr, -6); // returns [0, 0]
findClosest(arr, 6); // returns [8, 8]
findClosest([], 6); // returns [-1, -1]
```

#### Parameters

| Parameter | Type          | Description                                  |
| --------- | ------------- | -------------------------------------------- |
| `arr`     | `NumberArray` | The array to search for the closest element. |
| `value`   | `number`      | The value to find the closest element to.    |

#### Returns

\[`number`, `number`\]

The indices of the closest element to the given value.

---

### getMax()

```ts
function getMax(arr): number;
```

Defined in: [utils/arrays.ts:92](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L92)

Function to get maximum element within array, we don't want to
use Math.max if it is a large array.

#### Parameters

| Parameter | Type                                              | Description   |
| --------- | ------------------------------------------------- | ------------- |
| `arr`     | `number`[] \| `Float64Array`\<`ArrayBufferLike`\> | Source array. |

#### Returns

`number`

largest number in the array.

---

### getMin()

```ts
function getMin(arr): number;
```

Defined in: [utils/arrays.ts:108](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L108)

Function to get maximum element within array.

#### Parameters

| Parameter | Type       | Description   |
| --------- | ---------- | ------------- |
| `arr`     | `number`[] | Source array. |

#### Returns

`number`

Smallest number in the array.

---

### getMinMax()

```ts
function getMinMax(arr): {
    max: number;
    min: number;
};
```

Defined in: [utils/arrays.ts:124](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L124)

Function to get maximum and minimum element within array.

#### Parameters

| Parameter | Type          | Description   |
| --------- | ------------- | ------------- |
| `arr`     | `NumberArray` | Source array. |

#### Returns

```ts
{
    max: number;
    min: number;
}
```

smallest and largest numbers within the array.

| Name  | Type     | Defined in                                                                                   |
| ----- | -------- | -------------------------------------------------------------------------------------------- |
| `max` | `number` | [utils/arrays.ts:124](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L124) |
| `min` | `number` | [utils/arrays.ts:124](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L124) |

---

### getNext()

```ts
function getNext<T>(index, arr): T;
```

Defined in: [utils/arrays.ts:59](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L59)

Get the next element of an array, this method is also a safety wrapper function, if the
given index is equal to the length of the array - 1, or larger, return the last element
of the array, rather than undefined.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `index`   | `number` | Current position in the array.        |
| `arr`     | `T`[]    | The array to index for the next item. |

#### Returns

`T`

the previous item from the array, the same one if the index is length of the array.

---

### getPrevious()

```ts
function getPrevious<T>(index, data): T;
```

Defined in: [utils/arrays.ts:46](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L46)

Get the previous element of an array, this method is created for safety, if the
given index is zero or less than zero, the function will return the element at zero
rather than undefined.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `index`   | `number` | Current position in the array.            |
| `data`    | `T`[]    | The array to index for the previous item. |

#### Returns

`T`

the previous item from the array, the same one if the index is 0.

---

### longest()

```ts
function longest(arr): string;
```

Defined in: [utils/arrays.ts:31](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L31)

Returns the longest string within a given array. It does not return the actual length
of the longest item, just the longest item.

#### Parameters

| Parameter | Type       | Description                                |
| --------- | ---------- | ------------------------------------------ |
| `arr`     | `string`[] | Array of strings to find the longest item. |

#### Returns

`string`

Longest string from the array.

---

### negativeValues()

```ts
function negativeValues(arr): NumberArray;
```

Defined in: [utils/arrays.ts:69](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L69)

Get all only negative values from a given array.

#### Parameters

| Parameter | Type          | Description                                            |
| --------- | ------------- | ------------------------------------------------------ |
| `arr`     | `NumberArray` | The array to filter out positive and zero values from. |

#### Returns

`NumberArray`

Negative only items.

---

### nonNegativeValues()

```ts
function nonNegativeValues(array): NumberArray;
```

Defined in: [utils/arrays.ts:196](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L196)

Get all only positive and zero values from a given array.

#### Parameters

| Parameter | Type          | Description                       |
| --------- | ------------- | --------------------------------- |
| `array`   | `NumberArray` | The array that is to be filtered. |

#### Returns

`NumberArray`

the array with only natural numbers.

---

### sum()

```ts
function sum(arr): number;
```

Defined in: [utils/arrays.ts:186](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L186)

Array sum function.

#### Parameters

| Parameter | Type       | Description         |
| --------- | ---------- | ------------------- |
| `arr`     | `number`[] | Array to be summed. |

#### Returns

`number`

sum of the array.

---

### uniqueValues()

```ts
function uniqueValues<T>(arr): Set<T>;
```

Defined in: [utils/arrays.ts:81](https://github.com/feds01/Graphika/blob/main/src/utils/arrays.ts#L81)

Get all unique values from a given array.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter | Type  | Description                      |
| --------- | ----- | -------------------------------- |
| `arr`     | `T`[] | The array to convert into a set. |

#### Returns

`Set`\<`T`\>

the set of the array.
