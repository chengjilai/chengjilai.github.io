"use strict";

const title = document.createElement("title");
title.textContent = "Building this page with DOM, CSSOM, and Houdini";
document.head.appendChild(title);

// The post. One appendChild per element, in document order.
document.body.appendChild($("h1", {
  textContent: "Building this page with DOM, CSSOM, and Houdini",
}));

document.body.appendChild($("p", {}, [
  "Every page on this site is two script tags. common.js creates the head and ",
  "the stylesheet; a per-page script builds the content. There is no HTML ",
  "content, no CSS file, no framework, no build step, and nothing is fetched ",
  "over the network. This post documents how it works, with the code that ",
  "actually runs.",
]));

// 1. This page
document.body.appendChild($("h2", { textContent: "1. This page" }));
document.body.appendChild($("p", {}, ["The whole document:"]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "<!DOCTYPE html>\n" +
      "\n" +
      "<body>\n" +
      "  <script src=\"../common.js\"></script>\n" +
      "  <script src=\"building-this-page.js\"></script>\n" +
      "</body>\n" +
      "</html>",
  "html")}),
]));
document.body.appendChild($("p", {}, [
  "The HTML parser creates the missing ",
  $("code", { textContent: "<html>" }),
  " and ",
  $("code", { textContent: "<head>" }),
  " elements on its own. common.js sets up the head, the stylesheet, and the ",
  "paint worklet; building-this-page.js appends this post.",
]));
document.body.appendChild($("p", {}, [
  "Without JavaScript there is no page: nothing exists until the scripts run.",
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
    ": new element node",
  ]),
  $("li", {}, [
    $("code", { textContent: "el.appendChild(child)" }),
    ": insert into the tree",
  ]),
  $("li", {}, [
    $("code", { textContent: "el.textContent" }),
    " and ",
    $("code", { textContent: "el.setAttribute(name, value)" }),
    ": content and attributes",
  ]),
  $("li", {}, [
    $("code", { textContent: "el.addEventListener(type, fn)" }),
    ": events",
  ]),
]));
document.body.appendChild($("p", {}, [
  "A helper wraps these calls, so the page is written as a flat list of ",
  "appendChild calls in document order. This is the helper that runs:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "function $(tag, attrs = {}, children = []) {\n" +
      "  const el = document.createElement(tag);\n" +
      "  for (const [k, v] of Object.entries(attrs)) {\n" +
      "    if (k === \"className\") el.className = v;\n" +
      "    else if (k === \"textContent\") el.textContent = v;\n" +
      "    else if (k === \"innerHTML\") el.innerHTML = v;\n" +
      "    else el.setAttribute(k, v);\n" +
      "  }\n" +
      "  for (const child of children) {\n" +
      "    el.appendChild(typeof child === \"string\" ? document.createTextNode(child) : child);\n" +
      "  }\n" +
      "  return el;\n" +
      "}",
  "js")}),
]));
document.body.appendChild($("p", {}, [
  "Each element is one call, for example the title of this post:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      'document.body.appendChild($("h1", {\n' +
      '  textContent: "Building this page with DOM, CSSOM, and Houdini",\n' +
      "}));",
  "js")}),
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
    innerHTML: highlight(
      "const sheet = new CSSStyleSheet();\n" +
      "sheet.replaceSync(cssText);\n" +
      "document.adoptedStyleSheets = [sheet];",
  "js")}),
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

// 4. CSS Paint API
document.body.appendChild($("h2", { textContent: "4. CSS Paint API: one worklet" }));
document.body.appendChild($("p", {}, [
  "Houdini is a set of APIs that expose parts of the browser's CSS engine to ",
  "JavaScript. This page uses one piece: a paint worklet that draws the double ",
  "rule under each section heading. A worklet is a class with a ",
  $("code", { textContent: "paint(ctx, size, props)" }),
  " method:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight( WORKLET_SRC , "js")}),
]));
document.body.appendChild($("p", {}, [
  "The source is a string inside common.js and loads from a blob URL, so there ",
  "is no second file:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      'if ("paintWorklet" in CSS) {\n' +
      '  const url = URL.createObjectURL(new Blob([workletSrc], { type: "text/javascript" }));\n' +
      "  CSS.paintWorklet.addModule(url);\n" +
      "}",
  "js")}),
]));
document.body.appendChild($("p", {}, [
  "The stylesheet applies it to headings:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "h2 {\n" +
      "  background-image: paint(rule);\n" +
      "  --rule-color: var(--link);\n" +
      "}",
  "css")}),
]));
document.body.appendChild($("p", {}, [
  "Paint runs on its own thread and reads the color from a custom property on ",
  "the element it paints. Chromium only: Chrome and Edge run worklets (Chrome ",
  "65+); Firefox and Safari do not. Browsers without support drop the paint() ",
  "value, so headings just have no rule and the page still works.",
]));

// 5. Syntax highlighting
document.body.appendChild($("h2", { textContent: "5. Syntax highlighting" }));
document.body.appendChild($("p", {}, [
  "Every code block on this site is colored by a zero-dependency tokenizer in ",
  "common.js. Each language is a list of (class, regex) rules, and highlight() ",
  "takes the earliest match at each position, so rule order never matters:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      'const LANGS = {\n' +
      '  js: [\n' +
      '    ["comment", /\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\//],\n' +
      '    ["keyword", /\\b(?:const|let|if|return|function)\\b/],\n' +
      '  ],\n' +
      '};',
    "js"),
  }),
]));
document.body.appendChild($("p", {}, [
  "Tokens are wrapped in spans colored from the terminal palette: cyan ",
  "keywords, green strings, gray comments, yellow numbers, magenta builtins. ",
  "Each token is HTML-escaped on the way out, which is why the document dump in ",
  "section 1 renders as text and not as markup. This post is highlighted by ",
  "it.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
