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
      expect(courseSnapshot.editorSnapshot.editors[0].caretPosition).toStrictEqual({ row: 2, col: 4 });

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
    it("should not confuse numbers in text when there are many numbers and new lines", () => {
      const content = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28";
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
          value: content
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(actions);

      // Get final state
      const courseSnapshot = virtualIDE.getCourseSnapshot();

      // Verify that we have test.txt file open with correct content
      expect(virtualIDE.getOpenFiles()).toEqual(["test.txt"]);
      expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("test.txt");
      expect(courseSnapshot.editorSnapshot.editors[0].content).toBe(content);
      expect(courseSnapshot.editorSnapshot.editors[0].caretPosition).toStrictEqual({ row: 28, col: 3 });

      // The file should not be saved yet since no save action was performed
      expect(courseSnapshot.editorSnapshot.editors[0].isSaved).toBe(false);

      // Verify file structure - caret position and content for file explorer still initial / empty because we didn't save it
      expect(courseSnapshot.fileExplorerSnapshot.fileStructure).toEqual({
        "test.txt": {
          caretPosition: {
            row: 0,
            col: 0
          },
          type: "file",
          content: "",
          language: "txt"
        }
      });

      // issue save action
      virtualIDE.applyAction({name: "editor-save", value: "1"});

      // verify file structure after save
      expect(courseSnapshot.fileExplorerSnapshot.fileStructure).toEqual({
        "test.txt": {
          caretPosition: {
            row: 28,
            col: 3
          },
          type: "file",
          content: content, // content should be saved 
          language: "txt"
        }
      });
    });
  });
});