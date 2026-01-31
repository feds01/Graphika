/**
 * src/utils/coordinates.ts
 *
 * Module description:
 *
 * Coordinate conversion utilities for transforming between data coordinates
 * and canvas coordinates. These functions are used by the Point class and
 * tooltip system.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

/** Required axis properties for coordinate conversion. */
export type CoordinateAxis = {
    roundedMin: number;
    scaleStep: number;
    yStart: number;
};

/** Required graph properties for coordinate conversion. */
export type CoordinateContext = {
    lengths: {
        xBegin: number;
        xEnd: number;
        yBegin: number;
        yLength: number;
    };
    gridRectSize: {
        x: number;
        y: number;
    };
    xAxis: CoordinateAxis;
    yAxis: CoordinateAxis;
};

/**
 * Convert data X value to canvas X coordinate.
 *
 * @param ctx - The coordinate context containing graph measurements.
 * @param dataX - The data X value to convert.
 * @returns The canvas X coordinate.
 */
export function dataXToCanvasX(ctx: CoordinateContext, dataX: number): number {
    const { lengths, gridRectSize, xAxis } = ctx;

    let relX = Math.abs(dataX);
    if (xAxis.roundedMin > 0) {
        relX -= xAxis.roundedMin;
    }

    const xScalar = relX / xAxis.scaleStep;
    const xDirection = dataX < 0 ? -1 : 1;

    return lengths.xBegin + xDirection * xScalar * gridRectSize.x;
}

/**
 * Convert data Y value to canvas Y coordinate.
 *
 * @param ctx - The coordinate context containing graph measurements.
 * @param dataY - The data Y value to convert.
 * @returns The canvas Y coordinate.
 */
export function dataYToCanvasY(ctx: CoordinateContext, dataY: number): number {
    const { gridRectSize, xAxis, yAxis } = ctx;

    let relY = Math.abs(dataY);
    if (yAxis.roundedMin > 0) {
        relY -= yAxis.roundedMin;
    }

    const yScalar = relY / yAxis.scaleStep;
    const yDirection = dataY < 0 ? -1 : 1;

    return xAxis.yStart - yDirection * yScalar * gridRectSize.y;
}

/**
 * Convert canvas X coordinate to data X value.
 *
 * This is the inverse of dataXToCanvasX.
 *
 * @param ctx - The coordinate context containing graph measurements.
 * @param canvasX - The canvas X coordinate to convert.
 * @returns The data X value.
 */
export function canvasXToDataX(ctx: CoordinateContext, canvasX: number): number {
    const { lengths, gridRectSize, xAxis } = ctx;

    // Reverse of: canvasX = lengths.xBegin + xScalar * gridRectSize.x
    const xScalar = (canvasX - lengths.xBegin) / gridRectSize.x;
    const relX = xScalar * xAxis.scaleStep;

    // Add back the minimum if the axis doesn't start at 0
    return relX + xAxis.roundedMin;
}

/**
 * Check if canvas coordinates are within the graph plotting area.
 *
 * @param ctx - The coordinate context containing graph measurements.
 * @param canvasX - The canvas X coordinate to check.
 * @param canvasY - The canvas Y coordinate to check.
 * @returns True if the coordinates are within the graph area.
 */
export function isWithinGraphArea(ctx: CoordinateContext, canvasX: number, canvasY: number): boolean {
    const { lengths } = ctx;

    return (
        canvasX >= lengths.xBegin &&
        canvasX <= lengths.xEnd &&
        canvasY >= lengths.yBegin &&
        canvasY <= lengths.yBegin + lengths.yLength
    );
}

export interface GraphLike {
    lengths: {
        xBegin: number;
        xEnd: number;
        yBegin: number;
        yLength: number;
    };
    gridRectSize: {
        x: number;
        y: number;
    };
    axisManager: {
        xAxis: CoordinateAxis;
        yAxis: CoordinateAxis;
    };
}

/**
 * Create a coordinate context from a graph instance.
 *
 * This helper extracts the necessary properties from a graph to create
 * a CoordinateContext that can be used with the coordinate conversion functions.
 *
 * @param graph - An object with lengths, gridRectSize, and axisManager properties.
 * @returns A CoordinateContext for use with coordinate conversion functions.
 */
export function createCoordinateContext(graph: GraphLike): CoordinateContext {
    return {
        lengths: graph.lengths,
        gridRectSize: graph.gridRectSize,
        xAxis: graph.axisManager.xAxis,
        yAxis: graph.axisManager.yAxis,
    };
}
