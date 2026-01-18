[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / utils/object

# utils/object

## Functions

### expr()

```ts
function expr<T>(cb): T;
```

Defined in: [utils/object.ts:40](https://github.com/feds01/Graphika/blob/main/src/utils/object.ts#L40)

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `cb`      | () => `T` |

#### Returns

`T`

---

### isDef()

```ts
function isDef<T>(o): o is T;
```

Defined in: [utils/object.ts:36](https://github.com/feds01/Graphika/blob/main/src/utils/object.ts#L36)

Check whether some item is not null and not undefined.

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Parameters

| Parameter | Type                         | Description        |
| --------- | ---------------------------- | ------------------ |
| `o`       | `T` \| `null` \| `undefined` | The item to check. |

#### Returns

`o is T`

Whether the item is defined, as a type assertion.

---

### merge()

```ts
function merge<T>(target, source): T;
```

Defined in: [utils/object.ts:19](https://github.com/feds01/Graphika/blob/main/src/utils/object.ts#L19)

Combine two objects into one.

#### Type Parameters

| Type Parameter         |
| ---------------------- |
| `T` _extends_ `object` |

#### Parameters

| Parameter | Type | Description                                               |
| --------- | ---- | --------------------------------------------------------- |
| `target`  | `T`  | The initial object that will be used as a based to merge. |
| `source`  | `T`  | The object that will be merged into target.               |

#### Returns

`T`

A merged object from target and source.
