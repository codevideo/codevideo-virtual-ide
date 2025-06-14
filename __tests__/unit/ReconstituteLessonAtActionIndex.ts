import { IAction, ILesson } from "@fullstackcraftllc/codevideo-types";
import { VirtualIDE } from "../../src/VirtualIDE";

describe("VirtualIDE", () => {
    describe("creating virtual IDE with lesson and action index at final action index", () => {
        it("should be able to properly reconstitute", () => {
            // Arrange: create a lesson which has some file structure in the initial snapshot
            const lesson: ILesson = {
                id: "lesson-1",
                name: "Lesson 1",
                description: "This is the first lesson.",
                initialSnapshot: {
                    isUnsavedChangesDialogOpen: false,
                    unsavedFileName: '',
                    fileExplorerSnapshot: {
                        isFileExplorerContextMenuOpen: false,
                        isFileContextMenuOpen: false,
                        isFolderContextMenuOpen: false,
                        isNewFileInputVisible: false,
                        isNewFolderInputVisible: false,
                        isRenameFileInputVisible: false,
                        isRenameFolderInputVisible: false,
                        newFileInputValue: '',
                        newFolderInputValue: '',
                        renameFileInputValue: '',
                        renameFolderInputValue: '',
                        originalFileBeingRenamed: '',
                        originalFolderBeingRenamed: '',
                        newFileParentPath: '',
                        newFolderParentPath: '',
                        fileStructure: {
                            'src': {
                                type: 'directory',
                                content: '',
                                collapsed: true,
                                children: {
                                    'index.js': {
                                        type: 'file',
                                        language: 'javascript',
                                        content: 'console.log("Hello, world!");',
                                        caretPosition: { row: 0, col: 0 },
                                    }
                                }
                            }
                        },
                    },
                    editorSnapshot: {
                        isEditorContextMenuOpen: false,
                        editors: [{
                            isActive: true,
                            isSaved: true,
                            filename: 'src/index.js',
                            content: 'console.log("Hello, world!");',
                            caretPosition: { row: 0, col: 0 },
                            highlightCoordinates: null
                        }]
                    },
                    terminalSnapshot: {
                        terminals: [
                            {
                                content: ''
                            }
                        ]
                    },
                    mouseSnapshot: {
                        location: 'editor',
                        currentHoveredFileName: '',
                        currentHoveredFolderName: '',
                        currentHoveredEditorTabFileName: '',
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
                            y: 0
                        },
                    },
                    authorSnapshot: {
                        authors: [
                            { currentSpeechCaption: '' }
                        ]
                    }
                },
                actions: [
                    {
                        name: "file-explorer-create-file",
                        value: "new.md"
                    },
                    {
                        name: "file-explorer-open-file",
                        value: "new.md"
                    },
                    {
                        name: 'mouse-move-editor',
                        value: "1"
                    },
                    {
                        name: "mouse-left-click",
                        value: "1"
                    },
                    {
                        name: "editor-type",
                        value: "# My New Markdown File"
                    },
                    {
                        name: "editor-save",
                        value: "1"
                    }
                ]
            };
            const finalActionIndex = lesson.actions.length - 1;
            const virtualIDE = new VirtualIDE(lesson, finalActionIndex, true);

            // Act: apply the action to the virtual IDE
            const courseSnapshot = virtualIDE.getCourseSnapshot();

            // Assert: check that the course snapshot is correct - in addition to the new markdown file in the root, the files from the initial snapshot should be present (src folder and index.js file within)
            console.log(courseSnapshot.fileExplorerSnapshot.fileStructure);

            // existing files from the initial snapshot
            expect(courseSnapshot.fileExplorerSnapshot.fileStructure).toHaveProperty('src');
            expect(courseSnapshot.fileExplorerSnapshot.fileStructure.src).toHaveProperty('children');
            expect((courseSnapshot.fileExplorerSnapshot.fileStructure.src as any).children['index.js']).toHaveProperty('content');
            expect((courseSnapshot.fileExplorerSnapshot.fileStructure.src as any).children['index.js'].content).toBe('console.log("Hello, world!");');

            // new file and content created by the actions
            expect((courseSnapshot.fileExplorerSnapshot.fileStructure as any)['new.md']).toHaveProperty('content');
            expect((courseSnapshot.fileExplorerSnapshot.fileStructure as any)['new.md'].content).toBe('# My New Markdown File');
        });
    });
});