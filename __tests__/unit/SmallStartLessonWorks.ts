import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { lesson } from "../fixtures/testLesson";

describe("VirtualIDE", () => {
    describe("small two file code base exploration lesson", () => {
        it("should not crash when applying all actions", () => {
            for (var i = 0; i < lesson.actions.length; i++) {
                const virtualIDE = new VirtualIDE(lesson, i);
            }
        });

        it("should show the contents of package.json after it is opened", () => {
            // take starting point but none of the actions
            const virtualIDE = new VirtualIDE(lesson, 0);

            // already at the start we should see the two files with their contents
            const fileExplorerSnapshot = virtualIDE.getFileExplorerSnapshot();
            expect(fileExplorerSnapshot.fileStructure).toEqual({
                "package.json": {
                    "type": "file",
                    "content": "{ hey some package json content }",
                    "language": "json",
                    "caretPosition": {
                        "row": 0,
                        "col": 0
                    }
                },
                "index.js": {
                    "type": "file",
                    "content": "module.exports = require('./lib/express');",
                    "language": "javascript",
                    "caretPosition": {
                        "row": 0,
                        "col": 0
                    }
                }
            });


            // open the package.json file
            virtualIDE.applyAction({
                name: "file-explorer-open-file",
                value: "package.json"
            });

            // get snapshot
            const courseSnapshot = virtualIDE.getCourseSnapshot();

            // check that the package.json is in the open editors and has contents
            expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("package.json");
            expect(courseSnapshot.editorSnapshot.editors[0].content).toContain("{ hey some package json content }");

        })
    });
});