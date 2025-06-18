import { VirtualIDE } from "../../src/VirtualIDE";
import { describe, expect, it } from "@jest/globals";
import { twoFileFullLoopLesson } from "../fixtures/twoFileFullLoopLesson";

describe("VirtualIDE", () => {
    describe("two file full loop lesson", () => {

        it("should show all files as closed by the end of the lesson since we close them using constructor start", () => {
            // take starting point but none of the actions
            const virtualIDE = new VirtualIDE(twoFileFullLoopLesson, twoFileFullLoopLesson.actions.length - 1);

            // should be no open editors
            expect(virtualIDE.getCourseSnapshot().editorSnapshot.editors.length).toBe(0);

        })

        it("should show all files as closed by the end of the lesson since we close them using applyActions", () => {
            const virtualIDE = new VirtualIDE(twoFileFullLoopLesson, 0);
            virtualIDE.applyActions(twoFileFullLoopLesson.actions);
            expect(virtualIDE.getCourseSnapshot().editorSnapshot.editors.length).toBe(0);
        });
    });
});