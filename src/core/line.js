/**
 * Module description: src/core/line.js
 *
 * This module holds the utility and CRUD methods for a graph
 * data object. Sorting data, joining and getting basic statistical
 * analysis on the data.
 *
 * Created on 01/10/2018
 * @author Alexander. E. Fedotov
 * @email <alexander.fedotov.uk@gmail.com>
 */

const {Point} = require("./point");
const interpolation = require("./interpolation");
const utils = require("./../utils");
const arrays = require("./../utils/arrays");
const config = require("./config");
const {assert} = require("./../utils/assert");

class Line {
    constructor(data, graph, options) {
        this.data = data;
        this.graph = graph;
        this.options = options;

        assert(Array.isArray(data) && data.length !== 0, "data must be a non-empty array.");

        this._convertDataToPoints();
    }

    /**
     * @private
     * */
    _convertDataToPoints() {
        this.points = [];

        for (let index = 0; index < this.data.length; index++) {
            this.points.push(new Point({x: index, y: this.data[index]}, this.graph));
        }

        if (this.options.interpolation === "cubic") {
            this._computeInterpolationControlPoints();
        }
    }

    /**
     * @private
     * */
    _computeInterpolationControlPoints() {
        this.controlPoints = [];

        // start from point 1 and not point 0, as point one and last point will
        // be quadratic curves and not splines
        for (let k = 1; k < this.points.length - 1; k++) {
            this.controlPoints.push(interpolation.splineCurve(
                arrays.getPrevious(k, this.points),
                this.points[k], arrays.getNext(k, this.points),
                config.tension, this.graph
            ));

            // perform a check to see if a control point goes out of the graph bounds,
            // if so we correct this behaviour by setting the 'y' to the lengths.y_begin
            // value.
            // TODO: implement check for control points which go out of bounds on lower port.
            if (this.controlPoints[k - 1].prev.y < this.graph.lengths.y_begin) {
                this.controlPoints[k - 1].prev.y = this.graph.lengths.y_begin;
            }

            if (this.controlPoints[k - 1].next.y < this.graph.lengths.y_begin) {
                this.controlPoints[k - 1].next.y = this.graph.lengths.y_begin;
            }
        }
    }

    _drawFillerSegment() {
        const context = this.graph.drawer.context;

        let f1 = new Point({x: 0, y: 0}, this.graph);
        let f2 = new Point({x: 1, y: 0}, this.graph);

        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        context.quadraticCurveTo(
            this.controlPoints[0].prev.x, this.controlPoints[0].prev.y,
            this.points[1].x, this.points[1].y
        );
        context.lineTo(f2.x, f2.y);
        context.lineTo(f1.x, f1.y);
        context.closePath();
        context.fill();

        // -----------------------------------------------------------------------
        for (let i = 1; i < this.points.length - 2; i++) {

            // Initiate critical points on X-Axis
            const x1 = new Point({x: i, y: 0}, this.graph);
            const x2 = new Point({x: i + 1, y: 0}, this.graph);

            context.beginPath();
            context.moveTo(this.points[i].x, this.points[i].y);
            context.bezierCurveTo(
                this.controlPoints[i - 1].next.x, this.controlPoints[i - 1].next.y,
                this.controlPoints[i].prev.x, this.controlPoints[i].prev.y,
                this.points[i + 1].x, this.points[i + 1].y
            );
            context.lineTo(x2.x, x2.y);
            context.lineTo(x1.x, x1.y);
            context.closePath();
            context.fill();
        }

        // -----------------------------------------------------------------------
        let f3 = new Point({x: this.points.length - 2, y: 0}, this.graph);
        let f4 = new Point({x: this.points.length - 1, y: 0}, this.graph);

        const precursorPoint = this.points[this.points.length - 1];

        // Drawing it reverse seems a little strange.
        context.beginPath();
        context.moveTo(f4.x, f4.y);
        context.lineTo(precursorPoint.x, precursorPoint.y);
        context.quadraticCurveTo(
            this.controlPoints[this.controlPoints.length - 1].next.x,
            this.controlPoints[this.controlPoints.length - 1].next.y,
            this.points[this.points.length - 2].x, this.points[this.points.length - 2].y
        );
        context.lineTo(f3.x, f3.y);
        context.closePath();
        context.fill();
    }

    draw() {
        const context = this.graph.drawer.context;

        context.lineJoin = "round";
        context.lineWidth = config.lineWidth;
        context.fillStyle = utils.rgba(this.options.colour, 100);
        context.strokeStyle = utils.rgba(this.options.colour, 40);
        context.setLineDash(this.options.style === "dashed" ? [5, 5] : []);


        // @Experiment: let's outline the first 'section' of filling element.
        context.beginPath();
        context.globalAlpha = 0.6;
        this._drawFillerSegment();
        context.globalAlpha = 1;
        context.closePath();

        if (this.options.interpolation === "cubic") {
            // draw the cubic spline curves
            for (let i = 1; i < this.points.length - 2; i++) {
                // begin current trajectory, by moving to starting point
                context.beginPath();
                context.moveTo(this.points[i].x, this.points[i].y);

                // create bezier curve using the next control point of previous entry
                // and previous control point of current entry and which leads to next
                // point
                context.bezierCurveTo(
                    this.controlPoints[i - 1].next.x, this.controlPoints[i - 1].next.y,
                    this.controlPoints[i].prev.x, this.controlPoints[i].prev.y,
                    this.points[i + 1].x, this.points[i + 1].y
                );
                context.stroke();

                context.closePath();
            }

            // now draw the starting quadratic between first and second curve
            context.beginPath();
            context.moveTo(this.points[0].x, this.points[0].y);
            context.quadraticCurveTo(
                this.controlPoints[0].prev.x, this.controlPoints[0].prev.y,
                this.points[1].x, this.points[1].y
            );
            context.stroke();
            context.closePath();

            // now draw final quadratic curve, between last and the point before the last.
            context.beginPath();
            context.moveTo(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y);

            context.quadraticCurveTo(
                this.controlPoints[this.controlPoints.length - 1].next.x,
                this.controlPoints[this.controlPoints.length - 1].next.y,
                this.points[this.points.length - 2].x, this.points[this.points.length - 2].y
            );
            context.stroke();
            context.closePath();


        } else {
            for (let p = 0; p < this.points.length - 1; p++) {
                context.beginPath();
                context.moveTo(this.points[p].x, this.points[p].y);
                context.lineTo(this.points[p + 1].x, this.points[p + 1].y);
                context.stroke();
                context.closePath();
            }
        }

        // if point annotation is enabled, draw the points.
        if (this.options.annotatePoints) {
            this.points.forEach((point) => {
                if ((point.data.x / this.graph.axisManager.xAxisTickStep) % 1 === 0) {
                    point.draw();
                }
            });
        }
    }
}

module.exports = {
    Line: Line,
};