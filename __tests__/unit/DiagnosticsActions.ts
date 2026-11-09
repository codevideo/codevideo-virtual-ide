import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";

describe("VirtualIDE", () => {
  describe("diagnostics display actions", () => {
    it("opens no editor for show/hide diagnostics and leaves typing alone", () => {
      const virtualIDE = new VirtualIDE(undefined, undefined, false);
      virtualIDE.applyActions([
        { name: "editor-show-diagnostics", value: "1" },
        { name: "editor-hide-diagnostics", value: "1" },
      ] as IAction[]);
      expect(virtualIDE.getCourseSnapshot().editorSnapshot.editors).toEqual([]);

      virtualIDE.applyActions([
        { name: "file-explorer-create-file", value: "src/generics.ts" },
        { name: "file-explorer-open-file", value: "src/generics.ts" },
        { name: "editor-type", value: "const a: number = 'x';" },
        { name: "editor-show-diagnostics", value: "1" },
        { name: "mouse-move-editor-diagnostic", value: "src/generics.ts:1:19" },
        { name: "editor-hide-diagnostics", value: "1" },
      ] as IAction[]);
      const editors = virtualIDE.getCourseSnapshot().editorSnapshot.editors;
      expect(editors.map(editor => editor.filename)).toEqual(["src/generics.ts"]);
      expect(editors[0].content).toEqual("const a: number = 'x';");
    });
  });
});
