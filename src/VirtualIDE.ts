import {
  IAction,
  isCodeAction,
  isTerminalAction,
  isSpeakAction,
  isFileExplorerAction,
  ICourseSnapshot,
  IMouseSnapshot,
  IEditorSnapshot,
  IAuthorSnapshot
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
  private virtualEditors: Array<VirtualEditor> = [];
  private virtualTerminals: Array<VirtualTerminal> = [];
  private currentFile: string | null = null;
  private currentTerminal: VirtualTerminal | null = null;
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
  addVirtualEditor(virtualEditor: VirtualEditor): void {
    this.virtualEditors.push(virtualEditor);
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
    } else if (isCodeAction(action)) {
      this.virtualEditors.forEach((block) => {
        block.applyAction(action);
      });
    } else if (isTerminalAction(action)) {
      this.virtualTerminals.forEach((terminal) => {
        terminal.applyAction(action);
      });
    } else if (isSpeakAction(action)) {
      this.virtualAuthors.forEach((author) => {
        author.applyAction(action);
      });
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

  getFileContents(fileName: string): string {
    return this.virtualFileExplorer.getFileContents(fileName);
  }

  getOpenFiles(): Array<string> {
    return this.virtualFileExplorer.getOpenFiles();
  }

  getEditorSnapshot(): IEditorSnapshot {
    return {
      fileStructure: this.virtualFileExplorer.getCurrentFileStructure(),
      currentFile: this.currentFile,
      openFiles: [],
      terminalContents: this.virtualTerminals[0].getCurrentCommand(),
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
   * Applies a series of actions to the virtual code block. Uses current file to determine which file to apply the action to (if editing a file).
   * Likewise, uses current terminal to determine which terminal to apply the action to (if editing a terminal).

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
