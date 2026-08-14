"use strict";

const title = document.createElement("title");
title.textContent = "DeepSeek Harness: Everything is a Plugin";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "DeepSeek Harness: Everything is a Plugin" }));

document.body.appendChild($("h2", { textContent: "1. The harness" }));
document.body.appendChild($("p", {}, [
  "DeepSeek Harness (dsh) is DeepSeek-AI's open-source agent harness. License: MIT. Version 0.1.0-rc.6, developer preview; the README warns of compatibility-breaking changes.",
]));
document.body.appendChild($("p", {}, [
  "A harness is the program that runs an AI agent: model connection, tools (read files, run commands), the model-to-tool loop, session state.",
]));
document.body.appendChild($("p", {}, [
  "The repo's description is literal: ",
  $("code", { textContent: "Everything is a Plugin" }),
  ". The core is a plugin runtime; every capability (model access, shell, filesystem, subagents, skills, MCP) is a plugin.",
]));

document.body.appendChild($("h2", { textContent: "2. The architecture" }));
document.body.appendChild($("p", {}, [
  "The runtime is Cordis, a plugin framework by the cordiverse org, vendored and re-scoped as ",
  $("code", { textContent: "@deepseek-ai/cordis" }),
  ". Cordis provides plugin loading, dependency injection, lifecycle, hot reload, and config reconciliation.",
]));
document.body.appendChild($("p", {}, [
  "On top of the runtime sit roughly fifty ",
  $("code", { textContent: "@deepseek-ai/dsh-*" }),
  " packages: llm adapters, agent loop, session, tools, subagent, skill, sandbox, credentials, settings.",
]));
document.body.appendChild($("p", {}, [
  "A profile (headless, web, tui) is a cordis.yml list of plugins. The CLI package itself is a manifest: its dependencies are about eighty plugins, and the binary just boots the profile you name.",
]));
document.body.appendChild($("p", {}, [
  "The repo ships minimal example compositions under examples/, each a hand-written cordis.yml: settings, credentials, one llm adapter, one shell tool, an agent.",
]));

document.body.appendChild($("h2", { textContent: "3. The paper" }));
document.body.appendChild($("p", {}, [
  "The design is documented in ",
  $("a", { href: "https://github.com/cordiverse/paper", textContent: "A Programming Paradigm for Spatiotemporal Composability" }),
  " (Shi, Zhang, Cui; Peking University and DeepSeek-AI; preprint dated 2026-08-13).",
]));
document.body.appendChild($("p", {}, [
  "Temporal composability: every context transformation carries an explicit inverse the runtime tracks. Unloading a component replays the inverses last-in-first-out, so removal returns the environment to its pre-composition state.",
]));
document.body.appendChild($("p", {}, [
  "Spatial composability: a component declares what it requires as a specification. Each context change notifies the component as activating, deactivating, or neutral, so dependencies that appear, disappear, or change identity at runtime are resolved reactively.",
]));
document.body.appendChild($("p", {}, [
  "The paper's motivating numbers: 87 of VSCode's top-100 extensions contain executable code and require an extension-host restart to remove; 7 of the top-100 declare dependencies on other extensions.",
]));
document.body.appendChild($("p", {}, [
  "Cordis realizes the model: every mutation flows through one primitive that returns a dispose closure; a running component instance is a fiber; a declarative loader reconciles config changes incrementally; hot module replacement re-applies edited plugins on save.",
]));
document.body.appendChild($("p", {}, [
  "The production case study is Koishi, a chatbot framework on Cordis with over 4,000 community plugins. Koishi runs Cordis v3; the paper presents v4.",
]));

document.body.appendChild($("h2", { textContent: "4. Running it headless" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "npx @deepseek-ai/dsh web", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "The web profile serves a UI at http://127.0.0.1:3080. The headless profile answers one task, prints the result, and exits:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "DEEPSEEK_API_KEY=sk-... node --expose-internals \\\n  node_modules/@deepseek-ai/dsh/lib/bin.js \\\n  --profile headless \"fix the failing test in this workspace\"", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "The default provider is deepseek-official, default model deepseek-v4-flash.",
]));
document.body.appendChild($("p", {}, [
  "The bin script does not pass ",
  $("code", { textContent: "--expose-internals" }),
  " itself; the HMR service constructor throws without it. Run lib/bin.js under node with the flag.",
]));
document.body.appendChild($("p", {}, [
  "The headless run performs real tool use: a task executed uname via its shell tool, wrote the output to a file via its filesystem tool, read the file back, and reported.",
]));

document.body.appendChild($("h2", { textContent: "5. What the runtime does not guarantee" }));
document.body.appendChild($("p", {}, [
  "The runtime tracks inverses supplied by the plugin author; it does not verify an inverse recovers what the effect changed.",
]));
document.body.appendChild($("p", {}, [
  "Emissions outside the system boundary (bytes on a network, files other programs read) are not revertible. They are compensable at best: delete the created file, refund the charge.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
