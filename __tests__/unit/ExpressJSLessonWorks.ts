import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { lesson } from "../fixtures/expressJSLesson";

describe("VirtualIDE", () => {
    describe("large express js exploration lesson", () => {
        it("should not crash when applying all actions", () => {
            for (var i = 0; i < lesson.actions.length; i++) {
                const virtualIDE = new VirtualIDE(lesson, i);
            }
        });

        it("should show the contents of package.json after it is opened", () => {
            // take starting point but none of the actions
            const virtualIDE = new VirtualIDE(lesson, 0);
            // open the package.json file
            virtualIDE.applyAction({
                name: "file-explorer-open-file",
                value: "package.json"
            });

            // get snapshot
            const courseSnapshot = virtualIDE.getCourseSnapshot();

            // check that the package.json is in the open editors and has contents
            expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("package.json");
            expect(courseSnapshot.editorSnapshot.editors[0].content).toContain("express");

        })
    });
});