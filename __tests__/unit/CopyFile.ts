import { VirtualIDE } from "../../src/VirtualIDE";

describe("VirtualIDE", () => {
    describe("copy files", () => {
        it("should be able to copy a file to another", () => {
            const virtualIDE = new VirtualIDE(undefined, undefined);
            virtualIDE.applyAction({
                name: "file-explorer-create-file",
                value: "test.md"
            });
            virtualIDE.applyAction({
                name: "terminal-open",
                value: "1"
            });
            virtualIDE.applyAction({
                name: "terminal-type",
                value: "cp test.md test2.md"
            });
            virtualIDE.applyAction({
                name: "terminal-enter",
                value: "1"
            });
            // assert that both files exist in the file explorer
            const files = virtualIDE.virtualFileExplorer.getFiles();
            expect(files).toEqual(["/test.md", "/test2.md"]);

            // ls should also show both files
            const lsString = virtualIDE.virtualFileExplorer.getLsString();
            expect(lsString).toEqual("test.md\ntest2.md");
        });
    });
});