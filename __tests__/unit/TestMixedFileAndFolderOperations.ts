import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";

describe("VirtualIDE", () => {
  describe("mixed file and folder operations", () => {
    it("should correctly reset parent paths between different operations", () => {
      // Initialize the Virtual IDE
      const virtualIDE = new VirtualIDE(undefined, undefined, false);
      virtualIDE.addVirtualTerminal(new VirtualTerminal());
      virtualIDE.addVirtualAuthor(new VirtualAuthor());
      
      // STEP 1: Create parent folders structure first
      const createFoldersActions: IAction[] = [
        // Create src folder
        { name: "mouse-move-file-explorer", value: "1" },
        { name: "mouse-right-click", value: "1" },
        { name: "mouse-move-file-explorer-context-menu-new-folder", value: "1" },
        { name: "mouse-left-click", value: "1" },
        { name: "file-explorer-type-new-folder-input", value: "src" },
        { name: "file-explorer-enter-new-folder-input", value: "1" },
        
        // Create src/components folder
        { name: "mouse-move-file-explorer-folder", value: "src" },
        { name: "mouse-right-click", value: "1" },
        { name: "mouse-move-file-explorer-folder-context-menu-new-folder", value: "1" },
        { name: "mouse-left-click", value: "1" },
        { name: "file-explorer-type-new-folder-input", value: "components" },
        { name: "file-explorer-enter-new-folder-input", value: "1" }
      ];
      
      // Create the folder structure
      virtualIDE.applyActions(createFoldersActions);
      
      // STEP 2: Create a file in the nested folder
      const createNestedFileActions: IAction[] = [
        { name: "mouse-move-file-explorer-folder", value: "src/components" },
        { name: "mouse-right-click", value: "1" },
        { name: "mouse-move-file-explorer-folder-context-menu-new-file", value: "1" },
        { name: "mouse-left-click", value: "1" },
        { name: "file-explorer-type-new-file-input", value: "Button.tsx" },
        { name: "file-explorer-enter-new-file-input", value: "1" }
      ];
      
      virtualIDE.applyActions(createNestedFileActions);
      
      // Verify file was created in the nested folder
      const afterNestedFileSnapshot = virtualIDE.getFileExplorerSnapshot();
      
      // CHECK 1: After nested file creation, parent paths should be reset
      console.log("After nested file creation:");
      console.log("newFileParentPath:", afterNestedFileSnapshot.newFileParentPath);
      console.log("newFolderParentPath:", afterNestedFileSnapshot.newFolderParentPath);
      
      expect(afterNestedFileSnapshot.newFileParentPath).toBe("");
      expect(afterNestedFileSnapshot.newFolderParentPath).toBe("");
      
      // STEP 3: Create a file at the root level
      const createRootFileActions: IAction[] = [
        { name: "mouse-move-file-explorer", value: "1" },
        { name: "mouse-right-click", value: "1" },
        { name: "mouse-move-file-explorer-context-menu-new-file", value: "1" },
        { name: "mouse-left-click", value: "1" }
      ];
      
      virtualIDE.applyActions(createRootFileActions);
      
      // CHECK 2: When creating a file at root, parent path should be empty
      const rootFileInputSnapshot = virtualIDE.getFileExplorerSnapshot();
      console.log("Creating root file, before input:");
      console.log("newFileParentPath:", rootFileInputSnapshot.newFileParentPath);
      
      expect(rootFileInputSnapshot.newFileParentPath).toBe("");
      
      // Complete the root file creation
      const completeRootFileActions: IAction[] = [
        { name: "file-explorer-type-new-file-input", value: "config.json" },
        { name: "file-explorer-enter-new-file-input", value: "1" }
      ];
      
      virtualIDE.applyActions(completeRootFileActions);
      
      // STEP 4: After root file creation, create a folder in src folder
      const createSrcFolderActions: IAction[] = [
        { name: "mouse-move-file-explorer-folder", value: "src" },
        { name: "mouse-right-click", value: "1" },
        { name: "mouse-move-file-explorer-folder-context-menu-new-folder", value: "1" },
        { name: "mouse-left-click", value: "1" }
      ];
      
      virtualIDE.applyActions(createSrcFolderActions);
      
      // CHECK 3: When creating a folder in src, parent path should be "src"
      const srcFolderInputSnapshot = virtualIDE.getFileExplorerSnapshot();
      console.log("Creating folder in src:");
      console.log("newFolderParentPath:", srcFolderInputSnapshot.newFolderParentPath);
      
      expect(srcFolderInputSnapshot.newFolderParentPath).toBe("src");
      
      // Complete the src folder creation
      const completeSrcFolderActions: IAction[] = [
        { name: "file-explorer-type-new-folder-input", value: "utils" },
        { name: "file-explorer-enter-new-folder-input", value: "1" }
      ];
      
      virtualIDE.applyActions(completeSrcFolderActions);
      
      // STEP 5: Finally create a root folder after mixed operations
      const createRootFolderActions: IAction[] = [
        { name: "mouse-move-file-explorer", value: "1" },
        { name: "mouse-right-click", value: "1" },
        { name: "mouse-move-file-explorer-context-menu-new-folder", value: "1" },
        { name: "mouse-left-click", value: "1" }
      ];
      
      virtualIDE.applyActions(createRootFolderActions);
      
      // CHECK 4: When creating a folder at root after mixed operations, parent path should be empty
      const finalRootFolderSnapshot = virtualIDE.getFileExplorerSnapshot();
      console.log("Creating root folder after mixed operations:");
      console.log("newFolderParentPath:", finalRootFolderSnapshot.newFolderParentPath);
      
      // THIS IS THE KEY TEST: Parent path should be reset properly
      expect(finalRootFolderSnapshot.newFolderParentPath).toBe("");
      
      // Complete the root folder creation
      const completeRootFolderActions: IAction[] = [
        { name: "file-explorer-type-new-folder-input", value: "dist" },
        { name: "file-explorer-enter-new-folder-input", value: "1" }
      ];
      
      virtualIDE.applyActions(completeRootFolderActions);
      
      // Final verification of file structure
      const finalSnapshot = virtualIDE.getFileExplorerSnapshot();
      console.log("Final file structure:");
      console.log(JSON.stringify(finalSnapshot.fileStructure, null, 2));
      
      // Verify the final structure matches all our operations with full object comparison
      expect(finalSnapshot.fileStructure).toEqual({
        "src": {
          type: "directory",
          content: "",
          collapsed: true,
          children: {
            "components": {
              type: "directory",
              content: "",
              collapsed: true,
              children: {
                "Button.tsx": {
                  type: "file",
                  content: "",
                  language: "tsx",
                  caretPosition: {
                    row: 0,
                    col: 0
                  }
                }
              }
            },
            "utils": {
              type: "directory",
              content: "",
              collapsed: true,
              children: {}
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
        },
        "dist": {
          type: "directory",
          content: "",
          collapsed: true,
          children: {}
        }
      });
    });
  });
});