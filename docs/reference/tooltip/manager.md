[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / tooltip/manager

# tooltip/manager

## Classes

### default

Defined in: [tooltip/manager.ts:93](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L93)

TooltipManager handles interactive tooltip display on the graph.

It listens to mouse events on the canvas, computes interpolated values
at the cursor position, and renders the tooltip using the configured renderer.

#### Constructors

##### Constructor

```ts
new default(graph, options): default;
```

Defined in: [tooltip/manager.ts:109](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L109)

###### Parameters

| Parameter | Type                                        |
| --------- | ------------------------------------------- |
| `graph`   | [`default`](../basic.graph.md#default)      |
| `options` | [`TooltipOptions`](types.md#tooltipoptions) |

###### Returns

[`default`](#default)

#### Methods

##### destroy()

```ts
destroy(): void;
```

Defined in: [tooltip/manager.ts:376](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L376)

Cleanup resources.

###### Returns

`void`

##### draw()

```ts
draw(): void;
```

Defined in: [tooltip/manager.ts:350](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L350)

Draw the tooltip. Called from BasicGraph.draw().

###### Returns

`void`

##### getState()

```ts
getState(): Readonly<TooltipState>;
```

Defined in: [tooltip/manager.ts:362](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L362)

Get the current tooltip state.

###### Returns

`Readonly`\<[`TooltipState`](types.md#tooltipstate)\>

##### isActive()

```ts
isActive(): boolean;
```

Defined in: [tooltip/manager.ts:369](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L369)

Check if the tooltip is currently active.

###### Returns

`boolean`
