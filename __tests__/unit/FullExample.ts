import { VirtualEditor } from "./../../src/VirtualEditor";
import { describe, expect } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";

describe("VirtualEditor", () => {
  describe("full audit of complex steps", () => {
    it("should have correct state for everything at every step", () => {
      const virtualEditor = new VirtualEditor([]);
      const realExampleActions: IAction[] = [
        // 0
        {
          name: "speak-before",
          value:
            "Let's learn how to use the console.log function in JavaScript!",
        },
        // 1
        {
          name: "speak-before",
          value:
            "First, to make it clear that this is a JavaScript file, I'll just put a comment here",
        },
        // 2
        {
          name: "type-editor",
          value: "// index.js",
        },
        // 3
        {
          name: "enter",
          value: "1",
        },
        // 4
        {
          name: "speak-before",
          value:
            "For starters, let's just print 'Hello world!' to the console.",
        },
        // 5
        {
          name: "type-editor",
          value: "console.log('Hello, world!');",
        },
        // 6
        {
          name: "speak-before",
          value:
            "and if I wanted to write the value of some variable to the console, I could do that like so:",
        },
        // 7
        {
          name: "backspace",
          value: "29",
        },
        // 8
        {
          name: "type-editor",
          value: "const myVariable = 5;",
        },
        // 9
        {
          name: "enter",
          value: "1",
        },
        // 10
        {
          name: "type-editor",
          value: "console.log(myVariable);",
        },
        // 11
        {
          name: "speak-before",
          value:
            "Now, when I run this code, I would expect the value of 'myVariable' to be printed to the console. Something like:",
        },
        // 12
        {
          name: "enter",
          value: "1",
        },
        // 13
        {
          name: "type-editor",
          value: "// 5",
        },
        // 14
        {
            name: "speak-before",
            value: "Console logging is simple, yet powerful and very useful!"
        }
      ];
      virtualEditor.applyActions(realExampleActions);
      const projectSnapshot =
        virtualEditor.getProjectSnapshot();
      expect(projectSnapshot).toEqual({
        metadata: {
          id: "unknown",
          name: "unknown",
          description: "unknown",
          primaryLanguage: "unknown",
        },
        virtualFileSystem: {
          files: [
            {
              name: "index.js",
              content: [
                "// index.js",
                "console.log('Hello, world!');",
                "const myVariable = 5;",
                "console.log(myVariable);",
                "// 5",
              ],
            },
          ],
        },
        virtualCodeBlocks: [],
        virtualTerminals: [],
      });
    });
  });
});
