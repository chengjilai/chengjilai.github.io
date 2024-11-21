"use strict";

// ---------------------------------------------------------------
// Shared setup for every page. Each page is two script tags;
// the browser creates the missing <html> and <head> elements.
// ---------------------------------------------------------------

// Head
const charset = document.createElement("meta");
charset.charset = "utf-8";
document.head.appendChild(charset);

const viewport = document.createElement("meta");
viewport.name = "viewport";
viewport.content = "width=device-width, initial-scale=1";
document.head.appendChild(viewport);

// ---------------------------------------------------------------
// One stylesheet, no <style> tag, no CSS file: a constructable
// CSSStyleSheet, adopted by the document.
// ---------------------------------------------------------------
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :root {
    color-scheme: dark;
    --bg: #000000;
    --fg: #E5E5E5;
    --link: #00FFFF;
  }

  a { color: var(--link); }

  h2 {
    background-image: paint(rule);
    --rule-color: var(--link);
  }

  code { background: #E5E5E5; color: #000000; }
  pre { overflow-x: auto; border: 1px solid #7F7F7F; }
  pre code { background: none; color: inherit; }
`);
document.adoptedStyleSheets = [sheet];

// ---------------------------------------------------------------
// Paint worklet: draws the double rule under each h2. Chromium
// only; other browsers drop the paint() background-image, so
// headings just have no rule.
// ---------------------------------------------------------------
const WORKLET_SRC = `
class Rule {
  static get inputProperties() {
    return ["--rule-color"];
  }

  paint(ctx, size, props) {
    const color = props.get("--rule-color").toString().trim();
    ctx.fillStyle = color;
    // terminal double rule along the bottom edge of the element
    ctx.fillRect(0, size.height - 5, size.width, 1);
    ctx.fillRect(0, size.height - 2, size.width, 1);
  }
}

registerPaint("rule", Rule);
`;

if ("paintWorklet" in CSS) {
  const url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: "text/javascript" }));
  CSS.paintWorklet.addModule(url);
}

// ---------------------------------------------------------------
// DOM helper. Wraps createElement/appendChild so each element of
// a page is one call, in document order.
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
