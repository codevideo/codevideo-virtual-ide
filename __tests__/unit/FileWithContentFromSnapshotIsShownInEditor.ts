import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { IAction, ILesson } from "@fullstackcraftllc/codevideo-types";

describe("VirtualIDE", () => {
    describe("a file with text content from initial snapshot is shown when clicked", () => {
        it("should not show an empty file when the initial snapshot is not an empty file", () => {

            const content = "package main\n\nfunc main() {\n\t// some comment\n}"

            // define a lesson with an initial snapshot that contains a file with content, and actions to open it
            const lesson: ILesson = {
                "id": "test-lesson",
                "name": "Test Lesson",
                "description": "This is a test lesson to verify file content display.",
                initialSnapshot: {
                    "isUnsavedChangesDialogOpen": false,
                    "unsavedFileName": "",
                    "fileExplorerSnapshot": {
                        "isFileExplorerContextMenuOpen": false,
                        "isFileContextMenuOpen": false,
                        "isFolderContextMenuOpen": false,
                        "isNewFileInputVisible": false,
                        "isNewFolderInputVisible": false,
                        "isRenameFileInputVisible": false,
                        "isRenameFolderInputVisible": false,
                        "newFileInputValue": "",
                        "newFolderInputValue": "",
                        "renameFileInputValue": "",
                        "renameFolderInputValue": "",
                        "originalFileBeingRenamed": "",
                        "originalFolderBeingRenamed": "",
                        "newFileParentPath": "",
                        "newFolderParentPath": "",
                        "fileStructure": {
                            "main.go": {
                                "type": "file",
                                "content": content,
                                "language": "Go",
                                "caretPosition": {
                                    "row": 0,
                                    "col": 0
                                }
                            },
                        }
                    },
                    "editorSnapshot": {
                        "isEditorContextMenuOpen": false,
                        "editors": []
                    },
                    "terminalSnapshot": {
                        "terminals": []
                    },
                    "mouseSnapshot": {
                        "location": "editor",
                        "currentHoveredFileName": "",
                        "currentHoveredFolderName": "",
                        "currentHoveredEditorTabFileName": "",
                        "x": 0,
                        "y": 0,
                        "timestamp": 0,
                        "type": "move",
                        "buttonStates": {
                            "left": false,
                            "right": false,
                            "middle": false
                        },
                        "scrollPosition": {
                            "x": 0,
                            "y": 0
                        }
                    },
                    "authorSnapshot": {
                        "authors": [
                            {
                                "currentSpeechCaption": ""
                            }
                        ]
                    }
                },
                actions: [
                    
                ]
            }

            const virtualIDE = new VirtualIDE(lesson);

            const actions: IAction[] = [
                {
                        "name": "author-speak-before",
                        "value": "Hi there! Let's explore this interesting Golang repository that helps track GitLab contributions. This tool analyzes user activity across different time periods and produces contribution statistics."
                    },
                    {
                        "name": "mouse-move-file-explorer",
                        "value": "1"
                    },
                    {
                        "name": "mouse-move-file-explorer-file",
                        "value": "main.go"
                    },
                    {
                        "name": "mouse-left-click",
                        "value": "1"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "The main.go file is the entry point for the application. It defines the core functionality for tracking GitLab contributions."
                    },
                    {
                        "name": "author-speak-before",
                        "value": "This struct stores contribution statistics for a user - tracking both commits and merge requests across different time periods."
                    }
            ]

            // Apply all actions
            virtualIDE.applyActions(actions);

            // check if the editor has the file open with the correct content
            const courseSnapshot = virtualIDE.getCourseSnapshot();
            expect(courseSnapshot.fileExplorerSnapshot.fileStructure).toEqual({
                "main.go": {
                    "type": "file",
                    "content": content,
                    "language": "Go",
                    "caretPosition": {
                        "row": 0,
                        "col": 0
                    }
                },
            });
            expect(courseSnapshot.editorSnapshot.editors[0].filename).toBe("main.go");
            expect(courseSnapshot.editorSnapshot.editors[0].content).toBe(content);
            expect(courseSnapshot.editorSnapshot.editors[0].isSaved).toBe(true);
            expect(virtualIDE.getOpenFiles()).toEqual(["main.go"]);
        })
    })
});