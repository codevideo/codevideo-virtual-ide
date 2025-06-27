import { VirtualIDE } from "../../src/VirtualIDE";

describe("VirtualIDE", () => {
    describe("copy files", () => {
        it("should be able to move a file to another", () => {
            const virtualIDE = new VirtualIDE();
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
                value: "mv test.md test2.md"
            });
            virtualIDE.applyAction({
                name: "terminal-enter",
                value: "1"
            });
            // assert that both files exist in the file explorer
            const files = virtualIDE.virtualFileExplorer.getFiles();
            expect(files).toContain("/test2.md");
            expect(files).not.toContain("/test.md");

            // ls should also show both files
            const lsString = virtualIDE.getLsString();
            expect(lsString).toContain("test2.md");
            expect(lsString).not.toContain("test.md");
        });
    });
});