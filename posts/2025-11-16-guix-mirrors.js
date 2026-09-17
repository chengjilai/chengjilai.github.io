"use strict";


const title = document.createElement("title");
title.textContent = "Faster substitutes and package management from China";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Faster substitutes and package management from China" }));

document.body.appendChild($("p", {}, [
  "Guix queries substitute servers in order and falls back. Put the fast ones ",
  "first, keep the official ones as fallback, and prefer API clients over git ",
  "for repo work on restricted networks.",
]));

// 1. Substitute servers
document.body.appendChild($("h2", { textContent: "1. Substitute servers" }));
document.body.appendChild($("p", {}, [
  "Measured from the campus network on three ~70 MB nars: ",
  $("code", { textContent: "mirrors.sjtug.sjtu.edu.cn/guix" }), " 42 MB/s, its ",
  $("code", { textContent: "guix-bordeaux" }), " sibling 38, ",
  $("a", { href: "https://mirror.sjtu.edu.cn/guix", textContent: "mirror.sjtu.edu.cn/guix" }), " 37, ",
  $("a", { href: "https://ci.guix.moe", textContent: "ci.guix.moe" }), " 7.6, ",
  $("a", { href: "https://bordeaux.guix.gnu.org", textContent: "bordeaux.guix.gnu.org" }), " 5, ",
  $("a", { href: "https://substitutes.nonguix.org", textContent: "substitutes.nonguix.org" }), " ~3, ",
  $("a", { href: "https://ci.guix.gnu.org", textContent: "ci.guix.gnu.org" }), " 1.3.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "(substitute-urls\n" +
    " (list \"https://mirrors.sjtug.sjtu.edu.cn/guix\"\n" +
    "       \"https://mirrors.sjtug.sjtu.edu.cn/guix-bordeaux\"\n" +
    "       \"https://mirror.sjtu.edu.cn/guix\"\n" +
    "       \"https://ci.guix.moe\"\n" +
    "       \"https://substitutes.nonguix.org\"\n" +
    "       \"https://nonguix-proxy.ditigal.xyz\"\n" +
    "       \"https://bordeaux.guix.gnu.org\"\n" +
    "       \"https://ci.guix.gnu.org\"))", "elisp") }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "The SJTU mirrors serve the official ",
    $("a", { href: "https://ci.guix.gnu.org", textContent: "ci.guix.gnu.org" }),
    " cache: their narinfos carry the ",
    $("code", { textContent: "berlin.guix.gnu.org" }),
    " signature, and ",
    $("code", { textContent: "berlin.guix.gnu.org.pub" }),
    " and ",
    $("code", { textContent: "ci.guix.gnu.org.pub" }),
    " hold the same key, so a ",
    $("code", { textContent: "ci.guix.gnu.org.pub" }),
    " entry ",
    $("a", { href: "https://guix.gnu.org/manual/devel/en/html_node/Substitute-Server-Authorization.html", textContent: "already authorizes them" }),
  ]),
  $("li", {}, [
    "They are the only mirrors with the 64-bit Hurd (x86_64-gnu) nars: the ",
    "hello narinfo is 200 there, 404 on the bordeaux mirrors and ",
    $("a", { href: "https://ci.guix.moe", textContent: "ci.guix.moe" }),
  ]),
  $("li", {}, [
    "nonguix packages exist only on the aemilia-signed servers (",
    $("a", { href: "https://ci.guix.moe", textContent: "ci.guix.moe" }), ", ",
    $("a", { href: "https://substitutes.nonguix.org", textContent: "substitutes.nonguix.org" }), ", ",
    $("a", { href: "https://nonguix-proxy.ditigal.xyz", textContent: "nonguix-proxy.ditigal.xyz" }),
    "). Keep them in the list or nonguix substitutes stop",
  ]),
  $("li", {}, [
    "The proxy is transparent (same nonguix signature, no new key)",
  ]),
  $("li", {}, [
    $("a", { href: "https://ci.guix.moe", textContent: "ci.guix.moe" }),
    " re-signs with its own key; authorize it and understand the ",
    "trust change (a single community operator)",
  ]),
  $("li", {}, [
    "Guix verifies nar hashes and signatures, so a bad mirror can only fail a ",
    "download, never corrupt",
  ]),
  $("li", {}, [
    "A caching proxy in front is a liability: its narinfo path probed six ",
    "upstreams serially at 20 s each, so every cache miss stalled for up to ",
    "two minutes, and without a ",
    $("code", { textContent: "ci.guix.gnu.org" }),
    " upstream it could not serve ",
    "x86_64-gnu nars at all",
  ]),
  $("li", {}, [
    "--no-substitutes is not a fallback: for a system package it builds the ",
    "whole bootstrap (guile-bootstrap, gcc, glibc) and then fails for ",
    "x86_64-gnu because that bootstrap has to run on the Hurd",
  ]),
  $("li", {}, [
    "Restart the daemon to apply: ",
    $("code", { textContent: "herd restart guix-daemon" }),
    " (reconfigure does not)",
  ]),
]));

// 2. Channels
document.body.appendChild($("h2", { textContent: "2. Channels" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("a", { href: "https://git.guix.gnu.org", textContent: "git.guix.gnu.org" }),
    " redirects to Codeberg (stable in China); ",
    $("a", { href: "https://gitlab.com/nonguix", textContent: "gitlab.com/nonguix" }),
    " is slow but reachable (give it a long timeout before concluding it is ",
    "blocked)",
  ]),
  $("li", {}, [
    "Channel fetch failures surface as \"no code for module (nongnu packages ",
    "linux)\"; check the channel state, not just the package",
  ]),
]));

// 3. Host APIs instead of git protocol
document.body.appendChild($("h2", { textContent: "3. Host APIs instead of git protocol" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "git protocol to ",
    $("a", { href: "https://github.com", textContent: "github.com" }),
    " is unreliable from China; ",
    $("a", { href: "https://api.github.com", textContent: "api.github.com" }),
    " is stable. Use gh (github-cli), which is API based",
  ]),
  $("li", {}, [
    "Guix git-fetch falls back to Software Heritage. If SWH lacks a recent ",
    "commit, request ingestion: POST ",
    $("code", { textContent: "/api/1/origin/save/git/url/<url>/" }),
    ". It ingests within minutes, then guix can fetch",
  ]),
  $("li", {}, [
    "guix hash -S git is unreliable for git-fetch hashes (clone ref state ",
    "matters). Get the true hash from a build's \"actual hash\" mismatch error",
  ]),
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
