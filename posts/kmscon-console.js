"use strict";

const title = document.createElement("title");
title.textContent = "kmscon as the console";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "kmscon as the console" }));

document.body.appendChild($("p", {}, [
  "The kernel console could not render bright backgrounds distinctly on the ",
  "laptop panel. kmscon, a KMS/DRM terminal emulator, replaced it: 256 ",
  "colors, pango fonts, proper rendering. Two gotchas followed.",
]));

// 1. Why
document.body.appendChild($("h2", { textContent: "1. Why" }));
document.body.appendChild($("p", {}, [
  "fbcon rendered bright background colors indistinctly on the laptop panel. ",
  "kmscon is a terminal emulator on KMS/DRM: 256 colors, pango fonts, proper ",
  "rendering. On Guix it is a built-in service type (" ,
  $("code", { textContent: "kmscon-service-type" }),
  ", ",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/services/base.scm", textContent: "gnu/services/base.scm" }),
  "); on NixOS it would need a custom unit.",
]));

// 2. Guix setup
document.body.appendChild($("h2", { textContent: "2. Guix setup" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "(service kmscon-service-type\n" +
    "         (kmscon-configuration\n" +
    "          (virtual-terminal \"tty1\")\n" +
    "          (font-size 20)               ; HDPI\n" +
    "          (keyboard-layout keyboard-layout)))", "elisp") }),
]));
document.body.appendChild($("p", {}, [
  "Base mingetty must be removed (delete + re-add tty2-6). modify-services ",
  "cannot add service expressions and delete removes re-adds; filter ",
  "%base-services instead:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "(filter (lambda (s) (not (eq? (service-kind s) mingetty-service-type)))\n" +
    "        %base-services)", "elisp") }),
]));

// 3. TERM: the service cannot pass -t
document.body.appendChild($("h2", { textContent: "3. TERM: the service cannot pass -t" }));
document.body.appendChild($("p", {}, [
  "kmscon's own default TERM is vt220 ",
  $("a", { href: "https://github.com/kmscon/kmscon/blob/master/src/misc/pty.c", textContent: "(src/misc/pty.c)" }),
  ": ",
  $("code", { textContent: "if (!term) term = \"vt220\"" }),
  ". That is fine for the shell, not for a 256-color Emacs, which needs a ",
  "TERM whose terminfo it knows. The guix service builds a fixed command ",
  "line (" ,
  $("code", { textContent: "--login --vt --no-switchvt --font-engine --font-size [--xkb-*] [--hwaccel]" }),
  "; " ,
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/services/base.scm", textContent: "gnu/services/base.scm" }),
  ") with no way to pass " ,
  $("code", { textContent: "-t" }),
  " or set TERM. The fix is a custom shepherd service that exports ",
  "TERM=xterm-256color.",
]));

// 4. The hard-coded cursor blink
document.body.appendChild($("h2", { textContent: "4. The hard-coded cursor blink" }));
document.body.appendChild($("p", {}, [
  "kmscon 10.0.1 blinked the cursor by design: a 500 ms timer; no config ",
  "option, and DECSCUSR and DEC private mode 12 were unimplemented. The fix: ",
  "patch the renderer to drop the blink and build a patched package (" ,
  $("code", { textContent: "inherit kmscon" }),
  " plus a substitute* phase). SGR-5 text blink is handled separately in ",
  "the renderers ",
  $("a", { href: "https://github.com/kmscon/kmscon/blob/master/src/render/text.c", textContent: "(src/render/text.c)" }),
  ", so it survives the patch. Upstream later added a real " ,
  $("code", { textContent: "--blink" }),
  " option: ",
  $("a", { href: "https://github.com/kmscon/kmscon/commit/7ae1c81", textContent: "commit 7ae1c81" }),
  " \"conf: Add a blink option\" (the project's NEWS file lists it as ",
  $("a", { href: "https://github.com/kmscon/kmscon/blob/master/NEWS.md", textContent: "NEWS.md" }),
  ": \"terminal: Add blink support\"; ",
  $("a", { href: "https://github.com/kmscon/kmscon/pull/432", textContent: "PR #432" }),
  "). Check upstream before patching.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
  ", ",
  $("a", { href: "https://github.com/kmscon/kmscon", textContent: "kmscon" }),
]));
