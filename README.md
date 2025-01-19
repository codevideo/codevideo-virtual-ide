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

const virtualEditor = new VirtualEditor();
const virtualTerminal = new VirtualTerminal();
const virtualAuthor = new VirtualAuthor();

const virtualIDE = new VirtualIDE();

virtualIDE.addVirtualEditor(virtualEditor);
virtualIDE.addVirtualTerminal(virtualTerminal);
virtualIDE.addVirtualAuthor(virtualAuthor);

virtualIDE.applyAction({
  name: 'create-folder',
  value: 'src',
})

virtualIDE.applyAction({
  name: 'create-file',
  value: 'src/index.js',
})

virtualIDE.applyAction({
  name: 'open-file',
  value: 'src/index.js',
})

virtualIDE.applyAction({
  name: 'type-editor',
  value: 'console.log("Hello, World!")',
})

virtualIDE.applyAction({
  name: 'type-terminal',
  value: 'node src/index.js',
})

```

## Why?

This library is the main powerhouse used to build projections that are used to validate actions across the CodeVideo ecosystem. This is a small part of a larger project to create a declarative way to build, edit, and generate step by step educational video software courses.

See more at [codevideo.io](https://codevideo.io)