[**@feds01/graphika**](../README.md)

---

[@feds01/graphika](../README.md) / tooltip/canvas-renderer

# tooltip/canvas-renderer

## Classes

### CanvasTooltipRenderer

Defined in: [tooltip/canvas-renderer.ts:29](https://github.com/feds01/Graphika/blob/main/src/tooltip/canvas-renderer.ts#L29)

Canvas-based tooltip renderer.

Renders the tooltip directly onto the canvas, including:

- Vertical tracking line
- Indicator dots on each line at the intersection point
- Tooltip box with formatted values

#### Implements

- [`TooltipRenderer`](types.md#tooltiprenderer)

#### Constructors

##### Constructor

```ts
new CanvasTooltipRenderer(graph, options): CanvasTooltipRenderer;
```

Defined in: [tooltip/canvas-renderer.ts:30](https://github.com/feds01/Graphika/blob/main/src/tooltip/canvas-renderer.ts#L30)

###### Parameters

| Parameter | Type                                                        |
| --------- | ----------------------------------------------------------- |
| `graph`   | [`default`](../basic.graph.md#default)                      |
| `options` | [`RequiredTooltipOptions`](types.md#requiredtooltipoptions) |

###### Returns

[`CanvasTooltipRenderer`](#canvastooltiprenderer)

#### Methods

##### clear()

```ts
clear(): void;
```

Defined in: [tooltip/canvas-renderer.ts:221](https://github.com/feds01/Graphika/blob/main/src/tooltip/canvas-renderer.ts#L221)

Clear the tooltip (no-op for canvas renderer as it's cleared on redraw).

###### Returns

`void`

###### Implementation of

[`TooltipRenderer`](types.md#tooltiprenderer).[`clear`](types.md#clear)

##### destroy()

```ts
destroy(): void;
```

Defined in: [tooltip/canvas-renderer.ts:228](https://github.com/feds01/Graphika/blob/main/src/tooltip/canvas-renderer.ts#L228)

Cleanup resources (no-op for canvas renderer).

###### Returns

`void`

###### Implementation of

[`TooltipRenderer`](types.md#tooltiprenderer).[`destroy`](types.md#destroy)

##### render()

```ts
render(state): void;
```

Defined in: [tooltip/canvas-renderer.ts:38](https://github.com/feds01/Graphika/blob/main/src/tooltip/canvas-renderer.ts#L38)

Render the tooltip with the current state.

###### Parameters

| Parameter | Type                                    |
| --------- | --------------------------------------- |
| `state`   | [`TooltipState`](types.md#tooltipstate) |

###### Returns

`void`

###### Implementation of

[`TooltipRenderer`](types.md#tooltiprenderer).[`render`](types.md#render)
