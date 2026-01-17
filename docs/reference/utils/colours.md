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

Defined in: [utils/colours.ts:17](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L17)

#### Type Declaration

| Name                                       | Type                                                                                                                                                  | Default value | Defined in                                                                                                                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| <a id="black"></a> `BLACK`                 | `string`                                                                                                                                              | `"#000000"`   | [utils/colours.ts:33](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L33) |
| <a id="debug"></a> `DEBUG`                 | `string`                                                                                                                                              | `"#00b200"`   | [utils/colours.ts:38](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L38) |
| <a id="deep_purple"></a> `DEEP_PURPLE`     | `string`                                                                                                                                              | `"#3a243b"`   | [utils/colours.ts:32](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L32) |
| <a id="electric_blue"></a> `ELECTRIC_BLUE` | `string`                                                                                                                                              | `"#009FE5"`   | [utils/colours.ts:31](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L31) |
| <a id="emerald_green"></a> `EMERALD_GREEN` | `string`                                                                                                                                              | `"#008816"`   | [utils/colours.ts:30](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L30) |
| <a id="flamingo_red"></a> `FLAMINGO_RED`   | `string`                                                                                                                                              | `"#FF6782"`   | [utils/colours.ts:29](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L29) |
| <a id="grey"></a> `GREY`                   | `string`                                                                                                                                              | `"#5e5e5e"`   | [utils/colours.ts:35](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L35) |
| <a id="purple"></a> `PURPLE`               | `string`                                                                                                                                              | `"#800080"`   | [utils/colours.ts:34](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L34) |
| <a id="schemes"></a> `schemes`             | \{ `s1`: `string`[]; `s2`: `string`[]; `s3`: `string`[]; `s4`: `string`[]; `s5`: `string`[]; `s6`: `string`[]; `s7`: `string`[]; `s8`: `string`[]; \} | -             | [utils/colours.ts:18](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L18) |
| `schemes.s1`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:19](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L19) |
| `schemes.s2`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:20](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L20) |
| `schemes.s3`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:21](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L21) |
| `schemes.s4`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:22](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L22) |
| `schemes.s5`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:23](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L23) |
| `schemes.s6`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:24](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L24) |
| `schemes.s7`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:25](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L25) |
| `schemes.s8`                               | `string`[]                                                                                                                                            | -             | [utils/colours.ts:26](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L26) |

## Functions

### rgba()

```ts
function rgba(hex, opacity): string;
```

Defined in: [utils/colours.ts:13](https://github.com/feds01/Graphika/blob/05ccf9175507ac60868838979a0155d2250fcd21/src/utils/colours.ts#L13)

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
