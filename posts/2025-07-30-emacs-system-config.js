"use strict";


const title = document.createElement("title");
title.textContent = "Shipping your Emacs config as part of the OS";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Shipping your Emacs config as part of the OS" }));

document.body.appendChild($("p", {}, [
  "An Emacs config that lives in the system repo, pinned per generation, ",
  "edited like any other system file, with no ~/.emacs.d to maintain.",
]));

// 1. How
document.body.appendChild($("h2", { textContent: "1. How" }));
document.body.appendChild($("p", {}, [
  "A tiny guix package ships ",
  $("code", { textContent: "config/emacs/init.el" }),
  " as ",
  $("code", { textContent: "share/emacs/site-lisp/default.el" }),
  " in the profile. Emacs loads default.el when no personal init exists: ",
  "the load order is documented in startup.el: site-start, early-init-file, ",
  "user-init-file, then default.el. No --init-file, no home dotfile.",
]));

// 2. Two constraints
document.body.appendChild($("h2", { textContent: "2. Two constraints" }));
document.body.appendChild($("ol", {}, [
  $("li", {}, [
    "The welcome screen. startup.el wraps the load verbatim: ",
    $("code", { textContent: "(let ((inhibit-startup-screen nil)) (load \"default\" 'noerror 'nomessage))" }),
    " with the comment \"Prevent default.el from changing the value of ",
    "inhibit-startup-screen\". The same policy guards site-start: \"Sites ",
    "should not disable the startup screen. Only individuals may disable the ",
    "startup screen.\" ",
    $("a", { href: "https://github.com/emacs-mirror/emacs/blob/master/lisp/startup.el", textContent: "(startup.el)" }),
    ". Emacs treats the init file as a trust boundary; a setting from a ",
    "system-shipped default file is swallowed. The escape: set it in ",
    "after-init-hook, which runs after the wrap.",
  ]),
  $("li", {}, [
    "Changes need a rebuild. The running Emacs holds the old store file; ",
    "restart (or M-x load-file the deployed copy) to pick up a new generation.",
  ]),
]));

// 3. Server, the remote control
document.body.appendChild($("h2", { textContent: "3. Server, the remote control" }));
document.body.appendChild($("p", {}, [
  "Add ",
  $("code", { textContent: "(server-start)" }),
  " to the config. Then ",
  $("code", { textContent: "emacsclient -e" }),
  " evaluates anything in the live session, and a blocking ",
  $("code", { textContent: "(while (not done) (accept-process-output))" }),
  " makes it a synchronous RPC: send, wait for the callback, read the answer. ",
  "An external agent drives the running Emacs this way.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
  ", ",
  $("a", { href: "https://github.com/emacs-mirror/emacs/blob/master/lisp/startup.el", textContent: "lisp/startup.el" }),
]));
