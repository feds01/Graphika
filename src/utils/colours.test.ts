import { describe, it, expect } from "vitest";
import { rgba } from "./colours";

describe("rgba", () => {
    it("converts full hex to rgba", () => {
        expect(rgba("#ff6782", 100)).toBe("rgba(255, 103, 130, 1)");
        expect(rgba("#000000", 50)).toBe("rgba(0, 0, 0, 0.5)");
        expect(rgba("#ffffff", 0)).toBe("rgba(255, 255, 255, 0)");
    });

    it("converts shorthand hex to rgba", () => {
        expect(rgba("#eee", 50)).toBe("rgba(238, 238, 238, 0.5)");
        expect(rgba("#fff", 100)).toBe("rgba(255, 255, 255, 1)");
        expect(rgba("#000", 25)).toBe("rgba(0, 0, 0, 0.25)");
    });

    it("handles hex without leading #", () => {
        expect(rgba("ff6782", 100)).toBe("rgba(255, 103, 130, 1)");
        expect(rgba("eee", 50)).toBe("rgba(238, 238, 238, 0.5)");
    });

    it("handles various opacity values", () => {
        expect(rgba("#ff0000", 0)).toBe("rgba(255, 0, 0, 0)");
        expect(rgba("#ff0000", 33)).toBe("rgba(255, 0, 0, 0.33)");
        expect(rgba("#ff0000", 100)).toBe("rgba(255, 0, 0, 1)");
    });
});
