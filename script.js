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
// ---------------------------------------------------------------
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    line-height: 1.7;
    color: #1f2328;
    background: #fff;
    max-width: 44rem;
    margin: 0 auto;
    padding: 0 1.25rem;
  }

  nav {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 1.4rem 0;
    border-bottom: 1px solid #e2e2e2;
  }
  nav .brand { font-weight: 700; font-size: 1.1rem; color: inherit; text-decoration: none; }
  nav .links { display: flex; gap: 1.4rem; list-style: none; }
  nav a { color: inherit; text-decoration: none; }
  nav a:hover { text-decoration: underline; }

  section { padding: 3rem 0; }

  h1 { font-size: 2.1rem; line-height: 1.25; }
  h2 { font-size: 1.5rem; margin: 0 0 1rem; }
  h3 { font-size: 1.1rem; margin: 1.6rem 0 0.5rem; }

  p, ul, ol { margin: 0.6rem 0 1rem; }
  ul, ol { padding-left: 1.4rem; }
  li { margin-bottom: 0.3rem; }

  a { color: #0969da; }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.88em;
    background: #f3f4f6;
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }
  pre {
    background: #f6f8fa;
    border: 1px solid #e4e7eb;
    border-radius: 8px;
    padding: 0.9rem 1rem;
    overflow-x: auto;
    margin: 0.8rem 0 1.2rem;
    font-size: 0.88rem;
    line-height: 1.55;
  }
  pre code { background: none; padding: 0; }

  .post-meta { color: #666; font-size: 0.85rem; margin-bottom: 0.75rem; }
  article { margin-bottom: 2rem; }

  footer {
    border-top: 1px solid #e2e2e2;
    padding: 1.6rem 0 3rem;
    color: #666;
    font-size: 0.88rem;
  }

  @media (max-width: 480px) {
    nav { flex-direction: column; gap: 0.4rem; }
  }
`);
document.adoptedStyleSheets = [sheet];

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

const hero = $("section", { id: "top" }, [
  $("h1", { textContent: "Jilai Cheng" }),
  $("p", { textContent: "Notes on NixOS, Guix, Emacs, and Linux audio." }),
]);

const post = $("article", {}, [
  $("p", { className: "post-meta", textContent: "2026.08.12" }),
  $("h2", { textContent: "This page is built entirely with JavaScript" }),
  $("div", {}, [
    $("p", {}, [
      "index.html is a single script tag. Everything else — the ",
      $("code", { textContent: "<title>" }),
      ", the viewport meta, the whole DOM, and every style rule — is created by ",
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
          '$("section", { id: "blog" }, [\n' +
          '  $("h2", { textContent: "Blog" }),\n' +
          '  post,\n' +
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
        " only accepts sheets constructed in the same document — a sheet from another document throws NotAllowedError.",
      ]),
      $("li", {}, [
        "Historically the list was frozen (assign a new array); recent browsers allow mutating it in place.",
      ]),
    ]),
  ]),
]);

const blogSection = $("section", { id: "blog" }, [
  $("h2", { textContent: "Blog" }),
  post,
]);

const aboutSection = $("section", { id: "about" }, [
  $("h2", { textContent: "About" }),
  $("p", {}, [
    "This blog collects notes on system administration and audio debugging. The page itself is built with the DOM and CSSOM APIs described in the post above. Source on ",
    $("a", {
      href: "https://github.com/chengjilai/chengjilai.github.io",
      textContent: "GitHub",
    }),
    ".",
  ]),
]);

const footer = $("footer", {}, [
  $("p", { textContent: "© 2026 Jilai Cheng" }),
]);

document.body.appendChild(nav);
document.body.appendChild(hero);
document.body.appendChild(blogSection);
document.body.appendChild(aboutSection);
document.body.appendChild(footer);
