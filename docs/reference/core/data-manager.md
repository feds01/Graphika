[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / core/data-manager

# core/data-manager

## Classes

### default

Defined in: [core/data-manager.ts:35](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L35)

#### Constructors

##### Constructor

```ts
new default(_data): default;
```

Defined in: [core/data-manager.ts:38](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L38)

###### Parameters

| Parameter | Type                   |
| --------- | ---------------------- |
| `_data`   | `OptionalDataSource`[] |

###### Returns

[`default`](#default)

#### Properties

| Property                   | Modifier   | Type                          | Defined in                                                                                           |
| -------------------------- | ---------- | ----------------------------- | ---------------------------------------------------------------------------------------------------- |
| <a id="_data"></a> `_data` | `readonly` | `OptionalDataSource`[]        | [core/data-manager.ts:38](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L38) |
| <a id="data"></a> `data`   | `public`   | [`DataSource`](#datasource)[] | [core/data-manager.ts:36](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L36) |

#### Methods

##### colourList()

```ts
colourList(): string[];
```

Defined in: [core/data-manager.ts:88](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L88)

###### Returns

`string`[]

##### generateLegendInfo()

```ts
generateLegendInfo(): DataSource[];
```

Defined in: [core/data-manager.ts:84](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L84)

Generate legend data from the provided line configurations.

###### Returns

[`DataSource`](#datasource)[]

##### get()

```ts
get(): DataSource[];
```

Defined in: [core/data-manager.ts:60](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L60)

###### Returns

[`DataSource`](#datasource)[]

##### join()

```ts
join(): Float64Array<ArrayBuffer>;
```

Defined in: [core/data-manager.ts:64](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L64)

###### Returns

`Float64Array`\<`ArrayBuffer`\>

##### labels()

```ts
labels(): string[];
```

Defined in: [core/data-manager.ts:92](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L92)

###### Returns

`string`[]

##### lengths()

```ts
lengths(): number[];
```

Defined in: [core/data-manager.ts:69](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L69)

###### Returns

`number`[]

##### maxLen()

```ts
maxLen(): number;
```

Defined in: [core/data-manager.ts:73](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L73)

###### Returns

`number`

##### minLen()

```ts
minLen(): number;
```

Defined in: [core/data-manager.ts:77](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L77)

###### Returns

`number`

## Type Aliases

### DataSource

```ts
type DataSource = {
    annotatePoints?: boolean;
    area: {
        fill?: boolean;
        opacity?: number;
    };
    colour: string;
    data: number[] | Float64Array;
    interpolation: "linear" | "cubic";
    label: string;
    style?: LegendBoxBorderStyle;
};
```

Defined in: [core/data-manager.ts:18](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L18)

#### Properties

| Property                                      | Type                                                                | Defined in                                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| <a id="annotatepoints"></a> `annotatePoints?` | `boolean`                                                           | [core/data-manager.ts:27](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L27) |
| <a id="area"></a> `area`                      | \{ `fill?`: `boolean`; `opacity?`: `number`; \}                     | [core/data-manager.ts:23](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L23) |
| `area.fill?`                                  | `boolean`                                                           | [core/data-manager.ts:24](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L24) |
| `area.opacity?`                               | `number`                                                            | [core/data-manager.ts:25](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L25) |
| <a id="colour"></a> `colour`                  | `string`                                                            | [core/data-manager.ts:21](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L21) |
| <a id="data-1"></a> `data`                    | `number`[] \| `Float64Array`                                        | [core/data-manager.ts:19](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L19) |
| <a id="interpolation"></a> `interpolation`    | `"linear"` \| `"cubic"`                                             | [core/data-manager.ts:28](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L28) |
| <a id="label"></a> `label`                    | `string`                                                            | [core/data-manager.ts:20](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L20) |
| <a id="style"></a> `style?`                   | [`LegendBoxBorderStyle`](../legend/manager.md#legendboxborderstyle) | [core/data-manager.ts:22](https://github.com/feds01/Graphika/blob/main/src/core/data-manager.ts#L22) |
