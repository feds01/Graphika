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

Defined in: [tooltip/manager.ts:381](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L381)

Cleanup resources.

###### Returns

`void`

##### draw()

```ts
draw(): void;
```

Defined in: [tooltip/manager.ts:355](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L355)

Draw the tooltip. Called from BasicGraph.draw().

###### Returns

`void`

##### getState()

```ts
getState(): Readonly<TooltipState>;
```

Defined in: [tooltip/manager.ts:367](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L367)

Get the current tooltip state.

###### Returns

`Readonly`\<[`TooltipState`](types.md#tooltipstate)\>

##### isActive()

```ts
isActive(): boolean;
```

Defined in: [tooltip/manager.ts:374](https://github.com/feds01/Graphika/blob/main/src/tooltip/manager.ts#L374)

Check if the tooltip is currently active.

###### Returns

`boolean`
