import { IAction, ICourse, ILesson } from "@fullstackcraftllc/codevideo-types";
import { VirtualIDE } from "../../src/VirtualIDE";

/**
 * Regression coverage for constructor project routing.
 *
 * Since codevideo-types 2.1.33+, isValidActions returns an
 * IActionValidationResult object (always truthy) instead of a boolean. The
 * constructor's previously NON-exclusive routing then sent course/lesson
 * projects through the actions path as well, crashing on `actions.slice`.
 */
describe("VirtualIDE", () => {
    const actions: Array<IAction> = [
        { name: "file-explorer-create-file", value: "index.ts" },
        { name: "file-explorer-open-file", value: "index.ts" },
        { name: "author-speak-before", value: "Welcome to the lesson!" },
    ];

    const lesson: ILesson = {
        id: "lesson-1",
        name: "Test Lesson",
        description: "A lesson",
        actions,
    };

    const course: ICourse = {
        id: "course-1",
        name: "Test Course",
        description: "A course",
        primaryLanguage: "typescript",
        lessons: [lesson],
    };

    describe("constructor project routing", () => {
        it("routes a course-shaped project ONLY through the course path (no .slice crash)", () => {
            expect(() => new VirtualIDE(course, actions.length - 1)).not.toThrow();

            const virtualIDE = new VirtualIDE(course, actions.length - 1);
            const snapshot = virtualIDE.getCourseSnapshot();
            expect(snapshot.editorSnapshot.editors[0]?.filename).toBe("index.ts");
            expect(snapshot.authorSnapshot.authors[0].currentSpeechCaption).toBe("Welcome to the lesson!");
        });

        it("routes a lesson-shaped project ONLY through the lesson path", () => {
            expect(() => new VirtualIDE(lesson, actions.length - 1)).not.toThrow();

            const virtualIDE = new VirtualIDE(lesson, actions.length - 1);
            const snapshot = virtualIDE.getCourseSnapshot();
            expect(snapshot.editorSnapshot.editors[0]?.filename).toBe("index.ts");
        });

        it("still reconstitutes a plain valid actions array", () => {
            const virtualIDE = new VirtualIDE(actions, actions.length - 1);
            const snapshot = virtualIDE.getCourseSnapshot();
            expect(snapshot.editorSnapshot.editors[0]?.filename).toBe("index.ts");
        });

        it("does not apply an actions array containing an invalid action (strict gating preserved)", () => {
            const withInvalid: Array<IAction> = [
                { name: "file-explorer-create-file", value: "index.ts" },
                // empty value is rejected by isValidAction in codevideo-types
                { name: "external-web-preview", value: "" } as IAction,
            ];
            const virtualIDE = new VirtualIDE(withInvalid, 1);
            const snapshot = virtualIDE.getCourseSnapshot();
            // nothing applied: no editors were opened/created
            expect(snapshot.editorSnapshot.editors.length).toBe(0);
        });
    });
});
