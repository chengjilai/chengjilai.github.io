"use strict";

// ---------------------------------------------------------------
// Head, created by JS. index.html has no head element at all.
// ---------------------------------------------------------------
const charset = document.createElement("meta");
charset.charset = "utf-8";
document.head.appendChild(charset);

const viewport = document.createElement("meta");
viewport.name = "viewport";
viewport.content = "width=device-width, initial-scale=1";
document.head.appendChild(viewport);

const title = document.createElement("title");
title.textContent = "Jilai Cheng";
document.head.appendChild(title);

// ---------------------------------------------------------------
// Stylesheet. No <style> tag, no CSS file: one constructable
// CSSStyleSheet, adopted by the document.
// ---------------------------------------------------------------
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :root {
    color-scheme: light dark;

    /* xterm 8-color palette */
    --black: #000000;
    --red: #CD0000;
    --green: #00CD00;
    --yellow: #CDCD00;
    --blue: #0000CD;
    --magenta: #CD00CD;
    --cyan: #00CDCD;
    --white: #E5E5E5;
    --br-black: #7F7F7F;
    --br-white: #FFFFFF;
    --br-cyan: #00FFFF;

    --bg: #FFFFFF;
    --fg: #000000;
    --link: #0000CD;
    --border: #7F7F7F;
    --code-bg: #E5E5E5;
    --code-fg: #000000;
    --dot: hsla(0, 0%, 0%, 0.1);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #000000;
      --fg: #E5E5E5;
      --link: #00FFFF;
      --border: #7F7F7F;
      --code-bg: #E5E5E5;
      --code-fg: #000000;
      --dot: hsla(0, 0%, 100%, 0.1);
    }
  }

  body {
    color: var(--fg);
    background-color: var(--bg);
    background-image: paint(dots);
    --dot-size: 28;
    --dot-color: var(--dot);
    max-width: 44rem;
    margin: 0 auto;
    padding: 0 1.25rem;
  }

  a { color: var(--link); }

  code {
    background: var(--code-bg);
    color: var(--code-fg);
  }
  pre {
    overflow-x: auto;
    border: 1px solid var(--border);
  }
  pre code { background: none; color: inherit; }
`);
document.adoptedStyleSheets = [sheet];

// ---------------------------------------------------------------
// Paint worklet. The source is a plain string, so the same constant
// is used both by the runtime (blob URL) and by the post below.
// Chromium only; browsers without CSS.paintWorklet drop the
// paint() background-image and keep the plain background.
// ---------------------------------------------------------------
const WORKLET_SRC = `
class Dots {
  static get inputProperties() {
    return ["--dot-size", "--dot-color"];
  }

  paint(ctx, size, props) {
    const step = parseFloat(props.get("--dot-size").toString()) || 28;
    const color = props.get("--dot-color").toString().trim();
    ctx.fillStyle = color;
    for (let x = step / 2; x < size.width; x += step) {
      for (let y = step / 2; y < size.height; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}

registerPaint("dots", Dots);
`;

if ("paintWorklet" in CSS) {
  const url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: "text/javascript" }));
  CSS.paintWorklet.addModule(url);
}

// ---------------------------------------------------------------
// DOM helper. Wraps createElement/appendChild so each element of
// the page is one call, in document order.
// ---------------------------------------------------------------
function $(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "className") el.className = v;
    else if (k === "textContent") el.textContent = v;
    else el.setAttribute(k, v);
  }
  for (const child of children) {
    el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return el;
}

// ---------------------------------------------------------------
// The page. One appendChild per element, in document order.
// ---------------------------------------------------------------
document.body.appendChild($("h1", {
  textContent: "Building this page with DOM, CSSOM, and Houdini",
}));

document.body.appendChild($("p", {}, [
  "index.html is one script tag. script.js creates the head, the DOM, and the ",
  "stylesheet at runtime - no HTML content, no CSS file, no framework, no build ",
  "step, nothing fetched over the network. This post documents how the page is ",
  "built, with the code that actually runs.",
]));

// 1. index.html
document.body.appendChild($("h2", { textContent: "1. index.html" }));
document.body.appendChild($("p", {}, ["The whole document:"]));
document.body.appendChild($("pre", {}, [
  $("code", {
    textContent:
      "<!DOCTYPE html>\n" +
      "\n" +
      "<body>\n" +
      "  <script src=\"script.js\"></script>\n" +
      "</body>\n" +
      "</html>",
  }),
]));
document.body.appendChild($("p", {}, [
  "The HTML parser creates the missing ",
  $("code", { textContent: "<html>" }),
  " and ",
  $("code", { textContent: "<head>" }),
  " elements on its own; everything else comes from script.js.",
]));
document.body.appendChild($("p", {}, [
  "Without JavaScript there is no page: nothing exists until script.js runs.",
]));

// 2. DOM
document.body.appendChild($("h2", { textContent: "2. DOM" }));
document.body.appendChild($("p", {}, [
  "The DOM is the tree of element nodes behind a document. Every node can be read ",
  "and changed from JavaScript. The page is built with these calls:",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("code", { textContent: "document.createElement(tag)" }),
    " - new element node",
  ]),
  $("li", {}, [
    $("code", { textContent: "el.appendChild(child)" }),
    " - insert into the tree",
  ]),
  $("li", {}, [
    $("code", { textContent: "el.textContent" }),
    " and ",
    $("code", { textContent: "el.setAttribute(name, value)" }),
    " - content and attributes",
  ]),
  $("li", {}, [
    $("code", { textContent: "el.addEventListener(type, fn)" }),
    " - events",
  ]),
]));
document.body.appendChild($("p", {}, [
  "A helper wraps these calls, so the page is written as a flat list of ",
  "appendChild calls in document order. This is the helper that runs:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    textContent:
      "function $(tag, attrs = {}, children = []) {\n" +
      "  const el = document.createElement(tag);\n" +
      "  for (const [k, v] of Object.entries(attrs)) {\n" +
      "    if (k === \"className\") el.className = v;\n" +
      "    else if (k === \"textContent\") el.textContent = v;\n" +
      "    else el.setAttribute(k, v);\n" +
      "  }\n" +
      "  for (const child of children) {\n" +
      "    el.appendChild(typeof child === \"string\" ? document.createTextNode(child) : child);\n" +
      "  }\n" +
      "  return el;\n" +
      "}",
  }),
]));
document.body.appendChild($("p", {}, [
  "Each element is one call, for example the title of this post:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    textContent:
      'document.body.appendChild($("h1", {\n' +
      '  textContent: "Building this page with DOM, CSSOM, and Houdini",\n' +
      "}));",
  }),
]));

// 3. CSSOM
document.body.appendChild($("h2", { textContent: "3. CSSOM: constructable stylesheets" }));
document.body.appendChild($("p", {}, [
  "Styles normally come from ",
  $("code", { textContent: "<style>" }),
  " or ",
  $("code", { textContent: "<link>" }),
  ". A constructable ",
  $("code", { textContent: "CSSStyleSheet" }),
  " does the same with neither. Rules are strings; the sheet is adopted by the document:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    textContent:
      "const sheet = new CSSStyleSheet();\n" +
      "sheet.replaceSync(cssText);\n" +
      "document.adoptedStyleSheets = [sheet];",
  }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("code", { textContent: "insertRule(rule)" }),
    " adds one rule and throws SyntaxError if the rule does not parse, for example a bad selector.",
  ]),
  $("li", {}, [
    $("code", { textContent: "replaceSync(css)" }),
    " replaces the whole sheet in one call; ",
    $("code", { textContent: "replace()" }),
    " is the async variant.",
  ]),
  $("li", {}, [
    "Both throw NotAllowedError on a sheet that was not created with the ",
    $("code", { textContent: "CSSStyleSheet()" }),
    " constructor, for example one that came from ",
    $("code", { textContent: "<style>" }),
    " or ",
    $("code", { textContent: "<link>" }),
    ".",
  ]),
  $("li", {}, [
    $("code", { textContent: "replaceSync()" }),
    " strips ",
    $("code", { textContent: "@import" }),
    " rules, so a constructed sheet cannot load external stylesheets. Everything must be inline.",
  ]),
  $("li", {}, [
    $("code", { textContent: "adoptedStyleSheets" }),
    " accepts only sheets constructed in the same document. It was a frozen array in older browsers; assign a new array.",
  ]),
  $("li", {}, [
    "One sheet can be adopted by a document and by shadow roots; it is parsed once.",
  ]),
]));
document.body.appendChild($("p", {}, [
  "Colors on this page are CSS variables; one ",
  $("code", { textContent: "prefers-color-scheme" }),
  " media query switches them for dark mode.",
]));

// 4. CSS Paint API
document.body.appendChild($("h2", { textContent: "4. CSS Paint API: one worklet" }));
document.body.appendChild($("p", {}, [
  "Houdini is a set of APIs that expose parts of the browser's CSS engine to ",
  "JavaScript. This page uses one piece: a paint worklet that draws the dot ",
  "pattern behind the page. A worklet is a class with a ",
  $("code", { textContent: "paint(ctx, size, props)" }),
  " method:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { textContent: WORKLET_SRC }),
]));
document.body.appendChild($("p", {}, [
  "The source is a string inside script.js and loads from a blob URL, so there is ",
  "no second file:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    textContent:
      'if ("paintWorklet" in CSS) {\n' +
      '  const url = URL.createObjectURL(new Blob([workletSrc], { type: "text/javascript" }));\n' +
      "  CSS.paintWorklet.addModule(url);\n" +
      "}",
  }),
]));
document.body.appendChild($("p", {}, [
  "The stylesheet applies it to the body:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    textContent:
      "body {\n" +
      "  background-image: paint(dots);\n" +
      "  --dot-size: 28;\n" +
      "  --dot-color: var(--dot);\n" +
      "}",
  }),
]));
document.body.appendChild($("p", {}, [
  "Paint runs on its own thread and reads the two custom properties from the ",
  "element it paints. Chromium only: Chrome and Edge run worklets (Chrome 65+); ",
  "Firefox and Safari do not. Browsers without support drop the paint() value, so ",
  "the background is plain and the page still works.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
