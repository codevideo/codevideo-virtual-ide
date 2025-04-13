import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
    describe("complex tutorial scenario", () => {
        it("left clicking after moving to a file", () => {
            const virtualIDE = new VirtualIDE(undefined, undefined, false);
            virtualIDE.addVirtualTerminal(new VirtualTerminal());
            virtualIDE.addVirtualAuthor(new VirtualAuthor());
            const tutorialActions: IAction[] = [
                // Initial setup - use file explorer to create folder and file
                {
                    name: "file-explorer-create-folder",
                    value: "src"
                },
                {
                    name: "file-explorer-create-file",
                    value: "src/hello-world.js"
                },
                // then use mouse to create a file
                {
                    name: "mouse-move-file-explorer-file",
                    value: "src/hello-world.js"
                },
                {
                    name: "mouse-left-click",
                    value: "1"
                }
            ];

            // Apply all actions
            virtualIDE.applyActions(tutorialActions);

            // Get final state
            const courseSnapshot = virtualIDE.getCourseSnapshot();

            // also we expect the mouse snapshot to still be on the file
            expect(courseSnapshot.mouseSnapshot.location).toBe("file-explorer-file");
            expect(courseSnapshot.mouseSnapshot.currentHoveredFileName).toBe("src/hello-world.js");

            // Verify that we have 1 editor open with file name "src/hello-world.js"
            expect(courseSnapshot.editorSnapshot.editors.length).toBe(1);
            expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("src/hello-world.js");
        });
    });
});