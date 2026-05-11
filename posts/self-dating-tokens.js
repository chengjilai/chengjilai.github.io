"use strict";

const title = document.createElement("title");
title.textContent = "Session cookies carry their own expiry";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Session cookies carry their own expiry" }));

document.body.appendChild($("p", {}, [
  "A bilibili login cookie encodes its own deadline. yt-dlp rewrites the \n",
  "cookie file you hand it. The two facts together shape how long a media \n",
  "playback setup stays alive without maintenance.",
]));

// 1. The cookie that dates itself
document.body.appendChild($("h2", { textContent: "1. The cookie that dates itself" }));
document.body.appendChild($("p", {}, [
  "The bilibili SESSDATA value is three comma-separated fields, URL-encoded: \n",
  "an 8-hex md5 prefix, a unix expiry timestamp, and a token. The server \n",
  "enforces the embedded timestamp, so the cookie is dead after it regardless \n",
  "of what the browser thinks. Two stored copies of the same account carried \n",
  "expiries two days apart. They were separate logins, and the browser \n",
  "database copy was the fresher one.",
]));

// 2. Extending a session needs the refresh token
document.body.appendChild($("h2", { textContent: "2. Extending a session needs the refresh token" }));
document.body.appendChild($("p", {}, [
  "Extending a web session requires the refresh_token, which is one-time-use \n",
  "and rotating: each refresh issues a new access token and a new refresh \n",
  "token, and the old refresh token dies (",
  $("a", { href: "https://github.com/pskdje/bilibili-API-collect/blob/main/docs/login/cookie_refresh.md", textContent: "bilibili-API-collect cookie_refresh.md" }),
  "). A login flow that captures only the cookie and drops the refresh token \n",
  "leaves the session stuck at its embedded deadline. One streaming plugin \n",
  "saved refresh_token as the empty string. douyin's session behaves the same \n",
  "way: the sessionid cookie expires in about two months, the longer-lived \n",
  "sid_guard and ttwid last about a year, and the fingerprint chain (ttwid, \n",
  "bd_ticket_guard, __ac_signature) is what the a_bogus signer relies on.",
]));

// 3. yt-dlp rewrites the cookie file
document.body.appendChild($("h2", { textContent: "3. yt-dlp rewrites the cookie file" }));
document.body.appendChild($("p", {}, [
  "yt-dlp writes back to the --cookies file when it exits: YoutubeDL.close \n",
  "calls cookiejar.save(), which opens the file for writing (",
  $("a", { href: "https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/cookies.py", textContent: "cookies.py" }),
  "). A read-only cookie file made extraction succeed and then fail with \n",
  "EACCES on the save. Hand yt-dlp a writable copy and keep the original \n",
  "read-only; the copy also keeps the canonical credential pristine.",
]));

// 4. No permanent web token
document.body.appendChild($("h2", { textContent: "4. No permanent web token" }));
document.body.appendChild($("p", {}, [
  "yt-dlp's douyin extractor refuses to run without cookies, even for \n",
  "public videos. \"Fresh cookies are needed\" is the error without them. \n",
  "A static non-expiring credential exists only on the developer platform \n",
  "(a key pair issued after a KYC registration), and it serves creator \n",
  "APIs, not playback. Web playback has no permanent token by design; the \n",
  "practical model is a long-lived session renewed by re-login.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
