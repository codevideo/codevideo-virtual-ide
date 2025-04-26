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
        }]

      // Apply actions so far
      virtualIDE.applyActions(tutorialActions);


      // expect that the isNewFolderInputVisible to be true
      expect(virtualIDE.getFileExplorerSnapshot().isNewFolderInputVisible).toBe(true)


      const furtherActions: Array<IAction> = [{
        name: "file-explorer-type-new-folder-input",
        value: "src"
      }];


      // Apply further actions
      virtualIDE.applyActions(furtherActions);

      // new folder input should still be visible
      expect(virtualIDE.getFileExplorerSnapshot().isNewFolderInputVisible).toBe(true)

      const furtherActions2: Array<IAction> = [
        {
          name: "file-explorer-enter-new-folder-input",
          value: "1"
        }
      ];

      // Apply further actions2
      virtualIDE.applyActions(furtherActions2);

      // new folder input should not be visible
      expect(virtualIDE.getFileExplorerSnapshot().isNewFolderInputVisible).toBe(false)
      // expect that the src folder is created
      expect(virtualIDE.getFileExplorerSnapshot()).toEqual({
        fileStructure: {
          "src": {
            type: "directory",
            content: "",
            collapsed: false,
            children: {}
          }
        },
        "isFileContextMenuOpen": false,
        "isFileExplorerContextMenuOpen": false,
        "isFolderContextMenuOpen": false,
        "isNewFileInputVisible": false,
        "isNewFolderInputVisible": false,
        "isRenameFileInputVisible": false,
        "isRenameFolderInputVisible": false,
        "newFileInputValue": "",
        "newFolderInputValue": "",
        "originalFileBeingRenamed": "",
        "originalFolderBeingRenamed": "",
        "renameFileInputValue": "",
        "renameFolderInputValue": "",
        "newFileParentPath": "",
        "newFolderParentPath": "",
      })


      // now right click the src folder, left click the new file menu
      const createFileActions: Array<IAction> = [
        {
          "name": "mouse-move-file-explorer-folder",
          "value": "src"
        },
        {
          "name": "mouse-right-click",
          "value": "1"
        },
        {
          "name": "mouse-move-file-explorer-folder-context-menu-new-file",
          "value": "1"
        },
        {
          "name": "mouse-left-click",
          "value": "1"
        },
      ]

      // apply actions
      virtualIDE.applyActions(createFileActions)

      // expect isNewFileInputVisible be visible
      expect(virtualIDE.getFileExplorerSnapshot().isNewFileInputVisible).toBe(true)

      const typeFileNameActions: Array<IAction> = [
        {
          "name": "file-explorer-type-new-file-input",
          "value": "hello-world.js"
        },
        {
          "name": "file-explorer-enter-new-file-input",
          "value": "1"
        },
      ]

      // apply actions
      virtualIDE.applyActions(typeFileNameActions)

      // new file input should be hidden
      expect(virtualIDE.getFileExplorerSnapshot().isNewFileInputVisible).toBe(false)

      // expect that the hello-world.js file is in the input
      expect(virtualIDE.getFileExplorerSnapshot()).toEqual({
        fileStructure: {
          src: {
            type: 'directory', content: '', collapsed: false, children: {
              'hello-world.js': {
                type: 'file',
                content: '',
                language: 'js',
                caretPosition: {
                  col: 0,
                  row: 0,
                }
              }
            }
          },
        },
        isFileExplorerContextMenuOpen: false,
        isFileContextMenuOpen: false,
        isFolderContextMenuOpen: false,
        isNewFileInputVisible: false,
        isNewFolderInputVisible: false,
        newFileInputValue: '',
        newFolderInputValue: '',
        isRenameFileInputVisible: false,
        isRenameFolderInputVisible: false,
        originalFileBeingRenamed: '',
        originalFolderBeingRenamed: '',
        renameFileInputValue: '',
        renameFolderInputValue: '',
        newFileParentPath: 'src',
        newFolderParentPath: 'src',
      })

      // the editor should also be open in the editor
      expect(virtualIDE.getEditorSnapshot().editors.length).toEqual(1)
      expect(virtualIDE.getEditorSnapshot().editors[0].filename).toEqual("src/hello-world.js")
    });
  });
});