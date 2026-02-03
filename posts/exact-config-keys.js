"use strict";

const title = document.createElement("title");
title.textContent = "Exact config key names and silent ignores";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Exact config key names and silent ignores" }));

document.body.appendChild($("p", {}, [
  "Goal: turn off LLMNR and mDNS advertising on a campus network. One line \n",
  "worked, the other vanished, with no error anywhere. Key names are exact in \n",
  "case and spelling, and config parsers that ignore what they don't know \n",
  "turn typos into silent no-ops.",
]));

// 1. The setting that half-applied
document.body.appendChild($("h2", { textContent: "1. The setting that half-applied" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "services.resolved.settings.Resolve = {\n" +
    "  LLMNR = false;\n" +
    "  mDNS = false;\n" +
    "};", "nix") }),
]));
document.body.appendChild($("p", {}, [
  "After the rebuild and a manual restart of systemd-resolved:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "resolvectl status | grep Protocols\n" +
    "Protocols: -LLMNR +mDNS -DNSOverTLS DNSSEC=no/unsupported", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "LLMNR flipped off; mDNS stayed on. The asymmetry is the tell.",
]));

// 2. Why
document.body.appendChild($("h2", { textContent: "2. Why" }));
document.body.appendChild($("p", {}, [
  "settings.Resolve writes keys into resolved.conf verbatim: LLMNR=false, \n",
  "mDNS=false. LLMNR is a real option name; mDNS is not. resolved.conf's \n",
  "option is MulticastDNS. An unknown key in resolved.conf is dropped by the \n",
  "parser. So one line worked, the other vanished.",
]));

// 3. The fix and the rules
document.body.appendChild($("h2", { textContent: "3. The fix and the rules" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "services.resolved.settings.Resolve = {\n" +
    "  LLMNR = false;\n" +
    "  MulticastDNS = false;   # the real name - mDNS is ignored silently\n" +
    "};", "nix") }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Key names are exact; check the man page (man resolved.conf) or the \n",
    "source, not your guess",
  ]),
  $("li", {}, [
    "Unknown keys are ignored without a warning. When a setting \"doesn't \n",
    "apply\", read the GENERATED file (sudo cat /etc/systemd/resolved.conf) \n",
    "and diff it against what you expected",
  ]),
  $("li", {}, [
    "Verify with the daemon's own view, before and after: resolvectl status; \n",
    "a change that flips one field but not the other is a name typo, not a \n",
    "race",
  ]),
  $("li", {}, [
    "Daemons with restartIfChanged = false (set here to protect live \n",
    "sessions, the wifi, the SSH you are using) are NOT restarted by a \n",
    "switch; restart them yourself after a config change, or your \"fix\" \n",
    "never loads",
  ]),
]));
document.body.appendChild($("p", {}, [
  "In the config here, restartIfChanged = false on the resolved and networkd ",
  "services protects live sessions, and wait-online stays enabled; see the ",
  "systemd builtins post.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
