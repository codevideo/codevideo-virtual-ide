import { VirtualIDE } from "../../src/VirtualIDE";

describe("VirtualIDE", () => {
    describe("cat files", () => {
        it("should be able to cat an empty non saved file as empty and a saved file with contents", () => {
            const virtualIDE = new VirtualIDE();
            virtualIDE.applyAction({
                name: "file-explorer-create-file",
                value: "test.md"
            });
            virtualIDE.applyAction({
                name: "file-explorer-open-file",
                value: "test.md"
            });
            virtualIDE.applyAction({
                name: "editor-type",
                value: "# Hello, world!"
            });
            virtualIDE.applyAction({
                name: "terminal-open",
                value: "1"
            });
            virtualIDE.applyAction({
                name: "terminal-type",
                value: "cat test.md"
            });
            virtualIDE.applyAction({
                name: "terminal-enter",
                value: "1"
            });
            // assert that cat on an unsaved file new file returns empty string (no cat output, we jump right to clean prompt)
            const buffer = virtualIDE.virtualTerminals[0].getBuffer();
            const prompt = virtualIDE.virtualTerminals[0].getPrompt();
            const catOutput = buffer[buffer.length - 1];
            expect(catOutput).toBe(prompt);

            // saving the file should persist the edits to the file explorer
            virtualIDE.applyAction({
                name: "editor-save",
                value: "1"
            });
            virtualIDE.applyAction({
                name: "terminal-type",
                value: "cat test.md"
            });
            virtualIDE.applyAction({
                name: "terminal-enter",
                value: "1"
            });

            // assert that the content in the file explorer is the same as the saved file
            const fileObjects = virtualIDE.virtualFileExplorer.getFileObjects();
            const file = fileObjects[0];
            expect(file.content).toBe("# Hello, world!");

            // assert that cat on a saved file returns the contents
            const buffer2 = virtualIDE.virtualTerminals[0].getBuffer();
            const catOutput2 = buffer2[buffer2.length - 2]; // back two because we have a clean prompt as the current line
            expect(catOutput2).toBe("# Hello, world!");
        });
    });
});