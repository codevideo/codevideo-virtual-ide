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
          value: "Today, we're going to rename a file."
        },
        {
          name: "author-speak-before",
          value: "let's create a hello-world.js file"
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
          value: "hello-world.js" // in codevideo actions, paths must always be relative to the root
        },
        {
          name: "file-explorer-enter-new-file-input", // this should trigger the file creation, open the file, and focus
          value: "1"
        },
        {
          name: "mouse-move-file-explorer-file",
          value: "hello-world.js"
        },
        {
          name: "mouse-right-click",
          value: "1"
        },
        {
          name: "mouse-move-file-explorer-file-context-menu-rename",
          value: "1"
        },
        {
          name: "mouse-left-click",
          value: "1"
        },
      ];

      // Apply all actions so far
      virtualIDE.applyActions(tutorialActions);

      // at this point the file explorer file rename input should be open, as well as the original
      // TODO: name here should be "currentContextFileName" instead of "currentHoveredFileName"
      expect(virtualIDE.getMouseSnapshot().currentHoveredFileName).toBe("hello-world.js");
      expect(virtualIDE.getFileExplorerSnapshot().isRenameFileInputVisible).toBe(true);
      expect(virtualIDE.getFileExplorerSnapshot().originalFileBeingRenamed).toBe("hello-world.js")

      // type the new file name, like 'new.js'. we only type 'new' because the file extension is already there
      // and in codevideo, we copy behaviour like vs code, where only the file name is highlighted so you just type

      const furtherActions: IAction[] = [
        {
          name: "file-explorer-type-rename-file-input",
          value: "new"
        },
        {
          name: "file-explorer-enter-rename-file-input",
          value: "1"
        }
      ];
      // Apply further actions
      virtualIDE.applyActions(furtherActions);
      // expect that the file explorer file rename input is not visible
      expect(virtualIDE.getFileExplorerSnapshot().isRenameFileInputVisible).toBe(false);
      // expect that the file explorer file rename input is not visible
      expect(virtualIDE.getFileExplorerSnapshot().originalFileBeingRenamed).toBe("");

      // TODO: what to do with hovered file? technically it should be the new file name, but then again maybe it should be empty...
    });
  });
});