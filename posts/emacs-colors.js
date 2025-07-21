"use strict";

// Title, per page. common.js sets up the head and stylesheet.
const title = document.createElement("title");
title.textContent = "Emacs face colors on terminals";
document.head.appendChild(title);

// The post. One appendChild per element, in document order.
document.body.appendChild($("h1", {
  textContent: "Emacs face colors on terminals",
}));

document.body.appendChild($("p", {}, [
  "Goal: one theme that works on the kernel console, on kmscon, and in a GUI. ",
  "The terminal advertises its colors in three different ways; Emacs builds a ",
  "different color table for each; a face spec can pick an alternative per ",
  "display. Two traps follow, both documented in the source.",
]));

// 1. The terminal advertises colors three ways
document.body.appendChild($("h2", {
  textContent: "1. The terminal advertises colors three ways",
}));
document.body.appendChild($("p", {}, [
  "The color count comes from terminfo. The kernel console reports 8 ",
  "(",
  $("code", { textContent: "infocmp linux" }),
  ": ",
  $("code", { textContent: "colors#8" }),
  ", ",
  $("code", { textContent: "bce" }),
  "); xterm-256color reports 256 (",
  $("code", { textContent: "colors#0x100" }),
  "). A third mode skips terminfo: ",
  $("code", { textContent: "COLORTERM=truecolor" }),
  " makes Emacs emit 24-bit escape sequences directly - term.c switches to ",
  $("code", { textContent: "38;2;..." }),
  " and ",
  $("code", { textContent: "48;2;..." }),
  " and 16777216 cells.",
]));
document.body.appendChild($("p", {}, [
  "kmscon sets COLORTERM, and its default value is truecolor (pty.c, ",
  "terminal.c).",
]));

// 2. Emacs builds a color table per mode
document.body.appendChild($("h2", { textContent: "2. Emacs builds a color table per mode" }));
document.body.appendChild($("p", {}, [
  "Emacs registers colors from that count (term/tty-colors.el, term/xterm.el):",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "8 cells: the ANSI colors, ",
    $("code", { textContent: "tty-standard-colors" }),
  ]),
  $("li", {}, [
    "256 cells: ",
    $("code", { textContent: "color-0..255" }),
    ", computed with the formulas from xterm's 256colres.pl",
  ]),
  $("li", {}, [
    "24-bit: every named color from ",
    $("code", { textContent: "color-name-rgb-alist" }),
  ]),
]));
document.body.appendChild($("p", {}, [
  "So ",
  $("code", { textContent: "color-252" }),
  " exists only in 256-color mode. A name that is not in the current table ",
  "cannot be used. M-x list-colors-display shows what the current display can ",
  "handle.",
]));

// 3. Face specs pick an alternative per display
document.body.appendChild($("h2", {
  textContent: "3. Face specs pick an alternative per display",
}));
document.body.appendChild($("p", {}, [
  "A face spec is a list of alternatives, each a display condition plus ",
  "attributes; the first alternative whose condition matches wins ",
  "(face-spec-choose, faces.el). Conditions include:",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("code", { textContent: "(type tty)" }),
    " - matches when there is no window system",
  ]),
  $("li", {}, [
    $("code", { textContent: "(min-colors n)" }),
    " - matches when ",
    $("code", { textContent: "(display-color-cells)" }),
    " is at least n",
  ]),
  $("li", {}, [
    $("code", { textContent: "(class color)" }),
    ", ",
    $("code", { textContent: "(background light)" }),
  ]),
]));
document.body.appendChild($("p", {}, [
  "The display is a list of conjuncts, so a single condition is written ",
  $("code", { textContent: "((type tty))" }),
  "; a bare ",
  $("code", { textContent: "(type tty)" }),
  " fails with \"Wrong type argument: listp\".",
]));
document.body.appendChild($("p", {}, [
  "defface sets the default spec but does nothing if the face already has one ",
  "(lispref). To override a built-in face per display, set an override spec:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    textContent:
      "(face-spec-set 'hl-line\n" +
      "               '((((class color) (min-colors 256)) (:background \"#262626\"))\n" +
      "                 (((type tty)) (:background \"cyan\")))\n" +
      "               'face-override-spec)",
  }),
]));
document.body.appendChild($("p", {}, [
  "face-spec-set's default spec type is the override spec, which takes ",
  "precedence over everything else.",
]));

// 4. The truecolor trap
document.body.appendChild($("h2", { textContent: "4. The truecolor trap" }));
document.body.appendChild($("p", {}, [
  "With ",
  $("code", { textContent: "COLORTERM=truecolor" }),
  " the table holds named colors, not color-N. A face spec written for ",
  "256-color mode - ",
  $("code", { textContent: ":background \"color-252\"" }),
  " - resolves to nothing, and every face application logs \"Unable to load ",
  "color\" (xfaces.c). The theme is not broken; the name is not in the table.",
]));
document.body.appendChild($("p", {}, [
  "The portable vocabulary is hex: ",
  $("code", { textContent: "#d0d0d0" }),
  " parses in every mode (color-values-from-color-spec accepts ",
  $("code", { textContent: "#RGB" }),
  " and ",
  $("code", { textContent: "#RRGGBB" }),
  ", display-independent; xfaces.c). To convert a 256-color name once: ",
  $("code", { textContent: "(tty-color-desc \"color-252\")" }),
  " returns 16-bit components, and xterm stores each 8-bit value as ",
  $("code", { textContent: "value*257" }),
  " (xterm-rgb-convert-to-16bit), so dividing by 257 recovers the byte. One ",
  "hex palette works everywhere - the solarized theme issue #175 found the ",
  "same fix.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
