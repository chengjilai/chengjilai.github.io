"use strict";

// Title, per page. common.js sets up the head and stylesheet.
const title = document.createElement("title");
title.textContent = "Debugging traps that recur";
document.head.appendChild(title);

// The post. One appendChild per element, in document order.
document.body.appendChild($("h1", {
  textContent: "Debugging traps that recur",
}));

document.body.appendChild($("p", {}, [
  "Every one of these started as \"my change did nothing\" and ended as a ",
  "two-line explanation. None is exotic; all of them recur. The theme: verify ",
  "against the running system, not the file, and against instruments that ",
  "exist.",
]));

// 1. The running system is not the configured system
document.body.appendChild($("h2", {
  textContent: "1. The running system is not the configured system",
}));
document.body.appendChild($("p", {}, [
  "Config changes stage; running processes keep the old state. Check what is ",
  "running, not what you wrote:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "ps -o lstart,args -p <pid>     # when the process actually started\n" +
      "readlink /run/current-system   # the live NixOS generation",
  "shell")}),
]));
document.body.appendChild($("p", {}, [
  "A process born before your change is the whole story. The manuals say the ",
  "same: guix system reconfigure \"does not restart system services that were ",
  "already running\" (guix manual) - the new code exists, the old code still ",
  "runs. nixos-rebuild switch activates the new system now; boot defers ",
  "everything to the next reboot, and a new kernel only loads at boot.",
]));

// 2. pkill -f matches your own shell
document.body.appendChild($("h2", { textContent: "2. pkill -f matches your own shell" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "-f" }),
  " matches against the full command line, and your own shell's command line ",
  "contains the pattern - the shell you are running pkill from matches itself. ",
  "Demonstrated on this machine: ",
  $("code", { textContent: "pgrep -af pattern" }),
  " from a shell whose cmdline carries the pattern reported that same shell.",
]));
document.body.appendChild($("p", {}, [
  "Two ways out:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "pkill -x <name>     # match the process name exactly\n" +
      "pkill -f '[k]mscon' # bracket pattern: your own cmdline no longer matches",
  "shell")}),
]));
document.body.appendChild($("p", {}, [
  "The bracket trick works because the regex matches \"kmscon\" but your ",
  "cmdline holds the literal text \"[k]mscon\" - the substring is gone.",
]));

// 3. Stdin is a single stream
document.body.appendChild($("h2", { textContent: "3. Stdin is a single stream" }));
document.body.appendChild($("p", {}, [
  "A pipeline feeds stdin once. If the command reads it twice, the second read ",
  "is empty - ",
  $("code", { textContent: "printf 'hello\\n' | { read -r a; read -r b; }" }),
  " leaves ",
  $("code", { textContent: "b" }),
  " empty. A remote command that needs the data more than once quietly loses ",
  "the second read. Transfer it through a file instead.",
]));

// 4. Verify the probe before trusting its silence
document.body.appendChild($("h2", { textContent: "4. Verify the probe before trusting its silence" }));
document.body.appendChild($("p", {}, [
  "An absent instrument reports nothing. A \"no blink in the binary\" ",
  "conclusion was wrong because ",
  $("code", { textContent: "strings" }),
  " was not installed - the probe itself was missing. Before concluding from a ",
  "probe's silence, check that the probe exists and runs.",
]));

// 5. Read the tree you are running
document.body.appendChild($("h2", { textContent: "5. Read the tree you are running" }));
document.body.appendChild($("p", {}, [
  "Files move between versions. Guix keeps terminal emulators in ",
  $("code", { textContent: "gnu/packages/terminals.scm" }),
  " (verified in the current tree), but the file's internals were reorganized, ",
  "and driver directories move between kernel versions too. Advice written ",
  "against an older tree points at the wrong path. Read the source of the ",
  "version you actually run.",
]));

// 6. Order is semantics
document.body.appendChild($("h2", { textContent: "6. Order is semantics" }));
document.body.appendChild($("p", {}, [
  "First match wins in more than one place:",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Emacs face specs pick the first display condition that matches ",
    "(face-spec-choose)",
  ]),
  $("li", {}, [
    "Guix substitute servers are consulted in order; later ones are fallbacks ",
    "(guix manual: \"preferably taken from X then Y as fallback\")",
  ]),
  $("li", {}, [
    "case falls through to the catch-all",
  ]),
]));
document.body.appendChild($("p", {}, [
  "A list in the wrong order behaves differently, with no error.",
]));

// 7. Evidence before theory
document.body.appendChild($("h2", { textContent: "7. Evidence before theory" }));
document.body.appendChild($("p", {}, [
  "Record and measure before concluding: a 10-second capture, a register dump, ",
  "a palette test. Then trust the measurement over the hypothesis. In one ",
  "session the register dump was stale and the ears were right.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
