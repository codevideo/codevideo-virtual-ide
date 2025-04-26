import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
  describe("create file in folder using mouse", () => {
    it("should correctly place the new file inside the folder", () => {
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
          collapsed: false,
          children: {}
        }
      });
      
      console.log("File structure after folder creation:", 
        JSON.stringify(folderSnapshot.fileStructure, null, 2));
      console.log("newFileParentPath:", folderSnapshot.newFileParentPath);
      console.log("newFolderParentPath:", folderSnapshot.newFolderParentPath);
      
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
      console.log("After right-click on src folder:");
      console.log("isNewFileInputVisible:", afterRightClickSnapshot.isNewFileInputVisible);
      console.log("newFileParentPath:", afterRightClickSnapshot.newFileParentPath);
      console.log("newFolderParentPath:", afterRightClickSnapshot.newFolderParentPath);
      
      // Verify file input is visible
      expect(afterRightClickSnapshot.isNewFileInputVisible).toBe(true);
      
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
      console.log("Final file structure:", 
        JSON.stringify(finalSnapshot.fileStructure, null, 2));
      
      // CRITICAL TEST: Verify the file was created inside the src folder using full structure comparison
      expect(finalSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: false,
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
    });
  });
});