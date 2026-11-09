import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction, ILesson } from "@fullstackcraftllc/codevideo-types";

const act = (name: string, value: string = "1"): IAction => ({ name, value } as IAction);
const codeOf = (ide: VirtualIDE, file: string) => ide.getEditorSnapshot().editors.find((editor) => editor.filename === file)?.content;
const openNewFile = (file: string): IAction[] => [act("file-explorer-create-file", file), act("file-explorer-open-file", file)];

describe("VirtualIDE", () => {
  describe("clipboard", () => {
    it("pastes in one file what was copied in another", () => {
      const ide = new VirtualIDE();
      ide.applyActions([
        ...openNewFile("a.ts"),
        act("editor-type", "export const fromA = 1;"),
        act("editor-shift+arrow-left", "23"),
        act("editor-command-c"),
        ...openNewFile("b.ts"),
        act("editor-command-v"),
      ]);
      expect(codeOf(ide, "a.ts")).toEqual("export const fromA = 1;");
      expect(codeOf(ide, "b.ts")).toEqual("export const fromA = 1;");
    });

    it("moves a whole line to another file with cut and paste, as VS Code does", () => {
      const ide = new VirtualIDE();
      ide.applyActions([
        ...openNewFile("a.ts"),
        act("editor-type", "keep\nmove me"),
        act("editor-command-x"),
        ...openNewFile("b.ts"),
        act("editor-type", "first"),
        act("editor-command-v"),
      ]);
      expect(codeOf(ide, "a.ts")).toEqual("keep");
      expect(codeOf(ide, "b.ts")).toEqual("move me\nfirst");
    });

    it("pastes text copied off screen with clipboard-set-text", () => {
      const ide = new VirtualIDE();
      ide.applyActions([
        act("clipboard-set-text", "const data = [\n  1,\n  2,\n];"),
        ...openNewFile("data.ts"),
        act("editor-command-v"),
      ]);
      expect(codeOf(ide, "data.ts")).toEqual("const data = [\n  1,\n  2,\n];");
    });

    it("switches back to an open file and pastes there", () => {
      const ide = new VirtualIDE();
      ide.applyActions([
        ...openNewFile("a.ts"),
        ...openNewFile("b.ts"),
        act("editor-type", "from b"),
        act("editor-shift+arrow-left", "6"),
        act("editor-command-c"),
        act("file-explorer-open-file", "a.ts"),
        act("editor-command-v", "2"),
      ]);
      expect(codeOf(ide, "a.ts")).toEqual("from bfrom b");
    });

    it("does nothing on copy, cut or paste with no file open", () => {
      const ide = new VirtualIDE();
      ide.applyActions([act("clipboard-set-text", "x"), act("editor-command-v"), act("editor-command-c"), act("editor-command-x")]);
      expect(ide.getEditorSnapshot().editors).toEqual([]);
      expect(ide.getClipboardSnapshot()).toEqual({ text: "x", isFullLine: false });
    });

    it("empties with clipboard-clear, so a paste does nothing", () => {
      const ide = new VirtualIDE();
      ide.applyActions([act("clipboard-set-text", "x"), act("clipboard-clear"), ...openNewFile("a.ts"), act("editor-command-v")]);
      expect(codeOf(ide, "a.ts")).toEqual("");
    });
  });

  describe("clipboard snapshots", () => {
    it("saves the clipboard in the course snapshot, and a restored IDE pastes it", () => {
      const ide = new VirtualIDE();
      ide.applyActions([...openNewFile("a.ts"), act("editor-type", "line one"), act("editor-command-c")]);
      const snapshot = ide.getCourseSnapshot();
      expect(snapshot.clipboardSnapshot).toEqual({ text: "line one\n", isFullLine: true });

      const restored = new VirtualIDE();
      restored.applyCourseSnapshot(structuredClone(snapshot));
      restored.applyAction(act("editor-command-v"));
      expect(codeOf(restored, "a.ts")).toEqual("line one\nline one");
    });

    it("shares one clipboard between editors restored from a snapshot", () => {
      const ide = new VirtualIDE();
      ide.applyActions([...openNewFile("a.ts"), act("editor-type", "alpha"), ...openNewFile("b.ts")]);
      const restored = new VirtualIDE();
      restored.applyCourseSnapshot(structuredClone(ide.getCourseSnapshot()));
      restored.applyActions([
        act("file-explorer-open-file", "a.ts"),
        act("editor-shift+arrow-left", "5"),
        act("editor-command-c"),
        act("file-explorer-open-file", "b.ts"),
        act("editor-command-v"),
      ]);
      expect(codeOf(restored, "b.ts")).toEqual("alpha");
    });

    it("starts empty from a snapshot made before the clipboard existed", () => {
      const ide = new VirtualIDE();
      ide.applyAction(act("clipboard-set-text", "stale"));
      const older = ide.getCourseSnapshot();
      delete older.clipboardSnapshot;
      const restored = new VirtualIDE();
      restored.applyAction(act("clipboard-set-text", "replaced by the snapshot"));
      restored.applyCourseSnapshot(older);
      expect(restored.getClipboardSnapshot()).toEqual({ text: "", isFullLine: false });
    });

    it("lets a lesson start with text already on the clipboard", () => {
      const setup = new VirtualIDE();
      setup.applyActions(openNewFile("a.ts"));
      const initialSnapshot = setup.getCourseSnapshot();
      initialSnapshot.clipboardSnapshot = { text: "copied before the lesson" };
      const lesson: ILesson = {
        id: "clipboard-lesson",
        name: "Clipboard lesson",
        description: "Pastes what was copied before it started.",
        initialSnapshot: structuredClone(initialSnapshot),
        actions: [act("editor-command-v")],
      };
      const ide = new VirtualIDE(lesson, 0);
      expect(codeOf(ide, "a.ts")).toEqual("copied before the lesson");
    });
  });
});
