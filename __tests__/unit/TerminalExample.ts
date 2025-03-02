import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";

describe("VirtualIDE", () => {
  describe("simple terminal tests", () => {
    it("should have a terminal after issuing terminal-open", () => {
      const virtualIDE = new VirtualIDE();
      expect(virtualIDE.getTerminalSnapshot().terminals).toHaveLength(0);
      virtualIDE.applyAction({
        name: "terminal-open",
        value: "1"
      });
      expect(virtualIDE.getTerminalSnapshot().terminals).toHaveLength(1);
    });
  });
});