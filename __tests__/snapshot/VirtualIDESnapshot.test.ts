import { VirtualIDE } from "../../src/VirtualIDE";
import * as fs from "fs";
import * as path from "path";
import { advancedRustExampleActions } from "../fixtures/rustAdvancedExample";
import { twoFileComplexEditsExample } from "../fixtures/twoFileComplexEditsExample";

/**
 * Renders a snapshot of the VirtualIDE state as a full HTML fragment.
 * (This function remains unchanged from your original implementation.)
 */
function renderSnapshot(snapshot: any): string {
  // Helper to recursively render the file structure.
  const renderFileStructure = (fsObj: any): string => {
    let html = "<ul style='list-style: none; padding-left: 10px; margin: 0;'>";
    for (const name in fsObj) {
      const node = fsObj[name];
      if (node.type === "directory") {
        html += `<li style="margin: 2px 0;"><strong>${name}</strong>`;
        if (node.children) {
          html += renderFileStructure(node.children);
        }
        html += `</li>`;
      } else {
        html += `<li style="margin: 2px 0;">${name}</li>`;
      }
    }
    html += "</ul>";
    return html;
  };

  // File Explorer snapshot.
  const fileStructure = snapshot.fileExplorerSnapshot?.fileStructure || {};
  const fileExplorerHTML = renderFileStructure(fileStructure);

  // Build Editor Tabs (for static snapshot, these might be used for display only)
  let editorTabsHTML = "";
  const editors = snapshot.editorSnapshot?.editors || [];
  for (let i = 0; i < editors.length; i++) {
    const editor = editors[i];
    const active = i === 0;
    const savedMarker = editor.isSaved ? "•" : "x";
    editorTabsHTML += `
      <div style="
          padding: 2px 5px;
          border: 1px solid black;
          margin-right: 5px;
          background: ${active ? "#ddd" : "#fff"};
          display: inline-block;">
        ${editor.filename} <span style="color: ${editor.isSaved ? "green" : "red"};">${savedMarker}</span>
      </div>`;
  }

  // In this updated version, we output an "editor area" that will be replaced by Monaco.
  const editorAreaHTML = `
    <div id="editor-area" style="flex: 1; display: flex; flex-direction: column; position: relative;">
      <!-- Editor Tabs -->
      <div id="editor-tabs" style="height: 30px; border-bottom: 1px solid black; overflow-x: auto; padding: 5px;">
        ${editorTabsHTML}
      </div>
      <!-- Monaco editor will be injected here -->
      <div id="monaco-editor-container" style="flex: 1;"></div>
    </div>
  `;

  // Terminal content.
  const terminals = snapshot.terminalSnapshot?.terminals || [];
  const terminalContent = terminals.length > 0 ? terminals[0].content : "";

  // Mouse pointer snapshot.
  const mouseSnapshot = snapshot.mouseSnapshot || { x: 0, y: 0 };
  const mouseLeft = mouseSnapshot.x - 2;
  const mouseTop = mouseSnapshot.y - 2;
  const mouseSVGHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" style="position: absolute; left: ${mouseLeft}px; top: ${mouseTop}px; pointer-events: none; transform: scale(0.8); z-index: 1000;">
      <path d="M 0,0 L 0,20 L 4.5,15.5 L 8.75,23 L 11,22 L 6.75,15 L 13.75,15 Z" fill="black" stroke="white" stroke-width="1.5" stroke-linejoin="round"></path>
    </svg>
  `;

  // Assemble the complete snapshot HTML.
  const html = `
    <div style="display: flex; flex-direction: column; height: 100vh; position: relative;">
      <!-- Main IDE Area -->
      <div style="flex: 1; display: flex;">
        <!-- File Explorer -->
        <div style="width: 200px; border: 1px solid black; padding: 5px; overflow: auto;">
          ${fileExplorerHTML}
        </div>
        <!-- Editor Area -->
        <div style="flex: 1; border: 1px solid black; display: flex; flex-direction: column; position: relative;">
          ${editorAreaHTML}
        </div>
      </div>
      <!-- Terminal Area -->
      <div style="height: 150px; border: 1px solid black; padding: 5px; overflow: auto; font-family: monospace;">
        <div style="font-weight: bold;">codevideo &gt;</div>
        <pre style="margin:0;"><code class="language-javascript">${terminalContent}</code></pre>
      </div>
      <!-- Mouse Pointer SVG -->
      ${mouseSVGHTML}
    </div>
  `;
  return html;
}

/**
 * Builds the viewer HTML by applying actions to a VirtualIDE, capturing snapshots,
 * and then reading in the external HTML template to inject the snapshots JSON.
 */
function buildViewerHTML(actions: any[]): string {
  const virtualIDE = new VirtualIDE();

  // Array to hold snapshots.
  const snapshotsArray: { html: string; speak: string; editors?: any[] }[] = [];

  actions.forEach(action => {
    virtualIDE.applyAction(action);
    const snapshot = virtualIDE.getCourseSnapshot();
    const snapshotHtml = renderSnapshot(snapshot);
    const speakText = action.name.startsWith("author-speak") ? action.value : "";
    snapshotsArray.push({
      html: snapshotHtml,
      speak: speakText,
      editors: snapshot.editorSnapshot?.editors || []
    });
  });

  // Write snapshots.json for debugging purposes.
  fs.writeFileSync(
    path.join(__dirname, "snapshots.json"),
    JSON.stringify(snapshotsArray, null, 2),
    { encoding: "utf8" }
  );

  // Read the external viewer template.
  const viewerTemplatePath = path.resolve(__dirname, "VIEWER_TEMPLATE.html");
  let viewerTemplate = fs.readFileSync(viewerTemplatePath, { encoding: "utf8" });
  // Replace the placeholder with the JSON string.
  viewerTemplate = viewerTemplate.replace(
    "__SNAPSHOTS_JSON__",
    JSON.stringify(snapshotsArray)
  );
  return viewerTemplate;
}

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

    // Use your defined actions.
    const actions = advancedRustExampleActions;

    // Build the final viewer HTML using the external template.
    const viewerHTML = buildViewerHTML(actions);
    fs.writeFileSync(
      path.join(htmlOutputDir, "01-view-all.html"),
      viewerHTML,
      { encoding: "utf8" }
    );

    // (Optional) You can also perform a Jest snapshot assertion here.
    // expect(viewerHTML).toMatchSnapshot();
  });
});


// import { VirtualIDE } from "../../src/VirtualIDE";
// import { VirtualTerminal } from "@fullstackcraftllc/codevideo-virtual-terminal";
// import { VirtualAuthor } from "@fullstackcraftllc/codevideo-virtual-author";
// import * as fs from "fs";
// import * as path from "path";
// import { twoFileComplexEditsExample } from "../fixtures/twoFileComplexEditsExample";
// import { advancedRustExampleActions } from "../fixtures/rustAdvancedExample";
// import { IEditor } from "@fullstackcraftllc/codevideo-types";

// describe("VirtualIDE Snapshot with IDE Layout", () => {
//   it("should capture snapshots after each action and write raw HTML files", () => {
//     const virtualIDE = new VirtualIDE();
//     virtualIDE.addVirtualTerminal(new VirtualTerminal());
//     virtualIDE.addVirtualAuthor(new VirtualAuthor());

//     // Create output directory for HTML snapshots.
//     const htmlOutputDir = path.resolve(__dirname, "html_snapshots");
//     if (!fs.existsSync(htmlOutputDir)) {
//       fs.mkdirSync(htmlOutputDir);
//     }

//     // Define a simple series of actions.
//     const actions = advancedRustExampleActions;

//     // clear html_snapshots directory
//     fs.readdirSync(htmlOutputDir).forEach((file) => {
//       fs.unlinkSync(path.join(htmlOutputDir, file));
//     });

//     // write full viewer HTML
//     const viewerHTML = buildViewerHTML(actions);
//     fs.writeFileSync(path.join(htmlOutputDir, "01-view-all.html"), viewerHTML, { encoding: "utf8" });

//     // // Iterate through actions, writing an HTML snapshot after each.
//     // actions.forEach((action, index) => {
//     //   virtualIDE.applyAction(action);
//     //   const snapshot = virtualIDE.getCourseSnapshot();
//     //   const htmlSnapshot = renderSnapshot(snapshot);

//     //   // Create a safe filename based on the action name.
//     //   const safeActionName = action.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
//     //   const filename = path.join(htmlOutputDir, `snapshot_${index}_${safeActionName}.html`);
//     //   fs.writeFileSync(filename, htmlSnapshot, { encoding: "utf8" });

//     //   // Also perform a Jest snapshot assertion (optional)
//     //   expect(htmlSnapshot).toMatchSnapshot(`Snapshot after action ${index} (${action.name})`);
//     // });
//   });
// });


// /**
//  * Renders a snapshot of the VirtualIDE state as a full HTML fragment
//  * representing a standard IDE layout:
//  * - Left panel: file explorer (without a header label)
//  * - Main/right panel: editor area with tabs and (if available) a caption overlay
//  * - Bottom panel: terminal area (with a "codevideo >" prompt)
//  * - An absolutely positioned SVG simulates a mouse pointer.
//  */
// function renderSnapshot(snapshot: any): string {
//   // Helper to recursively render the file structure.
//   const renderFileStructure = (fsObj: any): string => {
//     let html = "<ul style='list-style: none; padding-left: 10px; margin: 0;'>";
//     for (const name in fsObj) {
//       const node = fsObj[name];
//       if (node.type === "directory") {
//         html += `<li style="margin: 2px 0;"><strong>${name}</strong>`;
//         if (node.children) {
//           html += renderFileStructure(node.children);
//         }
//         html += `</li>`;
//       } else {
//         html += `<li style="margin: 2px 0;">${name}</li>`;
//       }
//     }
//     html += "</ul>";
//     return html;
//   };

//   // File Explorer (no header label)
//   const fileStructure = snapshot.fileExplorerSnapshot?.fileStructure || {};
//   const fileExplorerHTML = renderFileStructure(fileStructure);

//   // Build Editor Tabs (first editor is assumed active)
//   let editorTabsHTML = "";
//   const editors = snapshot.editorSnapshot?.editors || [];
//   for (let i = 0; i < editors.length; i++) {
//     const editor = editors[i];
//     const active = i === 0;
//     // A green bullet ("•") for saved files; a red "x" for unsaved.
//     const savedMarker = editor.isSaved ? "•" : "x";
//     editorTabsHTML += `
//       <div style="
//           padding: 2px 5px;
//           border: 1px solid black;
//           margin-right: 5px;
//           background: ${active ? "#ddd" : "#fff"};
//           display: inline-block;">
//         ${editor.filename} <span style="color: ${editor.isSaved ? "green" : "red"};">${savedMarker}</span>
//       </div>`;
//   }

//   // Active editor content (the content of the first editor)
//   const activeEditorContent = editors.length > 0 ? escapeHtml(editors[0].content) : "";

//   // Editor caption overlay (if a current speech caption exists in the IDE state)
//   let editorCaptionHTML = "";
//   const authors = snapshot.authorSnapshot?.authors || [];
//   if (authors.length > 0 && authors[0].currentSpeechCaption) {
//     editorCaptionHTML = `<div style="
//       position: absolute;
//       bottom: 0;
//       left: 0;
//       right: 0;
//       background: rgba(0,0,0,0.7);
//       color: white;
//       padding: 5px;
//       font-size: 14px;
//       text-align: center;
//     ">
//       ${authors[0].currentSpeechCaption}
//     </div>`;
//   }

//   // Terminal content (assume the first terminal is active)
//   const terminals = snapshot.terminalSnapshot?.terminals || [];
//   const terminalContent = terminals.length > 0 ? terminals[0].content : "";

//   // Mouse pointer SVG: use mouseSnapshot x and y (offset by 2px)
//   const mouseSnapshot = snapshot.mouseSnapshot || { x: 0, y: 0 };
//   const mouseLeft = mouseSnapshot.x - 2;
//   const mouseTop = mouseSnapshot.y - 2;
//   const mouseSVGHTML = `
//   <svg width="24" height="24" viewBox="0 0 24 24" style="position: absolute; left: ${mouseLeft}px; top: ${mouseTop}px; pointer-events: none; transform: scale(0.8); z-index: 1000;">
//     <path d="M 0,0 L 0,20 L 4.5,15.5 L 8.75,23 L 11,22 L 6.75,15 L 13.75,15 Z" fill="black" stroke="white" stroke-width="1.5" stroke-linejoin="round"></path>
//   </svg>
//   `;

//   // Build the complete IDE HTML fragment.
//   const html = `
//   <div style="display: flex; flex-direction: column; height: 100vh; position: relative;">
//     <!-- Main IDE Area -->
//     <div style="flex: 1; display: flex;">
//       <!-- Left: File Explorer -->
//       <div style="width: 200px; border: 1px solid black; padding: 5px; overflow: auto;">
//         ${fileExplorerHTML}
//       </div>
//       <!-- Right: Editor -->
//       <div style="flex: 1; border: 1px solid black; display: flex; flex-direction: column; position: relative;">
//         <!-- Editor Tabs -->
//         <div style="height: 30px; border-bottom: 1px solid black; padding: 5px; overflow-x: auto;">
//           ${editorTabsHTML}
//         </div>
//         <!-- Editor Area -->
//         <div id="editor-area" style="flex: 1; display: flex; flex-direction: column; position: relative;">
//           <!-- Tabs for files -->
//           <div id="editor-tabs" style="height: 30px; border-bottom: 1px solid black; overflow-x: auto; padding: 5px;"></div>
//           <!-- Monaco editor will be injected here -->
//           <div id="monaco-editor-container" style="flex: 1;"></div>
//           ${editorCaptionHTML}
//         </div>
//       </div>
//     </div>
//     <!-- Bottom: Terminal -->
//     <div style="height: 150px; border: 1px solid black; padding: 5px; overflow: auto; font-family: monospace;">
//       <div style="font-weight: bold;">codevideo &gt;</div>
//       <pre style="margin:0;"><code class="language-javascript">${terminalContent}</code></pre>
//     </div>
//     <!-- Mouse Pointer SVG -->
//     ${mouseSVGHTML}
//   </div>
//   `;
//   return html;
// }

// /**
//  * Takes an array of actions, applies them sequentially to a VirtualIDE,
//  * and builds a complete HTML document (as a string) for viewing.
//  *
//  * For each action:
//  * - The current snapshot is recorded (using renderSnapshot).
//  * - If the action is a speak action (name starts with "author-speak"),
//  *   then its value is recorded in the snapshot's "speak" field.
//  *   Otherwise, speak is set to an empty string.
//  *
//  * The resulting HTML document includes a <script> block that defines the snapshots
//  * array, and viewer code that uses Monaco for code editing, listens for left/right
//  * arrow keys to navigate between snapshots, and uses Chrome's speech synthesis to speak
//  * any nonempty speak string.
//  */
// function buildViewerHTML(actions: any[]): string {
//   // Create a new VirtualIDE instance.
//   const virtualIDE = new VirtualIDE();
//   // Add a terminal and an author so that terminal/author actions work.
//   // virtualIDE.addVirtualTerminal(new VirtualTerminal());
//   // virtualIDE.addVirtualAuthor(new VirtualAuthor());

//   // Array to hold our snapshots.
//   const snapshotsArray: { html: string; speak: string, editors: Array<IEditor> }[] = [];

//   // Process each action sequentially.
//   actions.forEach(action => {
//     virtualIDE.applyAction(action);
//     const snapshot = virtualIDE.getCourseSnapshot();
//     const snapshotHtml = renderSnapshot(snapshot);
//     // Only if the action is a speak action (e.g. "author-speak-before" or similar) do we set speak.
//     const speakText = action.name.startsWith("author-speak") ? action.value : "";
//     snapshotsArray.push({
//       html: snapshotHtml,
//       speak: speakText,
//       editors: snapshot.editorSnapshot?.editors || [],
//     });
//   });

//   // write snapshots.json to disk
//   fs.writeFileSync(path.join(__dirname, "snapshots.json"), JSON.stringify(snapshotsArray, null, 2), { encoding: "utf8" });

//   // Build the complete viewer HTML.
//   const viewerHTML = `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <meta charset="UTF-8" />
//       <title>VirtualIDE Snapshot Viewer</title>
//       <!-- Include the Monaco Editor loader script -->
//       <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs/loader.js"></script>
//       <script>
//         // Function to load Monaco Editor
//         function loadMonaco() {
//           // Function to get query parameters from the URL
//           function getQueryParam(name) {
//             const urlParams = new URLSearchParams(window.location.search);
//             const value = urlParams.get(name);
//             return value === "" ? null : value;
//           }

//           // Check if the "initialCode" query parameter is present
//           const initialCodeParam = getQueryParam("initialCode");
//           // Check if the "language" query parameter is present
//           const languageParam = getQueryParam("language");

//           require.config({
//             paths: {
//               vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.27.0/min/vs",
//             },
//           });
//           require(["vs/editor/editor.main"], function () {
//             // Create the editor and attach it to the window object
//             window.editor = monaco.editor.create(
//               document.getElementById("editor"),
//               {
//                 value: [initialCodeParam || ""].join("\\n"),
//                 language: languageParam || "javascript",
//                 theme: "vs-dark",
//                 fontSize: 20,
//               }
//             );

//             // Handle editor resize on window resize
//             window.addEventListener("resize", function () {
//               window.editor.layout();
//             });

//             // click once in the editor so we get the caret showing
//             window.editor.focus();

//             // if there was initial code, then we need to set the cursor to the end of the code
//             if (initialCodeParam) {
//               const lineCount = window.editor.getModel().getLineCount();
//               const column = window.editor.getModel().getLineLength(lineCount);
//               window.editor.setPosition({ lineNumber: lineCount, column });
//             }
//           });
//         }
//       </script>
//       <style>
//         body {
//           font-size: 18px;
//           margin: 0;
//           padding: 0;
//           font-family: monospace;
//           background: #fafafa;
//         }
//         #snapshot-container {
//           height: calc(100vh - 40px);
//           overflow: auto;
//           position: relative;
//         }
//         #nav-indicator {
//           text-align: center;
//           padding: 8px;
//           background: #eee;
//           border-top: 1px solid black;
//         }
//       </style>
//     </head>
//     <body>
//       <div id="snapshot-container"></div>
//       <div id="nav-indicator"></div>
//       <script>
//         // The snapshots array built from the actions.
//         var snapshots = ${JSON.stringify(snapshotsArray)};
//         var currentIndex = 0;
//         function showSnapshot(index) {
//           if (index < 0 || index >= snapshots.length) return;
//           currentIndex = index;
//           var container = document.getElementById("snapshot-container");
//           container.innerHTML = snapshots[index].html;
//           document.getElementById("nav-indicator").innerText =
//             "Step " + (index + 1) + " of " + snapshots.length;
//           // If the snapshot has a nonempty "speak" field, speak it.
//           var speakText = snapshots[index].speak;
//           if (speakText) {
//             var utterance = new SpeechSynthesisUtterance(speakText);
//             window.speechSynthesis.cancel();
//             window.speechSynthesis.speak(utterance);
//           }
//         }
//         document.addEventListener("keydown", function (event) {
//           if (event.key === "ArrowRight") {
//             if (currentIndex < snapshots.length - 1) {
//               showSnapshot(currentIndex + 1);
//             }
//           } else if (event.key === "ArrowLeft") {
//             if (currentIndex > 0) {
//               showSnapshot(currentIndex - 1);
//             }
//           }
//         });
//         // Show the first snapshot on load.
//         showSnapshot(0);
//       </script>
//     </body>
//   </html>
//   `;
//   return viewerHTML;
// }

// function escapeHtml(str) {
//   return str
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// }