import {
  IAction,
  isTerminalAction,
  isFileExplorerAction,
  ICourseSnapshot,
  IMouseSnapshot,
  IEditorSnapshot,
  IAuthorSnapshot,
  isEditorAction,
  isAuthorAction,
  ICourse,
  IFileExplorerSnapshot,
  ITerminalSnapshot
} from "@fullstackcraftllc/codevideo-types";
import { VirtualFileExplorer } from "@fullstackcraftllc/codevideo-virtual-file-explorer";
import { VirtualEditor } from "@fullstackcraftllc/codevideo-virtual-editor";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";

/**
 * Represents a virtual IDE that can be manipulated by a series of actions.
 * A virtual IDE in the CodeVideo world consists of 4 main parts:
 * 1. A virtual file system that represents the file explorer, typically on the left sidebar of an IDE.
 * 2. One or more virtual editors that represent the main editing area, typically in upper right 75% or so of an IDE.
 * 3. One or more virtual terminals that represent the terminal, typically at the bottom right of an IDE.
 * 4. One or more virtual authors that represent the author, responsible for speaking actions.
 */
export class VirtualIDE {
  private virtualFileExplorer: VirtualFileExplorer;
  private virtualEditors: Array<{ fileName: string, virtualEditor: VirtualEditor }> = [];
  private virtualTerminals: Array<VirtualTerminal> = [];
  private currentEditorIndex: number = 0;
  private currentTerminalIndex: number = 0;
  private currentAuthorIndex: number = 0;
  private currentCursorPosition: { x: number; y: number } = { x: -1, y: -1 }; // x is column, y is row - we allow both to be negative because a user may not want to have a cursor shown or used

  // TODO: modify getOpenFiles in VirtualFileExplorer to return a list of FileItems, not strings
  //private openFiles: Array<FileItem> = [];
  private virtualAuthors: Array<VirtualAuthor> = [];

  constructor(course?: ICourse, initialActionIndex?: number) {
    // always initialize to completely empty state
    this.virtualFileExplorer = new VirtualFileExplorer();
    this.virtualEditors = [];
    this.virtualTerminals = [];
    this.virtualAuthors = [];

    // if course is defined, reconstitute the virtual IDE from the course at the given action index
    // if given action index is not defined, reconstitute the virtual IDE from the course at action index 0
    if (course) {
      this.reconstituteFromCourseAtActionIndex(course, initialActionIndex);
    }
  }

  /**
   * Reconstitutes the virtual IDE from a course at a given action index.
   * @param course The course to reconstitute from.
   * @param actionIndex The action index to reconstitute from.
   */
  private reconstituteFromCourseAtActionIndex(course: ICourse, actionIndex?: number): void {
    if (actionIndex === undefined) {
      actionIndex = 0;
    }

    // generate giant array of all actions from all lessons
    const allActions = [];
    for (const lesson of course.lessons) {
      allActions.push(...lesson.actions);
    }

    const actionsToApply = allActions.slice(0, actionIndex);
    this.applyActions(actionsToApply);

    // // based on action index, find which lesson we are in
    // let lessonIndex = 0;
    // let lessonActionIndex = 0;
    // let lesson = course.lessons[lessonIndex];
    // while (lessonActionIndex + lesson.actions.length < actionIndex) {
    //   lessonActionIndex += lesson.actions.length;
    //   lessonIndex++;
    //   lesson = course.lessons[lessonIndex];
    // }

    // // additional actions to apply to the lesson to get to the given action index
    // const additionalActions = lesson.actions.slice(lessonActionIndex, actionIndex);

    // // using the lesson we are in, use the initial snapshot + applied actions to reconstitute the virtual IDE
    // const lessonSnapshot = lesson.initialSnapshot;
    // // reconstruct the virtual file explorer
    // this.virtualFileExplorer = new VirtualFileExplorer(lessonSnapshot.fileExplorerSnapshot, lessonSnapshot.fileStructure);
    // // reconstruct each of the virtual editors
    // for (const editor of lessonSnapshot.editorSnapshot.editors) {
    //   this.addVirtualEditor(editor.fileName, new VirtualEditor(editor.content.split('\n')));
    // }
    // // reconstruct each of the virtual terminals
    // for (const terminal of lessonSnapshot.terminalSnapshot.terminals) {
    //   this.addVirtualTerminal(new VirtualTerminal(terminal.content, additionalActions));
    // }
    // // reconstruct each of the virtual authors
    // for (const author of lessonSnapshot.authorSnapshot.authors) {
    //   this.addVirtualAuthor(new VirtualAuthor(author.speechCaptions));
    // }
  }

  /**
   * Adds a virtual editor to the virtual IDE.
   * @param codeBlock The virtual code block to add.
   */
  addVirtualEditor(fileName: string, virtualEditor: VirtualEditor): void {
    this.virtualEditors.push({ fileName, virtualEditor });
  }

  /**
   * Adds a virtual terminal to the virtual IDE.
   * @param terminal The virtual terminal to add.
   */
  addVirtualTerminal(terminal: VirtualTerminal): void {
    this.virtualTerminals.push(terminal);
  }

  /**
   * Adds a virtual author to the virtual IDE.
   * @param author The virtual author to add.
   */
  addVirtualAuthor(author: VirtualAuthor): void {
    this.virtualAuthors.push(author);
  }

  /**
   * Applies an action to the virtual IDE.
   * @param action The action to apply.
   */
  applyAction(action: IAction): void {
    if (isFileExplorerAction(action)) {
      this.virtualFileExplorer.applyAction(action);
    } else if (isEditorAction(action)) {
      // if we don't have an editor yet, create one
      if (this.virtualEditors.length === 0) {
        this.addVirtualEditor(action.value, new VirtualEditor([]));
        this.currentEditorIndex = 0;
      }
      this.virtualEditors[this.currentEditorIndex].virtualEditor.applyAction(action);
    } else if (isTerminalAction(action)) {
      // if we don't have a terminal yet, create one
      if (this.virtualTerminals.length === 0) {
        this.addVirtualTerminal(new VirtualTerminal());
        this.currentTerminalIndex = 0;
      }
      this.virtualTerminals[this.currentTerminalIndex].applyAction(action);
    } else if (isAuthorAction(action)) {
      // if we don't have an author yet, create one
      if (this.virtualAuthors.length === 0) {
        this.addVirtualAuthor(new VirtualAuthor());
        this.currentAuthorIndex = 0;
      }
      this.virtualAuthors[this.currentAuthorIndex].applyAction(action);
    }

    // file-explorer-open-file is technically a FileExplorerAction, but we need to handle it here as a cross domain to editor
    if (action.name === "file-explorer-open-file") {
      const filename = action.value;
      const editorIndex = this.virtualEditors.findIndex((editor) => editor.fileName === filename);
      if (editorIndex === -1) {
        this.addVirtualEditor(filename, new VirtualEditor([]));
        this.currentEditorIndex = this.virtualEditors.length - 1;
      } else {
        this.currentEditorIndex = editorIndex;
      }
    }

    // likewise, mouse-click-filename is technically a MouseAction, but we need to handle it here as a cross domain to editor
    if (action.name === "mouse-click-filename") {
      const filename = action.value;
      const editorIndex = this.virtualEditors.findIndex((editor) => editor.fileName === filename);
      if (editorIndex === -1) {
        this.addVirtualEditor(filename, new VirtualEditor([]));
        this.currentEditorIndex = this.virtualEditors.length - 1;
      } else {
        this.currentEditorIndex = editorIndex;
      }
    }
  }

  /**
   * Applies a series of actions to the virtual code block.
   * @param actions The actions to apply.
   */
  applyActions(actions: IAction[]): void {
    actions.forEach((action) => {
      this.applyAction(action);
    });
  }

  getCursorPosition(): { x: number; y: number } | null {
    if (this.currentCursorPosition.x === -1 || this.currentCursorPosition.y === -1) {
      return null;
    }
    return this.currentCursorPosition;
  }

  getOpenFiles(): Array<string> {
    return this.virtualFileExplorer.getOpenFiles();
  }

  getFileExplorerSnapshot(): IFileExplorerSnapshot {
    return {
      fileStructure: this.virtualFileExplorer.getCurrentFileStructure(),
    }
  }

  getEditorSnapshot(): IEditorSnapshot {
    return {
      editors: this.virtualEditors.map((editor) => {
        return {
          filename: editor.fileName,
          content: editor.virtualEditor.getCode(),
          caretPosition: editor.virtualEditor.getCurrentCaretPosition(),
          highlightCoordinates: editor.virtualEditor.getCurrentHighlightCoordinates(),
          isSaved: editor.virtualEditor.getIsSaved(),
        }
      })
    }
  }

  getTerminalSnapshot(): ITerminalSnapshot {
    return {
      terminals: this.virtualTerminals.map((terminal) => {
        return {
          content: terminal.getCurrentCommand()
        }
      }),
    }
  }

  getMouseSnapshot(): IMouseSnapshot {
    return {
      x: 0,
      y: 0,
      timestamp: 0,
      type: 'move',
      buttonStates: {
        left: false,
        right: false,
        middle: false,
      },
      scrollPosition: {
        x: 0,
        y: 0,
      },
    }
  }

  getAuthorSnapshot(): IAuthorSnapshot {
    return {
      authors: this.virtualAuthors.map((author) => {
        return {
          currentSpeechCaption: author.getCurrentSpeechCaption()
        }
      }),
    }
  }

  /**
   * Gets the project snapshot. Should provide everything to completely recreate an IDE from scratch.
   */
  getCourseSnapshot(): ICourseSnapshot {
    return {
      fileExplorerSnapshot: this.getFileExplorerSnapshot(),
      editorSnapshot: this.getEditorSnapshot(),
      terminalSnapshot: this.getTerminalSnapshot(),
      mouseSnapshot: this.getMouseSnapshot(),
      authorSnapshot: this.getAuthorSnapshot(),
    };
  }
}
