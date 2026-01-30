[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / utils/colours

# utils/colours

## Variables

### default

```ts
default: {
  BLACK: string;
  DEBUG: string;
  DEEP_PURPLE: string;
  ELECTRIC_BLUE: string;
  EMERALD_GREEN: string;
  FLAMINGO_RED: string;
  GREY: string;
  PURPLE: string;
  schemes: {
     s1: string[];
     s2: string[];
     s3: string[];
     s4: string[];
     s5: string[];
     s6: string[];
     s7: string[];
     s8: string[];
  };
};
```

Defined in: [utils/colours.ts:30](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L30)

#### Type Declaration

| Name                                       | Type                                                                                                                                                  | Default value | Defined in                                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| <a id="black"></a> `BLACK`                 | `string`                                                                                                                                              | `"#000000"`   | [utils/colours.ts:46](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L46) |
| <a id="debug"></a> `DEBUG`                 | `string`                                                                                                                                              | `"#00b200"`   | [utils/colours.ts:51](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L51) |
| <a id="deep_purple"></a> `DEEP_PURPLE`     | `string`                                                                                                                                              | `"#3a243b"`   | [utils/colours.ts:45](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L45) |
| <a id="electric_blue"></a> `ELECTRIC_BLUE` | `string`                                                                                                                                              | `"#009FE5"`   | [utils/colours.ts:44](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L44) |
| <a id="emerald_green"></a> `EMERALD_GREEN` | `string`                                                                                                                                              | `"#008816"`   | [utils/colours.ts:43](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L43) |
| <a id="flamingo_red"></a> `FLAMINGO_RED`   | `string`                                                                                                                                              | `"#FF6782"`   | [utils/colours.ts:42](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L42) |
| <a id="grey"></a> `GREY`                   | `string`                                                                                                                                              | `"#5e5e5e"`   | [utils/colours.ts:48](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L48) |
| <a id="purple"></a> `PURPLE`               | `string`                                                                                                                                              | `"#800080"`   | [utils/colours.ts:47](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L47) |
| <a id="schemes"></a> `schemes`             | \{ `s1`: `string`[]; `s2`: `string`[]; `s3`: `string`[]; `s4`: `string`[]; `s5`: `string`[]; `s6`: `string`[]; `s7`: `string`[]; `s8`: `string`[]; \} | -             | [utils/colours.ts:31](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L31) |
| `schemes.s1`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:32](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L32) |
| `schemes.s2`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:33](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L33) |
| `schemes.s3`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:34](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L34) |
| `schemes.s4`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:35](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L35) |
| `schemes.s5`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:36](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L36) |
| `schemes.s6`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:37](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L37) |
| `schemes.s7`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:38](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L38) |
| `schemes.s8`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:39](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L39) |

## Functions

### rgba()

```ts
function rgba(hex, opacity): string;
```

Defined in: [utils/colours.ts:13](https://github.com/feds01/Graphika/blob/main/src/utils/colours.ts#L13)

src/utils/colours.ts

Module description:

This is file module is used for storing the various colours available
for making graphs and charts.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `hex`     | `string` |
| `opacity` | `number` |

#### Returns

`string`

#### Author

Alexander. E. Fedotov

#### Email

<alexander.fedotov.uk@gmail.com>
