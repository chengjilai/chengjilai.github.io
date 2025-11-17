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
  "Measured from the campus network (2026): official nonguix ~0.7 MB/s, a ",
  "transparent proxy ~3.4 MB/s, ci.guix.moe ~6.9 MB/s.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "(substitute-urls\n" +
    " (list \"https://ci.guix.moe\"\n" +
    "       \"https://nonguix-proxy.ditigal.xyz\"\n" +
    "       \"https://mirror.sjtu.edu.cn/guix\"\n" +
    "       \"https://substitutes.nonguix.org\"\n" +
    "       \"https://ci.guix.gnu.org\"\n" +
    "       \"https://bordeaux.guix.gnu.org\"))", "elisp") }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "The proxy is transparent (same nonguix signature, no new key)",
  ]),
  $("li", {}, [
    "ci.guix.moe re-signs with its own key; authorize it and understand the ",
    "trust change (a single community operator)",
  ]),
  $("li", {}, [
    "Guix verifies nar hashes and signatures, so a bad mirror can only fail a ",
    "download, never corrupt",
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
    "git.guix.gnu.org redirects to Codeberg (stable in China); gitlab.com/nonguix ",
    "is slow but reachable (give it a long timeout before concluding it is ",
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
    "git protocol to github.com is unreliable from China; api.github.com is ",
    "stable. Use gh (github-cli), which is API based",
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
