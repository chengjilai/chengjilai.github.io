"use strict";

const title = document.createElement("title");
title.textContent = "The stub that broke bilibili transcoding";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "The stub that broke bilibili transcoding" }));

document.body.appendChild($("h2", { textContent: "1. A video with no video" }));
document.body.appendChild($("p", {}, [
  "yt-dlp ",
  $("code", { textContent: "-f \"bv*+ba/b\"" }),
  " silently fell back to the combined muxed format (18) for one video. Through the proxy egress ",
  "that format arrived as a 1.5 MB header-only stub.",
]));

document.body.appendChild($("h2", { textContent: "2. The trap: the metadata lies" }));
document.body.appendChild($("p", {}, [
  "The stub declared h264 + aac with full sample tables (92k frames claimed) but carried ~zero real ",
  "frames — ffprobe reported \"partial file\". A size check against the declared metadata passed. ",
  "It got uploaded, and bilibili's transcode failed with \"该文件缺少视频轨\" (missing video track).",
]));

document.body.appendChild($("h2", { textContent: "3. DASH streams were fine all along" }));
document.body.appendChild($("p", {}, [
  "The same video's DASH streams (video 134 + audio 140) downloaded fully through the same path: ",
  "141 MB with all 92,542 frames readable. The fix: force DASH-only selection ",
  $("code", { textContent: "bv+ba" }),
  " and drop the ",
  $("code", { textContent: "/b" }),
  " combined fallback — then verify real frames with ",
  $("code", { textContent: "ffprobe -count_frames" }),
  " before trusting the file.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
