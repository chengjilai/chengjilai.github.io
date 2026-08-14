"use strict";

const title = document.createElement("title");
title.textContent = "Blank pages: the shell, not the script";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Blank pages: the shell, not the script" }));

document.body.appendChild($("h2", { textContent: "1. A script in head runs before the body exists" }));
document.body.appendChild($("p", {}, [
  "A classic script inside ",
  $("code", { textContent: "<head>" }),
  " executes while the parser is still in the head. ",
  $("code", { textContent: "document.body" }),
  " is null at that moment; the first ",
  $("code", { textContent: "document.body.appendChild" }),
  " throws. The page renders nothing. The script is healthy and the shell is well-formed; ",
  "the order is the bug.",
]));

document.body.appendChild($("h2", { textContent: "2. Script bytes decode with the document charset at fetch time" }));
document.body.appendChild($("p", {}, [
  "An external script is decoded with the document encoding in effect when it is fetched. ",
  "A ",
  $("code", { textContent: "<meta charset>" }),
  " inserted from JavaScript updates ",
  $("code", { textContent: "document.characterSet" }),
  "; bytes already decoded do not change. A page served without a charset signal defaults ",
  "to a legacy encoding ",
  $("a", { href: "https://encoding.spec.whatwg.org/", textContent: "(encoding standard)" }),
  ". In the test browser that was windows-1252: each UTF-8 byte of a non-ASCII string became ",
  "one character. The probe is a length check: 11 Chinese characters decoded to 33 ",
  "characters, one per byte. The fix is a static ",
  $("code", { textContent: "<meta charset=\"utf-8\">" }),
  " before the first script tag; the encoding is then UTF-8 from the first byte, on any host. ",
  "GitHub Pages serves text/html with charset=utf-8, so a deployed page decodes correctly ",
  "even without the meta; the garble appeared only on header-less loads.",
]));

document.body.appendChild($("h2", { textContent: "3. The shell is the untested surface" }));
document.body.appendChild($("p", {}, [
  "A harness that executes page scripts against a pre-built DOM misses both failures: its ",
  "stub has a body from the start, and it never decodes bytes. The checks that catch them ",
  "read the shell: script tags inside ",
  $("code", { textContent: "<body>" }),
  ", a static charset before the first script. A stale cached document can hide a shell fix ",
  "in testing: the tab kept the old decoded text until the browser cache was cleared.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
