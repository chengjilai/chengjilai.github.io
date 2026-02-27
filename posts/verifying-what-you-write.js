"use strict";

const title = document.createElement("title");
title.textContent = "Verifying what you write about software";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Verifying what you write about software" }));

document.body.appendChild($("p", {}, [
  "Before writing about a claim, check it against the source. Memory and \n",
  "\"everybody knows\" are wrong often enough to make this the default \n",
  "workflow. Each claim below was verified (or disproved) in one session.",
]));

// 1. Read the real source, not memory
document.body.appendChild($("h2", { textContent: "1. Read the real source, not memory" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Clone big repos cheaply: ",
    $("code", { textContent: "gh repo clone <o>/<r> -- --depth 1 --filter=blob:none" }),
    ". The emacs mirror is 1.6 GB with history, tiny with the blob filter",
  ]),
  $("li", {}, [
    "Single files: ",
    $("code", { textContent: "gh api repos/<o>/<r>/contents/<path> -H \"Accept: application/vnd.github.raw\"" }),
  ]),
  $("li", {}, [
    "Codeberg: ",
    $("code", { textContent: "git clone https://codeberg.org/<o>/<r>.git" }),
  ]),
  $("li", {}, [
    "Claims must appear VERBATIM: grep the clone for the exact quoted string \n",
    "(a kernel dev_err format, an ioctl macro, a comment)",
  ]),
]));

// 2. Version boundaries are guesses until bisected
document.body.appendChild($("h2", { textContent: "2. Version boundaries are guesses until bisected" }));
document.body.appendChild($("p", {}, [
  "A table claiming \"kernel >= 6.16 has ioctl X, older has Y\" was wrong: the \n",
  "header already contained the new ioctl at v5.10. Bisect tags on the \n",
  "contents path: ",
  $("code", { textContent: "?ref=v6.15" }),
  ".",
]));

// 3. Distro-package claims: check the tree
document.body.appendChild($("h2", { textContent: "3. Distro-package claims: check the tree" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "\"Guix's linux-firmware ships iwlwifi/i915/ibt but not intel/sof\" is \n",
    "false: there is no linux-firmware package in the guix tree at all (it \n",
    "comes from the nonguix channel). The substance (no intel/sof/ in the \n",
    "store) was then verified directly",
  ]),
  $("li", {}, [
    "\"Services show Replacement pending after reconfigure\": the string is \n",
    "not in the guix source; the manual says \"does not restart system \n",
    "services that were already running\"",
  ]),
]));

// 4. Issue numbers: verify before citing
document.body.appendChild($("h2", { textContent: "4. Issue numbers: verify before citing" }));
document.body.appendChild($("p", {}, [
  "\"Open PR #487 covered cursor styles\" turned out to be a kmscon/kmscon \n",
  "PR, not a guix PR. Check with ",
  $("code", { textContent: "gh api repos/<o>/<r>/issues/N" }),
  " or ",
  $("code", { textContent: "fj pr view" }),
  " (in a clone: bare id works).",
]));

// 5. Empirically test what is testable
document.body.appendChild($("h2", { textContent: "5. Empirically test what is testable" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "A Goertzel implementation was validated on a synthetic 50 Hz + 150 Hz \n",
    "signal; the peaks came out right",
  ]),
  $("li", {}, [
    "Shell gotchas reproduce: ${f#~/} tilde-expands the pattern (escape with \n",
    "\\~); pkill -f matches your own shell (bracket trick); piped stdin is \n",
    "consumed once",
  ]),
  $("li", {}, [
    "\"kmscon's default TERM is kmscon\" was contradicted by the source: \n",
    "if (!term) term = \"vt220\";",
  ]),
]));

// 6. Verify URLs before linking
document.body.appendChild($("h2", { textContent: "6. Verify URLs before linking" }));
document.body.appendChild($("p", {}, [
  "GitHub blobs: ",
  $("code", { textContent: "gh api .../contents/<p>" }),
  ". Other hosts (codeberg, debbugs, project sites): ",
  $("code", { textContent: "curl -sI -L" }),
  " and require 200.",
]));

// 7. Unverifiable: drop or annotate
document.body.appendChild($("h2", { textContent: "7. Unverifiable: drop or annotate" }));
document.body.appendChild($("p", {}, [
  "If a claim cannot be confirmed after a reasonable search, it does not go \n",
  "in. Annotate the rest with what was verified and when.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
