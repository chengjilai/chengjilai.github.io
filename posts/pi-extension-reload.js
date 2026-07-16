"use strict";


const title = document.createElement("title");
title.textContent = "pi 0.84.0: sendUserMessage never dispatches extension commands";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "pi 0.84.0: sendUserMessage never dispatches extension commands" }));

// 1. The documented reload handoff
document.body.appendChild($("h2", { textContent: "1. The documented reload handoff" }));
document.body.appendChild($("p", {}, [
  $("a", { href: "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md", textContent: "docs/extensions.md" }),
  " and the shipped example ",
  $("a", { href: "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/reload-runtime.ts", textContent: "examples/extensions/reload-runtime.ts" }),
  " document a tool-to-command handoff for reload: the tool calls ",
  $("code", { textContent: "pi.sendUserMessage(\"/reload-runtime\", { deliverAs: \"followUp\" })" }),
  ", the command handler runs ",
  $("code", { textContent: "ctx.reload()" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "It does not work in 0.84.0.",
]));

// 2. Why it fails
document.body.appendChild($("h2", { textContent: "2. Why it fails" }));
document.body.appendChild($("p", {}, [
  "sendUserMessage hardcodes ",
  $("code", { textContent: "expandPromptTemplates: false" }),
  ", whose stated purpose is to skip command dispatch.",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Extension-command dispatch happens only in ",
    $("code", { textContent: "prompt()" }),
    " when ",
    $("code", { textContent: "expandPromptTemplates" }),
    " is true and the text starts with \"/\"",
  ]),
  $("li", {}, [
    "Queued follow-ups bypass ",
    $("code", { textContent: "prompt()" }),
    " entirely: they drain straight into the model context (pi-agent-core ",
    $("code", { textContent: "PendingMessageQueue" }),
    " -> ",
    $("code", { textContent: "runPromptMessages" }),
    ")",
  ]),
  $("li", {}, [
    "The queued text reaches the model as a literal user message",
  ]),
]));

// 3. The experiment
document.body.appendChild($("h2", { textContent: "3. The experiment" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "A tool that queued ",
    $("code", { textContent: "\"/ping-cmd\"" }),
    " with ",
    $("code", { textContent: "deliverAs: \"followUp\"" }),
    " left the command's marker file unwritten; the model received ",
    $("code", { textContent: "\"/ping-cmd\"" }),
    " as a user message and replied to it",
  ]),
  $("li", {}, [
    "Control: an RPC prompt whose message is ",
    $("code", { textContent: "\"/ping-cmd\"" }),
    " executed the command handler; a user typing /cmd in the TUI executes too (same ",
    $("code", { textContent: "prompt()" }),
    " path)",
  ]),
]));
document.body.appendChild($("p", {}, [
  "Tools run with ",
  $("code", { textContent: "ExtensionContext" }),
  ", which has no ",
  $("code", { textContent: "reload()" }),
  "; ",
  $("code", { textContent: "ctx.reload()" }),
  " exists only on ",
  $("code", { textContent: "ExtensionCommandContext" }),
  ". No in-session mechanism can trigger reload in 0.84.0.",
]));

// 4. Upstream
document.body.appendChild($("h2", { textContent: "4. Upstream" }));
document.body.appendChild($("p", {}, [
  "Upstream issues confirm the break: ",
  $("a", { href: "https://github.com/earendil-works/pi/issues/6149", textContent: "#6149" }),
  ", ",
  $("a", { href: "https://github.com/earendil-works/pi/issues/6574", textContent: "#6574" }),
  " (\"Example reload-runtime.ts can't work\"), ",
  $("a", { href: "https://github.com/earendil-works/pi/issues/7484", textContent: "#7484" }),
  " (\"Extension-sent slash commands never execute\").",
]));
document.body.appendChild($("p", {}, [
  "The fixes were not merged as of 0.84.0 (2026-08-06): ",
  $("code", { textContent: "pi.queueCommand" }),
  " (PR ",
  $("a", { href: "https://github.com/earendil-works/pi/pull/7293", textContent: "#7293" }),
  "), ",
  $("code", { textContent: "executeCommand" }),
  " (",
  $("a", { href: "https://github.com/earendil-works/pi/issues/6010", textContent: "#6010" }),
  "). ",
  $("a", { href: "https://github.com/earendil-works/pi/issues/6552", textContent: "#6552" }),
  " \"deferred canonical reload\" stays open.",
]));

// 5. What works
document.body.appendChild($("h2", { textContent: "5. What works" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "User ",
    $("code", { textContent: "/reload" }),
    " in the TUI",
  ]),
  $("li", {}, [
    "An RPC/JSON caller sending a ",
    $("code", { textContent: "\"/reload-runtime\"" }),
    " prompt",
  ]),
  $("li", {}, [
    $("code", { textContent: "/reload" }),
    " re-reads extension files from disk (jiti cache cleared), ",
    $("code", { textContent: "-e" }),
    " paths included",
  ]),
  $("li", {}, [
    $("code", { textContent: "registerTool" }),
    "/",
    $("code", { textContent: "registerProvider" }),
    "/",
    $("code", { textContent: "setActiveTools" }),
    " at runtime take effect immediately without ",
    $("code", { textContent: "/reload" }),
    ": a build that only adds tools or providers needs no reload; a changed extension file does",
  ]),
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
