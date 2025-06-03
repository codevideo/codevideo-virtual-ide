import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
  describe("create file using mouse", () => {
    it("should be able to create a folder and file using the mouse", () => {
      const virtualIDE = new VirtualIDE(undefined, undefined, false);
      virtualIDE.addVirtualTerminal(new VirtualTerminal());
      virtualIDE.addVirtualAuthor(new VirtualAuthor());
      const tutorialActions: IAction[] = [
        // Initial setup explanation
        {
          name: "author-speak-before",
          value: "Today, we're going to learn about how to use the console.log function in JavaScript."
        },
        {
          name: "author-speak-before",
          value: "Let's first create a src folder."
        },
        {
          name: "mouse-move-file-explorer",
          value: "1"
        },
        {
          name: "mouse-right-click",
          value: "1"
        },
        {
          name: "mouse-move-file-explorer-context-menu-new-folder",
          value: "1"
        },
        {
          name: "mouse-left-click",
          value: "1"
        },
        {
          name: "file-explorer-type-new-folder-input",
          value: "src"
        },
        {
          name: "file-explorer-enter-new-folder-input",
          value: "1"
        },
        {
          name: "author-speak-before",
          value: "and now let's create a hello-world.js file inside it."
        },
        {
          name: "mouse-move-file-explorer-folder",
          value: "src"
        },
        {
          name: "mouse-right-click",
          value: "1"
        },
        {
          name: "mouse-move-file-explorer-folder-context-menu-new-file",
          value: "1"
        },
        {
          name: "mouse-left-click",
          value: "1"
        },
        {
          name: "file-explorer-type-new-file-input",
          value: "src/hello-world.js" // in codevideo actions, paths must always be relative to the root
        },
        {
          name: "file-explorer-enter-new-file-input", // this should trigger the file creation, open the file, and focus
          value: "1"
        },
        {
          name: "editor-type",
          value: "console.log('Hello, world!');"
        },
        {
          name: "editor-save",
          value: "1"
        },
      ];

      // Apply all actions
      virtualIDE.applyActions(tutorialActions);

      // Get final state
      const courseSnapshot = virtualIDE.getCourseSnapshot();

      // Verify file structure
      expect(courseSnapshot.fileExplorerSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: false,
          children: {
            "hello-world.js": {
              caretPosition: {
                row: 1,
                col: 30
              },
              type: "file",
              content: "console.log('Hello, world!');",
              language: "js"
            },
          }
        }
      });

      expect(virtualIDE.getOpenFiles()).toEqual([
        "src/hello-world.js",
      ]);

      // Verify that we have a src/hello-world.js file with the correct content and it is saved!
      expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("src/hello-world.js");
      expect(courseSnapshot.editorSnapshot.editors[0].content).toBe("console.log('Hello, world!');")
      expect(courseSnapshot.editorSnapshot.editors[0].isSaved).toBe(true);

    });
  });
});