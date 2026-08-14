"use strict";


const title = document.createElement("title");
title.textContent = "Bilibili video uploads accept a browser session";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Bilibili video uploads accept a browser session" }));

// 1. Upload tools need an app token; the web page does not
document.body.appendChild($("h2", { textContent: "1. Upload tools need an app token; the web page does not" }));
document.body.appendChild($("p", {}, [
  "bilibili has two login classes. Web login issues SESSDATA, a cookie. App login issues access_key, a token. ",
  "The video-submit endpoint x/vu/client/add rejects cookies with -101; upload tools (",
  $("a", { href: "https://github.com/biliup/biliup-rs", textContent: "biliup-rs" }),
  " and others) therefore all obtain an access_key.",
]));
document.body.appendChild($("p", {}, [
  "The web upload form is a separate micro-app loaded in an iframe (",
  $("a", { href: "https://member.bilibili.com/york/videoup", textContent: "member.bilibili.com/york/videoup" }),
  "). Its submit endpoint is x/vu/web/add/v3.",
]));

// 2. The web endpoint takes cookies, csrf and a wbi signature
document.body.appendChild($("h2", { textContent: "2. The web endpoint takes cookies, csrf and a wbi signature" }));
document.body.appendChild($("p", {}, [
  "x/vu/web/add/v3 accepts the browser session: SESSDATA and bili_jct (the csrf cookie) plus wbi-signed query ",
  "params (web_location=333.1024, t=Date.now(), csrf, wts, w_rid). The same cookies against x/vu/client/add ",
  "return -101.",
]));
document.body.appendChild($("p", {}, [
  "The wbi signature: the nav API (x/web-interface/nav) returns wbi_img.img_url and sub_url; the filename of ",
  "each is a 32-character key. mixinKeyEncTab permutes the 64-character concatenation and takes 32 characters. ",
  "w_rid = md5(sorted urlencoded params + wts + mixin key).",
]));

// 3. File staging is session-authenticated
document.body.appendChild($("h2", { textContent: "3. File staging is session-authenticated" }));
document.body.appendChild($("p", {}, [
  "The file upload to bilibili's upos storage: preupload?r=probe returns CDN lines; ",
  "preupload?{line.query}&r=upos&profile=ugcupos/bup&name=...&size=... returns upos_uri, auth, biz_id, ",
  "chunk_size and endpoint. The preupload needs a session cookie AND current params: the ",
  "deprecated version/build shape (2.11.0/2110000) gets a generic 403 page, and the cookie ",
  "chain (SESSDATA + bili_ticket) must be fresh (see the 2026-08-15 post).",
]));
document.body.appendChild($("p", {}, [
  "POST {endpoint}/{path}?uploads returns upload_id. Each chunk is a PUT with uploadId, chunks, total, chunk, ",
  "size, partNumber, start and end params, body the chunk bytes and header X-Upos-Auth. A final POST with ",
  "{\"parts\":[{partNumber,eTag}]} closes the upload. The submit references the staged file by its upos filename.",
]));

// 4. The app token renews headlessly
document.body.appendChild($("h2", { textContent: "4. The app token renews headlessly" }));
document.body.appendChild($("p", {}, [
  "The app token comes from the tv-login QR flow: passport-tv-login/qrcode/auth_code and qrcode/poll, both ",
  "signed md5(urlencoded params + appsec) with the BiliTV appkey. The poll returns access_key and ",
  "refresh_token; oauth2/refresh_token rotates both, so the key renews without a rescan.",
]));

// 5. Edits need the original part filename
document.body.appendChild($("h2", { textContent: "5. Edits need the original part filename" }));
document.body.appendChild($("p", {}, [
  "x/vu/web/edit takes the full Studio JSON (copyright, source, tid, title, desc, tag, videos). The videos ",
  "list must carry cid and the ORIGINAL upos filename, not the bvid; the filename is exposed by ",
  "/x/vupre/web/archive/view?aid=. A title over 80 characters fails with 21103.",
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
