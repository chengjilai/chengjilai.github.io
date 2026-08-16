"use strict";

const title = document.createElement("title");
title.textContent = "YouTube timedtext 429 escalates with retries";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "YouTube timedtext 429 escalates with retries" }));

document.body.appendChild($("h2", { textContent: "1. The block page" }));
document.body.appendChild($("p", {}, [
  "yt-dlp fetches subtitles from ",
  $("code", { textContent: "youtube.com/api/timedtext" }),
  ". A 429 on that endpoint returns Google's \"your computer or network may be sending automated ",
  "queries\" HTML page.",
]));

document.body.appendChild($("h2", { textContent: "2. The escalation" }));
document.body.appendChild($("p", {}, [
  "The limit starts per-video: one video's timedtext 429s while other videos fetch fine through ",
  "the same egress. Repeated retries escalate the block from per-video to per-IP. After the ",
  "escalation, every timedtext request 429s: other videos, plain curl, and every subtitle ",
  "format (vtt, srv3, json3, ttml). No cookie or player-client change helps; the block keys ",
  "on the egress IP, not the account or the video. Waiting on the same IP does not clear it: ",
  "the block persisted through 25+ minutes of spaced retries.",
]));

document.body.appendChild($("h2", { textContent: "3. Rotate the egress" }));
document.body.appendChild($("p", {}, [
  "Reconnecting a Cloudflare WARP tunnel rotates the egress IP: ",
  $("code", { textContent: "warp-cli --accept-tos disconnect && warp-cli --accept-tos connect" }),
  ". The next timedtext fetch succeeds immediately.",
]));
document.body.appendChild($("p", {}, [
  "The rule: retry a timedtext 429 at most twice, then rotate the egress. Hammering retries ",
  "makes the block worse.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
