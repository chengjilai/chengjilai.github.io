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
    $("a", { href: "posts/pi-extension-reload.html", textContent: "pi 0.84.0: sendUserMessage never dispatches extension commands" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/pi-rpc.html", textContent: "pi as a programmable agent: RPC mode and declarative subagents" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/hyprland-lua.html", textContent: "Hyprland 0.56: Lua config, dispatch, and screenshots" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/codeberg-burst-pacing.html", textContent: "Codeberg edge drops repeat connections; pacing and the API are stable" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/youtrack-api-token.html", textContent: "YouTrack: the REST API takes the SPA's own token" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/bilibili-web-upload.html", textContent: "Bilibili video uploads accept a browser session" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/resolver-night-window.html", textContent: "A resolver that withholds video sites at night" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/self-dating-tokens.html", textContent: "Session cookies carry their own expiry" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/debugging-traps.html", textContent: "Debugging traps that recur" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/rotating-credentials.html", textContent: "Rotating credentials in a systemd credential store" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/systemd-builtins.html", textContent: "systemd already does what you were about to write" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/declarative-secrets.html", textContent: "Declarative configuration and secrets pipelines" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/topic-embeddings.html", textContent: "Title embeddings, not whole content, for topic-level duplicates" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/verifying-what-you-write.html", textContent: "Verifying what you write about software" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/model-prose.html", textContent: "Keeping a language model out of your prose" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/hash-seed.html", textContent: "Python set iteration order is seed-dependent" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/nix-quoting.html", textContent: "Nix strings inside strings" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/exact-config-keys.html", textContent: "Exact config key names and silent ignores" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/ssh-home-resolution.html", textContent: "ssh resolves ~ from the passwd database, not $HOME" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/guix-pr.html", textContent: "How to submit a change to Guix (2026)" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/kmscon-console.html", textContent: "kmscon as the console" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/hda-codec.html", textContent: "HDA codec debugging from userspace" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/mic-hum.html", textContent: "Mic hum: diagnose with a 10-second recording" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/guix-mirrors.html", textContent: "Faster substitutes and package management from China" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/guix-firmware.html", textContent: "Guix firmware: why a machine can silently lose its sound card" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/guix-reconfigure.html", textContent: "guix system reconfigure: what it does and does not do" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/ssh-hosts.html", textContent: "SSH, keys, and hostnames across machines" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/wifi-eap.html", textContent: "What happens when a laptop joins a campus/enterprise Wi-Fi" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/emacs-system-config.html", textContent: "Shipping your Emacs config as part of the OS" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/emacs-colors.html", textContent: "Emacs face colors on terminals" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/escape-key.html", textContent: "The escape key: five layers" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/nixos-essentials.html", textContent: "NixOS debugging essentials" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/building-this-page.html", textContent: "Building this page with DOM, CSSOM, and Houdini" }),
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
