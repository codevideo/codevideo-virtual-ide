import {
  CodeAction,
  IAction,
  SpeakAction,
  ISpeechCaption,
  isCodeAction,
  isTerminalAction,
  isSpeakAction,
  isRepeatableAction,
  IProjectSnapshot,
  FileItem
} from "@fullstackcraftllc/codevideo-types";
import { VirtualCodeBlock } from "@fullstackcraftllc/codevideo-virtual-code-block";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";


/**
 * Represents a virtual file system that can be manipulated by a series of actions.
 */
export class VirtualFileSystem {
  private virtualFiles: Array<FileItem> = [];

  constructor() {
    this.virtualFiles = [];
  }

  /**
   * Adds a virtual file to the file system.
   * @param file The virtual file to add.
   */
  addVirtualFile(file: FileItem): void {
    this.virtualFiles.push(file);
  }

  /**
   * Applies an action to the virtual file system.
   * @param action The action to apply.
   */
  applyAction(action: IAction): void {
    if (isCodeAction(action)) {
      this.virtualFiles.forEach((file) => {
        file.applyAction(action);
      });
    }
  }
}


/**
 * Represents a virtual IDE that can be manipulated by a series of actions.
 */
export class VirtualEditor {
  private metadata: IProjectMetadata;
  private virtualFileSystem: VirtualFileSystem;
  private  virtualCodeBlocks: Array<VirtualCodeBlock> = [];
  private  virtualTerminals: Array<VirtualTerminal> = [];
  private currentFile: FileItem | null = null;
  private currentTerminal: VirtualTerminal | null = null;
  private openFiles: Array<FileItem> = [];
  // TODO: Add virtual authors - in charge of things like speaking, etc.
  // private virtualAuthors: Array<VirtualAuthor> = [];

  constructor(metadata?: IProjectMetadata) {
    this.metadata = metadata || {
      id: "unknown",
      name: "unknown",
      description: "unknown",
      primaryLanguage: "unknown",
    };
    this.virtualFileSystem = new VirtualFileSystem();
    this.virtualCodeBlocks = [];
    this.virtualTerminals = [];
  }

  /**
   * Adds a virtual code block to the editor.
   * @param codeBlock The virtual code block to add.
   */
  addVirtualCodeBlock(codeBlock: VirtualCodeBlock): void {
    this.virtualCodeBlocks.push(codeBlock);
  }

  /**
   * Adds a virtual terminal to the editor.
   * @param terminal The virtual terminal to add.
   */
  addVirtualTerminal(terminal: VirtualTerminal): void {
    this.virtualTerminals.push(terminal);
  }

  /**
   * Applies an action to the virtual code block.
   * @param action The action to apply.
   */
  applyAction(action: IAction): void {
    if (isCodeAction(action)) {
      this.virtualCodeBlocks.forEach((block) => {
        block.applyAction(action);
      });
    } else if (isTerminalAction(action)) {
      this.virtualTerminals.forEach((terminal) => {
        terminal.applyAction(action);
      });
    }
    // else if (isSpeakAction(action)) {
    //   this.virtualAuthors.forEach((terminal) => {
    //     terminal.speak(action.caption);
    //   });
    // }
  }

  /**
   * Applies a series of actions to the virtual code block. Uses current file to determine which file to apply the action to (if editing a file).
   * Likewise, uses current terminal to determine which terminal to apply the action to (if editing a terminal).

  /**
   * Gets the project snapshot.
   */
  getProjectSnapshot(): IProjectSnapshot {
    return {
      metadata: this.metadata,
      fileStructure: this.fileStructure,
      selectedFile: this.currentFile,
      openFiles: this.openFiles,
      editorContent: this.currentFile?.getContent(),
      editorCaretPosition: this.currentFile?.getCursorPosition(),
      cursorPosition: this.currentFile?.getCursorPosition(),
      terminalContent: this.currentTerminal?.getContent(),
    };
  }


}
