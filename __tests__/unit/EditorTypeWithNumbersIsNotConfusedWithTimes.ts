import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";

describe("VirtualIDE", () => {
  describe("editor type with numbers", () => {
    it("should not confuse numbers in text with repetition counts", () => {
      const virtualIDE = new VirtualIDE();
      
      const actions: IAction[] = [
        {
          name: "file-explorer-create-file",
          value: "test.txt"
        },
        {
          name: "file-explorer-open-file",
          value: "test.txt"
        },
        {
          name: "editor-type",
          value: "123\nABC"
        },
        {
            name: "editor-save",
            value: "1"
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(actions);

      // Get final state
      const courseSnapshot = virtualIDE.getCourseSnapshot();

      // Verify that we have test.txt file open with correct content
      expect(virtualIDE.getOpenFiles()).toEqual(["test.txt"]);
      expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("test.txt");
      expect(courseSnapshot.editorSnapshot.editors[0].content).toBe("123\nABC");
      expect(courseSnapshot.editorSnapshot.editors[0].caretPosition).toStrictEqual({row: 2, col: 4});
      
      // The file should not be saved yet since no save action was performed
      expect(courseSnapshot.editorSnapshot.editors[0].isSaved).toBe(true);

            // Verify file structure
      expect(courseSnapshot.fileExplorerSnapshot.fileStructure).toEqual({
        "test.txt": {
          caretPosition: {
            row: 2,
            col: 4
          },
          type: "file",
          content: "123\nABC",
          language: "txt"
        }
      });
    });
  });
});