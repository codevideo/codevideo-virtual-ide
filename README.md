# @fullstackcraft/codevideo-virtual-editor

![NPM Version](https://img.shields.io/npm/v/:fullstackcraftllc/codevideo-virtual-editor)

`codevideo-virtual-editor` is a TypeScript class that simulates a terminal with features like cursor navigation, text insertion, and line manipulation. It provides a flexible interface for applying various editing actions such as typing, moving the cursor, and executing commands. This lightweight and versatile library is ideal for building educational tools, code playgrounds, and interactive coding environments within web applications.

This library heavily relies on the types from [codevideo-types](https://github.com/codevideo/codevideo-types)

## Example Usage

```typescript
import { VirtualEditor } from '@fullstackcraftllc/codevideo-virtual-editor';

// Initialize a VirtualEditor instance with some IActions (@fullstackcraftllc/codevideo-types)
const initialCodeLines = [
  {
    "name": "type-terminal",
    "value": "cd my-new-project"
  },
  {
    "name": "type-terminal",
    "value": "npm init -y"},
  {
    "name": "type-terminal",
    "value": "touch index.js"
  },
  {
    "name": "type-terminal",
    "value": "echo 'console.log(\"Hello, world!\")' > index.js"
  },
  {
    "name": "click-file",
    "value": "index.js"
  },
  {
    "name": "type-editor",
    "value": " // This is a comment"
  },
  {
    "name": "type-editor",
    "value": "console.log('Hello, world!')"
  },
  {
    "name": "type-terminal",
    "value": "node index.js"
  }
];
const virtualEditor = new VirtualEditor(initialCodeLines);

// Apply terminal actions to create a new file with a for loop
virtualEditor.applyActions([
  { name: 'type-terminal', value: 'touch for-loop.js' },
  { name: 'click-file', value: 'for-loop.js' },
  { name: 'type-editor', value: 'for (let i = 0; i < 5; i++) {' },
  { name: 'enter-editor', value: '1' },
  { name: 'type-editor', value: '  console.log(i);' },
  { name: 'enter-editor', value: '1' },
  { name: 'type-editor', value: '}' },
  { name: 'type-terminal', value: 'node for-loop.js' }
]);

// Project snapshot represents everything in the current state of the IDE
const projectSnapshot = virtualEditor.getProjectSnapshot();

// Log the final code and actions applied
console.log('Metadata:', projectSnapshot.metadata);
console.log('File structure', projectSnapshot.fileStructure);
console.log('Selected file', projectSnapshot.selectedFile);
console.log('Open files', projectSnapshot.openFiles);
console.log('Editor content', projectSnapshot.editorContent);
console.log('Editor caret position', projectSnapshot.editorCaretPosition);
console.log('Cursor position', projectSnapshot.cursorPosition);
console.log('Terminal content', projectSnapshot.terminalContent);
```

## Available Methods

### `getProjectSnapshot(): IProjectSnapshot`

Returns a snapshot of the current project state, including metadata, file structure, selected file, open files, editor content, and editor caret position.

## Why?

This library is the main powerhouse used to build projections are used to validate steps across the CodeVideo ecosystem. This is a small part of a larger project to create a declarative way to build, edit, and generate step by step educational video software courses.

See more at [codevideo.io](https://codevideo.io)