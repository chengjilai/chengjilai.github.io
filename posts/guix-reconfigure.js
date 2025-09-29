"use strict";

const title = document.createElement("title");
title.textContent = "guix system reconfigure: what it does and does not do";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "guix system reconfigure: what it does and does not do" }));

document.body.appendChild($("p", {}, [
  "guix system reconfigure is transactional but not a restart: it stages the ",
  "new system and starts what is missing. The manual says what it does not do, ",
  "plainly.",
]));

// 1. What reconfigure does
document.body.appendChild($("h2", { textContent: "1. What reconfigure does" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Builds the new system, creates a generation, runs the activation script ",
    "(users, /etc farm, setuid), then atomically re-points ",
    $("code", { textContent: "/run/current-system" }),
  ]),
  $("li", {}, [
    "Talks to Shepherd: loads new services, unloads obsolete ones, starts new ",
    "ones",
  ]),
]));

// 2. It does not restart running services
document.body.appendChild($("h2", { textContent: "2. It does not restart running services" }));
document.body.appendChild($("p", {}, [
  "The manual: \"it does not restart system services that were already ",
  "running\" (Getting Started with the System), and \"by default guix system ",
  "reconfigure only restarts services that are not currently running\" ",
  "(Unattended Upgrades). A changed service keeps its old definition until ",
  $("code", { textContent: "herd restart <svc>" }),
  ". Staged != applied - verify with ",
  $("code", { textContent: "ps" }),
  " and ",
  $("code", { textContent: "herd status" }),
  ".",
]));

// 3. Gotchas worth remembering
document.body.appendChild($("h2", { textContent: "3. Gotchas worth remembering" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("code", { textContent: "udev-rules-service" }),
    " accepts directories containing lib/udev/rules.d; a ",
    $("code", { textContent: "(plain-file ...)" }),
    " is silently dropped - use ",
    $("code", { textContent: "(udev-rule \"name.rules\" \"...\")" }),
  ]),
  $("li", {}, [
    $("code", { textContent: "console-font-service-type" }),
    " is already provided by %base-services on all ttys; a second instance ",
    "fails \"provided more than once\" - replace via modify-services",
  ]),
  $("li", {}, [
    "Nested /etc entries (e.g. ",
    $("code", { textContent: "ssh/ssh_config" }),
    ") cannot go through etc-service-type (activate-etc symlinks the top ",
    "level) - write them from an activation-service-type snippet",
  ]),
  $("li", {}, [
    "The interpreter package is ",
    $("code", { textContent: "python" }),
    ", not ",
    $("code", { textContent: "python3" }),
    " (specification->package \"python3\" fails)",
  ]),
  $("li", {}, [
    "guix pull must run as the same guix you reconfigure with; the pulled guix ",
    "lives at ~/.config/guix/current and PATH may not include it - call it by ",
    "absolute path",
  ]),
]));

// 4. Workflow notes
document.body.appendChild($("h2", { textContent: "4. Workflow notes" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Validate before reconfiguring: ",
    $("code", { textContent: "guix system build config.scm --dry-run" }),
    " catches paren errors and unknown packages fast",
  ]),
  $("li", {}, [
    "Count parens: ",
    $("code", { textContent: "tr -cd '()' < file | wc -c" }),
    "; a mismatch means a structural bug",
  ]),
  $("li", {}, [
    "Backward reconfigures warn; old generations stay bootable and ",
    $("code", { textContent: "guix system roll-back" }),
    " reverts",
  ]),
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
  " - manual: ",
  $("a", { href: "https://guix.gnu.org/manual/devel/en/html_node/Getting-Started-with-the-System.html", textContent: "Getting Started with the System" }),
  " - ",
  $("a", { href: "https://guix.gnu.org/manual/stable/en/html_node/Unattended-Upgrades.html", textContent: "Unattended Upgrades" }),
]));
