/**
 * src/index.ts
 *
 * Module description:
 *
 * Main entry point for the library.
 *
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

export * from "./core/data-manager";
export * as Graph from "./basic.graph";
export * as Colours from "./utils/colours";

import Graph from "./basic.graph";
import Colours from "./utils/colours";

export default {
    Graph,
    Colours,
};
