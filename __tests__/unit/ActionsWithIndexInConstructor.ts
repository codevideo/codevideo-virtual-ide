import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualIDE } from "../../src/VirtualIDE";

describe("VirtualIDE", () => {
    describe("creating virtual IDE with actions and action index", () => {
        it("should be able to create the correct course snapshot with initial actions and index", () => {
            const actions: Array<IAction> = [
                {
                    name: "author-speak-before",
                    value: "Hello, world!"
                }
            ]
            const finalActionIndex = actions.length - 1;
            const virtualIDE = new VirtualIDE(actions, finalActionIndex);

            const courseSnapshot = virtualIDE.getCourseSnapshot();
            expect(courseSnapshot.authorSnapshot.authors[0].currentSpeechCaption).toBe("Hello, world!");
        });
    });
});