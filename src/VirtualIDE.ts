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
  isValidActions,
  IVirtualLayerLog,
  advancedCommandValueSeparator,
  MouseLocation,
  isMouseAction,
  getRootFileName,
  IFileEntry,
} from "@fullstackcraftllc/codevideo-types";
import { VirtualFileExplorer } from "@fullstackcraftllc/codevideo-virtual-file-explorer";
import { VirtualMouse } from "@fullstackcraftllc/codevideo-virtual-mouse";
import { VirtualEditor } from "@fullstackcraftllc/codevideo-virtual-editor";
import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";
import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";

export const supportedTerminalCommands = ["cat", "cd", "cp", "echo", "ls", "mkdir", "mv", "pwd", "touch", "tree"];

/**
 * Represents a virtual IDE that can be manipulated by a series of actions.
 * A virtual IDE in the CodeVideo world consists of 4 main parts:
 * 1. A virtual file system that represents the file explorer, typically on the left sidebar of an IDE.
 * 2. One or more virtual editors that represent the main editing area, typically in upper right 75% or so of an IDE.
 * 3. One or more virtual terminals that represent the terminal, typically at the bottom right of an IDE.
 * 4. One or more virtual authors that represent the author, responsible for speaking actions.
 */
export class VirtualIDE {
  /**
   * The virtual file explorer that represents the file system.
   */
  public virtualFileExplorer: VirtualFileExplorer;

  /**
   * The virtual mouse that represents the mouse cursor.
  */
  public virtualMouse: VirtualMouse;

  /**
   * The virtual editors that represent the editing area. Filenames are absolute and also represent the open tabs of the IDE.
   */
  public virtualEditors: Array<{ fileName: string, virtualEditor: VirtualEditor }> = [];

  /**
   * The virtual terminals that represent the terminals. Since they have no file name, we just reference them by index.
   */
  public virtualTerminals: Array<VirtualTerminal> = [];

  private currentEditorIndex: number = -1;
  private currentTerminalIndex: number = -1;
  private currentAuthorIndex: number = -1;
  private isUnsavedChangesDialogOpen: boolean = false;
  private unsavedFileName: string = "";
  private verbose: boolean = false;
  private logs: Array<IVirtualLayerLog> = [];

  /**
   * Global present working directory for terminal display (uses "~" for root, subdirectories as "~/folder/subfolder")
   */
  private terminalPwd: string = "~";

  /**
   * Flag to track if we're currently in a lesson reconstruction process
   */
  private isReconstituting: boolean = false;

  // TODO: modify getOpenFiles in VirtualFileExplorer to return a list of FileItems, not strings
  //private openFiles: Array<FileItem> = [];
  private virtualAuthors: Array<VirtualAuthor> = [];

  constructor(project?: Project, initialActionIndex?: number, verbose?: boolean) {
    // if verbose is defined, set it
    if (verbose) {
      this.verbose = verbose;
    }

    // always initialize to completely empty state
    this.virtualFileExplorer = new VirtualFileExplorer(undefined, this.verbose);
    this.virtualMouse = new VirtualMouse();
    this.virtualEditors = [];
    this.virtualTerminals = [];
    this.virtualAuthors = [];

    // Initialize Terminal PWD to root directory
    this.terminalPwd = "~";

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
   * Adds a virtual editor to the virtual IDE.
   * @param fileName The name of the file.
   * @param virtualEditor The virtual editor to add.
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
    this.currentTerminalIndex = this.virtualTerminals.length - 1;
  }

  /**
   * Adds a virtual author to the virtual IDE.
   * @param author The virtual author to add.
   */
  addVirtualAuthor(author: VirtualAuthor): void {
    this.virtualAuthors.push(author);
    this.currentAuthorIndex = this.virtualAuthors.length - 1;
  }

  /**
   * Applies a course snapshot to the virtual IDE.
   * Goes piece by piece through the course snapshot and apply it to the various parts of the virtual IDE
   * @param courseSnapshot The course snapshot to apply.
   */
  applyCourseSnapshot(courseSnapshot: ICourseSnapshot): void {
    // virtual IDE level properties
    if (this.verbose) console.log("VirtualIDE: Reconstitution: isUnsavedChangesDialogOpen: ", courseSnapshot.isUnsavedChangesDialogOpen);
    this.isUnsavedChangesDialogOpen = courseSnapshot.isUnsavedChangesDialogOpen;
    if (this.verbose) console.log("VirtualIDE: Reconstitution: unsavedFileName: ", courseSnapshot.unsavedFileName);
    this.unsavedFileName = courseSnapshot.unsavedFileName;

    // file explorer snapshot
    if (this.verbose) console.log("VirtualIDE: Reconstitution: fileExplorerSnapshot object: ", JSON.stringify(courseSnapshot.fileExplorerSnapshot));
    this.virtualFileExplorer.applySnapshot(courseSnapshot.fileExplorerSnapshot);

    // TODO: set Terminal PWD?
    // this.terminalPwd = fileExplorerPwd === "" ? "~" : fileExplorerPwd;

    // editor snapshot
    courseSnapshot.editorSnapshot.editors.forEach((editor, index) => {
      const virtualEditor = new VirtualEditor([], undefined, this.verbose);
      if (this.verbose) console.log("VirtualIDE: Reconstitution: editor object: ", JSON.stringify(editor));
      virtualEditor.setValuesFromEditor(editor);
      this.addVirtualEditor(editor.filename, virtualEditor);
      if (editor.isActive) {
        this.currentEditorIndex = index;
      }
    })

    // terminal snapshot
    courseSnapshot.terminalSnapshot.terminals.forEach((terminal) => {
      const virtualTerminal = new VirtualTerminal(undefined, undefined, this.verbose);
      if (this.verbose) console.log("VirtualIDE: Reconstitution: terminal object: ", JSON.stringify(terminal));
      virtualTerminal.setValuesFromTerminal(terminal);
      this.addVirtualTerminal(virtualTerminal);
    });

    // mouse snapshot
    this.virtualMouse.applySnapshot(courseSnapshot.mouseSnapshot);

    // author snapshot
    courseSnapshot.authorSnapshot.authors.forEach((author) => {
      const virtualAuthor = new VirtualAuthor(undefined, this.verbose);
      if (this.verbose) console.log("VirtualIDE: Reconstitution: author object: ", JSON.stringify(author));
      virtualAuthor.setValuesFromAuthor(author);
      this.addVirtualAuthor(virtualAuthor);
    });
  }

  /**
   * Applies an action to the virtual IDE.
   * @param action The action to apply.
   */
  applyAction(action: IAction): void {
    if (isFileExplorerAction(action)) {
      if (this.verbose) console.log("VirtualIDE: Applying FILE EXPLORER ACTION", action);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Applying FILE EXPLORER action: ${action.name}`, timestamp: Date.now() });

      // Convert terminal paths to file explorer paths for actions that contain file paths
      // const convertedAction = this.convertFileExplorerActionPaths(action);
      this.virtualFileExplorer.applyAction(action);
    } else if (isEditorAction(action)) {
      if (this.verbose) console.log("VirtualIDE: Applying EDITOR action", action);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Applying EDITOR action: ${action.name}`, timestamp: Date.now() });
      // if we don't have an editor yet, create one
      // make schnittstelle great again - it's not our responsibility to create side effects for the benefit of the user
      if (this.virtualEditors.length === 0) {
        this.addVirtualEditor(action.value, new VirtualEditor([], undefined, this.verbose));
        this.currentEditorIndex = 0;
      }
      this.virtualEditors[this.currentEditorIndex].virtualEditor.applyAction(action);
    } else if (isTerminalAction(action)) {
      if (this.verbose) console.log("VirtualIDE: Applying TERMINAL action", action);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Applying TERMINAL action: ${action.name}`, timestamp: Date.now() });
      // if we don't have a terminal yet, create one
      // make schnittstelle great again - it's not our responsibility to create side effects for the benefit of the user
      if (this.virtualTerminals.length === 0) {
        this.addVirtualTerminal(new VirtualTerminal(undefined, undefined, this.verbose));
        this.currentTerminalIndex = 0;
      }
      this.virtualTerminals[this.currentTerminalIndex].applyAction(action);
    } else if (isAuthorAction(action)) {
      if (this.verbose) console.log("VirtualIDE: Applying AUTHOR action", action);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Applying AUTHOR action: ${action.name}`, timestamp: Date.now() });
      // if we don't have an author yet, create one
      if (this.virtualAuthors.length === 0) {
        this.addVirtualAuthor(new VirtualAuthor(undefined, this.verbose));
        this.currentAuthorIndex = 0;
      }
      this.virtualAuthors[this.currentAuthorIndex].applyAction(action);
    } else if (isMouseAction(action)) {
      // forward the mouse action to the virtual mouse
      if (this.verbose) console.log("VirtualIDE: Applying MOUSE action", action);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Applying MOUSE action: ${action.name}`, timestamp: Date.now() });
      this.virtualMouse.applyAction(action);
    }
    else {
      if (this.verbose) console.warn("VirtualIDE: Unknown action:", action);
      this.logs.push({ source: 'virtual-ide', type: 'warning', message: `Unknown action: ${action.name}`, timestamp: Date.now() });
    }

    // file-explorer-open-file is technically a FileExplorerAction, but we need to handle it here as a cross domain to editor
    if (action.name === "file-explorer-open-file") {
      const filename = action.value;
      const editorIndex = this.virtualEditors.findIndex((editor) => editor.fileName === filename);
      if (editorIndex === -1) {
        // check if we have initial code lines - could be a file that has already some content
        const initialCodeLines = this.virtualFileExplorer.getFileContents(filename).split('\n');
        this.addVirtualEditor(filename, new VirtualEditor(initialCodeLines, undefined, this.verbose));

        // if we had initial code lines, we also need to set the editor as saved
        this.virtualEditors[this.virtualEditors.length - 1].virtualEditor.applyAction({ name: 'editor-save', value: "1" });

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

    // another super special side effect - on editor-save we persist the contents AND caret position to the file explorer
    if (action.name === "editor-save") {
      // console.log("EXECUTE EDITOR SAVE SIDE EFFECTS: this.currentEditorIndex", this.currentEditorIndex)
      // console.log("EXECUTE EDITOR SAVE SIDE EFFECTS: this.virtualEditors.length", this.virtualEditors.length)
      const editor = this.virtualEditors[this.currentEditorIndex];
      let filename = editor.fileName;
      const contents = editor.virtualEditor.getCode();
      const caretPosition = editor.virtualEditor.getCurrentCaretPosition();

      // Convert terminal format path to file explorer format
      const fileExplorerPath = this.convertTerminalPathToFileExplorerPath(filename);

      if (this.verbose) console.log(`VirtualIDE: Saving file: <${filename}> with contents: <${contents}>, caret position: <${caretPosition}>`);
      this.virtualFileExplorer.applyAction({ name: "file-explorer-set-file-contents", value: `${fileExplorerPath}${advancedCommandValueSeparator}${contents}` });

      // Only update file explorer caret position if this is not during lesson reconstruction
      // During lesson reconstruction, files should maintain their default (0,0) positions unless explicitly set
      if (!this.isReconstituting) {
        this.virtualFileExplorer.applyAction({ name: "file-explorer-set-file-caret-position", value: `${fileExplorerPath}${advancedCommandValueSeparator}${caretPosition.row}${advancedCommandValueSeparator}${caretPosition.col}` });
      }
    }

    // and yet another super special side effect - on file-explorer-close-file we need to close the editor
    if (action.name === "file-explorer-close-file") {
      const filename = action.value;
      const editorIndex = this.virtualEditors.findIndex((editor) => editor.fileName === filename);
      if (editorIndex !== -1) {
        this.virtualEditors.splice(editorIndex, 1);
        this.currentEditorIndex = 0;
      }
    }

    const currentMouseSnapshot = this.virtualMouse.getCurrentMouseSnapshot()
    const currentMouseLocation = currentMouseSnapshot.location
    const currentHoveredFileName = currentMouseSnapshot.currentHoveredFileName
    const currentHoveredFolderName = currentMouseSnapshot.currentHoveredFolderName
    const currentHoveredEditorTabFileName = currentMouseSnapshot.currentHoveredEditorTabFileName

    // another super special side effect - on any mouse right click we open the context menu based on location
    if (action.name === 'mouse-right-click') {
      this.executeMouseRightClickSideEffects(currentMouseLocation, currentHoveredFileName, currentHoveredFolderName);
    }

    // another super special side effect - on any mouse left click we close the context menus everywhere
    // and also need to apply any cross domain effects that a mouse click might do (like with the context menus!)
    if (action.name === 'mouse-left-click') {
      this.executeMouseLeftClickSideEffects(currentMouseLocation, currentHoveredFileName, currentHoveredFolderName, currentHoveredEditorTabFileName)
    }

    if (action.name === 'file-explorer-enter-new-file-input') {
      // get the current file name from the file explorer
      const fileNameInput = this.virtualFileExplorer.getCurrentFileExplorerSnapshot().newFileInputValue
      const parentPath = this.virtualFileExplorer.getCurrentFileExplorerSnapshot().newFileParentPath;

      // Validate input - prevent undefined or empty values
      if (!fileNameInput || typeof fileNameInput !== 'string' || fileNameInput.trim() === '') {
        if (this.verbose) console.warn(`VirtualIDE: Invalid file name input: ${fileNameInput}`);
        this.logs.push({ source: 'virtual-ide', type: 'warning', message: `Invalid file name input: ${fileNameInput}`, timestamp: Date.now() });
        return;
      }

      // Construct the full path, considering the parent path
      let fileName = fileNameInput.trim();
      if (parentPath && !fileName.includes('/')) {
        fileName = `${parentPath}/${fileName}`;
      }

      if (this.verbose) console.log(`VirtualIDE: Entered new file input: ${fileName}`);
      if (this.verbose) console.log(`VirtualIDE: Parent path for new file input: ${parentPath}`);

      // check if the file already exists
      const fileExists = this.virtualFileExplorer.getFiles().includes(fileName);
      if (fileExists) {
        // if it does, log message if verbose
        if (this.verbose) console.warn(`VirtualIDE: File already exists: ${fileName}`);
        this.logs.push({ source: 'virtual-ide', type: 'warning', message: `File already exists: ${fileName}`, timestamp: Date.now() });
      } else {
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-create-file', value: fileName })
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-hide-new-file-input', value: "1" })
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-clear-new-file-input', value: "1" })

        // instead of file-explorer-open-file (which has side effects here, just repeat code as above)
        // (should be refactored eventually)
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-open-file', value: fileName })
        const editorIndex = this.virtualEditors.findIndex((editor) => editor.fileName === fileName);
        if (editorIndex === -1) {
          // editor was not found, so we need to create it and set the current editor index
          this.addVirtualEditor(fileName, new VirtualEditor([], undefined, this.verbose));
          this.currentEditorIndex = this.virtualEditors.length - 1;
        } else {
          // editor already in an editor tab, so we just need to set the current editor index
          // TODO: this probably shouldn't exist since we are always creating a new editor when typing enter on the new file input...
          this.currentEditorIndex = editorIndex;
        }
        // in IDEs like visual studio code, the file is already in a saved state even though it is opened,
        // so we set the saved state to true
        this.virtualEditors[this.currentEditorIndex].virtualEditor.applyAction({ name: 'editor-save', value: "1" });
      }
    }

    if (action.name === 'file-explorer-enter-new-folder-input') {
      // get the current file name from the file explorer
      const folderNameInput = this.virtualFileExplorer.getCurrentFileExplorerSnapshot().newFolderInputValue
      const parentPath = this.virtualFileExplorer.getCurrentFileExplorerSnapshot().newFolderParentPath;

      // Construct the full path, considering the parent path
      let folderName = folderNameInput;
      if (parentPath && !folderName.includes('/')) {
        folderName = `${parentPath}/${folderName}`;
      }

      // check if the folder already exists
      const folderExists = this.virtualFileExplorer.getFiles().includes(folderName);
      if (folderExists) {
        // if it does, log message if verbose
        if (this.verbose) console.warn(`VirtualIDE: File already exists: ${folderName}`);
        this.logs.push({ source: 'virtual-ide', type: 'warning', message: `File already exists: ${folderName}`, timestamp: Date.now() });
      } else {
        // if it doesn't, create the folder
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-create-folder', value: folderName })
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-hide-new-folder-input', value: "1" })
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-clear-new-folder-input', value: "1" })
      }
    }
  }

  executeMouseRightClickSideEffects(currentMouseLocation: MouseLocation, currentHoveredFileName: string, currentHoveredFolderName: string): void {
    switch (currentMouseLocation) {
      case 'file-explorer':
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-show-context-menu', value: "1" })
        break;
      case 'file-explorer-file':
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-show-file-context-menu', value: currentHoveredFileName })
        break;
      case 'file-explorer-folder':
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-show-folder-context-menu', value: currentHoveredFolderName })
        break;
      case 'editor':
        this.virtualEditors[this.currentEditorIndex].virtualEditor.applyAction({ name: 'editor-show-context-menu', value: "1" })
        break;
      // TODO: more later, for now we just support the above context menus
    }
  }

  executeMouseLeftClickSideEffects(currentMouseLocation: MouseLocation, currentHoveredFileName: string, currentHoveredFolderName: string, currentHoveredEditorTabFileName: string): void {

    // hide all context menus
    this.virtualFileExplorer.applyAction({ name: 'file-explorer-hide-context-menu', value: "1" })
    this.virtualFileExplorer.applyAction({ name: 'file-explorer-hide-file-context-menu', value: "1" })
    this.virtualFileExplorer.applyAction({ name: 'file-explorer-hide-folder-context-menu', value: "1" })
    const currentEditor = this.getActiveEditorSafely()
    if (currentEditor) {
      currentEditor.applyAction({ name: 'editor-hide-context-menu', value: "1" })
    }

    // file explorer context menu (opened when right clicking anywhere not on a file or folder in the file explorer)
    if (currentMouseLocation === "file-explorer-context-menu-new-file") {
      // ... then toggle activation of file-explorer-input
      this.virtualFileExplorer.applyAction({ name: 'file-explorer-show-new-file-input', value: "1" })
    }
    if (currentMouseLocation === "file-explorer-context-menu-new-folder") {
      // ... then toggle activation of file-explorer-input
      this.virtualFileExplorer.applyAction({ name: 'file-explorer-show-new-folder-input', value: "1" })
    }

    // file context menu (opened when right clicking on a file)
    if (currentMouseLocation === "file-explorer-file-context-menu-rename") {
      // ... then toggle activation of file-explorer-input
      this.virtualFileExplorer.applyAction({ name: 'file-explorer-rename-file-draft-state', value: currentHoveredFileName })
    }
    if (currentMouseLocation === "file-explorer-file-context-menu-delete") {
      // ... then toggle activation of file-explorer-input
      this.virtualFileExplorer.applyAction({ name: 'file-explorer-delete-file', value: currentHoveredFileName })
    }

    // folder context menu (opened when  right clicking on a file)
    if (currentMouseLocation === "file-explorer-folder-context-menu-new-file") {
      // ... then toggle activation of file-explorer-show-new-file-input
      this.virtualFileExplorer.applyAction({ name: 'file-explorer-show-new-file-input', value: currentHoveredFolderName })
    }
    if (currentMouseLocation === "file-explorer-folder-context-menu-new-folder") {
      // ... then toggle activation of file-explorer-show-new-folder-input
      this.virtualFileExplorer.applyAction({ name: 'file-explorer-show-new-folder-input', value: currentHoveredFolderName })
    }
    if (currentMouseLocation === "file-explorer-folder-context-menu-rename") {
      // ... then set file-explorer-rename-folder-draft-state
      this.virtualFileExplorer.applyAction({ name: 'file-explorer-rename-folder-draft-state', value: currentHoveredFolderName })
    }
    if (currentMouseLocation === "file-explorer-folder-context-menu-delete") {
      // ... then delete the folder
      this.virtualFileExplorer.applyAction({ name: 'file-explorer-delete-folder', value: currentHoveredFolderName })
    }

    // side effect for clicking file in file explorer case - we need to open that file in the editor!
    if (currentMouseLocation === 'file-explorer-file') {
      // TODO - if this is a non-UTF 8 compatible file, we can preview it!
      // const fileExtension = currentHoveredFileName.split('.').pop();
      // if it's a binary extension, use the generic 'preview-file' action - TO BE DEFINED, and another blog post!


      // console.log("EXECUTE MOUSE LEFT CLICK SIDE EFFECTS, currentHoveredFileName", currentHoveredFileName)
      const filename = currentHoveredFileName;
      const editorIndex = this.virtualEditors.findIndex((editor) => editor.fileName === filename);
      if (editorIndex === -1) {
        // editor was not found in editor tabs, so we need to create it and set the current editor index

        // check if we have initial code lines - could be a file that has already some content
        const initialCodeLines = this.virtualFileExplorer.getFileContents(filename).split('\n');
        this.addVirtualEditor(filename, new VirtualEditor(initialCodeLines, undefined, this.verbose));

        // if we had initial code lines, we also need to set the editor as saved
        this.virtualEditors[this.virtualEditors.length - 1].virtualEditor.applyAction({ name: 'editor-save', value: "1" });

        const newEditorIndex = this.virtualEditors.findIndex((editor) => editor.fileName === filename);
        this.currentEditorIndex = newEditorIndex === -1 ? this.virtualEditors.length - 1 : newEditorIndex;

        // we also need to inform the file explorer that we opened a file
        // TODO: doublecheck this doesn't cause other side effects!
        this.virtualFileExplorer.applyAction({ name: 'file-explorer-open-file', value: filename });

      } else {
        // else just set the current editor index to that index
        this.currentEditorIndex = editorIndex;
      }
    }

    // left click on editor tab - we need to set the current editor index to that editor
    if (currentMouseLocation === 'editor-tab') {
      // find the open editor tab index by currentHoveredEditorTabFileName
      const editorIndex = this.virtualEditors.findIndex((editor) => editor.fileName === currentHoveredEditorTabFileName);
      if (this.verbose) console.log(`VirtualIDE: Setting current editor index to: ${editorIndex}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Setting current editor index to: ${editorIndex}`, timestamp: Date.now() });
      this.currentEditorIndex = editorIndex;
    }

    // left click on editor tab close - we need to close that editor!
    if (currentMouseLocation === 'editor-tab-close') {
      // if file is not saved, set isUnsavedChangesDialogOpen to true and that's it
      if (!this.virtualEditors[this.currentEditorIndex].virtualEditor.getIsSaved()) {
        this.unsavedFileName = getRootFileName(this.virtualEditors[this.currentEditorIndex].fileName);
        this.isUnsavedChangesDialogOpen = true;
        return;
      }

      // find the open editor tab index by currentHoveredEditorTabFileName
      // console.log("EXECUTE MOUSE LEFT CLICK SIDE EFFECTS, currentHoveredEditorTabFileName", currentHoveredEditorTabFileName)
      // console.log("EXECUTE MOUSE LEFT CLICK SIDE EFFECTS, this.virtualEditors", this.virtualEditors)
      const editorIndex = this.virtualEditors.findIndex((editor) => editor.fileName === currentHoveredEditorTabFileName);
      if (this.verbose) console.log(`VirtualIDE: Closing editor: ${this.virtualEditors[editorIndex].fileName}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Closing editor: ${this.virtualEditors[editorIndex].fileName}`, timestamp: Date.now() });
      this.virtualEditors.splice(editorIndex, 1);
      // set the current editor index to the first editor
      if (this.virtualEditors.length > 0) {
        this.currentEditorIndex = 0;
      } else {
        this.currentEditorIndex = -1;
      }
    }

    // left click "save" button on unsaved changes dialog - we need to save the file and close it
    if (currentMouseLocation === 'unsaved-changes-dialog-button-save') {
      const filename = this.virtualEditors[this.currentEditorIndex].fileName;
      if (this.verbose) console.log(`VirtualIDE: Saving file: ${filename}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Saving file: ${filename}`, timestamp: Date.now() });
      this.virtualFileExplorer.applyAction({ name: "file-explorer-set-file-contents", value: `${filename}${advancedCommandValueSeparator}${this.virtualEditors[this.currentEditorIndex].virtualEditor.getCode()}` });
      // close the editor
      this.virtualEditors.splice(this.currentEditorIndex, 1);
      this.isUnsavedChangesDialogOpen = false;
      this.unsavedFileName = "";
    }

    // left click "don't save" button on unsaved changes dialog - we need to close the editor
    if (currentMouseLocation === 'unsaved-changes-dialog-button-dont-save') {
      // close the editor
      this.virtualEditors.splice(this.currentEditorIndex, 1);
      // set the current editor index to the first editor
      if (this.virtualEditors.length > 0) {
        this.currentEditorIndex = 0;
      } else {
        this.currentEditorIndex = -1;
      }
      this.isUnsavedChangesDialogOpen = false;
      this.unsavedFileName = "";
    }

    // left click "cancel" button on unsaved changes dialog - we need to close the dialog
    if (currentMouseLocation === 'unsaved-changes-dialog-button-cancel') {
      this.isUnsavedChangesDialogOpen = false;
      this.unsavedFileName = "";
    }

  }

  /**
   * Executes IDE side effects for a terminal command.
   * The terminal itself doesn't have knowledge of the filesystem, so we need to handle that here.
   * (In the real world it does but in CodeVideo world we rely on the virtual file explorer to handle all filesystem operations.)
   */
  executeTerminalCommandSideEffects(): void {
    if (this.verbose) console.log("VirtualIDE: Executing terminal command side effects");
    this.logs.push({ source: 'virtual-ide', type: 'info', message: `Executing terminal command side effects`, timestamp: Date.now() });

    // get the command that was just executed
    const terminal = this.virtualTerminals[this.currentTerminalIndex];
    const prompt = terminal.getPrompt();
    const commandHistory = terminal.getCommandHistory();

    // default to empty string if no command history
    const lastCommand = commandHistory.length > 0 ? commandHistory[commandHistory.length - 1] : "";

    const parts = lastCommand.split(" ");

    // shouldn't happen but no op if it does
    if (parts.length === 0) {
      return;
    }
    const commandName = parts[0];

    // check for supported commands - we can just log if in verbose mode
    if (!supportedTerminalCommands.includes(commandName)) {
      if (this.verbose) console.log(`VirtualIDE: Unsupported command: ${commandName} - supported commands are: ${supportedTerminalCommands.join(", ")}`);
      this.logs.push({ source: 'virtual-ide', type: 'warning', message: `Unsupported command: ${commandName} - supported commands are: ${supportedTerminalCommands.join(", ")}`, timestamp: Date.now() });
      // TODO: activate later with something like "terminal shows unknown commands?" in GUI - for now users can manually set output
      // terminal.applyAction({ name: 'terminal-set-output', value: `${lastCommand}: command not found` });
      // just set a fresh prompt and return
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return
    }

    // single part commands

    // ls
    if (parts.length === 1 && lastCommand === "ls") {
      // getLsString considers the present working directory internally
      const lsString = this.getLsString();
      if (this.verbose) console.log(`VirtualIDE: ls output: ${lsString}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `ls output: ${lsString}`, timestamp: Date.now() });
      if (lsString.length === 0) {
        // traditional ls outputs nothing if there are no files, just goes to the next fresh prompt
        terminal.applyAction({ name: "terminal-set-output", value: prompt });
        return;
      } else {
        terminal.applyAction({ name: "terminal-set-output", value: lsString });
        terminal.applyAction({ name: "terminal-set-output", value: prompt });
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

    // Get current PWD using our centralized method
    const terminalPwd = this.getTerminalPwd();

    if (this.verbose) console.log(`VirtualIDE: TERMINAL present working directory displayed as: ${terminalPwd}`);
    this.logs.push({ source: 'virtual-ide', type: 'info', message: `TERMINAL present working directory displayed as: ${terminalPwd}`, timestamp: Date.now() });

    // pwd
    if (parts.length === 1 && lastCommand === "pwd") {
      // use filesystem to list the current path
      terminal.applyAction({ name: "terminal-set-output", value: terminalPwd });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return;
    }

    // two part commands - cd, touch, mkdir

    // touch - make file and leave a fresh prompt
    if (parts.length == 2 && commandName === "touch") {
      // use filesystem to create a file
      const relativeFile = parts[1]
      // Convert to absolute path based on current terminal PWD
      const absoluteFile = this.convertRelativeToAbsolutePath(relativeFile);
      if (this.verbose) console.log(`VirtualIDE: Creating file: ${absoluteFile}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Creating file: ${absoluteFile}`, timestamp: Date.now() });
      this.virtualFileExplorer.applyAction({ name: "file-explorer-create-file", value: absoluteFile });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return;
    }

    // mkdir - make directory and leave a fresh prompt
    if (parts.length == 2 && commandName === "mkdir") {
      // use filesystem to create a directory
      const relativeDir = parts[1]
      // Convert to absolute path based on current terminal PWD
      const absoluteDir = this.convertRelativeToAbsolutePath(relativeDir);
      if (this.verbose) console.log(`VirtualIDE: Creating directory: ${absoluteDir}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Creating directory: ${absoluteDir}`, timestamp: Date.now() });
      this.virtualFileExplorer.applyAction({ name: "file-explorer-create-folder", value: absoluteDir });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return;
    }

    // cd
    if (parts.length == 2 && commandName === "cd") {
      const targetDir = parts[1];
      if (this.verbose) console.log(`VirtualIDE: Changing directory to: ${targetDir}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Changing directory to: ${targetDir}`, timestamp: Date.now() });

      // Use our centralized changeDirectory method
      const success = this.changeDirectory(targetDir);

      if (!success) {
        if (targetDir === ".." && this.getTerminalPwd() === "~") {
          // Already at root, just show fresh prompt
          terminal.applyAction({ name: "terminal-set-output", value: prompt });
          return;
        } else {
          // Likely tried to cd into a file
          terminal.applyAction({ name: "terminal-set-output", value: `cd: not a directory: ${targetDir}` });
          terminal.applyAction({ name: "terminal-set-output", value: prompt });
          return;
        }
      }

      // Directory change was successful, update terminal prompt
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
      const relativeFile = parts[1]
      const absoluteFile = this.convertRelativeToAbsolutePath(relativeFile);
      if (this.verbose) console.log(`VirtualIDE: Reading file: ${absoluteFile}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Reading file: ${absoluteFile}`, timestamp: Date.now() });
      const fileContents = this.virtualFileExplorer.getFileContents(this.convertTerminalPathToFileExplorerPath(absoluteFile));
      // cat only outputs the file content if it is not empty, otherwise no op
      if (fileContents !== "") {
        terminal.applyAction({ name: "terminal-set-output", value: fileContents });
      }
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return
    }

    // three part commands

    // cp
    if (parts.length == 3 && commandName === "cp") {
      // use filesystem to copy a file
      const relativeFrom = parts[1]
      const relativeTo = parts[2]
      const absoluteFrom = this.convertRelativeToAbsolutePath(relativeFrom);
      const absoluteTo = this.convertRelativeToAbsolutePath(relativeTo);
      if (this.verbose) console.log(`VirtualIDE: Copying file from: ${absoluteFrom} to: ${absoluteTo}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Copying file from: ${absoluteFrom} to: ${absoluteTo}`, timestamp: Date.now() });
      // Convert to file explorer format for the action
      const fileExplorerFrom = this.convertTerminalPathToFileExplorerPath(absoluteFrom);
      const fileExplorerTo = this.convertTerminalPathToFileExplorerPath(absoluteTo);
      this.virtualFileExplorer.applyAction({ name: "file-explorer-copy-file", value: `${fileExplorerFrom}${advancedCommandValueSeparator}${fileExplorerTo}` });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return;
    }

    // mv
    if (parts.length == 3 && commandName === "mv") {
      // use filesystem to move a file
      const relativeFrom = parts[1]
      const relativeTo = parts[2]
      const absoluteFrom = this.convertRelativeToAbsolutePath(relativeFrom);
      const absoluteTo = this.convertRelativeToAbsolutePath(relativeTo);
      if (this.verbose) console.log(`VirtualIDE: Moving file from: ${absoluteFrom} to: ${absoluteTo}`);
      this.logs.push({ source: 'virtual-ide', type: 'info', message: `Moving file from: ${absoluteFrom} to: ${absoluteTo}`, timestamp: Date.now() });
      // Convert to file explorer format for the action
      const fileExplorerFrom = this.convertTerminalPathToFileExplorerPath(absoluteFrom);
      const fileExplorerTo = this.convertTerminalPathToFileExplorerPath(absoluteTo);
      this.virtualFileExplorer.applyAction({ name: "file-explorer-move-file", value: `${fileExplorerFrom}${advancedCommandValueSeparator}${fileExplorerTo}` });
      terminal.applyAction({ name: "terminal-set-output", value: prompt });
      return;
    }

    // if we get here, we don't know the command
    // TODO: could be configurable in GUI "Terminal should show unknown commands?" or not. for not just log if verbose
    if (this.verbose) console.log(`VirtualIDE: Unknown command: ${commandName}`);
    this.logs.push({ source: 'virtual-ide', type: 'warning', message: `Unknown command: ${commandName}`, timestamp: Date.now() });
    // terminal.applyAction({ name: 'terminal-set-output', value: `${lastCommand}: command not found` });
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

  /**
   * Gets the open files in the virtual IDE.
   * @returns The open files in the virtual IDE.
   */
  getOpenFiles(): Array<string> {
    return this.virtualFileExplorer.getOpenFiles();
  }

  /**
   * Gets the file explorer snapshot.
   * @returns The file explorer snapshot.
   */
  getFileExplorerSnapshot(): IFileExplorerSnapshot {
    return this.virtualFileExplorer.getCurrentFileExplorerSnapshot()
  }

  /**
   * Gets the mouse snapshot.
   */
  getMouseSnapshot(): IMouseSnapshot {
    return this.virtualMouse.getCurrentMouseSnapshot()
  }

  /**
   * Gets the editor snapshot.
   * @returns The editor snapshot.
   */
  getEditorSnapshot(): IEditorSnapshot {
    const activeEditor = this.getActiveEditorSafely()
    return {
      editors: this.virtualEditors.map((editor) => {
        // const virtualEditorObject = this.virtualEditors[this.currentEditorIndex];

        // if (!virtualEditorObject) {
        //   return {
        //     isActive: false,
        //     filename: '',
        //     content: '',
        //     caretPosition: { row: 0, col: 0 },
        //     highlightCoordinates: null,
        //     isSaved: true,
        //   }
        // }

        return {
          isActive: editor.fileName === this.virtualEditors[this.currentEditorIndex].fileName,
          filename: editor.fileName,
          content: editor.virtualEditor.getCode(),
          caretPosition: editor.virtualEditor.getCurrentCaretPosition(),
          highlightCoordinates: editor.virtualEditor.getCurrentHighlightCoordinates(),
          isSaved: editor.virtualEditor.getIsSaved(),
        }
      }),
      isEditorContextMenuOpen: activeEditor ? activeEditor.getIsEditorContextMenuOpen() : false
    }
  }

  /**
   * Gets the terminal snapshot.
   */
  getTerminalSnapshot(): ITerminalSnapshot {
    return {
      terminals: this.virtualTerminals.map((terminal) => {
        return {
          content: terminal.getCurrentCommand()
        }
      }),
    }
  }

  /**
   * Gets the author snapshot.
   */
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
   * Gets the project snapshot. Should provide everything to completely recreate an IDE visually, from scratch.
   */
  getCourseSnapshot(): ICourseSnapshot {
    return {
      isUnsavedChangesDialogOpen: this.isUnsavedChangesDialogOpen,
      unsavedFileName: this.unsavedFileName,
      fileExplorerSnapshot: this.getFileExplorerSnapshot(),
      editorSnapshot: this.getEditorSnapshot(),
      terminalSnapshot: this.getTerminalSnapshot(),
      mouseSnapshot: this.getMouseSnapshot(),
      authorSnapshot: this.getAuthorSnapshot(),
    };
  }

  /**
   * Sets the verbose flag for the virtual IDE and all its components.
   * @param verbose 
   */
  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
    this.virtualFileExplorer.setVerbose(verbose);
    this.virtualEditors.forEach((editor) => {
      editor.virtualEditor.setVerbose(verbose);
    });
    this.virtualTerminals.forEach((terminal) => {
      terminal.setVerbose(verbose);
    });
    this.virtualAuthors.forEach((author) => {
      author.setVerbose(verbose);
    });
  }

  /**
   * Gets the logs for the virtual IDE.
   * @returns The logs for the virtual IDE.
   */
  getLogs(): Array<IVirtualLayerLog> {
    return this.logs;
  }

  /**
   * Gets all file paths and their contents in the virtual IDE. Simply a wrapper around the file explorer's getFullFilePathsAndContents method.
   * @returns The files in the virtual IDE.
   */
  getFullFilePathsAndContents(): Array<IFileEntry> {
    return this.virtualFileExplorer.getFullFilePathsAndContents();
  }

  /**
   * Gets the current present working directory for terminal display ("~" for root).
   * @returns The terminal PWD.
   */
  getTerminalPwd(): string {
    return this.terminalPwd;
  }

  /**
   * Convert a terminal format path to file explorer format
   * Terminal format: "~" for root, "~/folder" for subdirectories
   * File explorer format: "" for root, "folder" for subdirectories
   */
  private convertTerminalPathToFileExplorerPath(terminalPath: string): string {
    if (terminalPath === "~") {
      return "";
    }
    if (terminalPath.startsWith("~/")) {
      return terminalPath.slice(2);
    }
    // If path doesn't start with ~, assume it's already in file explorer format
    return terminalPath;
  }

  /**
   * Sets the present working directory and syncs both file explorer and terminal representations.
   * @param newPwd The new PWD in terminal format ("~" for root, "~/folder" for subdirectories)
   */
  private setPwd(newPwd: string): void {
    this.terminalPwd = newPwd;

    // Update terminal PWD
    if (this.virtualTerminals.length > 0) {
      this.virtualTerminals[this.currentTerminalIndex].applyAction({
        name: "terminal-set-present-working-directory",
        value: this.terminalPwd
      });
    }

    if (this.verbose) {
      console.log(`VirtualIDE: PWD updated - Terminal: "${this.terminalPwd}"`);
    }
    this.logs.push({
      source: 'virtual-ide',
      type: 'info',
      message: `PWD updated - Terminal: "${this.terminalPwd}"`,
      timestamp: Date.now()
    });
  }

  /**
   * Changes directory relative to current PWD.
   * @param targetDir The target directory ("." for current, ".." for parent, or directory name)
   * @returns true if directory change was successful, false otherwise
   */
  private changeDirectory(targetDir: string): boolean {
    if (targetDir === ".") {
      // No change needed for current directory
      return true;
    }

    if (targetDir === "..") {
      // Go up one level
      if (this.terminalPwd === "~") {
        // Already at root, can't go up
        return false;
      }
      const parts = this.terminalPwd.split("/");
      parts.pop();
      const newPwd = parts.length === 1 ? "~" : parts.join("/");
      this.setPwd(newPwd);
      return true;
    }

    // Check if target is a file (contains extension pattern)
    const filePattern = /[a-zA-Z0-9]\.[a-zA-Z0-9]/;
    if (filePattern.test(targetDir)) {
      return false; // Can't cd into a file
    }

    // Go to specific directory
    const newPwd = this.terminalPwd + "/" + targetDir;
    this.setPwd(newPwd);
    return true;
  }

  private getActiveEditorSafely(): VirtualEditor | undefined {
    if (this.virtualEditors.length === 0) {
      return undefined;
    }
    if (this.currentEditorIndex >= this.virtualEditors.length) {
      return undefined;
    }
    // TODO: this anyway is sometimes undefined? how?
    // const virtualEditorObject = this.virtualEditors[this.currentEditorIndex];
    // if (!virtualEditorObject) {
    //   return undefined;
    // }
    return this.virtualEditors[this.currentEditorIndex].virtualEditor;
  }

  private reconstituteFromCourseAtActionIndex(course: ICourse, actionIndex?: number): void {
    if (this.verbose) console.log(`VirtualIDE: reconstituting from course at action index: ${actionIndex}`);
    // if action index is not provided, set it to 0
    if (actionIndex === undefined) {
      actionIndex = 0;
    }

    // find corresponding lesson of which the action index is part of
    let actionCounter = 0;
    let lessonIndex = 0;
    for (const lesson of course.lessons) {
      actionCounter += lesson.actions.length;
      if (actionCounter >= actionIndex) {
        break;
      }
      lessonIndex++;
    }

    // use that lesson's  initial snapshot
    const lesson = course.lessons[lessonIndex];
    // if initial snapshot is defined, apply it to the virtual IDE
    if (lesson.initialSnapshot) {
      if (this.verbose) console.log(`VirtualIDE: Applying initial snapshot from lesson ${lessonIndex}`);
      this.applyCourseSnapshot(lesson.initialSnapshot);
    }

    // generate giant array of all actions from all lessons
    const allActions = [];
    for (const lesson of course.lessons) {
      allActions.push(...lesson.actions);
    }

    const actionsToApply = allActions.slice(0, actionIndex + 1);
    if (this.verbose) console.log(`VirtualIDE: applying ${actionsToApply.length} actions`);
    this.applyActions(actionsToApply);
  }

  private reconstituteFromLessonAtActionIndex(lesson: ILesson, actionIndex?: number): void {
    if (this.verbose) console.log(`VirtualIDE: reconstituting from lesson at action index: ${actionIndex}`);
    this.isReconstituting = true;

    // if action index is not provided, set it to 0
    if (actionIndex === undefined) {
      actionIndex = 0;
    }

    // use the initial snapshot of the lesson, apply actions, and return the final snapshot
    let initialSnapshot: ICourseSnapshot | undefined = lesson.initialSnapshot;
    // if initial snapshot is defined, apply it to the virtual IDE
    if (initialSnapshot) {
      if (this.verbose) console.log(`VirtualIDE: Applying initial snapshot from lesson`);
      this.applyCourseSnapshot(initialSnapshot);
    }

    const actionsToApply = lesson.actions.slice(0, actionIndex + 1);
    if (this.verbose) console.log(`VirtualIDE: applying ${actionsToApply.length} actions`);
    this.applyActions(actionsToApply);

    this.isReconstituting = false;
  }

  private reconstituteFromActionsAtActionIndex(actions: IAction[], actionIndex?: number): void {
    if (this.verbose) console.log(`VirtualIDE: reconstituting from actions at action index: ${actionIndex}`);
    this.isReconstituting = true;

    // if action index is not provided, set it to 0
    if (actionIndex === undefined) {
      actionIndex = 0;
    }

    // **(note with pure action input, there is no snapshot to start from, so we just apply the actions)**

    const actionsToApply = actions.slice(0, actionIndex + 1);
    if (this.verbose) console.log(`VirtualIDE: applying ${actionsToApply.length} actions`);
    this.applyActions(actionsToApply);

    this.isReconstituting = false;
  }  /**
   * Gets an 'ls' formatted list of files in the current terminal directory
   * @returns String of folders and files in the current directory in alphabetical order
   */
  getLsString(): string {
    // Get all file entries from file explorer
    const allFileEntries = this.virtualFileExplorer.getFullFilePathsAndContents();
    
    // Convert terminal PWD to file explorer format for filtering
    const currentDirPath = this.convertTerminalPathToFileExplorerPath(this.terminalPwd);

    if (this.verbose) {
      console.log('getLsString - Terminal PWD:', this.terminalPwd);
      console.log('getLsString - File explorer path:', currentDirPath);
      console.log('getLsString - All file entries:', allFileEntries);
    }

    // Get all file paths
    const allPaths = allFileEntries.map(entry => entry.path);

    // Also need to include directories that aren't explicitly files
    // Let's get the file structure and extract directory paths
    const fileStructure = this.virtualFileExplorer.getCurrentFileStructure();
    const allDirectories = this.extractDirectoryPaths(fileStructure, "");

    if (this.verbose) {
      console.log('getLsString - All directories:', allDirectories);
    }

    // Combine files and directories
    const allItems = [...allPaths, ...allDirectories];

    // Filter items that are in the current directory
    const currentDirItems = allItems.filter(itemPath => {
      // Normalize item path by removing leading slash if present
      const normalizedPath = itemPath.startsWith('/') ? itemPath.slice(1) : itemPath;
      
      if (currentDirPath === "") {
        // At root directory - show items that don't contain '/' after removing leading slash
        return !normalizedPath.includes('/');
      } else {
        // In subdirectory - show items that start with current path and are one level deeper
        if (!normalizedPath.startsWith(currentDirPath + '/')) {
          return false;
        }

        // Remove the current directory prefix and check if it's a direct child
        const relativePath = normalizedPath.substring(currentDirPath.length + 1);
        return !relativePath.includes('/'); // No further slashes means direct child
      }
    });

    if (this.verbose) {
      console.log('getLsString - Filtered items for current directory:', currentDirItems);
    }

    if (currentDirItems.length === 0) {
      return "";
    }

    // Format the output - remove the current directory prefix and sort alphabetically
    const displayNames = currentDirItems.map(itemPath => {
      // Normalize item path by removing leading slash if present
      const normalizedPath = itemPath.startsWith('/') ? itemPath.slice(1) : itemPath;
      
      if (currentDirPath === "") {
        return normalizedPath; // At root, show normalized name (without leading slash)
      } else {
        return normalizedPath.substring(currentDirPath.length + 1); // Remove current dir prefix
      }
    }).sort();

    // Remove duplicates (in case a path appears as both file and directory)
    const uniqueDisplayNames = [...new Set(displayNames)];

    if (this.verbose) {
      console.log('getLsString - Final display names:', uniqueDisplayNames);
    }

    // Join with newlines but no trailing newline
    return uniqueDisplayNames.join('\n');
  }

  /**
   * Recursively extracts directory paths from a file structure
   * @param structure The file structure to extract from
   * @param currentPath The current path prefix
   * @returns Array of directory paths
   */
  private extractDirectoryPaths(structure: any, currentPath: string): string[] {
    const directories: string[] = [];
    
    for (const [name, item] of Object.entries(structure)) {
      if (typeof item === 'object' && item !== null && (item as any).type === 'directory') {
        const dirPath = currentPath ? `${currentPath}/${name}` : name;
        directories.push(dirPath);
        
        // Recursively extract subdirectories
        if ((item as any).children) {
          const subDirs = this.extractDirectoryPaths((item as any).children, dirPath);
          directories.push(...subDirs);
        }
      }
    }
    
    return directories;
  }

  /**
   * Convert a relative path to an absolute path based on the current terminal PWD
   * @param relativePath The relative path from terminal command
   * @returns Absolute path in terminal format
   */
  private convertRelativeToAbsolutePath(relativePath: string): string {
    // If path is already absolute (starts with ~), return as is
    if (relativePath.startsWith("~")) {
      return relativePath;
    }

    // If at root directory, prepend with ~
    if (this.terminalPwd === "~") {
      return `~/${relativePath}`;
    }

    // If in subdirectory, append to current PWD
    return `${this.terminalPwd}/${relativePath}`;
  }
}
