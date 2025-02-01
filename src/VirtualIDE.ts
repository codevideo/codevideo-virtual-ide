import {
  IAction,
  isTerminalAction,
  isFileExplorerAction,
  ICourseSnapshot,
  IMouseSnapshot,
  IEditorSnapshot,
  IAuthorSnapshot,
  isEditorAction,
  isAuthorAction
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
  private virtualEditors: Array<{fileName: string, virtualEditor: VirtualEditor}> = [];
  private virtualTerminals: Array<VirtualTerminal> = [];
  private currentFile: string | null = null;
  private currentTerminalIndex: number = 0;
  private currentCursorPosition: { x: number; y: number } = { x: -1, y: -1 }; // x is column, y is row - we allow both to be negative because a user may not want to have a cursor shown or used

  // TODO: modify getOpenFiles in VirtualFileExplorer to return a list of FileItems, not strings
  //private openFiles: Array<FileItem> = [];
  private virtualAuthors: Array<VirtualAuthor> = [];

  constructor() {
    this.virtualFileExplorer = new VirtualFileExplorer();
    this.virtualEditors = [];
    this.virtualTerminals = [];
    this.virtualAuthors = [];
  }

  /**
   * Adds a virtual editor to the virtual IDE.
   * @param codeBlock The virtual code block to add.
   */
  addVirtualEditor(fileName: string, virtualEditor: VirtualEditor): void {
    this.virtualEditors.push({fileName, virtualEditor});
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
      console.log('applying action to file explorer: ', action);
      this.virtualFileExplorer.applyAction(action);
    } else if (isEditorAction(action)) {
      const currentEditorIndex = this.virtualEditors.findIndex((editor) => 
        editor.fileName === this.currentFile
      );
      if (currentEditorIndex !== -1) {
        console.log('applying action to editor', this.virtualEditors[currentEditorIndex].fileName);
        // This updates the actual array element
        this.virtualEditors[currentEditorIndex].virtualEditor.applyAction(action);
      }
    } else if (isTerminalAction(action)) {
      this.virtualTerminals[this.currentTerminalIndex].applyAction(action);
    } else if (isAuthorAction(action)) {
      this.virtualAuthors.forEach((author) => {
        author.applyAction(action);
      });
    }

    // other side effects of the virtual IDE - TODO: can we elegantly combine these with the above if/else if block?
    switch (action.name) {
      case "mouse-click-filename":
      case "file-explorer-open-file":
        this.currentFile = action.value;
        break;
      case "mouse-click-terminal":
        this.currentTerminalIndex = 0;
        break;
      case "file-explorer-create-file":
        this.addVirtualEditor(action.value, new VirtualEditor([""]));
        break;
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

  // TODO: may one day be better to delegate to a VirtualEditor _within_ VirtualFileExplorer
  getFileContents(fileName?: string): string {
    return this.virtualEditors.find((editor) => editor.fileName === fileName)?.virtualEditor.getCode() || '';
  }

  getOpenFiles(): Array<string> {
    return this.virtualFileExplorer.getOpenFiles();
  }

  getEditorSnapshot(): IEditorSnapshot {
    const currentEditorIndex = this.virtualEditors.findIndex((editor) => 
      editor.fileName === this.currentFile
    );
    const currentEditor = currentEditorIndex !== -1 ? this.virtualEditors[currentEditorIndex].virtualEditor : null;
    return {
      fileStructure: this.virtualFileExplorer.getCurrentFileStructure(),
      currentFile: this.currentFile,
      openFiles: [],
      terminalContents: this.virtualTerminals[0].getCurrentCommand(),
      currentCaretPosition: currentEditor ? currentEditor.getCurrentCaretPosition() : { row: 1, col: 1 },
      currentHighlightCoordinates: currentEditor ? currentEditor.getCurrentHighlightCoordinates() : null,
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
      currentSpeechCaption: this.virtualAuthors[0].getCurrentSpeechCaption(),
    }
  }

  /**
   * Gets the project snapshot. Should provide everything to completely recreate an IDE from scratch.
   */
  getCourseSnapshot(): ICourseSnapshot {
    return {
      editorSnapshot: this.getEditorSnapshot(),
      mouseSnapshot: this.getMouseSnapshot(),
      authorSnapshot: this.getAuthorSnapshot(),
    };
  }
}
