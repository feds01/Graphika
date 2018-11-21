module.exports = {
    rgba: function (hex, opacity) {
        return hex.replace(")", `,${parseFloat((opacity / 100).toFixed(2))})`);
    },

    findObjectElements(id, options) {
        let element = document.getElementById(id);
        let elementMap = {
            canvas: undefined,
            tittle: undefined
        };

        for (let childNode of element.childNodes) {
            const tagName = childNode.nodeName.toLowerCase();
            if (tagName === "canvas") {
                elementMap.canvas = childNode;

            } else if (tagName === "div") {
                if (childNode.classList.contains("tittle")) {
                    elementMap.tittle = childNode;
                }
            }
        }

        // DOM modifications
        if (elementMap.canvas !== null) {
            element.style.width = elementMap.canvas.width.toString() + "px";
        } else {
            // TODO: create the canvas element ?, same for tittle ?
            throw "canvas element does not exist";
        }

        if (elementMap.tittle !== null) {
            switch (options.tittle_pos) {
                case "top-left":
                    elementMap.tittle.style.textAlign = "left";
                    break;
                case "top-center":
                    elementMap.tittle.style.textAlign = "center";
                    break;
                case "top-right":
                    elementMap.tittle.style.textAlign = "right";
            }
            elementMap.tittle.innerHTML = options.tittle;
        }
        return elementMap;
    },


    isUndefOrNaN: function (o) {
        return isNaN(o) || typeof o === "undefined";

    }
};