"use strict";


const title = document.createElement("title");
title.textContent = "Identifying pi sessions behind the opaque pi process; the subagent O(n^2) hot path";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Identifying pi sessions behind the opaque pi process; the subagent O(n^2) hot path" }));

// 1. Opaque cmdlines
document.body.appendChild($("h2", { textContent: "1. Opaque cmdlines: every pi process shows just \"pi\"" }));
document.body.appendChild($("p", {}, [
  "The pi wrapper runs ",
  $("code", { textContent: "exec -a" }),
  ": every pi process shows cmdline ",
  $("code", { textContent: "pi" }),
  " (argv: model, session, prompt) is invisible to ",
  $("code", { textContent: "ps" }),
  "/",
  $("code", { textContent: "pgrep" }),
  ". Running several sessions means several indistinguishable processes.",
]));
document.body.appendChild($("p", {}, [
  "Map a process to its session via ",
  $("code", { textContent: "/proc/<pid>/environ" }),
  ": it holds ",
  $("code", { textContent: "PI_SESSION_FILE" }),
  " and ",
  $("code", { textContent: "PI_SESSION_ID" }),
  ". Subagent children inherit them from the parent, so a worker maps to its session too.",
]));

// 2. Session files as progress signals
document.body.appendChild($("h2", { textContent: "2. Session files as progress signals" }));
document.body.appendChild($("p", {}, [
  "The session-file mtime is the progress signal, with a caveat: the subagent tool returns ",
  $("code", { textContent: "one" }),
  " result after ",
  $("code", { textContent: "all" }),
  " its workers finish, so the parent's file does not advance while a batch runs. Long mtime gaps are normal; check the workers (children, CPU, sockets) for health.",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Subagent children are ",
    $("code", { textContent: "pi --mode json -p --no-session" }),
    " with stdio pipes; they inherit the parent's controlling tty, so ",
    $("code", { textContent: "ps" }),
    " tty is not a reliable interactive marker",
  ]),
  $("li", {}, [
    "Healthy worker signature: an ESTAB socket to Cloudflare (the model API) with ",
    $("code", { textContent: "lastrcv" }),
    " in milliseconds and megabytes received (network-bound, not hung)",
  ]),
  $("li", {}, [
    "Hung signature: no socket data for minutes, no children, no CPU",
  ]),
]));

// 3. The O(n^2) hot path
document.body.appendChild($("h2", { textContent: "3. The O(n^2) hot path" }));
document.body.appendChild($("p", {}, [
  "A session's parent burned 40-60% CPU while a worker streamed. The tool called ",
  $("code", { textContent: "onUpdate" }),
  " on every ",
  $("code", { textContent: "message_end" }),
  " with the entire accumulated messages array, and pi re-rendered the whole growing output each time (O(n^2) over a long agentic run).",
]));
document.body.appendChild($("p", {}, [
  "The pathological grep: ",
  $("code", { textContent: "grep -o '.\\{0,100\\}<literal>.\\{0,1500\\}'" }),
  " on a 200 KB minified single-line JS bundle ran 98.9% CPU for over an hour. ",
  $("code", { textContent: "grep -o" }),
  " with bounded quantifiers over a giant single line is a CPU bomb; use rg or python.",
]));

// 4. The fix pattern
document.body.appendChild($("h2", { textContent: "4. The fix pattern" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Capped transcript (24 messages) and an incremental last-output string instead of recomputing from the full history",
  ]),
  $("li", {}, [
    "Debounced updates (300 ms) plus a flush on worker close",
  ]),
  $("li", {}, [
    "Per-worker timeout: SIGTERM then SIGKILL, exit 124, status ",
    $("code", { textContent: "timedOut" }),
    ", reported in the result",
  ]),
  $("li", {}, [
    "Concurrency caps (parallel 4, concurrent 2)",
  ]),
]));
document.body.appendChild($("p", {}, [
  "Verified live: a worker with a 2-second timeout was killed at 2 s with ",
  $("code", { textContent: "status: timedOut" }),
  " and ",
  $("code", { textContent: "exitCode: 124" }),
  "; the happy path returns the worker's output intact.",
]));

// 5. Testing extensions without the wrapper
document.body.appendChild($("h2", { textContent: "5. Testing extensions without the wrapper" }));
document.body.appendChild($("p", {}, [
  "The wrapper pre-loads its own extensions via ",
  $("code", { textContent: "-e" }),
  ", so loading a modified copy of one conflicts on the tool name. Run the raw binary directly instead: ",
  $("code", { textContent: "$(dirname $(readlink -f /run/current-system/sw/bin/pi))/.pi-wrapped_ --model <provider>/<model> -e <path>" }),
  ", with the provider key exported. The subagent child spawns through the same raw entry, so the whole chain is testable.",
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
