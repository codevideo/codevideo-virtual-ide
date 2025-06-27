

import { IAction, ILesson } from "@fullstackcraftllc/codevideo-types";
import { VirtualIDE } from "../../src/VirtualIDE";

describe("VirtualIDE", () => {
    describe("advanced tests with initial snapshot, combined mouse and terminal file creation and movement", () => {
        it("also works from a lesson with initial snapshot", () => {
            const lesson: ILesson = {
                "id": "typescript-mcp-lesson",
                "name": "Building an MCP Server with TypeScript",
                "description": "Learn how to create the same MCP server using TypeScript and Anthropic's official SDK",
                "actions": [
                    {
                        "name": "author-speak-before",
                        "value": "In the previous lesson, we built our first MCP server using FastMCP in Python and successfully tested it with mcp-cli."
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Now let's create the exact same functionality using TypeScript and Anthropic's official MCP SDK. First, we'll organize our project by moving the Python file into its own folder."
                    },
                    {
                        "name": "terminal-open",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "mkdir python"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "mv hello_mcp.py python/hello_mcp.py"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "ls"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Now let's create a typescript folder to keep our TypeScript implementation organized."
                    },
                    {
                        "name": "terminal-type",
                        "value": "mkdir typescript"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "cd typescript"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Perfect! Now let's set up our TypeScript project. We'll start by initializing a new Node.js project."
                    },
                    {
                        "name": "terminal-type",
                        "value": "npm init -y"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "file-explorer-create-file",
                        "value": "typescript/package.json"
                    },
                    {
                        "name": "terminal-set-output",
                        "value": "Wrote to package.json"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Now we'll install the Anthropic MCP SDK and TypeScript dependencies."
                    },
                    {
                        "name": "terminal-type",
                        "value": "npm install @modelcontextprotocol/sdk zod"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-set-output",
                        "value": "added 15 packages, and audited 16 packages in 2s"
                    },
                    {
                        "name": "terminal-type",
                        "value": "npm install -D typescript @types/node"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-set-output",
                        "value": "added 3 packages, and audited 19 packages in 1s"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Let's create our TypeScript configuration file."
                    },
                    {
                        "name": "mouse-move-file-explorer-folder",
                        "value": "typescript"
                    },
                    {
                        "name": "mouse-right-click",
                        "value": "1"
                    },
                    {
                        "name": "mouse-move-file-explorer-folder-context-menu-new-file",
                        "value": "1"
                    },
                    {
                        "name": "mouse-left-click",
                        "value": "1"
                    },
                    {
                        "name": "file-explorer-type-new-file-input",
                        "value": "tsconfig.json"
                    },
                    {
                        "name": "file-explorer-enter-new-file-input",
                        "value": "1"
                    },
                ],
                "initialSnapshot": {
                    "isUnsavedChangesDialogOpen": false,
                    "unsavedFileName": "",
                    "fileExplorerSnapshot": {
                        "fileStructure": {
                            "hello_mcp.py": {
                                "type": "file",
                                "content": "from fastmcp import FastMCP\n\n# 1. Instantiate a server and give our tool a namespace\nmcp = FastMCP(\"hello\")\n\n# 2. Expose a single action\n@mcp.tool\ndef greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello,{name}! 👋\"\n\n# 3. Run with the built-in stdio transport (works with any client)\nif __name__ == \"__main__\":\n    mcp.run()",
                                "language": "py",
                                "caretPosition": {
                                    "row": 0,
                                    "col": 0
                                }
                            }
                        },
                        "isFileExplorerContextMenuOpen": false,
                        "isFileContextMenuOpen": false,
                        "isFolderContextMenuOpen": false,
                        "isNewFileInputVisible": false,
                        "isNewFolderInputVisible": false,
                        "newFileInputValue": "",
                        "newFolderInputValue": "",
                        "isRenameFileInputVisible": false,
                        "isRenameFolderInputVisible": false,
                        "originalFileBeingRenamed": "",
                        "originalFolderBeingRenamed": "",
                        "renameFileInputValue": "",
                        "renameFolderInputValue": "",
                        "newFileParentPath": "",
                        "newFolderParentPath": ""
                    },
                    "editorSnapshot": {
                        "editors": [
                            {
                                "isActive": true,
                                "filename": "hello_mcp.py",
                                "content": "from fastmcp import FastMCP\n\n# 1. Instantiate a server and give our tool a namespace\nmcp = FastMCP(\"hello\")\n\n# 2. Expose a single action\n@mcp.tool\ndef greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello,{name}! 👋\"\n\n# 3. Run with the built-in stdio transport (works with any client)\nif __name__ == \"__main__\":\n    mcp.run()",
                                "caretPosition": {
                                    "row": 14,
                                    "col": 14
                                },
                                "highlightCoordinates": null,
                                "isSaved": true
                            }
                        ],
                        "isEditorContextMenuOpen": false
                    },
                    "terminalSnapshot": {
                        "terminals": [
                            {
                                "content": ""
                            }
                        ]
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
                        "button": 0,
                        "buttonStates": {
                            "left": false,
                            "right": false,
                            "middle": false
                        },
                        "scrollPosition": {
                            "x": 0,
                            "y": 0
                        },
                        "scrollDelta": 0
                    },
                    "authorSnapshot": {
                        "authors": [
                            {
                                "currentSpeechCaption": "In the next lesson, we'll see how to create the same server but using TypeScript with Anthropic's TypeScript SDK. See you there!"
                            }
                        ]
                    }
                }
            }
            const virtualIDE = new VirtualIDE(lesson, lesson.actions.length - 1);

            // expect in the snapshot we have a python folder with hello_mcp.py file
            // and a typescript folder with package.json file
            expect(virtualIDE.virtualFileExplorer.getCurrentFileStructure()).toEqual({
                "python": {
                    "type": "directory",
                    "content": "",
                    "collapsed": true,
                    "children": {
                        "hello_mcp.py": {
                            "type": "file",
                            "content": "from fastmcp import FastMCP\n\n# 1. Instantiate a server and give our tool a namespace\nmcp = FastMCP(\"hello\")\n\n# 2. Expose a single action\n@mcp.tool\ndef greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello,{name}! 👋\"\n\n# 3. Run with the built-in stdio transport (works with any client)\nif __name__ == \"__main__\":\n    mcp.run()",
                            "language": "py",
                            "caretPosition": {
                                "row": 0,
                                "col": 0
                            }
                        }
                    }
                },
                "typescript": {
                    "type": "directory",
                    "content": "",
                    "collapsed": true,
                    "children": {
                        "package.json": {
                            "type": "file",
                            "content": "",
                            "language": "json",
                            "caretPosition": {
                                "row": 0,
                                "col": 0
                            }
                        },
                        "tsconfig.json": {
                            "type": "file",
                            "content":"",
                            "language": "json",
                            "caretPosition": {
                                "row": 0,
                                "col": 0
                            }
                        }
                    }
                }
            });

        });

        it("also works from a lesson with initial snapshot and creating a folder with the terminal, then a file with the mouse, editing that file, and saving", () => {
            const lesson: ILesson = {
                "id": "typescript-mcp-lesson",
                "name": "Building an MCP Server with TypeScript",
                "description": "Learn how to create the same MCP server using TypeScript and Anthropic's official SDK",
                "actions": [
                    {
                        "name": "author-speak-before",
                        "value": "In the previous lesson, we built our first MCP server using FastMCP in Python and successfully tested it with mcp-cli."
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Now let's create the exact same functionality using TypeScript and Anthropic's official MCP SDK. First, we'll organize our project by moving the Python file into its own folder."
                    },
                    {
                        "name": "terminal-open",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "mkdir python"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "mv hello_mcp.py python/hello_mcp.py"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "ls"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Now let's create a typescript folder to keep our TypeScript implementation organized."
                    },
                    {
                        "name": "terminal-type",
                        "value": "mkdir typescript"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "cd typescript"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Perfect! Now let's set up our TypeScript project. We'll start by initializing a new Node.js project."
                    },
                    {
                        "name": "terminal-type",
                        "value": "npm init -y"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "file-explorer-create-file",
                        "value": "typescript/package.json"
                    },
                    {
                        "name": "terminal-set-output",
                        "value": "Wrote to package.json"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Now we'll install the Anthropic MCP SDK and TypeScript dependencies."
                    },
                    {
                        "name": "terminal-type",
                        "value": "npm install @modelcontextprotocol/sdk zod"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-set-output",
                        "value": "added 15 packages, and audited 16 packages in 2s"
                    },
                    {
                        "name": "terminal-type",
                        "value": "npm install -D typescript @types/node"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-set-output",
                        "value": "added 3 packages, and audited 19 packages in 1s"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Let's create our TypeScript configuration file."
                    },
                    {
                        "name": "mouse-move-file-explorer-folder",
                        "value": "typescript"
                    },
                    {
                        "name": "mouse-right-click",
                        "value": "1"
                    },
                    {
                        "name": "mouse-move-file-explorer-folder-context-menu-new-file",
                        "value": "1"
                    },
                    {
                        "name": "mouse-left-click",
                        "value": "1"
                    },
                    {
                        "name": "file-explorer-type-new-file-input",
                        "value": "tsconfig.json"
                    },
                    {
                        "name": "file-explorer-enter-new-file-input",
                        "value": "1"
                    },
                    {
                      "name": "editor-type",
                      "value": "{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"Node16\",\n    \"moduleResolution\": \"Node16\",\n    \"outDir\": \"./build\",\n    \"rootDir\": \"./src\",\n    \"strict\": true,\n    \"esModuleInterop\": true,\n    \"skipLibCheck\": true,\n    \"forceConsistentCasingInFileNames\": true\n  },\n  \"include\": [\"src /**/*\"],\n  \"exclude\": [\"node_modules\"]\n}"
                    },
                    {
                      "name": "editor-save",
                      "value": "1"
                    }
                ],
                "initialSnapshot": {
                    "isUnsavedChangesDialogOpen": false,
                    "unsavedFileName": "",
                    "fileExplorerSnapshot": {
                        "fileStructure": {
                            "hello_mcp.py": {
                                "type": "file",
                                "content": "from fastmcp import FastMCP\n\n# 1. Instantiate a server and give our tool a namespace\nmcp = FastMCP(\"hello\")\n\n# 2. Expose a single action\n@mcp.tool\ndef greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello,{name}! 👋\"\n\n# 3. Run with the built-in stdio transport (works with any client)\nif __name__ == \"__main__\":\n    mcp.run()",
                                "language": "py",
                                "caretPosition": {
                                    "row": 0,
                                    "col": 0
                                }
                            }
                        },
                        "isFileExplorerContextMenuOpen": false,
                        "isFileContextMenuOpen": false,
                        "isFolderContextMenuOpen": false,
                        "isNewFileInputVisible": false,
                        "isNewFolderInputVisible": false,
                        "newFileInputValue": "",
                        "newFolderInputValue": "",
                        "isRenameFileInputVisible": false,
                        "isRenameFolderInputVisible": false,
                        "originalFileBeingRenamed": "",
                        "originalFolderBeingRenamed": "",
                        "renameFileInputValue": "",
                        "renameFolderInputValue": "",
                        "newFileParentPath": "",
                        "newFolderParentPath": ""
                    },
                    "editorSnapshot": {
                        "editors": [
                            {
                                "isActive": true,
                                "filename": "hello_mcp.py",
                                "content": "from fastmcp import FastMCP\n\n# 1. Instantiate a server and give our tool a namespace\nmcp = FastMCP(\"hello\")\n\n# 2. Expose a single action\n@mcp.tool\ndef greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello,{name}! 👋\"\n\n# 3. Run with the built-in stdio transport (works with any client)\nif __name__ == \"__main__\":\n    mcp.run()",
                                "caretPosition": {
                                    "row": 14,
                                    "col": 14
                                },
                                "highlightCoordinates": null,
                                "isSaved": true
                            }
                        ],
                        "isEditorContextMenuOpen": false
                    },
                    "terminalSnapshot": {
                        "terminals": [
                            {
                                "content": ""
                            }
                        ]
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
                        "button": 0,
                        "buttonStates": {
                            "left": false,
                            "right": false,
                            "middle": false
                        },
                        "scrollPosition": {
                            "x": 0,
                            "y": 0
                        },
                        "scrollDelta": 0
                    },
                    "authorSnapshot": {
                        "authors": [
                            {
                                "currentSpeechCaption": "In the next lesson, we'll see how to create the same server but using TypeScript with Anthropic's TypeScript SDK. See you there!"
                            }
                        ]
                    }
                }
            }
            const virtualIDE = new VirtualIDE(lesson, lesson.actions.length - 1, true);

            // expect in the snapshot we have a python folder with hello_mcp.py file
            // and a typescript folder with package.json file
            expect(virtualIDE.virtualFileExplorer.getCurrentFileStructure()).toEqual({
                "python": {
                    "type": "directory",
                    "content": "",
                    "collapsed": true,
                    "children": {
                        "hello_mcp.py": {
                            "type": "file",
                            "content": "from fastmcp import FastMCP\n\n# 1. Instantiate a server and give our tool a namespace\nmcp = FastMCP(\"hello\")\n\n# 2. Expose a single action\n@mcp.tool\ndef greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello,{name}! 👋\"\n\n# 3. Run with the built-in stdio transport (works with any client)\nif __name__ == \"__main__\":\n    mcp.run()",
                            "language": "py",
                            "caretPosition": {
                                "row": 0,
                                "col": 0
                            }
                        }
                    }
                },
                "typescript": {
                    "type": "directory",
                    "content": "",
                    "collapsed": true,
                    "children": {
                        "package.json": {
                            "type": "file",
                            "content": "",
                            "language": "json",
                            "caretPosition": {
                                "row": 0,
                                "col": 0
                            }
                        },
                        "tsconfig.json": {
                            "type": "file",
                            "content": "{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"Node16\",\n    \"moduleResolution\": \"Node16\",\n    \"outDir\": \"./build\",\n    \"rootDir\": \"./src\",\n    \"strict\": true,\n    \"esModuleInterop\": true,\n    \"skipLibCheck\": true,\n    \"forceConsistentCasingInFileNames\": true\n  },\n  \"include\": [\"src /**/*\"],\n  \"exclude\": [\"node_modules\"]\n}",
                            "language": "json",
                            "caretPosition": {
                                "row": 0,
                                "col": 0
                            }
                        }
                    }
                }
            });
        });


        it("also works from a lesson with initial snapshot and creating a folder with the terminal, then a file with the mouse, editing that file, and saving, and then adding yet another folder within a folder with mouse", () => {
            const lesson: ILesson = {
                "id": "typescript-mcp-lesson",
                "name": "Building an MCP Server with TypeScript",
                "description": "Learn how to create the same MCP server using TypeScript and Anthropic's official SDK",
                "actions": [
                    {
                        "name": "author-speak-before",
                        "value": "In the previous lesson, we built our first MCP server using FastMCP in Python and successfully tested it with mcp-cli."
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Now let's create the exact same functionality using TypeScript and Anthropic's official MCP SDK. First, we'll organize our project by moving the Python file into its own folder."
                    },
                    {
                        "name": "terminal-open",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "mkdir python"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "mv hello_mcp.py python/hello_mcp.py"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "ls"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Now let's create a typescript folder to keep our TypeScript implementation organized."
                    },
                    {
                        "name": "terminal-type",
                        "value": "mkdir typescript"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-type",
                        "value": "cd typescript"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Perfect! Now let's set up our TypeScript project. We'll start by initializing a new Node.js project."
                    },
                    {
                        "name": "terminal-type",
                        "value": "npm init -y"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "file-explorer-create-file",
                        "value": "typescript/package.json"
                    },
                    {
                        "name": "terminal-set-output",
                        "value": "Wrote to package.json"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Now we'll install the Anthropic MCP SDK and TypeScript dependencies."
                    },
                    {
                        "name": "terminal-type",
                        "value": "npm install @modelcontextprotocol/sdk zod"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-set-output",
                        "value": "added 15 packages, and audited 16 packages in 2s"
                    },
                    {
                        "name": "terminal-type",
                        "value": "npm install -D typescript @types/node"
                    },
                    {
                        "name": "terminal-enter",
                        "value": "1"
                    },
                    {
                        "name": "terminal-set-output",
                        "value": "added 3 packages, and audited 19 packages in 1s"
                    },
                    {
                        "name": "author-speak-before",
                        "value": "Let's create our TypeScript configuration file."
                    },
                    {
                        "name": "mouse-move-file-explorer-folder",
                        "value": "typescript"
                    },
                    {
                        "name": "mouse-right-click",
                        "value": "1"
                    },
                    {
                        "name": "mouse-move-file-explorer-folder-context-menu-new-file",
                        "value": "1"
                    },
                    {
                        "name": "mouse-left-click",
                        "value": "1"
                    },
                    {
                        "name": "file-explorer-type-new-file-input",
                        "value": "tsconfig.json"
                    },
                    {
                        "name": "file-explorer-enter-new-file-input",
                        "value": "1"
                    },
                    {
                      "name": "editor-type",
                      "value": "{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"Node16\",\n    \"moduleResolution\": \"Node16\",\n    \"outDir\": \"./build\",\n    \"rootDir\": \"./src\",\n    \"strict\": true,\n    \"esModuleInterop\": true,\n    \"skipLibCheck\": true,\n    \"forceConsistentCasingInFileNames\": true\n  },\n  \"include\": [\"src /**/*\"],\n  \"exclude\": [\"node_modules\"]\n}"
                    },
                    {
                      "name": "editor-save",
                      "value": "1"
                    },
                    {
                      "name": "author-speak-before",
                      "value": "Now let's create a source directory and our main TypeScript file."
                    },
                    {
                      "name": "mouse-move-file-explorer-folder",
                      "value": "typescript"
                    },
                    {
                      "name": "mouse-right-click",
                      "value": "1"
                    },
                    {
                      "name": "mouse-move-file-explorer-folder-context-menu-new-folder",
                      "value": "1"
                    },
                    {
                      "name": "mouse-left-click",
                      "value": "1"
                    },
                    {
                      "name": "file-explorer-type-new-folder-input",
                      "value": "src"
                    },
                    {
                      "name": "file-explorer-enter-new-folder-input",
                      "value": "1"
                    },
                ],
                "initialSnapshot": {
                    "isUnsavedChangesDialogOpen": false,
                    "unsavedFileName": "",
                    "fileExplorerSnapshot": {
                        "fileStructure": {
                            "hello_mcp.py": {
                                "type": "file",
                                "content": "from fastmcp import FastMCP\n\n# 1. Instantiate a server and give our tool a namespace\nmcp = FastMCP(\"hello\")\n\n# 2. Expose a single action\n@mcp.tool\ndef greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello,{name}! 👋\"\n\n# 3. Run with the built-in stdio transport (works with any client)\nif __name__ == \"__main__\":\n    mcp.run()",
                                "language": "py",
                                "caretPosition": {
                                    "row": 0,
                                    "col": 0
                                }
                            }
                        },
                        "isFileExplorerContextMenuOpen": false,
                        "isFileContextMenuOpen": false,
                        "isFolderContextMenuOpen": false,
                        "isNewFileInputVisible": false,
                        "isNewFolderInputVisible": false,
                        "newFileInputValue": "",
                        "newFolderInputValue": "",
                        "isRenameFileInputVisible": false,
                        "isRenameFolderInputVisible": false,
                        "originalFileBeingRenamed": "",
                        "originalFolderBeingRenamed": "",
                        "renameFileInputValue": "",
                        "renameFolderInputValue": "",
                        "newFileParentPath": "",
                        "newFolderParentPath": ""
                    },
                    "editorSnapshot": {
                        "editors": [
                            {
                                "isActive": true,
                                "filename": "hello_mcp.py",
                                "content": "from fastmcp import FastMCP\n\n# 1. Instantiate a server and give our tool a namespace\nmcp = FastMCP(\"hello\")\n\n# 2. Expose a single action\n@mcp.tool\ndef greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello,{name}! 👋\"\n\n# 3. Run with the built-in stdio transport (works with any client)\nif __name__ == \"__main__\":\n    mcp.run()",
                                "caretPosition": {
                                    "row": 14,
                                    "col": 14
                                },
                                "highlightCoordinates": null,
                                "isSaved": true
                            }
                        ],
                        "isEditorContextMenuOpen": false
                    },
                    "terminalSnapshot": {
                        "terminals": [
                            {
                                "content": ""
                            }
                        ]
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
                        "button": 0,
                        "buttonStates": {
                            "left": false,
                            "right": false,
                            "middle": false
                        },
                        "scrollPosition": {
                            "x": 0,
                            "y": 0
                        },
                        "scrollDelta": 0
                    },
                    "authorSnapshot": {
                        "authors": [
                            {
                                "currentSpeechCaption": "In the next lesson, we'll see how to create the same server but using TypeScript with Anthropic's TypeScript SDK. See you there!"
                            }
                        ]
                    }
                }
            }
            const virtualIDE = new VirtualIDE(lesson, lesson.actions.length - 1, true);

            // expect in the snapshot we have a python folder with hello_mcp.py file
            // and a typescript folder with package.json file
            expect(virtualIDE.virtualFileExplorer.getCurrentFileStructure()).toEqual({
                "python": {
                    "type": "directory",
                    "content": "",
                    "collapsed": true,
                    "children": {
                        "hello_mcp.py": {
                            "type": "file",
                            "content": "from fastmcp import FastMCP\n\n# 1. Instantiate a server and give our tool a namespace\nmcp = FastMCP(\"hello\")\n\n# 2. Expose a single action\n@mcp.tool\ndef greet(name: str) -> str:\n    \"\"\"Return a friendly greeting.\"\"\"\n    return f\"Hello,{name}! 👋\"\n\n# 3. Run with the built-in stdio transport (works with any client)\nif __name__ == \"__main__\":\n    mcp.run()",
                            "language": "py",
                            "caretPosition": {
                                "row": 0,
                                "col": 0
                            }
                        }
                    }
                },
                "typescript": {
                    "type": "directory",
                    "content": "",
                    "collapsed": true,
                    "children": {
                        "package.json": {
                            "type": "file",
                            "content": "",
                            "language": "json",
                            "caretPosition": {
                                "row": 0,
                                "col": 0
                            }
                        },
                        "tsconfig.json": {
                            "type": "file",
                            "content": "{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"Node16\",\n    \"moduleResolution\": \"Node16\",\n    \"outDir\": \"./build\",\n    \"rootDir\": \"./src\",\n    \"strict\": true,\n    \"esModuleInterop\": true,\n    \"skipLibCheck\": true,\n    \"forceConsistentCasingInFileNames\": true\n  },\n  \"include\": [\"src /**/*\"],\n  \"exclude\": [\"node_modules\"]\n}",
                            "language": "json",
                            "caretPosition": {
                                "row": 0,
                                "col": 0
                            }
                        },
                        "src": {
                            "type": "directory",
                            "content": "",
                            "collapsed": true,
                            "children": {}
                        }
                    }
                }
            });
        });
    });
});