"use strict";

const title = document.createElement("title");
title.textContent = "Generations that lie: boot regressions hide under long uptime";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Generations that lie: boot regressions hide under long uptime" }));

document.body.appendChild($("h2", { textContent: "1. Forty-four broken generations, nobody noticed" }));
document.body.appendChild($("p", {}, [
  "A one-line change to a boot-time provisioning script broke wifi for 44 generations before ",
  "anyone noticed. The machine never rebooted. The running system is not the next generation: ",
  "a failure that only happens at boot ships silently while uptime accumulates.",
]));

document.body.appendChild($("h2", { textContent: "2. The boot path, not the live system" }));
document.body.appendChild($("p", {}, [
  "The regression removed one file from a copy loop; every later generation failed at boot ",
  "(a service could not set up its mount namespace) while the long-running system stayed fine. ",
  "After touching boot-time provisioning, verify the boot path, not just the live system: the ",
  "unit ordering and the file it produces.",
]));

document.body.appendChild($("h2", { textContent: "3. Make generations say which tree built them" }));
document.body.appendChild($("p", {}, [
  "Anonymous store paths made mapping a generation to a commit an archaeology session. Making ",
  "the system label carry the build's short revision means ",
  $("code", { textContent: "readlink /run/current-system" }),
  " and the boot entry name the exact tree that produced the running system.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
