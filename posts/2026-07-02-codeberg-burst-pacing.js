"use strict";

const title = document.createElement("title");
title.textContent = "Codeberg edge drops repeat connections; pacing and the API are stable";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Codeberg edge drops repeat connections; pacing and the API are stable" }));

// 1. The drop
document.body.appendChild($("h2", { textContent: "1. The drop" }));
document.body.appendChild($("p", {}, [
  "The first request to codeberg.org succeeds. Repeats within about 40 seconds \n",
  "time out after the TLS handshake with 0 bytes received.",
]));
document.body.appendChild($("p", {}, [
  "The drop follows the host, not the egress: direct, a local proxy, and a WARP \n",
  "tunnel behave the same. HTTP/1.1 and HTTP/2 behave the same. The User-Agent \n",
  "does not change it.",
]));
document.body.appendChild($("p", {}, [
  "A bot gate answers HTTP 4xx or 429 with a body. This drop is 0 bytes after \n",
  "the handshake, no body.",
]));

// 2. IPv6 delivers nothing
document.body.appendChild($("h2", { textContent: "2. IPv6 delivers nothing" }));
document.body.appendChild($("p", {}, [
  "codeberg.org resolves to A and AAAA. The IPv6 path completes the TLS \n",
  "handshake and never delivers a byte; curl needs -4.",
]));

// 3. Stable access
document.body.appendChild($("h2", { textContent: "3. Stable access" }));
document.body.appendChild($("p", {}, [
  "One request per 30-40 seconds succeeds every time; bursts fail. The host's \n",
  "API answers small JSON that completes more often than HTML pages: ",
  $("a", { href: "https://codeberg.org/api/v1/repos/guix/guix", textContent: "codeberg.org/api/v1/repos/guix/guix" }),
  " is the repo metadata endpoint.",
]));
document.body.appendChild($("p", {}, [
  "The API serves file contents by path: /api/v1/repos/<owner>/<repo>/contents/<path>?ref=master.",
  " A GitHub mirror of the repository (",
  $("a", { href: "https://github.com/guix-mirror/guix", textContent: "github.com/guix-mirror/guix" }),
  ") cross-checks file existence when the origin is throttled.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
