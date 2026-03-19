"use strict";

const title = document.createElement("title");
title.textContent = "Rotating credentials in a systemd credential store";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Rotating credentials in a systemd credential store" }));

document.body.appendChild($("p", {}, [
  "Static secrets need provisioning once. Tokens that expire or get \n",
  "revoked need a refresh loop: a timer re-exports the current bytes from \n",
  "each live source, diffs against the provisioned copy, and re-encrypts \n",
  "the stored credential only when the bytes changed. A registry drives \n",
  "the loop, so adding a token is a one-line JSON entry.",
]));

// 1. The refresh loop
document.body.appendChild($("h2", { textContent: "1. The refresh loop" }));
document.body.appendChild($("p", {}, [
  "Each rotating token gets one registry entry: the source (a CLI session \n",
  "file, a command that prints the token, or a derivation from another \n",
  "credential), the format, the expiry field, and optionally a refresher \n",
  "command and an endpoint check. The timer runs every entry through the \n",
  "same loop: export to bytes, diff against the provisioned copy, encrypt \n",
  "only when they differ. Identical sessions are untouched, so a re-login \n",
  "is the only thing that re-encrypts.",
]));
document.body.appendChild($("p", {}, [
  "A bare login bootstraps the credential: the first pass exports the new \n",
  "bytes, sees the live file is missing, and provisions. Expiry warnings \n",
  "fire before the deadline, and also when the token is already dead. A \n",
  "stale file can hold an expired token the CLI never refreshed.",
]));

// 2. warp-cli has no registration renew
document.body.appendChild($("h2", { textContent: "2. warp-cli has no registration renew" }));
document.body.appendChild($("p", {}, [
  "The Cloudflare WARP CLI (cloudflare-warp 2026.3.846.0) has no renew \n",
  "subcommand. The registration verbs are show, new, delete, organization, \n",
  "devices, license. A stale anonymous device registration recovers with \n",
  "delete then new, rate-limited through a cooldown marker so a blocked \n",
  "endpoint does not churn devices on every check.",
]));

// 3. Tilde expansion in a root service
document.body.appendChild($("h2", { textContent: "3. Tilde expansion in a root service" }));
document.body.appendChild($("p", {}, [
  "A root systemd service has HOME=/root. Three separate code paths then \n",
  "silently miss the user's files: a shell script resolving ~ uses the \n",
  "wrong home, subprocess argv has no tilde expansion at all, and \n",
  "os.path.expanduser reads the process HOME. The fix is to thread the \n",
  "real user home explicitly: pass it as argv, put HOME into every \n",
  "subprocess environment, and expand ~ against that value, never the \n",
  "process environment.",
]));

// 4. Drop expired cookies, don't fake them
document.body.appendChild($("h2", { textContent: "4. Drop expired cookies, don't fake them" }));
document.body.appendChild($("p", {}, [
  "A cookie exporter that rewrites expired persistent cookies to \n",
  "expires=0 fakes them as session cookies. That erases the expiry signal \n",
  "from the exported file, so the expiry warning never fires, and a \n",
  "credential derived from the export can serve a dead SESSDATA. Drop \n",
  "expired persistent cookies instead; only genuine session cookies carry \n",
  "expires=0.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
