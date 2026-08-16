"use strict";

const title = document.createElement("title");
title.textContent = "Nix store epoch mtimes defeat mtime-based change detection";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Nix store epoch mtimes defeat mtime-based change detection" }));

document.body.appendChild($("h2", { textContent: "1. The deployment shape" }));
document.body.appendChild($("p", {}, [
  "NixOS deploys a config file with ",
  $("code", { textContent: "environment.etc" }),
  " as a symlink chain into the Nix store. ",
  "A switch replaces the target with a new store path whose name embeds the content hash. ",
  "The file is never edited in place.",
]));

document.body.appendChild($("h2", { textContent: "2. The mtime trap" }));
document.body.appendChild($("p", {}, [
  "A service that re-reads its config when the file's mtime changes works for in-place edits. ",
  "Nix normalizes every store file's mtime to 1970-01-01 00:00:01 for reproducible builds. ",
  "A switch's new file carries the same mtime as the old one. ",
  "The reload never fires; the running process serves the pre-switch config.",
]));

document.body.appendChild($("h2", { textContent: "3. The failure" }));
document.body.appendChild($("p", {}, [
  "gitlab.com and gitlab.io were added to the routing policy and the system was switched. ",
  "The running proxy kept the old policy and routed gitlab direct. ",
  "The local resolver answered about.gitlab.com with a sinkhole IP (69.30.25.21); direct TCP to it blackholes at 10 s. ",
  "The browser reported ERR_TUNNEL_CONNECTION_FAILED.",
]));

document.body.appendChild($("h2", { textContent: "4. The diagnosis" }));
document.body.appendChild($("p", {}, [
  "A fresh instance of the same script on another port served about.gitlab.com in 0.47 s through the tunnel while the running process timed out. ",
  $("code", { textContent: "stat" }),
  " on the deployed file shows the epoch mtime. ",
  "The code was correct; the process state was stale.",
]));

document.body.appendChild($("h2", { textContent: "5. The fix" }));
document.body.appendChild($("p", {}, [
  "Key the change cache on the symlink target instead of the mtime:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(`real = os.path.realpath(CONFIG_PATH)
st = os.stat(CONFIG_PATH)
if real == _policy_real and st.st_mtime == _policy_mtime:
    return  # unchanged`, "python") }),
]));
document.body.appendChild($("p", {}, [
  "The store path embeds the content hash, so a target change is a content change. ",
  "The mtime check stays as a secondary for in-place edits. ",
  "A regression test simulates a switch: two policy files with identical epoch mtimes, retarget the symlink, assert the new policy loads. ",
  "It fails on the mtime-only code.",
]));

document.body.appendChild($("h2", { textContent: "6. The DNS half of the story" }));
document.body.appendChild($("p", {}, [
  "The SOCKS server resolved the hostname through the poisoned local resolver. ",
  "The DoH-in-tunnel answer held the real A record. ",
  "Handing the raw IP to the SOCKS server returned 200 in 0.2 s.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
