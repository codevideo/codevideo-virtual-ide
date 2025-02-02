import { VirtualIDE } from "../../src/VirtualIDE";
import * as fs from "fs";
import * as path from "path";
import { advancedRustExampleActions } from "../fixtures/rustAdvancedExample";
import { buildViewerHTML } from "@fullstackcraftllc/codevideo-html-gen"

describe("VirtualIDE Snapshot with IDE Layout", () => {
  it("should capture snapshots after each action and write raw HTML files", () => {
    // Create output directory for HTML snapshots.
    const htmlOutputDir = path.resolve(__dirname, "html_snapshots");
    if (!fs.existsSync(htmlOutputDir)) {
      fs.mkdirSync(htmlOutputDir);
    }

    // Clear the html_snapshots directory.
    fs.readdirSync(htmlOutputDir).forEach((file) => {
      fs.unlinkSync(path.join(htmlOutputDir, file));
    });

    // Build the final viewer HTML using the external template.
    const viewerHTML = buildViewerHTML(advancedRustExampleActions);
    fs.writeFileSync(
      path.join(htmlOutputDir, "01-view-all.html"),
      viewerHTML,
      { encoding: "utf8" }
    );
  });
});