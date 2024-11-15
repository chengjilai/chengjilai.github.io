"use strict";

// ---------------------------------------------------------------
// Head: created by JS, not by HTML.
// index.html is one script tag; nothing else exists until here.
// ---------------------------------------------------------------
const meta = document.createElement("meta");
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1";
document.head.appendChild(meta);

const title = document.createElement("title");
title.textContent = "Jilai Cheng";
document.head.appendChild(title);

// ---------------------------------------------------------------
// One stylesheet, no <style> tag, no CSS file.
// Browser defaults do the layout; colors are variables so one
// prefers-color-scheme query covers dark mode.
// ---------------------------------------------------------------
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :root {
    color-scheme: light dark;
    --bg: #fff;
    --text: #1f2328;
    --muted: #666;
    --border: #e2e2e2;
    --code-bg: #f3f4f6;
    --pre-bg: #f6f8fa;
    --link: #0969da;
    --dot-color: hsla(0, 0%, 0%, 0.06);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0d1117;
      --text: #e6edf3;
      --muted: #8b949e;
      --border: #30363d;
      --code-bg: #161b22;
      --pre-bg: #161b22;
      --link: #58a6ff;
      --dot-color: hsla(0, 0%, 100%, 0.06);
    }
  }

  body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    line-height: 1.7;
    color: var(--text);
    background-color: var(--bg);
    background-image: paint(dots);
    --dot-size: 28;
    max-width: 44rem;
    margin: 0 auto;
    padding: 0 1.25rem;
  }

  nav {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 1.2rem 0;
    border-bottom: 1px solid var(--border);
  }
  nav .brand { font-weight: 700; text-decoration: none; color: inherit; }
  nav .links { display: flex; gap: 1.4rem; list-style: none; margin: 0; padding: 0; }
  nav a { color: inherit; text-decoration: none; }
  nav a:hover { text-decoration: underline; }

  main { padding: 2.5rem 0; }
  section { padding: 0 0 2.5rem; }

  a { color: var(--link); }

  code {
    background: var(--code-bg);
    padding: 0.1em 0.35em;
    border-radius: 4px;
    font-size: 0.88em;
  }
  pre {
    background: var(--pre-bg);
    border-radius: 8px;
    padding: 0.9rem 1rem;
    overflow-x: auto;
  }
  pre code { background: none; padding: 0; }

  .post-meta { color: var(--muted); font-size: 0.85rem; margin: 0 0 1.5rem; }

  footer {
    border-top: 1px solid var(--border);
    padding: 1.4rem 0 3rem;
    color: var(--muted);
    font-size: 0.88rem;
    display: flex;
    justify-content: space-between;
  }
`);
document.adoptedStyleSheets = [sheet];

// ---------------------------------------------------------------
// Houdini Paint API: one tiny worklet that draws the faint dot
// pattern behind the whole page. Chromium-only; browsers without
// CSS.paintWorklet ignore the paint() background-image, so the
// page just has a plain background.
// ---------------------------------------------------------------
if ("paintWorklet" in CSS) {
  CSS.paintWorklet.addModule(URL.createObjectURL(new Blob([`
class Dots {
  static get inputProperties() { return ["--dot-size", "--dot-color"]; }
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
`], { type: "text/javascript" })));
}

// ---------------------------------------------------------------
// DOM helper: describe a subtree instead of a long list of
// createElement / appendChild calls.
// ---------------------------------------------------------------
function $(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "className") el.className = v;
    else if (k === "style") Object.assign(el.style, v);
    else if (k === "textContent") el.textContent = v;
    else el.setAttribute(k, v);
  }
  for (const c of children) {
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return el;
}

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------
const nav = $("nav", {}, [
  $("a", { className: "brand", href: "#top", textContent: "Jilai Cheng" }),
  $("ul", { className: "links" }, [
    $("li", {}, [$("a", { href: "#blog", textContent: "Blog" })]),
    $("li", {}, [$("a", { href: "#about", textContent: "About" })]),
  ]),
]);

const post = $("article", { id: "blog" }, [
  $("h1", { textContent: "This page is built entirely with JavaScript" }),
  $("p", { className: "post-meta", textContent: "2026.08.12" }),
  $("div", {}, [
    $("p", {}, [
      "index.html is a single script tag. Everything else — the ",
      $("code", { textContent: "<title>" }),
      ", the viewport meta, the whole DOM, and the stylesheet — is created by ",
      $("code", { textContent: "script.js" }),
      " at runtime. No frameworks, no build step, no network requests.",
    ]),

    $("h3", { textContent: "DOM" }),
    $("p", {}, [
      "The DOM is the tree of element nodes behind a document; every node can be read and changed from JavaScript. The page is built with these calls:",
    ]),
    $("ul", {}, [
      $("li", {}, [
        $("code", { textContent: "document.createElement(tag)" }),
        " — new element node",
      ]),
      $("li", {}, [
        $("code", { textContent: "el.appendChild(child)" }),
        " — insert into the tree",
      ]),
      $("li", {}, [
        $("code", { textContent: "el.textContent" }),
        " / ",
        $("code", { textContent: "el.setAttribute(name, value)" }),
        " — content and attributes",
      ]),
      $("li", {}, [
        $("code", { textContent: "el.addEventListener(type, fn)" }),
        " — events",
      ]),
    ]),
    $("p", {}, [
      "A small helper, ",
      $("code", { textContent: "$(tag, attrs, children)" }),
      ", wraps these so the page is described declaratively:",
    ]),
    $("pre", {}, [
      $("code", {
        textContent:
          'const $ = (tag, attrs = {}, children = []) => {\n' +
          '  const el = document.createElement(tag);\n' +
          '  // ...apply attrs, append children...\n' +
          '  return el;\n' +
          '};\n' +
          '\n' +
          '$("article", { id: "blog" }, [\n' +
          '  $("h1", { textContent: "...title..." }),\n' +
          '  body,\n' +
          ']);',
      }),
    ]),

    $("h3", { textContent: "CSSOM — constructable stylesheets" }),
    $("p", {}, [
      "Styles normally come from ",
      $("code", { textContent: "<style>" }),
      " or ",
      $("code", { textContent: "<link>" }),
      ". A constructable ",
      $("code", { textContent: "CSSStyleSheet" }),
      " does the same job with neither: rules are strings inserted at runtime, and the sheet is adopted by the document.",
    ]),
    $("pre", {}, [
      $("code", {
        textContent:
          "const sheet = new CSSStyleSheet();\n" +
          "sheet.replaceSync(`...css rules...`);\n" +
          "document.adoptedStyleSheets = [sheet];",
      }),
    ]),
    $("ul", {}, [
      $("li", {}, [
        $("code", { textContent: "insertRule(rule)" }),
        " — add one rule; throws SyntaxError if it does not parse (a bad selector, for example)",
      ]),
      $("li", {}, [
        $("code", { textContent: "replaceSync(css)" }),
        " — replace the whole sheet in one call; ",
        $("code", { textContent: "replace()" }),
        " is the async variant",
      ]),
      $("li", {}, [
        "a constructed sheet can be adopted by shadow roots too — one parse, shared everywhere",
      ]),
    ]),
    $("p", {}, [
      "Colors are CSS variables, and one ",
      $("code", { textContent: "prefers-color-scheme" }),
      " media query swaps them for dark mode — no second file, no JavaScript. The stylesheet stays short on purpose: browser defaults handle the rest, there is no reset.",
    ]),

    $("h3", { textContent: "CSS Paint API — one worklet" }),
    $("p", {}, [
      "Houdini is a group of APIs that expose parts of the browser's CSS engine to JavaScript. I use one piece of it: a paint worklet that draws the faint dot pattern behind this page. It is a plain class with a ",
      $("code", { textContent: "paint(ctx, size, props)" }),
      " method, named with ",
      $("code", { textContent: "registerPaint()" }),
      ":",
    ]),
    $("pre", {}, [
      $("code", {
        textContent:
          'class Dots {\n' +
          '  static get inputProperties() { return ["--dot-size", "--dot-color"]; }\n' +
          '  paint(ctx, size, props) {\n' +
          '    // draw a dot every --dot-size pixels, in --dot-color\n' +
          '  }\n' +
          '}\n' +
          'registerPaint("dots", Dots);',
      }),
    ]),
    $("p", {}, [
      "The worklet ships as a string inside script.js and loads from a blob URL, so there is no extra file to deploy:",
    ]),
    $("pre", {}, [
      $("code", {
        textContent:
          'if ("paintWorklet" in CSS) {\n' +
          '  CSS.paintWorklet.addModule(URL.createObjectURL(new Blob([src])));\n' +
          '}',
      }),
    ]),
    $("p", {}, [
      "The stylesheet then uses it as the body's ",
      $("code", { textContent: "background-image" }),
      ", with ",
      $("code", { textContent: "--dot-size" }),
      " and ",
      $("code", { textContent: "--dot-color" }),
      " as parameters. Paint runs on its own thread, so it cannot block the page. Chrome and Edge run it; Firefox and Safari do not, and there the ",
      $("code", { textContent: "paint()" }),
      " background is silently dropped — which is fine, the page just has a plain background.",
    ]),

    $("h3", { textContent: "Lessons" }),
    $("ul", {}, [
      $("li", {}, [
        "Without JavaScript the page is blank: there is no content and no style until ",
        $("code", { textContent: "script.js" }),
        " runs. Fine for a personal page, wrong for anything that must survive JS failures.",
      ]),
      $("li", {}, [
        $("code", { textContent: "replaceSync()" }),
        " / ",
        $("code", { textContent: "replace()" }),
        " only work on sheets you constructed. Calling them on a sheet that came from ",
        $("code", { textContent: "<style>" }),
        " or ",
        $("code", { textContent: "<link>" }),
        " throws NotAllowedError.",
      ]),
      $("li", {}, [
        $("code", { textContent: "replaceSync()" }),
        " strips ",
        $("code", { textContent: "@import" }),
        " rules, so a constructed sheet cannot pull in external stylesheets. Everything must be inline.",
      ]),
      $("li", {}, [
        $("code", { textContent: "adoptedStyleSheets" }),
        " accepts only sheets constructed in the same document; it was a frozen array in older browsers, so assign a new array rather than mutating it in place.",
      ]),
      $("li", {}, [
        "Paint worklets are Chromium-only (Chrome 65+, no Firefox, no Safari). The ",
        $("code", { textContent: "paint()" }),
        " background is ignored elsewhere, so the page degrades quietly.",
      ]),
    ]),
  ]),
]);

const about = $("section", { id: "about" }, [
  $("h2", { textContent: "About" }),
  $("p", {}, [
    "This blog collects notes on system administration and audio debugging. The page itself is built with the DOM, CSSOM, and Houdini APIs described in the post above. Source on ",
    $("a", {
      href: "https://github.com/chengjilai/chengjilai.github.io",
      textContent: "GitHub",
    }),
    ".",
  ]),
]);

const main = $("main", { id: "top" }, [post, about]);

const footer = $("footer", {}, [
  $("p", { textContent: "© 2026 Jilai Cheng" }),
  $("a", { href: "#top", textContent: "top" }),
]);

document.body.appendChild(nav);
document.body.appendChild(main);
document.body.appendChild(footer);
