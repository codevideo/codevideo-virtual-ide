import { VirtualIDE } from "../../src/VirtualIDE";

describe("VirtualIDE", () => {
    describe("cross domain interactions with file explorer", () => {
        it("should have a correct buffer state at initialization and after various actions", () => {
            const virtualIDE = new VirtualIDE(undefined, undefined, false);
            virtualIDE.applyAction({ name: "terminal-open", value: "1" });
            const virtualTerminal = virtualIDE.virtualTerminals[0];
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> ",
            ]);
            virtualIDE.applyAction({ name: "terminal-type", value: "echo 'hello world!'" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
            ]);
            // pressing enter causes the correct output to be displayed, and the prompt to be reset
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer().length).toEqual(3);
            expect(virtualTerminal.getBuffer()[0]).toEqual("[codevideo.studio] [~] /> echo 'hello world!'")
            expect(virtualTerminal.getBuffer()[1]).toEqual("hello world!")
            expect(virtualTerminal.getBuffer()[2]).toEqual("[codevideo.studio] [~] /> ")
            virtualIDE.applyAction({ name: "terminal-type", value: "ls" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
            ]);
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> ", // absolutely no output line because we don't have any files in an empty terminal - empty ls doesn't even output a newline
            ]);
            virtualIDE.applyAction({ name: "terminal-type", value: "mkdir test" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> mkdir test",
            ]);
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> mkdir test",
                "[codevideo.studio] [~] /> ",
            ]);
            // cross domain check - the file explorer should now have a test directory
            const virtualFileExplorer = virtualIDE.virtualFileExplorer;
            expect(virtualFileExplorer.getLsString()).toEqual("test");

            // now with ls and enter we should see the test directory
            virtualIDE.applyAction({ name: "terminal-type", value: "ls" });
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> mkdir test",
                "[codevideo.studio] [~] /> ls",
                "test",
                "[codevideo.studio] [~] /> ",
            ]);
            // now let's move into the test directory
            virtualIDE.applyAction({ name: "terminal-type", value: "cd test" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> mkdir test",
                "[codevideo.studio] [~] /> ls",
                "test",
                "[codevideo.studio] [~] /> cd test",
            ]);
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> mkdir test",
                "[codevideo.studio] [~] /> ls",
                "test",
                "[codevideo.studio] [~] /> cd test",
                "[codevideo.studio] [~/test] /> ", // prompt should change to reflect the present working directory
            ]);

            // now let's make a file1.txt in the test directory
            virtualIDE.applyAction({ name: "terminal-type", value: "touch file1.txt" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> mkdir test",
                "[codevideo.studio] [~] /> ls",
                "test",
                "[codevideo.studio] [~] /> cd test",
                "[codevideo.studio] [~/test] /> touch file1.txt",
            ]);
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> mkdir test",
                "[codevideo.studio] [~] /> ls",
                "test",
                "[codevideo.studio] [~] /> cd test",
                "[codevideo.studio] [~/test] /> touch file1.txt",
                "[codevideo.studio] [~/test] /> ",
            ]);
            // now with ls within the test directory we should see only the file1.txt file
            virtualIDE.applyAction({ name: "terminal-type", value: "ls" });
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> mkdir test",
                "[codevideo.studio] [~] /> ls",
                "test",
                "[codevideo.studio] [~] /> cd test",
                "[codevideo.studio] [~/test] /> touch file1.txt",
                "[codevideo.studio] [~/test] /> ls",
                "file1.txt",
                "[codevideo.studio] [~/test] /> ",
            ]);
            // now with tree from the root we should see the test folder and file1.txt file
            virtualIDE.applyAction({ name: "terminal-type", value: "cd .." });
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            virtualIDE.applyAction({ name: "terminal-type", value: "tree" });
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> echo 'hello world!'",
                "hello world!",
                "[codevideo.studio] [~] /> ls",
                "[codevideo.studio] [~] /> mkdir test",
                "[codevideo.studio] [~] /> ls",
                "test",
                "[codevideo.studio] [~] /> cd test",
                "[codevideo.studio] [~/test] /> touch file1.txt",
                "[codevideo.studio] [~/test] /> ls",
                "file1.txt",
                "[codevideo.studio] [~/test] /> cd ..",
                "[codevideo.studio] [~] /> tree",
                "test",
                "  file1.txt",
                "",
                "[codevideo.studio] [~] /> ",
            ]);
        });

        it("no-ops when the user tries to cd above the root directory", () => {
            const virtualIDE = new VirtualIDE();
            virtualIDE.applyAction({ name: "terminal-open", value: "1" });
            const virtualTerminal = virtualIDE.virtualTerminals[0];
            virtualIDE.applyAction({ name: "terminal-type", value: "cd .." });
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> cd ..",
                "[codevideo.studio] [~] /> ",
            ]);
        });

        it("writes a missing terminal command when a command is not found", () => {
            const virtualIDE = new VirtualIDE();
            virtualIDE.applyAction({ name: "terminal-open", value: "1" });
            const virtualTerminal = virtualIDE.virtualTerminals[0];
            virtualIDE.applyAction({ name: "terminal-type", value: "not-a-command" });
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> not-a-command",
                "not-a-command: command not found",
                "[codevideo.studio] [~] /> ",
            ]);
        });

        it("writes a terminal error if they try to cd into a file", () => {
            const virtualIDE = new VirtualIDE();
            virtualIDE.applyAction({ name: "terminal-open", value: "1" });
            const virtualTerminal = virtualIDE.virtualTerminals[0];
            virtualIDE.applyAction({ name: "terminal-type", value: "touch file1.txt" });
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            virtualIDE.applyAction({ name: "terminal-type", value: "cd file1.txt" });
            virtualIDE.applyAction({ name: "terminal-enter", value: "1" });
            expect(virtualTerminal.getBuffer()).toEqual([
                "[codevideo.studio] [~] /> touch file1.txt",
                "[codevideo.studio] [~] /> cd file1.txt",
                "cd: not a directory: file1.txt",
                "[codevideo.studio] [~] /> ",
            ]);
        });
    });
});