import { VirtualIDE } from "../../src/VirtualIDE";

describe("VirtualIDE", () => {
    describe("cross domain interactions with file explorer", () => {
        it("should be able to make, move into, and move out of a directory", () => {
            const virtualIDE = new VirtualIDE();
            virtualIDE.applyAction({
                name: "file-explorer-create-folder",
                value: "test"
            });
            virtualIDE.applyAction({
                name: "terminal-open",
                value: "1"
            });
            virtualIDE.applyAction({
                name: "terminal-type",
                value: "cd test"
            });
            virtualIDE.applyAction({
                name: "terminal-enter",
                value: "1"
            });
            // assert that both the file-explorer and terminal present working directory as test
            expect(virtualIDE.virtualTerminals[0].getPresentWorkingDirectory()).toBe("~/test");

            // move out of the directory back to root
            virtualIDE.applyAction({
                name: "terminal-type",
                value: "cd .."
            });
            virtualIDE.applyAction({
                name: "terminal-enter",
                value: "1"
            });

            // assert that both the file-explorer and terminal present working directory as root
            expect(virtualIDE.virtualTerminals[0].getPresentWorkingDirectory()).toBe("~");
        });
    });
});