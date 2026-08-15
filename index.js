"use strict";

// Title, per page. common.js sets up the head and stylesheet.
const title = document.createElement("title");
title.textContent = "Jilai Cheng";
document.head.appendChild(title);

// The post list, generated from posts/ (nub run gen). Order: filename date desc.
document.body.appendChild($("h1", { textContent: "Jilai Cheng" }));

document.body.appendChild($("h2", { textContent: "Posts" }));

document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-bilibili-preupload-403.html", textContent: "A 403 that was a version field, not a block — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-blank-page-shell-bugs.html", textContent: "Blank pages: the shell, not the script — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-bun-compile-nix.html", textContent: "bun --compile binaries in Nix: patch only the interpreter — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-generation-identity.html", textContent: "Generations that lie: boot regressions hide under long uptime — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-kotlin-toolchain-external-builds.html", textContent: "kotlin-toolchain: Gradle distribution mirror and the missing power-assert runtime — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-mill-11-build-files.html", textContent: "Mill 1.1 build files: what changed — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-mill-clojure.html", textContent: "Self-contained Clojure builds with Mill — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-qutebrowser-ipc.html", textContent: "qutebrowser IPC: JSON, not plain text — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-transcript-semantic-bridge.html", textContent: "Transcripts bridge what titles can't — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-15-youtube-combined-format-stub.html", textContent: "The stub that broke bilibili transcoding — 2026-08-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-14-deepseek-harness.html", textContent: "DeepSeek Harness: Everything is a Plugin — 2026-08-14" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-14-git-history-rewrite.html", textContent: "Rebuilding git history from per-file change chains — 2026-08-14" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-08-13-published-date.html", textContent: "The publication date is a declaration — 2026-08-13" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-07-17-pi-process-diagnosis.html", textContent: "Identifying pi sessions behind the opaque pi process; the subagent O(n^2) hot path — 2026-07-17" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-07-16-pi-extension-reload.html", textContent: "pi 0.84.0: sendUserMessage never dispatches extension commands — 2026-07-16" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-07-13-pi-rpc.html", textContent: "pi as a programmable agent: RPC mode and declarative subagents — 2026-07-13" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-07-05-hyprland-lua.html", textContent: "Hyprland 0.56: Lua config, dispatch, and screenshots — 2026-07-05, updated 2026-08-14" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-07-02-codeberg-burst-pacing.html", textContent: "Codeberg edge drops repeat connections; pacing and the API are stable — 2026-07-02" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-06-18-youtrack-api-token.html", textContent: "YouTrack: the REST API takes the SPA's own token — 2026-06-18" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-06-01-bilibili-web-upload.html", textContent: "Bilibili video uploads accept a browser session — 2026-06-01, updated 2026-08-14" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-05-28-resolver-night-window.html", textContent: "A resolver that withholds video sites at night — 2026-05-28" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-05-10-self-dating-tokens.html", textContent: "Session cookies carry their own expiry — 2026-05-10" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-03-27-debugging-traps.html", textContent: "Debugging traps that recur — 2026-03-27" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-03-19-rotating-credentials.html", textContent: "Rotating credentials in a systemd credential store — 2026-03-19" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-03-16-systemd-builtins.html", textContent: "systemd already does what you were about to write — 2026-03-16" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-03-12-declarative-secrets.html", textContent: "Declarative configuration and secrets pipelines — 2026-03-12" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-03-05-topic-embeddings.html", textContent: "Title embeddings, not whole content, for topic-level duplicates — 2026-03-05" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-02-28-verifying-what-you-write.html", textContent: "Verifying what you write about software — 2026-02-28" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-02-23-model-prose.html", textContent: "Keeping a language model out of your prose — 2026-02-23" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-02-19-hash-seed.html", textContent: "Python set iteration order is seed-dependent — 2026-02-19" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-02-15-nix-quoting.html", textContent: "Nix strings inside strings — 2026-02-15" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-02-04-exact-config-keys.html", textContent: "Exact config key names and silent ignores — 2026-02-04" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-01-30-ssh-home-resolution.html", textContent: "ssh resolves ~ from the passwd database, not $HOME — 2026-01-30" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-01-24-guix-pr.html", textContent: "How to submit a change to Guix (2026) — 2026-01-24" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2026-01-10-kmscon-console.html", textContent: "kmscon as the console — 2026-01-10" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-12-19-hda-codec.html", textContent: "HDA codec debugging from userspace — 2025-12-19" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-12-05-mic-hum.html", textContent: "Mic hum: diagnose with a 10-second recording — 2025-12-05" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-11-16-guix-mirrors.html", textContent: "Faster substitutes and package management from China — 2025-11-16" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-11-14-guix-firmware.html", textContent: "Guix firmware: why a machine can silently lose its sound card — 2025-11-14" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-09-29-guix-reconfigure.html", textContent: "guix system reconfigure: what it does and does not do — 2025-09-29" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-09-09-ssh-hosts.html", textContent: "SSH, keys, and hostnames across machines — 2025-09-09" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-08-25-wifi-eap.html", textContent: "What happens when a laptop joins a campus/enterprise Wi-Fi — 2025-08-25" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-07-30-emacs-system-config.html", textContent: "Shipping your Emacs config as part of the OS — 2025-07-30" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-07-22-emacs-colors.html", textContent: "Emacs face colors on terminals — 2025-07-22" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-05-09-escape-key.html", textContent: "The escape key: five layers — 2025-05-09" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2025-04-28-nixos-essentials.html", textContent: "NixOS debugging essentials — 2025-04-28" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/2024-11-22-building-this-page.html", textContent: "Building this page with DOM, CSSOM, and Houdini — 2024-11-22, updated 2026-08-14" }),
  ]),
]));

document.body.appendChild($("p", {}, [
  "Email: ",
  $("a", { href: "mailto:chengjilai@sjtu.edu.cn", textContent: "chengjilai@sjtu.edu.cn" }),
]));

document.body.appendChild($("p", {}, [
  "GitHub: ",
  $("a", { href: "https://github.com/chengjilai", textContent: "github.com/chengjilai" }),
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
