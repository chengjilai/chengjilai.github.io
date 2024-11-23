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

  .tk-keyword { color: #00CDCD; }
  .tk-string  { color: #00CD00; }
  .tk-comment { color: #7F7F7F; }
  .tk-number  { color: #CDCD00; }
  .tk-builtin { color: #CD00CD; }
  .tk-preproc { color: #CDCD00; }
  .tk-tag     { color: #00CDCD; }
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
// Syntax highlighting. Zero dependencies: each language is a list
// of (class, regex) rules; the tokenizer takes the earliest match
// at each position, so rule order does not matter. Tokens are
// colored with the terminal palette (see .tk-* rules above).
// ---------------------------------------------------------------
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const LANGS = {
  js: [
    ["comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
    ["string", /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/],
    ["number", /\b0x[\da-fA-F]+|\b\d[\d_.]*\b/],
    ["builtin", /\b(?:document|CSS|URL|Blob|console|Math|JSON|Object|Array|String|Number|window|navigator|fetch|requestAnimationFrame|registerPaint)\b/],
    ["keyword", /\b(?:const|let|var|if|else|return|function|class|static|get|new|this|for|while|do|break|continue|switch|case|default|import|export|from|extends|async|await|typeof|in|of|void|try|catch|finally|throw|true|false|null|undefined)\b/],
  ],
  shell: [
    ["comment", /#[^\n]*/],
    ["string", /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/],
    ["number", /\b\d+(?:\.\d+)?\b/],
    ["keyword", /\b(?:if|then|else|elif|fi|for|in|do|done|case|esac|while|until|return|function|echo|printf|pkill|pgrep|grep|sed|cat|ls|cd|sudo|modprobe|ffmpeg|bash|sh)\b/],
  ],
  elisp: [
    ["comment", /;[^\n]*/],
    ["string", /"(?:[^"\\\n]|\\.)*"/],
    ["number", /\b\d+\b/],
    ["keyword", /\b(?:defun|defcustom|defvar|defconst|define-key|let|let\*|if|when|unless|cond|and|or|not|setq|setq-local|lambda|progn|interactive|quote|nil|t|face-spec-set|evil-define-key|evil-want-minibuffer)\b/],
  ],
  c: [
    ["comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
    ["string", /"(?:[^"\\\n]|\\.)*"/],
    ["number", /\b0x[\da-fA-F]+|\b\d+\b/],
    ["preproc", /#[a-zA-Z]+/],
    ["builtin", /\b[A-Z][A-Z0-9_]*\b/],
    ["keyword", /\b(?:define|u32|int|struct|static|const|return|if|else|for|while|void|char|unsigned)\b/],
  ],
  python: [
    ["comment", /#[^\n]*/],
    ["string", /"""[^"""]*"""|'''[^']*'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/],
    ["number", /\b\d[\d.]*\b/],
    ["builtin", /\b(?:math|range|len|print|int|float|round|abs|sqrt|random)\b/],
    ["keyword", /\b(?:def|return|if|else|elif|for|while|import|from|class|lambda|and|or|not|in|with|as|True|False|None)\b/],
  ],
  css: [
    ["comment", /\/\*[\s\S]*?\*\//],
    ["string", /"[^"]*"|'[^']*'/],
    ["number", /(?<![A-Za-z0-9_])-?\d[\d.]*(?:px|rem|em|%)?/],
    ["builtin", /\b(?:background|color|border|margin|padding|font|display|max-width|font-family|line-height)\b|--[a-z-]+/],
    ["keyword", /\b(?:var|paint|inherit|none|solid|auto|block|calc)\b/],
  ],
  html: [
    ["comment", /<!--[\s\S]*?-->/],
    ["string", /"[^"]*"|'[^']*'/],
    ["tag", /<\/?[a-zA-Z!][^>]*>/],
  ],
};

function highlight(src, lang) {
  const rules = (LANGS[lang] || []).map(([cls, re]) => [cls, new RegExp(re.source, "g")]);
  let out = "";
  let i = 0;
  while (i < src.length) {
    let best = null;
    for (const [cls, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(src);
      if (m && (best === null || m.index < best.m.index)) best = { cls, m };
    }
    if (best && best.m.index === i) {
      out += '<span class="tk-' + best.cls + '">' + escapeHtml(best.m[0]) + "</span>";
      i += best.m[0].length;
    } else {
      out += escapeHtml(src[i]);
      i++;
    }
  }
  return out;
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
    else if (k === "innerHTML") el.innerHTML = v;
    else el.setAttribute(k, v);
  }
  for (const child of children) {
    el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return el;
}
