import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
  describe("create file in folder using mouse", () => {
    it("should correctly place the new file inside the folder and reset parent paths", () => {
      // Initialize the Virtual IDE
      const virtualIDE = new VirtualIDE(undefined, undefined, false);
      virtualIDE.addVirtualTerminal(new VirtualTerminal());
      virtualIDE.addVirtualAuthor(new VirtualAuthor());

      // STEP 1: Create a src folder at the root level
      const createFolderActions: IAction[] = [
        // Move mouse to file explorer and right-click
        { name: "mouse-move-file-explorer", value: "1" },
        { name: "mouse-right-click", value: "1" },
        // Select "New Folder" from context menu
        { name: "mouse-move-file-explorer-context-menu-new-folder", value: "1" },
        { name: "mouse-left-click", value: "1" },
        // Type folder name and press enter
        { name: "file-explorer-type-new-folder-input", value: "src" },
        { name: "file-explorer-enter-new-folder-input", value: "1" }
      ];

      // Apply actions to create the folder
      virtualIDE.applyActions(createFolderActions);

      // Verify src folder was created
      const folderSnapshot = virtualIDE.getFileExplorerSnapshot();
      expect(folderSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: true,
          children: {}
        }
      });

      //console.log("File structure after folder creation:",
       // JSON.stringify(folderSnapshot.fileStructure, null, 2));
      //console.log("newFileParentPath:", folderSnapshot.newFileParentPath);
      //console.log("newFolderParentPath:", folderSnapshot.newFolderParentPath);

      // STEP 2: Create a new file inside the src folder
      const createFileActions: IAction[] = [
        // Move mouse to the src folder and right-click
        { name: "mouse-move-file-explorer-folder", value: "src" },
        { name: "mouse-right-click", value: "1" },
        // Select "New File" from context menu
        { name: "mouse-move-file-explorer-folder-context-menu-new-file", value: "1" },
        { name: "mouse-left-click", value: "1" }
      ];

      // Apply actions to open new file input
      virtualIDE.applyActions(createFileActions);

      // Log state after right-clicking and selecting "New File"
      const afterRightClickSnapshot = virtualIDE.getFileExplorerSnapshot();
      // console.log("After right-click on src folder:");
      // console.log("isNewFileInputVisible:", afterRightClickSnapshot.isNewFileInputVisible);
      // console.log("newFileParentPath:", afterRightClickSnapshot.newFileParentPath);
      // console.log("newFolderParentPath:", afterRightClickSnapshot.newFolderParentPath);

      // Verify file input is visible and parent path is set correctly
      expect(afterRightClickSnapshot.isNewFileInputVisible).toBe(true);
      expect(afterRightClickSnapshot.newFileParentPath).toBe("src");

      // Type file name and press enter
      const typeFileNameActions: IAction[] = [
        { name: "file-explorer-type-new-file-input", value: "index.ts" },
        { name: "file-explorer-enter-new-file-input", value: "1" }
      ];

      // Apply actions to create the file
      virtualIDE.applyActions(typeFileNameActions);

      // Get final state
      const finalSnapshot = virtualIDE.getFileExplorerSnapshot();

      // Log the final file structure for debugging
      // console.log("Final file structure:",
      //   JSON.stringify(finalSnapshot.fileStructure, null, 2));

      // CRITICAL TEST: Verify the file was created inside the src folder using full structure comparison
      expect(finalSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: true,
          children: {
            "index.ts": {
              type: "file",
              content: "",
              language: "ts",
              caretPosition: {
                row: 0,
                col: 0
              }
            }
          }
        }
      });

      // Verify the opened file in the editor has the correct path
      const editorSnapshot = virtualIDE.getEditorSnapshot();
      expect(editorSnapshot.editors.length).toBe(1);
      expect(editorSnapshot.editors[0].filename).toBe("src/index.ts");

      // STEP 3: Create another file at the root level to test path reset
      // console.log("Testing parent path reset...");

      // Check parent paths after creating the nested file
      const afterNestedFileSnapshot = virtualIDE.getFileExplorerSnapshot();
      // console.log("Parent paths after nested file creation:");
      // console.log("newFileParentPath:", afterNestedFileSnapshot.newFileParentPath);
      // console.log("newFolderParentPath:", afterNestedFileSnapshot.newFolderParentPath);

      // TEST THAT THE FIX ADDRESSES: Path should be reset after file creation
      // If this fails, it indicates the bug where parent path is remembered
      expect(afterNestedFileSnapshot.newFileParentPath).toBe("");

      // Now try to create a file at the root level
      const createRootFileActions: IAction[] = [
        // Move mouse to file explorer and right-click
        { name: "mouse-move-file-explorer", value: "1" },
        { name: "mouse-right-click", value: "1" },
        // Select "New File" from context menu
        { name: "mouse-move-file-explorer-context-menu-new-file", value: "1" },
        { name: "mouse-left-click", value: "1" }
      ];

      // Apply actions to open new file input at root
      virtualIDE.applyActions(createRootFileActions);

      // Verify that when creating a file at root, parent path is empty
      const rootFileContextSnapshot = virtualIDE.getFileExplorerSnapshot();
      console.log("After right-click for root file:");
      console.log("isNewFileInputVisible:", rootFileContextSnapshot.isNewFileInputVisible);
      console.log("newFileParentPath:", rootFileContextSnapshot.newFileParentPath);

      // TEST FOR THE FIXED BEHAVIOR: Parent path should be empty for root-level file
      expect(rootFileContextSnapshot.newFileParentPath).toBe("");

      // Create the root file
      const typeRootFileNameActions: IAction[] = [
        { name: "file-explorer-type-new-file-input", value: "config.json" },
        { name: "file-explorer-enter-new-file-input", value: "1" }
      ];

      // Apply actions to create the file at root
      virtualIDE.applyActions(typeRootFileNameActions);

      // Verify the final structure includes both the nested file and root file
      const finalRootFileSnapshot = virtualIDE.getFileExplorerSnapshot();
      expect(finalRootFileSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: true,
          children: {
            "index.ts": {
              type: "file",
              content: "",
              language: "ts",
              caretPosition: {
                row: 0,
                col: 0
              }
            }
          }
        },
        "config.json": {
          type: "file",
          content: "",
          language: "json",
          caretPosition: {
            row: 0,
            col: 0
          }
        }
      });
    });

    it("should create proper paths in the file explorer", () => {
      const actions: Array<IAction> = [
        {
          "name": "file-explorer-create-folder",
          "value": "typescript"
        },
        {
          "name": "mouse-move-file-explorer-folder",
          "value": "typescript"
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
        {
          "name": "file-explorer-type-new-file-input",
          "value": "tsconfig.json"
        },
        {
          "name": "file-explorer-enter-new-file-input",
          "value": "1"
        },
      ]

      const virtualIDE = new VirtualIDE();

      // apply all actions
      virtualIDE.applyActions(actions);

      // ensure that the file explorer has the correct structure i.e. typescript/tsconfig.json
      const fileExplorerSnapshot = virtualIDE.getFileExplorerSnapshot();
      expect(fileExplorerSnapshot.fileStructure).toEqual({
        "typescript": {
          type: "directory",
          content: "",
          collapsed: true,
          children: {
            "tsconfig.json": {
              type: "file",
              content: "",
              language: "json",
              caretPosition: {
                row: 0,
                col: 0
              }
            }
          }
        }
      });
    });
  });
});