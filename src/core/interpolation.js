module.exports = {
    splineCurve: function (previousPoint, currentPoint, afterPoint, tension) {
        const dist01 = Math.sqrt(
            Math.pow(currentPoint.x - previousPoint.x, 2) +
            Math.pow(currentPoint.y - previousPoint.y, 2)
        );

        const dist12 = Math.sqrt(
            Math.pow(afterPoint.x - currentPoint.x, 2) +
            Math.pow(afterPoint.y - currentPoint.y, 2)
        );

        let fa = tension * dist01 / (dist01 + dist12);
        let fb = tension - fa;

        return {
            before: {
                x: currentPoint.x + fa * (previousPoint.x - afterPoint.x),
                y: currentPoint.y + fa * (previousPoint.y - afterPoint.y)
            },
            after: {
                x: currentPoint.x - fb * (previousPoint.x - afterPoint.x),
                y: currentPoint.y - fb * (previousPoint.x - afterPoint.y)
            }
        };
    }
};