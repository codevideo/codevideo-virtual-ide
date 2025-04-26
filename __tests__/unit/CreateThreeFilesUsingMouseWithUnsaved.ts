import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
  describe("create three files using mouse", () => {
    it("should be able to create three files using the mouse, show an unsaved changes dialog, and close editor tabs", () => {
      const virtualIDE = new VirtualIDE(undefined, undefined, false);
      const aTxtActions: IAction[] = [
        {
          name: "author-speak-before",
          value: "Today, we're going to learn about how to use the console.log function in JavaScript."
        },
        {
          name: "author-speak-before",
          value: "Let's create a a.txt file"
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
          value: "a.txt"
        },
      ];

      // Apply all actions
      virtualIDE.applyActions(aTxtActions);
      // expect that the file explorer snapshot newFileInputValue is "a.txt" and it is visible
      expect(virtualIDE.getFileExplorerSnapshot().newFileInputValue).toBe("a.txt");
      expect(virtualIDE.getFileExplorerSnapshot().isNewFileInputVisible).toBe(true);

      // now press enter to create the file
      const enterActions: IAction[] = [
        {
          name: "file-explorer-enter-new-file-input",
          value: "1"
        }
      ];


      // Apply all actions
      virtualIDE.applyActions(enterActions);

      // Get the course snapshot
      const courseSnapshot = virtualIDE.getCourseSnapshot();

      // verify that the file was created and is already in saved state (this is default behavior when making new files in an IDE like visual studio code)
      expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("a.txt");
      expect(courseSnapshot.editorSnapshot.editors[0].content).toBe("")
      expect(courseSnapshot.editorSnapshot.editors[0].isSaved).toBe(true);

      // Now create a second file

      const bTxtActions: IAction[] = [
        {
          name: "author-speak-before",
          value: "Let's now create a b.txt file"
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
          value: "b.txt"
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(bTxtActions);
      // expect that the file explorer snapshot newFileInputValue is "b.txt" and it is visible
      expect(virtualIDE.getFileExplorerSnapshot().newFileInputValue).toBe("b.txt");
      expect(virtualIDE.getFileExplorerSnapshot().isNewFileInputVisible).toBe(true);
      // now press enter to create the file
      const enterActions2: IAction[] = [
        {
          name: "file-explorer-enter-new-file-input",
          value: "1"
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(enterActions2);

      // Get the course snapshot
      const newCourseSnapshot = virtualIDE.getCourseSnapshot();

      // verify that the file was created and is already in saved state (this is default behavior when making new files in an IDE like visual studio code)
      expect(newCourseSnapshot.editorSnapshot.editors[1].filename).toBe("b.txt");
      expect(newCourseSnapshot.editorSnapshot.editors[1].content).toBe("")
      expect(newCourseSnapshot.editorSnapshot.editors[1].isSaved).toBe(true);

      // Now create a third file

      const cTxtActions: IAction[] = [
        {
          name: "author-speak-before",
          value: "Let's now create a c.txt file"
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
          value: "c.txt"
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(cTxtActions);
      // expect that the file explorer snapshot newFileInputValue is "c.txt" and it is visible
      expect(virtualIDE.getFileExplorerSnapshot().newFileInputValue).toBe("c.txt");
      expect(virtualIDE.getFileExplorerSnapshot().isNewFileInputVisible).toBe(true);
      // now press enter to create the file
      const enterActions3: IAction[] = [
        {
          name: "file-explorer-enter-new-file-input",
          value: "1"
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(enterActions3);

      // Get the course snapshot
      const newNewCourseSnapshot = virtualIDE.getCourseSnapshot();

      // verify that the file was created and is already in saved state (this is default behavior when making new files in an IDE like visual studio code)
      expect(newNewCourseSnapshot.editorSnapshot.editors[2].filename).toBe("c.txt");
      expect(newNewCourseSnapshot.editorSnapshot.editors[2].content).toBe("")
      expect(newNewCourseSnapshot.editorSnapshot.editors[2].isSaved).toBe(true);

      // now when we type editor, it should be in the current c.txt file, and the saved state should be false
      const typeActions: IAction[] = [
        {
          name: 'mouse-move-editor',
          value: '1'
        },
        {
          name: 'mouse-left-click',
          value: '1'
        },
        {
          name: "editor-type",
          value: "console.log('Hello, world!');"
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(typeActions);
      // Get the course snapshot
      const courseSnapshot4 = virtualIDE.getCourseSnapshot();

      // verify that the file was created and is now in unsaved state
      expect(courseSnapshot4.editorSnapshot.editors[2].filename).toBe("c.txt");
      expect(courseSnapshot4.editorSnapshot.editors[2].content).toBe("console.log('Hello, world!');")
      expect(courseSnapshot4.editorSnapshot.editors[2].isSaved).toBe(false);

      // now we attempt to close the file
      const closeActions: IAction[] = [
        {
          name: "mouse-move-editor-tab-close",
          value: "c.txt"
        },
        {
          name: "mouse-left-click",
          value: "1"
        }
      ];

      // Apply all actions
      virtualIDE.applyActions(closeActions);

      // Get the course snapshot
      const courseSnapshot5 = virtualIDE.getCourseSnapshot();
      expect(courseSnapshot5.mouseSnapshot.location).toBe("editor-tab-close");
      expect(courseSnapshot5.mouseSnapshot.currentHoveredEditorTabFileName).toBe("c.txt");

      // verify that the unsaved changes dialog is shown
      expect(courseSnapshot5.isUnsavedChangesDialogOpen).toBe(true);


      // now we attempt to close the file and discard changes
      const closeActions2: IAction[] = [
        {
          name: "mouse-move-unsaved-changes-dialog-button-dont-save",
          value: "1"
        },
        {
          name: "mouse-left-click",
          value: "1"
        }
      ];
      // Apply all actions
      virtualIDE.applyActions(closeActions2);
      // Get the course snapshot
      const courseSnapshot6 = virtualIDE.getCourseSnapshot();
      // verify that the unsaved changes dialog is closed
      expect(courseSnapshot6.isUnsavedChangesDialogOpen).toBe(false);
      // verify that the file was closed
      expect(courseSnapshot6.editorSnapshot.editors.length).toBe(2);
      // verify that the file was closed
      expect(courseSnapshot6.editorSnapshot.editors[0].filename).toBe("a.txt");
      expect(courseSnapshot6.editorSnapshot.editors[1].filename).toBe("b.txt");

      // now move mouse to the a.txt tab close icon and click it
      const closeActions3: IAction[] = [
        {
          name: "mouse-move-editor-tab-close",
          value: "a.txt"
        },
        {
          name: "mouse-left-click",
          value: "1"
        }
      ];
      // Apply all actions
      virtualIDE.applyActions(closeActions3);
      // Get the course snapshot
      const courseSnapshot7 = virtualIDE.getCourseSnapshot();
      // verify that there is only one editor left and it is b.txt
      expect(courseSnapshot7.editorSnapshot.editors.length).toBe(1);
      // verify that the file was closed
      expect(courseSnapshot7.editorSnapshot.editors[0].filename).toBe("b.txt");

    });
  });
});