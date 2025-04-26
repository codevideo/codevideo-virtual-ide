import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
  describe("create nested folder structure and file using mouse", () => {
    it("should correctly create a folder within a folder and a file inside the nested folder", () => {
      // Initialize the Virtual IDE
      const virtualIDE = new VirtualIDE(undefined, undefined, false);
      virtualIDE.addVirtualTerminal(new VirtualTerminal());
      virtualIDE.addVirtualAuthor(new VirtualAuthor());
      
      // STEP 1: Create a src folder at the root level
      const createRootFolderActions: IAction[] = [
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
      
      // Apply actions to create the root folder
      virtualIDE.applyActions(createRootFolderActions);
      
      // Verify src folder was created
      const rootFolderSnapshot = virtualIDE.getFileExplorerSnapshot();
      expect(rootFolderSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: false,
          children: {}
        }
      });
      
      console.log("After creating src folder:");
      console.log(JSON.stringify(rootFolderSnapshot.fileStructure, null, 2));
      
      // STEP 2: Create a dev folder inside the src folder
      const createNestedFolderActions: IAction[] = [
        // Move mouse to the src folder and right-click
        { name: "mouse-move-file-explorer-folder", value: "src" },
        { name: "mouse-right-click", value: "1" },
        // Select "New Folder" from context menu
        { name: "mouse-move-file-explorer-folder-context-menu-new-folder", value: "1" },
        { name: "mouse-left-click", value: "1" }
      ];
      
      // Apply actions to open new folder input
      virtualIDE.applyActions(createNestedFolderActions);
      
      // Log state after right-clicking and selecting "New Folder"
      const afterRightClickSnapshot = virtualIDE.getFileExplorerSnapshot();
      console.log("After right-click on src folder for nested folder:");
      console.log("isNewFolderInputVisible:", afterRightClickSnapshot.isNewFolderInputVisible);
      console.log("newFileParentPath:", afterRightClickSnapshot.newFileParentPath);
      console.log("newFolderParentPath:", afterRightClickSnapshot.newFolderParentPath);
      
      // Verify folder input is visible
      expect(afterRightClickSnapshot.isNewFolderInputVisible).toBe(true);
      
      // Type folder name and press enter
      const typeNestedFolderNameActions: IAction[] = [
        { name: "file-explorer-type-new-folder-input", value: "dev" },
        { name: "file-explorer-enter-new-folder-input", value: "1" }
      ];
      
      // Apply actions to create the nested folder
      virtualIDE.applyActions(typeNestedFolderNameActions);
      
      // Get state after creating nested folder
      const nestedFolderSnapshot = virtualIDE.getFileExplorerSnapshot();
      
      console.log("After creating nested dev folder:");
      console.log(JSON.stringify(nestedFolderSnapshot.fileStructure, null, 2));
      
      // Verify dev folder was created inside src folder using full structure comparison
      expect(nestedFolderSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: false,
          children: {
            "dev": {
              type: "directory",
              content: "",
              collapsed: false,
              children: {}
            }
          }
        }
      });
      
      // STEP 3: Create a file inside the dev folder (which is inside src)
      const createNestedFileActions: IAction[] = [
        // Move mouse to the dev folder and right-click
        { name: "mouse-move-file-explorer-folder", value: "src/dev" },
        { name: "mouse-right-click", value: "1" },
        // Select "New File" from context menu
        { name: "mouse-move-file-explorer-folder-context-menu-new-file", value: "1" },
        { name: "mouse-left-click", value: "1" }
      ];
      
      // Apply actions to open new file input
      virtualIDE.applyActions(createNestedFileActions);
      
      // Log state after right-clicking and selecting "New File"
      const afterNestedFolderRightClickSnapshot = virtualIDE.getFileExplorerSnapshot();
      console.log("After right-click on dev folder for nested file:");
      console.log("isNewFileInputVisible:", afterNestedFolderRightClickSnapshot.isNewFileInputVisible);
      console.log("newFileParentPath:", afterNestedFolderRightClickSnapshot.newFileParentPath);
      console.log("newFolderParentPath:", afterNestedFolderRightClickSnapshot.newFolderParentPath);
      
      // Verify file input is visible
      expect(afterNestedFolderRightClickSnapshot.isNewFileInputVisible).toBe(true);
      
      // Type file name and press enter
      const typeNestedFileNameActions: IAction[] = [
        { name: "file-explorer-type-new-file-input", value: "config.json" },
        { name: "file-explorer-enter-new-file-input", value: "1" }
      ];
      
      // Apply actions to create the file in the nested folder
      virtualIDE.applyActions(typeNestedFileNameActions);
      
      // Get final state
      const finalSnapshot = virtualIDE.getFileExplorerSnapshot();
      
      // Log the final file structure for debugging
      console.log("Final file structure with nested file:");
      console.log(JSON.stringify(finalSnapshot.fileStructure, null, 2));
      
      // CRITICAL TEST: Verify the final structure with the nested file using full structure comparison
      expect(finalSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: false,
          children: {
            "dev": {
              type: "directory",
              content: "",
              collapsed: false,
              children: {
                "config.json": {
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
          }
        }
      });
      
      // Verify the opened file in the editor has the correct path
      const editorSnapshot = virtualIDE.getEditorSnapshot();
      expect(editorSnapshot.editors.length).toBe(1);
      expect(editorSnapshot.editors[0].filename).toBe("src/dev/config.json");
    });
  });
});