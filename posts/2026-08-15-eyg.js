"use strict";

const title = document.createElement("title");
title.textContent = "EYG: a typed functional language for makers";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "EYG: a typed functional language for makers" }));

document.body.appendChild($("h2", { textContent: "1. The language" }));
document.body.appendChild($("p", {}, [
  "EYG (Eat Your Greens) is a statically typed functional scripting language by Peter Saxton (CrowdHailer, Gleam contributor). It is implemented in Gleam, Apache-2.0, at ",
  $("a", { href: "https://github.com/CrowdHailer/eyg-lang", textContent: "github.com/CrowdHailer/eyg-lang" }),
  "; the site, browser editor, and package hub live at ",
  $("a", { href: "https://eyg.run", textContent: "eyg.run" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "Design: sound type inference with types never required up front; structural typing; effect typing (side effects appear in the inferred type, so a pure eval rejects perform Print(...)); hashed inline dependencies (a dependency is identified by the content hash of its module); sandboxed by default; closure serialization; a minimal AST with a stable JSON IR, with spec/ in the repo as the evaluator test suite.",
]));
document.body.appendChild($("p", {}, [
  "Target users are makers: glue scripts, personal dashboards, automations. The pitch removes category-2 problems (running the computer: PATH, /var/tmp, cloud credentials) so makers only describe logic. Excel macros are the stated model. The design blog post is \"A programming language for humans\" (2026-06-08, crowdhailer.me); there is a ",
  $("a", { href: "https://codebeameurope.com/archives/berlin_2025/participants/peter-saxton/", textContent: "Code BEAM Europe 2025 talk" }),
  " (\"Rapidly Building With Gleam\").",
]));

document.body.appendChild($("h2", { textContent: "2. The CLI model" }));
document.body.appendChild($("p", {}, [
  "A script file is a record with a ",
  $("code", { textContent: "script: (List(String)) -> Int" }),
  " field; the returned Int is the exit code. Subcommands: script (runs effects), run (any expression), eval (pure; prints the value), check (type-checks a project), and a bare ",
  $("code", { textContent: "eyg" }),
  " shell/REPL.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "eyg eval -c '!int_add(1, 1)'   # -> 2", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "EYG_ORIGIN selects the hub remote. Shared scripts are referenced by content hash (",
  $("code", { textContent: "#baguqee..." }),
  ") or @release.",
]));

document.body.appendChild($("h2", { textContent: "3. Not in nixpkgs" }));
document.body.appendChild($("p", {}, [
  "nix search nixpkgs eyg has no result; regex hits are substring false positives (eyg inside \"keygen\" and similar). CLI releases ship per-platform single binaries (eyg-linux-x64 and siblings) with SHA256SUMS under tag gleam_cli-v0.0.3. Building from source needs Gleam 1.7 or newer plus Bun.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
