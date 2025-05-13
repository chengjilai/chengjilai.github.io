"use strict";

// Title, per page. common.js sets up the head and stylesheet.
const title = document.createElement("title");
title.textContent = "The escape key: five layers worth knowing";
document.head.appendChild(title);

// The post. One appendChild per element, in document order.
document.body.appendChild($("h1", {
  textContent: "The escape key: five layers worth knowing",
}));

document.body.appendChild($("p", {}, [
  "Goal: make Escape cancel like C-g, make the Windows key Meta, and leave ",
  "Alt dead. Each attempt failed for a different reason, and each reason is a ",
  "documented layer of Emacs input handling. The five layers, with the source.",
]));

// 1. Character vs key event
document.body.appendChild($("h2", { textContent: "1. Character vs key event" }));
document.body.appendChild($("p", {}, [
  "In Emacs, ",
  $("code", { textContent: "(kbd \"ESC\")" }),
  " is the escape character, the integer 27. It is one of the shorthand ",
  "names in the Lisp manual: NUL, RET, TAB, LFD, ESC, SPC, DEL. The physical ",
  "Escape key produces a function-key event instead: the symbol ",
  $("code", { textContent: "escape" }),
  ". Function keys are symbols, control characters are integers; the manual's ",
  "own example is tab versus C-i (integer 9 versus symbol tab). The two forms ",
  "are not equal, so a binding on ",
  $("code", { textContent: "(kbd \"ESC\")" }),
  " never matches the key.",
]));
document.body.appendChild($("p", {}, [
  "evil makes the split explicit. It binds ",
  $("code", { textContent: "[escape]" }),
  " in its state maps ",
  $("a", { href: "https://github.com/emacs-evil/evil/blob/master/evil-maps.el", textContent: "(evil-maps.el)" }),
  ", and evil-esc-mode, switched on when ",
  "evil-mode starts, rewrites the ",
  $("code", { textContent: "\\e" }),
  " entry of ",
  $("code", { textContent: "input-decode-map" }),
  " so a lone escape becomes the escape event. C-h k on the key shows which ",
  "event Emacs actually received.",
]));
document.body.appendChild($("p", {}, [
  "In a graphical frame the Escape key arrives as the escape event, and a ",
  "key translation rewrites it to ESC. This is a known annoyance with an open ",
  "enhancement request: evil issue ",
  $("a", { href: "https://github.com/emacs-evil/evil/issues/1780", textContent: "#1780" }),
  ", \"Support separating M- and ",
  "<escape> in graphical frames\", proposes ",
  $("code", { textContent: "(define-key local-function-key-map (kbd \"<escape>\") nil)" }),
  ", which reserves ESC for Meta and leaves <escape> to the key. In a ",
  "terminal the two cannot be distinguished at all.",
]));

// 2. A terminal collapses Meta and Escape into one byte
document.body.appendChild($("h2", {
  textContent: "2. A terminal collapses Meta and Escape into one byte",
}));
document.body.appendChild($("p", {}, [
  "On a terminal there is no Meta key. Emacs encodes Meta as ESC followed by ",
  "the key: \"You can also type Meta characters using two-character sequences ",
  "starting with ESC\" ",
  $("a", { href: "https://github.com/emacs-mirror/emacs/blob/master/doc/emacs/commands.texi", textContent: "(commands.texi)" }),
  ", and the glossary calls ESC \"a character ",
  "used as a prefix for typing Meta characters on keyboards lacking a Meta ",
  "key.\" Internally M-a is ESC a, and its binding lives in ",
  $("code", { textContent: "esc-map" }),
  " ",
  $("a", { href: "https://github.com/emacs-mirror/emacs/blob/master/doc/lispref/keymaps.texi", textContent: "(keymaps.texi)" }),
  ". The FAQ says it plainly: \"Emacs converts M-a internally ",
  "into ESC a anyway (depending on the value of meta-prefix-char)\" ",
  $("a", { href: "https://github.com/emacs-mirror/emacs/blob/master/doc/misc/efaq.texi", textContent: "(efaq, \"No Meta key\")" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "So M-x and ESC x are the same bytes, and Emacs cannot tell them apart when ",
  "a letter follows. Only a lone ESC can be its own event. evil's docstring ",
  "states the problem verbatim ",
  $("a", { href: "https://github.com/emacs-evil/evil/blob/master/evil-vars.el", textContent: "(evil-intercept-esc)" }),
  ": \"In the terminal, escape ",
  "and a meta key sequence both generate the same event. In order to ",
  "distinguish these, Evil uses input-decode-map.\" evil-esc-mode waits ",
  $("code", { textContent: "evil-esc-delay" }),
  " (0.01 s): if no further key arrives, the event is escape; if one does, it ",
  "is the ESC prefix (M-x, M-a, ...). The translation code evil uses is ",
  "credited in its source to Stefan Monnier's discussion in GNU Emacs bug ",
  $("a", { href: "https://debbugs.gnu.org/13793", textContent: "#13793" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "Consequence: \"Escape = C-g everywhere\" and \"Meta = Windows key\" cannot ",
  "both hold in one context. Pick one per context.",
]));

// 3. evil claims the escape key
document.body.appendChild($("h2", { textContent: "3. evil claims the escape key" }));
document.body.appendChild($("p", {}, [
  "evil binds ",
  $("code", { textContent: "[escape]" }),
  " in every state ",
  $("a", { href: "https://github.com/emacs-evil/evil/blob/master/evil-maps.el", textContent: "(evil-maps.el)" }),
  ":",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "(define-key evil-normal-state-map [escape] 'evil-force-normal-state)\n" +
      "(define-key evil-insert-state-map [escape] 'evil-normal-state)\n" +
      "(define-key evil-visual-state-map [escape] 'evil-exit-visual-state)\n" +
      "(define-key evil-command-line-map [escape] #'abort-recursive-edit)",
  "elisp")}),
]));
document.body.appendChild($("p", {}, [
  "Normal state's binding is evil-force-normal-state: \"Switch to normal state ",
  "without recording current command.\" Already in normal mode, so it does ",
  "nothing visible. The other states leave for normal, exit visual, or abort.",
]));
document.body.appendChild($("p", {}, [
  "Your own escape binding can therefore silently do nothing. evil's state maps ",
  "are registered in evil-mode-map-alist, which evil pushes onto ",
  $("code", { textContent: "emulation-mode-map-alists" }),
  " ",
  $("a", { href: "https://github.com/emacs-evil/evil/blob/master/evil-core.el", textContent: "(evil-core.el)" }),
  "; the Lisp manual says the active keymaps there \"are used ",
  "before minor-mode-map-alist.\" evil's keys win over every minor-mode ",
  "binding.",
]));

// 4. The minibuffer has its own quit
document.body.appendChild($("h2", { textContent: "4. The minibuffer has its own quit" }));
document.body.appendChild($("p", {}, [
  "C-g in a prompt does not run keyboard-quit. delsel.el binds C-g in ",
  $("code", { textContent: "minibuffer-local-map" }),
  " to minibuffer-keyboard-quit, and its docstring says what happens: \"In ",
  "Delete Selection mode, if the mark is active, just deactivate it; then it ",
  "takes a second C-g to abort the minibuffer.\"",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "(define-key minibuffer-local-map \"\\C-g\" 'minibuffer-keyboard-quit)\n" +
      "\n" +
      "(defun minibuffer-keyboard-quit ()\n" +
      "  \"Abort recursive edit.\n" +
      "In Delete Selection mode, if the mark is active, just deactivate it;\n" +
      "then it takes a second \\\\[keyboard-quit] to abort the minibuffer.\"\n" +
      "  (interactive)\n" +
      "  (if (and delete-selection-mode (region-active-p))\n" +
      "      (setq deactivate-mark t)\n" +
      "    (abort-minibuffers)))",
  "elisp")}),
]));
document.body.appendChild($("p", {}, [
  "So during a selection, C-g cancels the selection first instead of aborting. ",
  "Binding Escape to the same function gives exact C-g parity. There is a ",
  "ready-made escape-flavored quit: ESC ESC ESC runs keyboard-escape-quit ",
  "(global-map, ",
  $("a", { href: "https://github.com/emacs-mirror/emacs/blob/master/lisp/bindings.el", textContent: "bindings.el" }),
  "), whose docstring describes the same dance: it ",
  "\"can clear out a prefix argument or a region, can get out of the minibuffer ",
  "or other recursive edit.\"",
]));

// 5. Vim-like prompts are possible
document.body.appendChild($("h2", { textContent: "5. Vim-like prompts are possible" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "(setq evil-want-minibuffer t)" }),
  ", whose docstring is \"Whether to enable Evil in minibuffer(s)\", makes evil initialize in ",
  "the minibuffer; evil-initialize skips minibuffers unless this is set. The ",
  "minibuffer starts in evil insert state (",
  $("a", { href: "https://github.com/emacs-evil/evil/blob/master/evil-core.el", textContent: "evil-core.el" }),
  " sets ",
  $("code", { textContent: "evil-default-state" }),
  " to insert there), so typing works as usual. Escape enters normal state; i ",
  "returns to insert.",
]));
document.body.appendChild($("p", {}, [
  "Normal state's q is already taken ",
  $("a", { href: "https://github.com/emacs-evil/evil/blob/master/evil-commands.el", textContent: "(evil-record-macro)" }),
  ". Bind your own: put q ",
  "on abort-minibuffers (a C subr, ",
  $("a", { href: "https://github.com/emacs-mirror/emacs/blob/master/src/minibuf.c", textContent: "src/minibuf.c" }),
  ") in the minibuffer's evil maps ",
  "with evil-define-key. Result: Escape enters normal state, i enters ",
  "insert, q quits, and no Control is needed.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
