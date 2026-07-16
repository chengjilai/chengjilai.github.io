"use strict";

const title = document.createElement("title");
title.textContent = "pi as a programmable agent: RPC mode and declarative subagents";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "pi as a programmable agent: RPC mode and declarative subagents" }));

document.body.appendChild($("p", {}, [
  "pi is a coding agent that runs headless over a JSON protocol, and it \n",
  "ships no subagents or plan mode: \"you can ask pi to build what you want \n",
  "or install a third party pi package\" (README). A subagent extension can \n",
  "be deployed declaratively, through the OS build, with no per-user state.",
]));

// 1. RPC mode is a real protocol
document.body.appendChild($("h2", { textContent: "1. RPC mode is a real protocol" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "pi --mode rpc" }),
  " speaks newline-delimited JSON on stdin/stdout (",
  $("a", { href: "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/rpc.md", textContent: "docs/rpc.md" }),
  "): commands \n",
  "like ",
  $("code", { textContent: "{\"type\":\"prompt\",\"message\":...}" }),
  ", and events streamed to stdout: ",
  $("code", { textContent: "agent_start" }),
  ", ",
  $("code", { textContent: "message_update" }),
  ", ",
  $("code", { textContent: "agent_end" }),
  ", ",
  $("code", { textContent: "agent_settled" }),
  ". Two facts:",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Keep stdin open until ",
    $("code", { textContent: "agent_settled" }),
    "; closing early abandons the in-flight turn",
  ]),
  $("li", {}, [
    "agent_settled is the completion signal; the event stream carries the \n",
    "whole lifecycle, so a client can render progress and know when the agent \n",
    "is done",
  ]),
]));
document.body.appendChild($("p", {}, [
  "Protocols beat scraping: RPC events are the API; stdout text is not.",
]));

// 2. The docs ship with the package
document.body.appendChild($("h2", { textContent: "2. The docs ship with the package" }));
document.body.appendChild($("p", {}, [
  "The npm install carries ",
  $("code", { textContent: "pi-monorepo/docs/" }),
  " (rpc, sdk, extensions, skills, ...); read the local copy before \n",
  "web-searching. The README states a design fact: pi ships no subagents or \n",
  "plan mode.",
]));

// 3. Declarative subagents
document.body.appendChild($("h2", { textContent: "3. Declarative subagents" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "extension source  ->  /etc/pi/extensions/<name>  ->  wrapper -e flag", "shell") }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "CLI -e extensions load before/regardless of project trust: no trust \n",
    "file, no pi install",
  ]),
  $("li", {}, [
    "pi's example extension discovers agents from ",
    $("code", { textContent: "~/.pi/agent/agents" }),
    " (getAgentDir); the deployed extension reads its own directory via \n",
    "import.meta.url, so it is fully self-contained with no hidden state (agents.ts)",
  ]),
  $("li", {}, [
    "Completion is the subprocess's close event: the parent awaits the child \n",
    "pi's exit and extracts its final message (index.ts, proc.on(\"close\"))",
  ]),
]));
document.body.appendChild($("p", {}, [
  "Asked to audit a README, the subagent found two genuine inconsistencies ",
  "with line citations (a wrong secrets-location claim, a misattributed ",
  "package) and one false positive (it checked the wrong machine's home ",
  "directory). Declarative beats \"install\": the source lives in a repo, ",
  "wired through the build, with no per-user state; agent output is a draft, ",
  "not a verdict.",
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
