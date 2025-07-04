import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
  describe("complex tutorial scenario", () => {
    it("should maintain correct state throughout a complete tutorial", () => {
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
          name: "file-explorer-create-folder",
          value: "src"
        },
        {
          name: "author-speak-before",
          value: "and now let's create a hello-world.js file inside it."
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
          name: "mouse-move-file-explorer-context-menu-new-file",
          value: "1"
        },
        {
          name: "mouse-left-click",
          value: "1"
        },
        {
          name: "file-explorer-type-new-file-input",
          value: "src/hello-world.js"
        },
        {
          name: "file-explorer-enter-new-file-input",
          value: "1"
        },

        // Opening and editing the first file
        {
          name: "author-speak-before",
          value: "Let's open up hello-world.js now..."
        },
        {
          name: "file-explorer-open-file",
          value: "src/hello-world.js"
        },
        {
          name: "mouse-move-editor",
          value: "1"
        },
        {
          name: "mouse-left-click",
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

        // Terminal operations
        {
          name: "author-speak-before",
          value: "Now we'll open up a terminal and run this file."
        },
        {
          name: "terminal-open",
          value: "1"
        },
        {
          name: "mouse-move-terminal",
          value: "1"
        },
        {
          name: "mouse-left-click",
          value: "1"
        },
        {
          name: "terminal-type",
          value: "node src/hello-world.js"
        },
        {
          name: "terminal-enter",
          value: "1"
        },

        // Creating utility module
        {
          name: "author-speak-before",
          value: "Let's create a utilities module for our logger."
        },
        {
          name: "file-explorer-create-folder",
          value: "src/utils"
        },
        {
          name: "file-explorer-create-file",
          value: "src/utils/logger.js"
        },
        {
          name: "file-explorer-open-file",
          value: "src/utils/logger.js"
        },
        {
          name: "mouse-move-editor",
          value: "1"
        },
        {
          name: "mouse-left-click",
          value: "1"
        },
        {
          name: "editor-type",
          value: "export const log = (message) => {\n    console.log(message);\n}"
        },
        {
          name: "editor-save",
          value: "1"
        },

        // Updating main file
        {
          name: "mouse-move-file-explorer-file",
          value: "src/hello-world.js"
        },
        {
          name: "mouse-left-click",
          value: "1"
        },
        {
          name: "mouse-move-editor",
          value: "1"
        },
        {
          name: "mouse-left-click",
          value: "1"
        },
        {
          name: "editor-backspace",
          value: "40"
        },
        {
          name: "editor-type",
          value: "const { log } = require('./utils/logger');\n\nlog('Hello, world!');"
        },
        {
          name: "editor-save",
          value: "1"
        },

        // Final run
        {
          name: "mouse-move-terminal",
          value: "1"
        },
        {
          name: "mouse-left-click",
          value: "1"
        },
        {
          name: "terminal-type",
          value: "node src/hello-world.js"
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
          collapsed: true,
          children: {
            "hello-world.js": {
              caretPosition: {
                row: 3,
                col: 22
              },
              type: "file",
              content: "const { log } = require('./utils/logger');\n\nlog('Hello, world!');",
              language: "js"
            },
            "utils": {
              type: "directory",
              content: "",
              collapsed: true,
              children: {
                "logger.js": {
                  caretPosition: {
                    row: 3,
                    col: 2
                  },
                  type: "file",
                  content: "export const log = (message) => {\n    console.log(message);\n}",
                  language: "js"
                }
              }
            }
          }
        }
      });

      expect(virtualIDE.getOpenFiles()).toEqual([
        "src/hello-world.js",
        "src/utils/logger.js"
      ]);

      // Verify editors state
      expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("src/hello-world.js");
      expect(courseSnapshot.editorSnapshot.editors[0].content).toBe("const { log } = require('./utils/logger');\n\nlog('Hello, world!');")
      expect(courseSnapshot.editorSnapshot.editors[0].isSaved).toBe(true);
      expect(courseSnapshot.editorSnapshot.editors[1].filename).toBe("src/utils/logger.js");
      expect(courseSnapshot.editorSnapshot.editors[1].content).toBe("export const log = (message) => {\n    console.log(message);\n}");
      expect(courseSnapshot.editorSnapshot.editors[1].isSaved).toBe(true);

      // Verify terminal state
      expect(courseSnapshot.terminalSnapshot.terminals[0].content).toBe("node src/hello-world.js");

      // after issuing terminal-enter, the terminal should be empty
      virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
      expect(virtualIDE.getCourseSnapshot().terminalSnapshot.terminals[0].content).toBe("");

      // Verify mouse snapshot
      expect(courseSnapshot.mouseSnapshot).toEqual({
        x: 0,
        y: 0,
        timestamp: 0,
        type: 'move',
        button: 0,
        buttonStates: {
          left: false,
          right: false,
          middle: false,
        },
        currentHoveredFileName: "",
        currentHoveredFolderName: "",
        currentHoveredEditorTabFileName: "",
        location: "terminal",
        scrollDelta: 0,
        scrollPosition: {
          x: 0,
          y: 0,
        },
      });

      // Verify author snapshot (so far only speech caption)
      expect(courseSnapshot.authorSnapshot.authors[0].currentSpeechCaption).toBe("Let's create a utilities module for our logger.");
    });
  });
});