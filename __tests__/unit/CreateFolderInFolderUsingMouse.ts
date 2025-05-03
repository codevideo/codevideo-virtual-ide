import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
  describe("create nested folder structure and verify parent path reset", () => {
    it("should correctly create nested folders and reset parent paths", () => {
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
      console.log("newFolderParentPath:", rootFolderSnapshot.newFolderParentPath);
      
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
      console.log("newFolderParentPath:", afterRightClickSnapshot.newFolderParentPath);
      
      // Verify folder input is visible and parent path is set correctly
      expect(afterRightClickSnapshot.isNewFolderInputVisible).toBe(true);
      expect(afterRightClickSnapshot.newFolderParentPath).toBe("src");
      
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
      
      // STEP 3: Check if parent path is reset after creating the nested folder
      console.log("Testing parent path reset...");
      console.log("newFolderParentPath after nested folder creation:", nestedFolderSnapshot.newFolderParentPath);
      
      // TEST THAT THE FIX ADDRESSES: Parent path should be reset after folder creation
      // If this fails, it indicates the bug where parent path is remembered
      expect(nestedFolderSnapshot.newFolderParentPath).toBe("");
      
      // STEP 4: Try to create another folder at the root level
      const createRootFolder2Actions: IAction[] = [
        // Move mouse to file explorer and right-click
        { name: "mouse-move-file-explorer", value: "1" },
        { name: "mouse-right-click", value: "1" },
        // Select "New Folder" from context menu
        { name: "mouse-move-file-explorer-context-menu-new-folder", value: "1" },
        { name: "mouse-left-click", value: "1" }
      ];
      
      // Apply actions to open new folder input at root
      virtualIDE.applyActions(createRootFolder2Actions);
      
      // Verify that when creating a folder at root, parent path is empty
      const rootFolder2ContextSnapshot = virtualIDE.getFileExplorerSnapshot();
      console.log("After right-click for root folder:");
      console.log("isNewFolderInputVisible:", rootFolder2ContextSnapshot.isNewFolderInputVisible);
      console.log("newFolderParentPath:", rootFolder2ContextSnapshot.newFolderParentPath);
      
      // TEST FOR THE FIXED BEHAVIOR: Parent path should be empty for root-level folder
      expect(rootFolder2ContextSnapshot.newFolderParentPath).toBe("");
      
      // Create the second root folder
      const typeRootFolder2NameActions: IAction[] = [
        { name: "file-explorer-type-new-folder-input", value: "lib" },
        { name: "file-explorer-enter-new-folder-input", value: "1" }
      ];
      
      // Apply actions to create the folder at root
      virtualIDE.applyActions(typeRootFolder2NameActions);
      
      // Verify the final structure includes both the nested folder and root folders
      const finalFolderSnapshot = virtualIDE.getFileExplorerSnapshot();
      expect(finalFolderSnapshot.fileStructure).toEqual({
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
        },
        "lib": {
          type: "directory",
          content: "",
          collapsed: false,
          children: {}
        }
      });
    });
  });
});