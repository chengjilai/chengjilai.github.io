"use strict";

const title = document.createElement("title");
title.textContent = "A 403 that was a version field, not a block";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "A 403 that was a version field, not a block" }));

document.body.appendChild($("h2", { textContent: "1. The symptom" }));
document.body.appendChild($("p", {}, [
  "Uploads returned HTTP 403 (\"出错啦 / 服务器正在休息\") from every client and every egress — ",
  "the campus IP, the lab IP, even a WARP tunnel. It looked like a network block. It was not.",
]));

document.body.appendChild($("h2", { textContent: "2. The probe that split it" }));
document.body.appendChild($("p", {}, [
  "The ",
  $("code", { textContent: "preupload?r=probe" }),
  " call stayed 200 while the name/size call 403'd. When the harmless call works and the real one fails, ",
  "the difference is in the request, not the network.",
]));

document.body.appendChild($("h2", { textContent: "3. The browser's request was the ground truth" }));
document.body.appendChild($("p", {}, [
  "Capturing the live web uploader's own request (CDP on the real browser) showed ",
  $("code", { textContent: "version=2.14.0.0&build=2140000&webVersion=2.14.0" }),
  ". The client sent the obsolete ",
  $("code", { textContent: "2.11.0/2110000" }),
  " shape and received the generic 403 page. The endpoint deprecates old parameter shapes ",
  "with a page that reads like an outage.",
]));

document.body.appendChild($("h2", { textContent: "4. The second bug: a stale session" }));
document.body.appendChild($("p", {}, [
  "The browser cookie chain rotates (SESSDATA, ",
  $("code", { textContent: "bili_ticket" }),
  ", buvid3). The uploader was reading a hand-written session file; the pipeline-maintained copy ",
  "refreshed from the browser was the one to use. After fixing both, the same account and network ",
  "uploaded back-to-back, including a 141 MB talk with transcode state 0.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
