const isUndefOrNull = (o) => {
    return typeof o === "undefined" || o === null;
};

module.exports = {
    rgba: function (hex, opacity) {
        return hex.replace(")", `,${parseFloat((opacity / 100).toFixed(2))})`);
    },

    findObjectElements(id, options) {
        let element = document.getElementById(id);
        let elementMap = {
            canvas: undefined,
            title: undefined
        };

        try {
            for (let childNode of element.childNodes) {
                const tagName = childNode.nodeName.toLowerCase();
                if (tagName === "canvas") {
                    elementMap.canvas = childNode;

                } else if (tagName === "div") {
                    if (childNode.classList.contains("title")) {
                        elementMap.title = childNode;
                    }
                }
            }
        } catch (e) {
            if (isUndefOrNull(elementMap.canvas)) {
                throw Error(`Graph Container with id: '${id}' doesn't exist.\n` + e);

            }
        }

        // DOM modifications
        if (!isUndefOrNull(elementMap.canvas)) {
            element.style.width = elementMap.canvas.width.toString() + "px";
        } else {
            throw Error(`Graph Container with id: '${this.HtmlElementId}' doesn't contain <canvas/> element.`);
        }

        if (!isUndefOrNull(elementMap.title)) {
            switch (options.title_pos) {
                case "top-left":
                    elementMap.title.style.textAlign = "left";
                    break;
                case "top-center":
                    elementMap.title.style.textAlign = "center";
                    break;
                case "top-right":
                    elementMap.title.style.textAlign = "right";
            }
            elementMap.title.innerHTML = options.title;
        } else {
            throw Error(`Graph Container with id: '${this.HtmlElementId}' doesn't contain 'title' element.`);
        }
        return elementMap;
    },


    isUndefOrNaN: function (o) {
        return isNaN(o) || typeof o === "undefined";

    },

    isUndefOrNull: isUndefOrNull
};