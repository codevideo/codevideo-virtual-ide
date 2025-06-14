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
      const content1 = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10";
      const content2 = "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28";
      const virtualIDE = new VirtualIDE();

      const actions: IAction[] = [
        {
          name: "file-explorer-create-file",
          value: "test1.txt"
        },
        {
          name: "file-explorer-open-file",
          value: "test1.txt"
        },
        {
          name: "editor-type",
          value: content1
        },
        {
          name: "editor-save",
          value: "1"
        },
        {
          name: "file-explorer-create-file",
          value: "test2.txt"
        },
        {
          name: "file-explorer-open-file",
          value: "test2.txt"
        },
        {
          name: "editor-type",
          value: content2
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(actions);

      // Get final state
      const courseSnapshot = virtualIDE.getCourseSnapshot();

      // Verify that we have test.txt file open with correct content
      expect(virtualIDE.getOpenFiles()).toEqual(["test1.txt", "test2.txt"]);
      expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("test1.txt");
      expect(courseSnapshot.editorSnapshot.editors[1].filename).toBe("test2.txt");
      expect(courseSnapshot.editorSnapshot.editors[0].content).toBe(content1);
      expect(courseSnapshot.editorSnapshot.editors[1].content).toBe(content2);
      expect(courseSnapshot.editorSnapshot.editors[0].caretPosition).toStrictEqual({ row: 10, col: 3 });
      expect(courseSnapshot.editorSnapshot.editors[1].caretPosition).toStrictEqual({ row: 28, col: 3 });

      // The file should not be saved yet since no save action was performed
      expect(courseSnapshot.editorSnapshot.editors[0].isSaved).toBe(true);
      expect(courseSnapshot.editorSnapshot.editors[1].isSaved).toBe(false);

      // Verify file structure - caret position and content for file explorer still initial / empty because we didn't save it
      expect(courseSnapshot.fileExplorerSnapshot.fileStructure).toEqual({
        "test1.txt": {
          caretPosition: {
            row: 10,
            col: 3
          },
          type: "file",
          content: content1, // content should be saved
          language: "txt"
        },
        "test2.txt": {
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
      virtualIDE.applyAction({ name: "editor-save", value: "1" });

      // verify file structure after save
      expect(courseSnapshot.fileExplorerSnapshot.fileStructure).toEqual({
        "test1.txt": {
          caretPosition: {
            row: 10,
            col: 3
          },
          type: "file",
          content: content1, // content should be saved
          language: "txt"
        },
        "test2.txt": {
          caretPosition: {
            row: 28,
            col: 3
          },
          type: "file",
          content: content2, // content should be saved
          language: "txt"
        }
      });
    });
    it("should reset caret position when saving and opening multiple files", () => {
      const actions: Array<IAction> = [
        {
          "name": "author-speak-before",
          "value": "Welcome to this lesson where we'll build a simple web app while testing some exciting new CodeVideo features! We'll create an HTML file, a JavaScript file, and a CSS file, then use the external web preview to see our app in action."
        },
        {
          "name": "slide-display",
          "value": "# CodeVideo New Features!\n\n- Web Preview\n- Editor Scrolling\n- Color Changes with Preview Updates"
        },
        {
          "name": "author-speak-before",
          "value": "Let's start by creating our HTML file. We'll right-click in the file explorer to create a new file."
        },
        {
          "name": "mouse-move-file-explorer",
          "value": "1"
        },
        {
          "name": "mouse-right-click",
          "value": "1"
        },
        {
          "name": "mouse-move-file-explorer-context-menu-new-file",
          "value": "1"
        },
        {
          "name": "mouse-left-click",
          "value": "1"
        },
        {
          "name": "file-explorer-type-new-file-input",
          "value": "index.html"
        },
        {
          "name": "file-explorer-enter-new-file-input",
          "value": "1"
        },
        {
          "name": "author-speak-before",
          "value": "Great. Now let's add some basic HTML structure to our file."
        },
        {
          "name": "editor-type",
          "value": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Feature Test App</title>\n    <link rel=\"stylesheet\" href=\"styles.css\">\n</head>\n<body>\n    <div class=\"container\">\n        <h1 id=\"title\">/> CodeVideo Web Preview Example!</h1>\n    </div>\n    <script src=\"index.js\"></script>\n</body>\n</html>"
        },
        {
          "name": "editor-save",
          "value": "1"
        },
        {
          "name": "author-speak-before",
          "value": "Now let's create our JavaScript file to add some interactivity."
        },
        {
          "name": "mouse-move-file-explorer",
          "value": "1"
        },
        {
          "name": "mouse-right-click",
          "value": "1"
        },
        {
          "name": "mouse-move-file-explorer-context-menu-new-file",
          "value": "1"
        },
        {
          "name": "mouse-left-click",
          "value": "1"
        },
        {
          "name": "file-explorer-type-new-file-input",
          "value": "index.js"
        },
        {
          "name": "file-explorer-enter-new-file-input",
          "value": "1"
        },
        {
          "name": "editor-type",
          "value": "document.addEventListener('DOMContentLoaded', function() {\n    const title = document.getElementById('title');\n    let isBlue = true;\n\n    // toggle title color from blue to green every second\n    setInterval(() => {\n        title.style.color = isBlue ? 'green' : 'blue';\n        isBlue = !isBlue;\n    }, 1000);\n});"
        },
        {
          "name": "editor-save",
          "value": "1"
        },
        {
          "name": "author-speak-before",
          "value": "Now let's create our CSS file."
        },
        {
          "name": "mouse-move-file-explorer",
          "value": "1"
        },
        {
          "name": "mouse-right-click",
          "value": "1"
        },
        {
          "name": "mouse-move-file-explorer-context-menu-new-file",
          "value": "1"
        },
        {
          "name": "mouse-left-click",
          "value": "1"
        },
        {
          "name": "file-explorer-type-new-file-input",
          "value": "styles.css"
        },
        {
          "name": "file-explorer-enter-new-file-input",
          "value": "1"
        },
        {
          "name": "editor-type",
          "value": "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n"
        },
        {
          "name": "editor-save",
          "value": "1"
        },
        {
          "name": "author-speak-before",
          "value": "Perfect. Now let's test the web preview feature to see our app in action."
        },
        {
          "name": "external-web-preview",
          "value": "1"
        },
        {
          "name": "author-speak-before",
          "value": "Great. Our app is working. Now let's make a quick color change to test the web preview refresh."
        },
        {
          "name": "file-explorer-open-file",
          "value": "styles.css"
        },
        {
          "name": "editor-arrow-up",
          "value": "100"
        },
        {
          "name": "editor-arrow-up",
          "value": "8"
        },
        {
          "name": "editor-arrow-left",
          "value": "2"
        },
        {
          "name": "author-speak-before",
          "value": "We'll change the background color from that blue purple gradient to a bright green one."
        },
        {
          "name": "editor-backspace",
          "value": "61"
        },
        {
          "name": "editor-type",
          "value": "background: linear-gradient(135deg, #35c230 0%, #4ba27b 100%)"
        },
        {
          "name": "editor-save",
          "value": "1"
        },
        {
          "name": "author-speak-before",
          "value": "Let's see our updated app with the new green background color!"
        },
        {
          "name": "external-web-preview",
          "value": "index.html"
        },
        {
          "name": "author-speak-before",
          "value": "Excellent. The web preview has updated with our new green background."
        },
        {
          "name": "author-speak-before",
          "value": "Perfect. We've successfully tested all the new CodeVideo features: web preview of our local development files, editor scrolling to navigate through our CSS file, and color changes with preview updates. Our simple web app demonstrates how these features work together to create a smooth educational experience."
        }
      ];
      const virtualIDE = new VirtualIDE();
      // Apply all actions up to index 30 - saving of the CSS file
      virtualIDE.applyActions(actions.slice(0, 30));


      // since we're writing a dummy css up to 28 lines, the caret position should be at the end of the file
      const courseSnapshot = virtualIDE.getCourseSnapshot();
      expect(virtualIDE.getOpenFiles()).toEqual(["index.html", "index.js", "styles.css"]);
      expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("index.html");
      expect(courseSnapshot.editorSnapshot.editors[1].filename).toBe("index.js");
      expect(courseSnapshot.editorSnapshot.editors[2].filename).toBe("styles.css");
      // expect the caret position to be at the end of the file
      expect(courseSnapshot.editorSnapshot.editors[0].caretPosition).toStrictEqual({ row: 15, col: 8 });

    });
  });
});