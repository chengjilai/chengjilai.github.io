"use strict";

const title = document.createElement("title");
title.textContent = "Nix fixed-output fetches through the HTTP proxy";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Nix fixed-output fetches through the HTTP proxy" }));

document.body.appendChild($("p", {}, [
  "A flake's ",
  $("code", { textContent: "nix flake check" }),
  " failed downloading two fixed-output sources: ",
  $("a", { href: "https://musl.libc.org/releases/musl-1.2.6.tar.gz", textContent: "musl.libc.org" }),
  " and a ",
  $("a", { href: "https://repo.or.cz/tinycc.git", textContent: "repo.or.cz" }),
  " snapshot. ",
  "The download failed twice: first with a TLS connection reset, then with a hash mismatch.",
]));

document.body.appendChild($("h2", { textContent: "1. The hash mismatch was the diagnosis" }));
document.body.appendChild($("p", {}, [
  "The retry error named two hashes:",
]));
document.body.appendChild($("samp", { textContent: "error: hash mismatch in fixed-output derivation '.../cb41cbfe...tar.gz.drv':\n         specified: sha256-MRuqq3TKcfIahtUWdhAcYhqDiGPkAjS8UTMsDE+/jGU=\n         got:       sha256-iORXlqHoBNPneIEnZ6uYH34Y2Q9RannkhrV7GfnrqLI=" }));
document.body.appendChild($("p", {}, [
  "Two readings: the pinned nixpkgs revision has a stale hash, or the network served something else. ",
  "A direct download of the same URL through the proxy settled it: its sha256 matched the specified hash. ",
  "The lockfile was correct; the 'got' hash was block-page content.",
]));

document.body.appendChild($("h2", { textContent: "2. The fix" }));
document.body.appendChild($("p", {}, [
  "Nix's fixed-output fetchers honor the proxy environment variables:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight("env https_proxy=http://127.0.0.1:8888 \\\n    http_proxy=http://127.0.0.1:8888 \\\n    all_proxy=http://127.0.0.1:8888 \\\n    nix flake check", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "The proxied run fetched both tarballs and the check passed. ",
  "Once the fixed-output derivations are in the store, later ",
  $("code", { textContent: "nix flake check --offline" }),
  " runs stay green with no network at all.",
]));

document.body.appendChild($("h2", { textContent: "3. What takes which path" }));
document.body.appendChild($("p", {}, [
  "The same run copied ",
  $("code", { textContent: "postgresql" }),
  " from a local nix-channel mirror automatically, so store-path traffic needs no proxy. ",
  "Only the fixed-output source fetches (the lock-verified tarballs) go to the origin hosts. ",
  "The proxy's policy routes these two hosts direct; the proxied fetch succeeded where nix's own direct fetch was reset, so the reliable step is the proxy environment, not the policy.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
