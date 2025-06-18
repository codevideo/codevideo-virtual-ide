import { ILesson } from "@fullstackcraftllc/codevideo-types";

export const twoFileFullLoopLesson: ILesson = {
  "id": "two-file-exploration",
  "name": "Two File Example Exploration",
  "description": "A test lesson with two files to explore.",
  "initialSnapshot": {
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
        "package.json": {
          "type": "file",
          "content": "{ hey some package json content }",
          "language": "json",
          "caretPosition": {
            "row": 0,
            "col": 0
          }
        },
        "index.js": {
          "type": "file",
          "content": "module.exports = require('./lib/express');",
          "language": "javascript",
          "caretPosition": {
            "row": 0,
            "col": 0
          }
        }
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
      "authors": []
    }
  },
  "actions": [
    {
      "name": "author-speak-before",
      "value": "Welcome to this walkthrough of a simple two file repository."
    },
    {
      "name": "author-speak-before",
      "value": "Let's start by opening package.json."
    },
    {
      "name": "file-explorer-open-file",
      "value": "package.json"
    },
    {
      "name": "author-speak-before",
      "value": "The package.json is just a dummy package json for testing."
    },
    {
      "name": "author-speak-before",
      "value": "Now, let's open up index.js."
    },
    {
      "name": "file-explorer-open-file",
      "value": "index.js"
    },
    {
      "name": "author-speak-before",
      "value": "This is the main entry point."
    },
    {
      "name": "author-speak-before",
      "value": "Alright, that's it for this short demo! Let's close up these tabs and call it a day."
    },
    {
      "name": "mouse-move-editor-tab-close",
      "value": "index.js"
    },
    {
      "name": "mouse-left-click",
      "value": "1"
    },
    {
      "name": "mouse-move-editor-tab-close",
      "value": "package.json"
    },
    {
      "name": "mouse-left-click",
      "value": "1"
    },
    {
      "name": "author-speak-before",
      "value": "Perfect - right back where we started! Until next time, happy coding!"
    }
  ]
}