/**
 * Module description:   src/legends/legend.js.js
 *
 * Created on 04/01/2019
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

import {assert} from "./../utils/assert";


const LegendPosition = {
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
    BOTTOM_RIGHT: "bottom-right",
    AUTO: "auto"
};

 class LegendContainer {
     constructor(legendData, drawer, position) {
         assert(legendData !== null, "Legend data must not be null");

         this.drawer = drawer;
         /* legendData is just an array of simple objects containing two fields, a legend label and a colour */
         this.legendData = legendData;

         /* Position of the legend container on the graph object */
         this.position = position === null ? LegendPosition.AUTO : position;
     }

     draw() {


     }
}