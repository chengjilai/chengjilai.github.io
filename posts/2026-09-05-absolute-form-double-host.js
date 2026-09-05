"use strict";


const title = document.createElement("title");
title.textContent = "Absolute-form request lines double the host in a 302";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Absolute-form request lines double the host in a 302" }));

document.body.appendChild($("p", {}, [
  "A 302-to-https device on a campus network built its redirect as ",
  $("code", { textContent: "https://<Host><URI>" }),
  ". The URI it received was absolute, so the host came out doubled: ",
  $("code", { textContent: "https://hosthttp://host/" }),
  ". The address bar host parses as ",
  $("code", { textContent: "hosthttp" }),
  ", DNS fails, and the browser reports ERR_TUNNEL_CONNECTION_FAILED ",
  "through its proxy.",
]));

// 1. The request line is the variable
document.body.appendChild($("h2", { textContent: "1. The request line is the variable" }));
document.body.appendChild($("p", {}, [
  "HTTP proxies receive absolute-form request lines: ",
  $("code", { textContent: "GET http://host/path" }),
  ". A proxy that relays the line verbatim hands a redirect device an ",
  "absolute URI on top of its own Host header.",
]));
document.body.appendChild($("p", {}, [
  "The same device, the same path: the request through the proxy (absolute ",
  "form) came back with the doubled Location; the direct request ",
  "(origin-form) came back clean: ",
  $("code", { textContent: "Location: https://host/" }),
  ". The form of the request line was the only difference.",
]));

// 2. Where the flow hit it
document.body.appendChild($("h2", { textContent: "2. Where the flow hit it" }));
document.body.appendChild($("p", {}, [
  "A single-sign-on callback was registered as plain http. Every post-login ",
  "redirect was a plain-http navigation, so every login walked through the ",
  "absolute-form path and died on the doubled Location.",
]));

// 3. Fix
document.body.appendChild($("h2", { textContent: "3. Fix" }));
document.body.appendChild($("p", {}, [
  "The proxy rewrites absolute-form request lines to origin-form before ",
  "relaying. The client's Host header rides along, so nothing else ",
  "changes; a Host-less HTTP/1.0 request keeps the absolute form.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "GET http://host/path HTTP/1.1   ->   GET /path HTTP/1.1\\n" +
    "Host: host", "shell") }),
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));