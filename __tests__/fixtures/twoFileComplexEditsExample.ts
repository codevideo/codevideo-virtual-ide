import { IAction } from "@fullstackcraftllc/codevideo-types";

export const twoFileComplexEditsExample: IAction[] = [
    // Initial setup explanation
    {
        name: "author-speak-before",
        value: "Today, we're going to learn about how to use the console.log function in JavaScript."
    }, // index 0
    {
        name: "author-speak-before",
        value: "Let's first create a src folder."
    }, // index 1
    {
        name: "file-explorer-create-folder",
        value: "src"
    }, // index 2
    {
        name: "author-speak-before",
        value: "and now let's create a hello-world.js file inside it."
    }, // index 3
    {
        name: "file-explorer-create-file",
        value: "src/hello-world.js"
    }, // index 4

    // Opening and editing the first file
    {
        name: "author-speak-before",
        value: "Let's open up hello-world.js now..."
    }, // index 5
    {
        name: "file-explorer-open-file", // how to constitute with 'click-filename'?
        value: "src/hello-world.js"
    }, // index 6
    {
        name: "mouse-click-editor",
        value: "1"
    }, // index 7
    {
        name: "editor-type",
        value: "console.log('Hello, world!');"
    }, // index 8
    {
        name: "editor-save",
        value: "1"
    }, // index 9

    // Terminal operations
    {
        name: "author-speak-before",
        value: "Now we'll open up a terminal and run this file."
    }, // index 10
    {
        name: "terminal-open",
        value: "1"
    }, // index 11
    {
        name: "mouse-click-terminal",
        value: "1"
    }, // index 12
    {
        name: "terminal-type",
        value: "node src/hello-world.js"
    }, // index 13
    {
        name: "terminal-enter",
        value: "1"
    }, // index 14

    // Creating utility module
    {
        name: "author-speak-before",
        value: "Let's create a utilities module for our logger."
    }, // index 15
    {
        name: "file-explorer-create-folder",
        value: "src/utils"
    }, // index 16
    {
        name: "file-explorer-create-file",
        value: "src/utils/logger.js"
    }, // index 17
    {
        name: "file-explorer-open-file",
        value: "src/utils/logger.js"
    }, // index 18
    {
        name: "mouse-click-editor",
        value: "1"
    }, // index 19
    {
        name: "editor-type",
        value: "export const log = (message) => {\n    console.log(message);\n}"
    }, // index 20
    {
        name: "editor-save",
        value: "1"
    }, // index 21

    // Updating main file
    {
        name: "mouse-click-filename",
        value: "src/hello-world.js"
    }, // index 22
    {
        name: "mouse-click-editor",
        value: "1"
    }, // index 23
    {
        name: "editor-backspace",
        value: "40"
    }, // index 24
    {
        name: "editor-type",
        value: "const { log } = require('./utils/logger');\n\nlog('Hello, world!');"
    }, // index 25
    {
        name: "editor-save",
        value: "1"
    }, // index 26

    // Final run
    {
        name: "mouse-click-terminal",
        value: "1"
    }, // index 27
    {
        name: "terminal-type",
        value: "node src/hello-world.js"
    }, // index 28
];