"use strict";

const title = document.createElement("title");
title.textContent = "DeepSeek Harness on NixOS: the bash tool that assumed /bin/bash";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "DeepSeek Harness on NixOS: the bash tool that assumed /bin/bash" }));

document.body.appendChild($("h2", { textContent: "1. Two bash tools" }));
document.body.appendChild($("p", {}, [
  "DeepSeek Harness (dsh) has two model-facing bash tools with different executors. The standard agent preset mounts ",
  $("code", { textContent: "dsh-tool-bash" }),
  ": each call is a fresh subprocess with argv ",
  $("code", { textContent: "['bash', '-c', command]" }),
  ", resolved through PATH. The minimal preset mounts ",
  $("code", { textContent: "dsh-tool-bash-persistent" }),
  ": a stateful PTY shell whose backend is ",
  $("code", { textContent: "dsh-terminal-bash" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "The PTY backend spawns ",
  $("code", { textContent: "config.shellPath" }),
  " and its shipped default is ",
  $("code", { textContent: "/bin/bash" }),
  " (packages/terminal/terminal-bash/src/config.ts).",
]));

document.body.appendChild($("h2", { textContent: "2. The failure" }));
document.body.appendChild($("p", {}, [
  "Pure NixOS has no ",
  $("code", { textContent: "/bin" }),
  " directory at all, so the spawn fails and the shell exits at startup. Every persistent-bash call returns ",
  $("code", { textContent: "Error: PTY shell exited during startup" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "Verified with node-pty directly: spawning ",
  $("code", { textContent: "/bin/bash" }),
  " exits immediately with code 1; spawning the real bash path produces a prompt. The subprocess executor never hits this: PATH resolution finds bash wherever it lives.",
]));

document.body.appendChild($("h2", { textContent: "3. Reading the session log" }));
document.body.appendChild($("p", {}, [
  "Sessions are stored as zstd-compressed JSONL under the harness home: ",
  $("code", { textContent: "sessions/<workspace>/session-<id>/session.jsonl.zstd" }),
  ". The session header event carries the agent preset; tool/call and tool/result events carry arguments and full error text.",
]));
document.body.appendChild($("p", {}, [
  "The two bash tools are distinguishable by call shape: persistent-bash takes only ",
  $("code", { textContent: "{\"command\": ...}" }),
  "; tool-bash also requires a ",
  $("code", { textContent: "description" }),
  " argument. Failing sessions show the first shape, working sessions the second.",
]));

document.body.appendChild($("h2", { textContent: "4. The fix" }));
document.body.appendChild($("p", {}, [
  "The web bundle disables the host-level ",
  $("code", { textContent: "tool-bash" }),
  " row; the preset row owns the PTY. Patching the profile's tool-bash row does not reach it. The fix is on the preset rows: set ",
  $("code", { textContent: "shellPath" }),
  " on ",
  $("code", { textContent: "terminal-bash" }),
  " and ",
  $("code", { textContent: "persistent-bash" }),
  " in the preset's agent.cordis.yml to the real bash path.",
]));
document.body.appendChild($("p", {}, [
  "A running session keeps the preset generation it joined, so the fix requires a new session.",
]));
document.body.appendChild($("p", {}, [
  "Do not substitute ",
  $("code", { textContent: "$SHELL" }),
  " blindly: it may resolve to zsh or fish, and the backend ships bash-specific arguments and prompt-readiness logic.",
]));

document.body.appendChild($("h2", { textContent: "5. Upstream" }));
document.body.appendChild($("p", {}, [
  "Reported in ",
  $("a", { href: "https://github.com/deepseek-ai/deepseek-harness/discussions/1913", textContent: "discussion 1913" }),
  " with the two-tool analysis. A community member confirmed the diagnosis and published a ",
  $("a", { href: "https://sandbaseai.github.io/deepseek-harness-handbook/pty-shell-path.html", textContent: "handbook walkthrough" }),
  " recommending the user-preset route: duplicate the preset under the harness home and edit its agent.cordis.yml.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
