import { AllActions, AllActionStrings } from "@fullstackcraftllc/codevideo-types";
import { VirtualIDE } from "../../src/VirtualIDE";

describe("VirtualIDE", () => {
    describe("fuzz test", () => {
        it("should not crash when trying to apply a dummy value for name of AllActions", () => {
            // arrange
            const virtualIDE = new VirtualIDE(undefined, undefined, true);

            // act
            for (let i = 0; i < AllActionStrings.length; i++) {
                const actionName = AllActionStrings[i] as AllActions;
                const randomAlphabetLetter = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"][Math.floor(Math.random() * 26)];
                virtualIDE.applyAction({
                    name: actionName,
                    value: randomAlphabetLetter
                });
            }
        });
    });
});