import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
  describe("complex tutorial scenario", () => {
    it("should maintain correct state throughout a complete tutorial", () => {
      const virtualIDE = new VirtualIDE();
      virtualIDE.addVirtualTerminal(new VirtualTerminal());
      virtualIDE.addVirtualAuthor(new VirtualAuthor());
      const tutorialActions: IAction[] = [
        // Initial setup explanation
        {
          name: "speak-before",
          value: "Today, we're going to learn about how to use the console.log function in JavaScript."
        },
        {
          name: "speak-before",
          value: "Let's first create a src folder."
        },
        {
          name: "create-folder",
          value: "src"
        },
        {
          name: "speak-before",
          value: "and now let's create a hello-world.js file inside it."
        },
        {
          name: "create-file",
          value: "src/hello-world.js"
        },

        // Opening and editing the first file
        {
          name: "speak-before",
          value: "Let's open up hello-world.js now..."
        },
        {
          name: "click-filename",
          value: "src/hello-world.js"
        },
        {
          name: "click-editor",
          value: "1"
        },
        {
          name: "type-editor",
          value: "console.log('Hello, world!');"
        },
        {
          name: "save-editor",
          value: "1"
        },

        // Terminal operations
        {
          name: "speak-before",
          value: "Now we'll open up a terminal and run this file."
        },
        {
          name: "open-terminal",
          value: "1"
        },
        {
          name: "click-terminal",
          value: "1"
        },
        {
          name: "type-terminal",
          value: "node src/hello-world.js"
        },
        {
          name: "enter",
          value: "1"
        },

        // Creating utility module
        {
          name: "speak-before",
          value: "Let's create a utilities module for our logger."
        },
        {
          name: "create-folder",
          value: "src/utils"
        },
        {
          name: "create-file",
          value: "src/utils/logger.js"
        },
        {
          name: "click-filename",
          value: "src/utils/logger.js"
        },
        {
          name: "click-editor",
          value: "1"
        },
        {
          name: "type-editor",
          value: "export const log = (message) => {\n    console.log(message);\n}"
        },
        {
          name: "save-editor",
          value: "1"
        },

        // Updating main file
        {
          name: "click-filename",
          value: "src/hello-world.js"
        },
        {
          name: "click-editor",
          value: "1"
        },
        {
          name: "type-editor",
          value: "const { log } = require('./utils/logger');\n\nlog('Hello, world!');"
        },
        {
          name: "save-editor",
          value: "1"
        },

        // Final run
        {
          name: "click-terminal",
          value: "1"
        },
        {
          name: "type-terminal",
          value: "node src/hello-world.js"
        },
        {
          name: "enter",
          value: "1"
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(tutorialActions);

      // Get final state
      const courseSnapshot = virtualIDE.getCourseSnapshot();

      // Verify file structure
      expect(courseSnapshot.editorSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: false,
          children: {
            "hello-world.js": {
              caretPosition: {
                row: 0,
                col: 0
              },
              type: "file",
              content: "",
              cursorPosition: {
                x: 0,
                y: 0
              },
              language: "js"
            },
            "utils": {
              type: "directory",
              content: "",
              collapsed: false,
              children: {
                "logger.js": {
                  caretPosition: {
                    row: 0,
                    col: 0
                  },
                  type: "file",
                  content: "",
                  cursorPosition: {
                    x: 0,
                    y: 0
                  },
                  language: "js"
                }
              }
            }
          }
        }
      });

      // Verify open files
      expect(virtualIDE.getOpenFiles()).toEqual([
        "src/hello-world.js",
        "src/utils/logger.js"
      ]);

      // Verify current file
      expect(courseSnapshot.editorSnapshot.currentFile).toBe("src/hello-world.js");

      // Verify editor contents - TODO: does it make sense to have methods on the finalstate object to get the contents of a file?
      expect(virtualIDE.getFileContents("src/hello-world.js")).toBe(
        "const { log } = require('./utils/logger');\n\nlog('Hello, world!');"
      );
      expect(virtualIDE.getFileContents("src/utils/logger.js")).toBe(
        "export const log = (message) => {\n    console.log(message);\n}"
      );

      // Verify terminal state
      expect(courseSnapshot.editorSnapshot.terminalContents).toBe("node src/hello-world.js");

      // Verify mouse snapshot
      expect(courseSnapshot.mouseSnapshot).toEqual({
        x: 0,
        y: 0,
        timestamp: 0,
        type: 'move',
        buttonStates: {
          left: false,
          right: false,
          middle: false,
        },
        scrollPosition: {
          x: 0,
          y: 0,
        },
      });

      // Verify author snapshot (so far only speech caption)
      expect(courseSnapshot.authorSnapshot.currentSpeechCaption).toBe("Let's create a utilities module for our logger.");
    });
  });
});