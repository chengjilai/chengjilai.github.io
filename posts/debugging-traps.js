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
  "A process born before your change explains the symptom. The manuals say the ",
  "same: guix system reconfigure \"does not restart system services that were ",
  "already running\" (guix manual); the new code exists, the old code still ",
  "runs. nixos-rebuild switch activates the new system now; boot defers ",
  "everything to the next reboot, and a new kernel only loads at boot.",
]));

// 2. pkill -f matches your own shell
document.body.appendChild($("h2", { textContent: "2. pkill -f matches your own shell" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "-f" }),
  " matches against the full command line. The shell you run pkill from has ",
  "the pattern in its own command line, so pkill matches it too.",
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
  "The bracket trick works because the regex matches \"kmscon\" but the ",
  "cmdline holds the literal text \"[k]mscon\"; the substring is gone.",
]));

// 3. Stdin is a single stream
document.body.appendChild($("h2", { textContent: "3. Stdin is a single stream" }));
document.body.appendChild($("p", {}, [
  "A pipeline feeds stdin once. If the command reads it twice, the second read ",
  "is empty: ",
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
  " was not installed; the probe itself was missing. Before concluding from a ",
  "probe's silence, check that the probe exists and runs.",
]));

// 5. Read the tree you are running
document.body.appendChild($("h2", { textContent: "5. Read the tree you are running" }));
document.body.appendChild($("p", {}, [
  "Files move between versions. Guix keeps terminal emulators in ",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/packages/terminals.scm", textContent: "gnu/packages/terminals.scm" }),
  ", but the file's internals were reorganized, and driver directories move ",
  "between kernel versions too. Advice written against an older tree points ",
  "at the wrong path. Read the source of the version you run.",
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
  "case the register dump was stale and the ears were right.",
]));

// 8. Lengths lie: compare bytes
document.body.appendChild($("h2", { textContent: "8. Lengths lie: compare bytes" }));
document.body.appendChild($("p", {}, [
  "A password \"of the right length\" was still wrong: the byte count ",
  "matched while the bytes were ",
  $("code", { textContent: "PREFIX=value" }),
  " instead of ",
  $("code", { textContent: "value" }),
  "; a template prefix baked into the secret. A trailing newline is the ",
  "same class of bug. Compare what the tool consumes, byte for ",
  "byte: ",
  $("code", { textContent: "sudo systemd-creds decrypt <cred> - | xxd" }),
  " against the known-good value. ",
  $("code", { textContent: "wc -c" }),
  " is not verification.",
]));

// 9. Event-driven failures: up is not working
document.body.appendChild($("h2", { textContent: "9. Event-driven failures: up is not working" }));
document.body.appendChild($("p", {}, [
  "The crashing path may run only on the first event. A chat-to-agent ",
  "bridge booted clean for days and crashed on every first message: ",
  "ProtectHome makes /home empty, and the agent subprocess hit EACCES on ",
  "it. An ack sent BEFORE the work (\"pi is working on it...\") plus silence ",
  "means the work step crashed; read the unit journal for the traceback. ",
  "A journal line ",
  $("code", { textContent: "restart counter is at N" }),
  " means it has been crash-looping; each era's last error line says why ",
  "(exit code from the receiver = network down, traceback = config/code).",
]));

// 10. What did the restart change?
document.body.appendChild($("h2", { textContent: "10. What did the restart change?" }));
document.body.appendChild($("p", {}, [
  "The restart is never the fix; it clears something: a stale process, a ",
  "unit file swapped mid-boot (",
  $("code", { textContent: "systemd[1]: Stopping/Starting X" }),
  " in the journal), or a hang only a fresh process can break ",
  "(wpa_supplicant's CTRL-REQ-PASSWORD with no control interface waits ",
  "forever). Find what it cleared.",
]));

// 11. One variable per test
document.body.appendChild($("h2", { textContent: "11. One variable per test" }));
document.body.appendChild($("p", {}, [
  "Change one thing per test boot; a combined fix \"works\" but tells ",
  "nothing about which part mattered. \"Nothing changed\" has a proof: after ",
  $("code", { textContent: "nixos-rebuild switch" }),
  ", an unchanged ",
  $("code", { textContent: "readlink /run/current-system" }),
  " store path is the strongest evidence. Validate a mechanism before ",
  "switching to it (e.g. ",
  $("code", { textContent: "systemd-run --property=ImportCredential=X" }),
  ").",
]));

// 12. Case study: a chat bridge
// (traps 9 and 10, one incident, the detail that makes them concrete)
document.body.appendChild($("h2", { textContent: "12. Case study: a chat bridge" }));
document.body.appendChild($("p", {}, [
  "The incident behind traps 9 and 10: a chat-to-agent bridge (phone ",
  "messages run the coding agent and reply) said ",
  $("code", { textContent: "active (running)" }),
  ", the log showed a clean start, websocket connected, and yet every ",
  "message died. The flow per message is receive, send the ack, run the ",
  "agent, then send the reply; the ack goes out BEFORE the heavy step, so ",
  "\"ack, then silence\" pinpoints the crash in the agent step.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "msg from <chat_id>: hello\n" +
    "PermissionError: [Errno 13] Permission denied: '/home/<user>'\n" +
    "Main process exited, code=exited, status=1/FAILURE", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "A past commit had added ",
  $("code", { textContent: "ProtectHome=true" }),
  " as \"basic hardening\". ProtectHome mounts /home as empty for the ",
  "service, and the agent subprocess chdirs into the user's home to reach ",
  "its session files. EACCES on every message; the unit now documents the ",
  "failure. The hardening was never tested because nothing exercised ",
  "the failing path until a message arrived. Security settings must be ",
  "exercised on the REAL path they affect, not only at startup.",
]));
document.body.appendChild($("p", {}, [
  "The journal's ",
  $("code", { textContent: "Scheduled restart job, restart counter is at 14." }),
  " line meant it had been crash-looping for a while, and the cause had ",
  "CHANGED over time. Earlier the loops were ",
  $("code", { textContent: "receive stream ended (receiver exit code 3)" }),
  " (network down); later they became the traceback above (config/code). ",
  "Same symptom, two different eras, two different causes; read each ",
  "era's last error line before deciding what to fix.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
