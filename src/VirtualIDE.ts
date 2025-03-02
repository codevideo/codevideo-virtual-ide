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
  ITerminalSnapshot,
  Project,
  isCourse,
  isLesson,
  ILesson,
  isValidActions
} from "@fullstackcraftllc/codevideo-types";
import { VirtualFileExplorer, advancedCommandValueSeparator } from "@fullstackcraftllc/codevideo-virtual-file-explorer";
import { VirtualEditor } from "@fullstackcraftllc/codevideo-virtual-editor";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";

export const supportedCommands = ["cat", "cd", "cp", "echo", "ls", "mkdir", "mv", "pwd", "touch", "tree"];

/**
 * Represents a virtual IDE that can be manipulated by a series of actions.
 * A virtual IDE in the CodeVideo world consists of 4 main parts:
 * 1. A virtual file system that represents the file explorer, typically on the left sidebar of an IDE.
 * 2. One or more virtual editors that represent the main editing area, typically in upper right 75% or so of an IDE.
 * 3. One or more virtual terminals that represent the terminal, typically at the bottom right of an IDE.
 * 4. One or more virtual authors that represent the author, responsible for speaking actions.
 */
export class VirtualIDE {
  public virtualFileExplorer: VirtualFileExplorer;
  public virtualEditors: Array<{ fileName: string, virtualEditor: VirtualEditor }> = [];
  public virtualTerminals: Array<VirtualTerminal> = [];
  private currentEditorIndex: number = 0;
  private currentTerminalIndex: number = 0;
  private currentAuthorIndex: number = 0;
  private currentCursorPosition: { x: number; y: number } = { x: -1, y: -1 }; // x is column, y is row - we allow both to be negative because a user may not want to have a cursor shown or used
  private verbose: boolean = false;

  // TODO: modify getOpenFiles in VirtualFileExplorer to return a list of FileItems, not strings
  //private openFiles: Array<FileItem> = [];
  private virtualAuthors: Array<VirtualAuthor> = [];

  constructor(project?: Project, initialActionIndex?: number, verbose?: boolean) {
    // always initialize to completely empty state
    this.virtualFileExplorer = new VirtualFileExplorer();
    this.virtualEditors = [];
    this.virtualTerminals = [];
    this.virtualAuthors = [];

    // if verbose is defined, set it
    if (verbose) {
      this.verbose = verbose;
    }

    // if project is defined, reconstitute the virtual IDE from the project at the given action index
    // if given action index is not defined, reconstitute the virtual IDE from the project at action index 0
    if (project) {
      if (isCourse(project)) {
        this.reconstituteFromCourseAtActionIndex(project, initialActionIndex);
      }
      if (isLesson(project)) {
        this.reconstituteFromLessonAtActionIndex(project, initialActionIndex);
      }
      if (isValidActions(project)) {
        this.reconstituteFromActionsAtActionIndex(project, initialActionIndex);
      }
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
  }

  /**
   * Reconstitutes the virtual IDE from a lesson at a given action index.
   * @param lesson The lesson to reconstitute from.
   * @param actionIndex The action index to reconstitute from.
   */
  private reconstituteFromLessonAtActionIndex(lesson: ILesson, actionIndex?: number): void {
    if (actionIndex === undefined) {
      actionIndex = 0;
    }

    const actionsToApply = lesson.actions.slice(0, actionIndex);
    this.applyActions(actionsToApply);
  }

  /**
   * Reconstitutes the virtual IDE from a series of actions at a given action index.
   * @param actions The actions to reconstitute from.
   * @param actionIndex The action index to reconstitute from.
   */
  private reconstituteFromActionsAtActionIndex(actions: IAction[], actionIndex?: number): void {
    if (actionIndex === undefined) {
      actionIndex = 0;
    }

    const actionsToApply = actions.slice(0, actionIndex);
    this.applyActions(actionsToApply);
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
      if (this.verbose) console.log("VirtualIDE: Applying FILE EXPLORER ACTION", action);
      this.virtualFileExplorer.applyAction(action);
    } else if (isEditorAction(action)) {
      if (this.verbose) console.log("VirtualIDE: Applying EDITOR action", action);
      // if we don't have an editor yet, create one
      if (this.virtualEditors.length === 0) {
        this.addVirtualEditor(action.value, new VirtualEditor([]));
        this.currentEditorIndex = 0;
      }
      this.virtualEditors[this.currentEditorIndex].virtualEditor.applyAction(action);
    } else if (isTerminalAction(action)) {
      if (this.verbose) console.log("VirtualIDE: Applying TERMINAL action", action);
      // if we don't have a terminal yet, create one
      if (this.virtualTerminals.length === 0) {
        this.addVirtualTerminal(new VirtualTerminal());
        this.currentTerminalIndex = 0;
      }
      this.virtualTerminals[this.currentTerminalIndex].applyAction(action);
    } else if (isAuthorAction(action)) {
      if (this.verbose) console.log("VirtualIDE: Applying AUTHOR action", action);
      // if we don't have an author yet, create one
      if (this.virtualAuthors.length === 0) {
        this.addVirtualAuthor(new VirtualAuthor());
        this.currentAuthorIndex = 0;
      }
      this.virtualAuthors[this.currentAuthorIndex].applyAction(action);
    } else {
      if (this.verbose) console.warn("VirtualIDE: Unknown action:", action);
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

    // same for the terminal - on enter we need to maintain state of what would happen in the terminal 
    // we support most bash commands one would use in a software course
    if (action.name === "terminal-enter") {
      this.executeTerminalCommandSideEffects();
    }

    // another super special effect - on editor-save we persist the contents to the file explorer
    if (action.name === "editor-save") {
      const editor = this.virtualEditors[this.currentEditorIndex];
      const filename = editor.fileName;
      const contents = editor.virtualEditor.getCode();
      this.virtualFileExplorer.applyAction({ name: "file-explorer-set-file-contents", value: `${filename}${advancedCommandValueSeparator}${contents}` });
    }
  }

  /**
   * Executes IDE side effects for a terminal command.
   * The terminal itself doesn't have knowledge of the filesystem, so we need to handle that here.
   * (In the real world it does but in codevideo we rely on the virtual file explorer to handle all filesystem operations.)
   * @param command The command to execute.
   */
  executeTerminalCommandSideEffects(): void {
    if (this.verbose) console.log("VirtualIDE: Executing terminal command side effects");

    // get the command that was just executed
    const terminal = this.virtualTerminals[this.currentTerminalIndex];
    const prompt = terminal.getPrompt();
    const commandHistory = terminal.getCommandHistory();
    const lastCommand = commandHistory[commandHistory.length - 1];

    const parts = lastCommand.split(" ");
    // shouldn't happen but no op if it does
    if (parts.length === 0) {
      return;
    }
    const commandName = parts[0];

    // check for supported commands - we can just log if in verbose mode
    if (!supportedCommands.includes(commandName)) {
      if (this.verbose) console.log(`VirtualIDE: Unsupported command: ${commandName} - supported commands are: ${supportedCommands.join(", ")}`);
      terminal.applyAction({ name: 'terminal-set-output', value: `${lastCommand}: command not found` });
      // just set a fresh prompt and return
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return
    }

    // single part commands

    // ls
    if (parts.length === 1 && lastCommand === "ls") {
      // use filesystem to list files - could support flags here
      // getLsString considers the present working directory internally
      const lsString = this.virtualFileExplorer.getLsString();
      if (this.verbose) console.log(`VirtualIDE: ls output: ${lsString}`);
      if (lsString.length === 0) {
        // traditional ls outputs nothing if there are no files, just goes to the next fresh prompt
        terminal.applyAction({ name: "terminal-set-output", value: prompt});
        return;
      } else {
        terminal.applyAction({ name: "terminal-set-output", value: lsString });
        terminal.applyAction({ name: "terminal-set-output", value: prompt});
        return;
      }
    }

    // tree
    if (parts.length === 1 && lastCommand === "tree") {
      // use filesystem to get the file tree
      const fileTreeString = this.virtualFileExplorer.getCurrentFileTree();
      terminal.applyAction({ name: "terminal-set-output", value: fileTreeString });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return;
    }

    // this pwd is the "GUI" version - file explorer doesn't use "~" internally but needs it for the relative paths
    let pwd = this.virtualFileExplorer.getPresentWorkingDirectory() === "" ? "~" : this.virtualFileExplorer.getPresentWorkingDirectory();

    if (this.verbose) console.log(`VirtualIDE: Present working directory: ${pwd}`);

    // pwd
    if (parts.length === 1 && lastCommand === "pwd") {
      // use filesystem to list the current path
      terminal.applyAction({ name: "terminal-set-output", value: pwd });
      return;
    }

    // two part commands - cd, touch, mkdir

    // touch - make file and leave a fresh prompt
    if (parts.length == 2 && commandName === "touch") {
      if (this.verbose) console.log(`VirtualIDE: Creating file: ${parts[1]}`);
      // use filesystem to create a file
      const newFile = parts[1]
      const fullFilePath = pwd + "/" + newFile;
      if (this.verbose) console.log(`VirtualIDE: Creating file: ${fullFilePath}`);
      this.virtualFileExplorer.applyAction({ name: "file-explorer-create-file", value: fullFilePath });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return;
    }

    // mkdir - make directory and leave a fresh prompt
    if (parts.length == 2 && commandName === "mkdir") {
      if (this.verbose) console.log(`VirtualIDE: Creating directory: ${parts[1]}`);
      // use filesystem to create a directory
      const newDir = parts[1]
      this.virtualFileExplorer.applyAction({ name: "file-explorer-create-folder", value: newDir });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return;
    }

    // cd
    if (parts.length == 2 && commandName === "cd") {
      if (this.verbose) console.log(`VirtualIDE: Changing directory to: ${parts[1]}`);
      const targetDir = parts[1];
      // no op if they try to .. already in "~"
      if (targetDir === ".." && pwd === "~") {
        terminal.applyAction({ name: "terminal-set-output", value: prompt });
        return;
      }

      // no op if they try to cd into a file (use regex with letter'.'letter)
      const regexp = /[a-zA-Z0-9]\.[a-zA-Z0-9]/;
      if (regexp.test(targetDir)) {
        terminal.applyAction({ name: "terminal-set-output", value: `cd: not a directory: ${targetDir}` });
        terminal.applyAction({ name: "terminal-set-output", value: prompt });
        return;
      }

      // for 'changing directory' in codevideo, we just change the prompt of the terminal
      // update the pwd
      if (targetDir === "..") {
        // go up one level
        const parts = pwd.split("/");
        parts.pop();
        pwd = parts.join("/");
        if (this.verbose) console.log(`VirtualIDE: Changing directory to: ${pwd}`);
      } else {
        // go to a specific directory
        pwd = pwd + "/" + targetDir;
        if (this.verbose) console.log(`VirtualIDE: Changing directory to: ${pwd}`);
      }

      // update pwd in the file explorer
      this.virtualFileExplorer.applyAction({ name: "file-explorer-set-present-working-directory", value: pwd });

      terminal.applyAction({ name: "terminal-set-present-working-directory", value: pwd });
      const newPrompt = this.virtualTerminals[this.currentTerminalIndex].getPrompt();
      terminal.applyAction({ name: "terminal-set-output", value: newPrompt });
      return;
    }

    // echo - this case can be 2 or MORE parts
    if (parts.length >= 2 && commandName === "echo") {
      // just echo the string back
      let echoString = parts.slice(1).join(" ");
      // remove starting quotes if they exist
      if (echoString.startsWith("'") || echoString.startsWith('"')) {
        echoString = echoString.slice(1);
      }
      // remove ending quotes if they
      if (echoString.endsWith("'") || echoString.endsWith('"')) {
        echoString = echoString.slice(0, -1);
      }
      terminal.applyAction({ name: "terminal-set-output", value: echoString });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return;
    }

    // cat
    if (parts.length == 2 && commandName === "cat") {
      // use filesystem to read a file
      const file = parts[1]
      const absoluteFilePath = pwd + "/" + file;
      if (this.verbose) console.log(`VirtualIDE: Reading file: ${absoluteFilePath}`);
      const fileContents = this.virtualFileExplorer.getFileContents(absoluteFilePath);
      terminal.applyAction({ name: "terminal-set-output", value: fileContents });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return
    }

    // three part commands

    // cp
    if (parts.length == 3 && commandName === "cp") {
      // use filesystem to copy a file
      const from = parts[1]
      const absoluteFromPath = pwd + "/" + from;
      const to = parts[2]
      const absoluteToPath = pwd + "/" + to;
      if (this.verbose) console.log(`VirtualIDE: Copying file from: ${absoluteFromPath} to: ${absoluteToPath}`);
      this.virtualFileExplorer.applyAction({ name: "file-explorer-copy-file", value: `from:${absoluteFromPath};to:${absoluteToPath}`});
      return;
    }

    // mv
    if (parts.length == 3 && commandName === "mv") {
      // use filesystem to move a file
      const from = parts[1]
      const absoluteFromPath = pwd + "/" + from;
      const to = parts[2]
      const absoluteToPath = pwd + "/" + to;
      if (this.verbose) console.log(`VirtualIDE: Moving file from: ${absoluteFromPath} to: ${absoluteToPath}`);
      this.virtualFileExplorer.applyAction({ name: "file-explorer-move-file", value: `from:${absoluteFromPath};to:${absoluteToPath}`});
      return;
    }

    // if we get here, we don't know the command
    terminal.applyAction({ name: 'terminal-set-output', value: `${lastCommand}: command not found` });
    // set a fresh prompt
    terminal.applyAction({ name: "terminal-set-output", value: prompt });
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
          isActive: editor.fileName === this.virtualEditors[this.currentEditorIndex].fileName,
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
