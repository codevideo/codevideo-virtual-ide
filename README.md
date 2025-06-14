# @fullstackcraft/codevideo-virtual-ide

![NPM Version](https://img.shields.io/npm/v/@fullstackcraftllc/codevideo-virtual-ide)

`codevideo-virtual-ide` is a TypeScript class that simulates a terminal with features like cursor navigation, text insertion, and line manipulation. It provides a flexible interface for applying various editing actions such as typing, moving the cursor, and executing commands. This lightweight and versatile library is ideal for building educational tools, code playgrounds, and interactive coding environments within web applications.

This library heavily relies on the types from [codevideo-types](https://github.com/codevideo/codevideo-types)

## Example Usage

```typescript
import { VirtualIDE } from '@fullstackcraftllc/codevideo-virtual-ide';
import { VirtualEditor } from '@fullstackcraftllc/codevideo-virtual-editor';
import { VirtualTerminal } from '@fullstackcraftllc/codevideo-virtual-terminal';
import { VirtualAuthor } from '@fullstackcraftllc/codevideo-virtual-author';

const virtualIDE = new VirtualIDE();
virtualIDE.addVirtualEditor(new VirtualEditor());
virtualIDE.addVirtualTerminal(new VirtualTerminal());
virtualIDE.addVirtualAuthor(new VirtualAuthor());

// Create a basic project structure
virtualIDE.applyAction({
  name: 'create-folder',
  value: 'src'
});

virtualIDE.applyAction({
  name: 'create-file',
  value: 'src/index.js'
});

// Add narration
virtualIDE.applyAction({
  name: 'speak-before',
  value: "Let's create a simple JavaScript program."
});

// Open and edit the file
virtualIDE.applyAction({
  name: 'click-filename',
  value: 'src/index.js'
});

virtualIDE.applyAction({
  name: 'type-editor',
  value: 'console.log("Hello, World!");'
});

// Execute in terminal
virtualIDE.applyAction({
  name: 'open-terminal',
  value: '1'
});

virtualIDE.applyAction({
  name: 'type-terminal',
  value: 'node src/index.js'
});

const courseSnapshot = virtualIDE.getCourseSnapshot();

console.log(courseSnapshot);
/* Output:
{
  editorSnapshot: {
    fileStructure: {
      src: {
        type: 'directory',
        content: '',
        collapsed: true,
        children: {
          'index.js': {
            type: 'file',
            content: 'console.log("Hello, World!");',
            language: 'js',
            caretPosition: { row: 0, col: 27 }
          }
        }
      }
    },
    currentFile: 'src/index.js',
    terminalContents: 'node src/index.js'
  },
  mouseSnapshot: {
    x: 0,
    y: 0,
    timestamp: 0,
    type: 'move',
    buttonStates: { left: false, right: false, middle: false },
    scrollPosition: { x: 0, y: 0 }
  },
  authorSnapshot: {
    currentSpeechCaption: ""
  }
}
*/
```

## Why?

This library is the main powerhouse used to build projections that are used to validate actions across the CodeVideo ecosystem. This is a small part of a larger project to create a declarative way to build, edit, and generate step by step educational video software courses.

See more at [codevideo.io](https://codevideo.io)