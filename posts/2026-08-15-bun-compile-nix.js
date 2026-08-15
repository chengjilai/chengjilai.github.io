"use strict";


const title = document.createElement("title");
title.textContent = "bun --compile binaries in Nix: patch only the interpreter";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "bun --compile binaries in Nix: patch only the interpreter" }));

// 1. What bun --compile produces
document.body.appendChild($("h2", { textContent: "1. What bun --compile produces" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "bun build --compile" }),
  " packs the JS runtime and the bundle into one ELF. ",
  "EYG (",
  $("a", { href: "https://crowdhailer.me/2026-06-08/a-programming-language-for-humans", textContent: "Eat Your Greens" }),
  "), a statically typed functional scripting language by Peter Saxton, ships its CLI this way: ",
  $("code", { textContent: "gleam build" }),
  " compiles the interpreter to JS, then ",
  $("code", { textContent: "bun build build/dev/javascript/eyg_cli/eyg_cli.mjs --compile --footer=\"main();\" --outfile dist/eyg" }),
  " (" ,
  $("a", { href: "https://github.com/CrowdHailer/eyg-lang/blob/main/packages/gleam_cli/bin/compile", textContent: "bin/compile" }),
  "). Each release carries one asset per platform: ",
  $("code", { textContent: "eyg-linux-x64" }),
  ", ",
  $("code", { textContent: "eyg-linux-arm64" }),
  ", ",
  $("code", { textContent: "eyg-macos-x64" }),
  ", ",
  $("code", { textContent: "eyg-macos-arm64" }),
  ", ",
  $("code", { textContent: "eyg-windows-x64.exe" }),
  " (",
  $("a", { href: "https://github.com/CrowdHailer/eyg-lang/releases/tag/gleam_cli-v0.0.3", textContent: "gleam_cli-v0.0.3" }),
  ").",
]));

// 2. The failure modes
document.body.appendChild($("h2", { textContent: "2. The failure modes" }));
document.body.appendChild($("p", {}, [
  "The packed binary expects the dynamic linker of the distro it was built on. NixOS has no ",
  $("code", { textContent: "/lib64/ld-linux-x86-64.so.2" }),
  ", so the interpreter must be rewritten. Three approaches were tested; two fail:",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("code", { textContent: "autoPatchelfHook" }),
    " (shrink-rpath, adds a RUNPATH): ",
    $("code", { textContent: "SIGSEGV" }),
    " at startup.",
  ]),
  $("li", {}, [
    $("code", { textContent: "strip" }),
    ": the binary runs as plain ",
    $("code", { textContent: "bun" }),
    ". The sections holding the embedded bundle are removed with the symbols.",
  ]),
  $("li", {}, [
    $("code", { textContent: "patchelf --set-interpreter" }),
    ": works.",
  ]),
]));
document.body.appendChild($("p", {}, [
  "nixpkgs glibc's ",
  $("code", { textContent: "ld.so" }),
  " finds its own library directory by default, so no RUNPATH is needed. ",
  "The binary then runs on stock NixOS without a ",
  $("code", { textContent: "nix-ld" }),
  " shim.",
]));

// 3. The fix: interpreter only
document.body.appendChild($("h2", { textContent: "3. The fix: interpreter only" }));
document.body.appendChild($("p", {}, [
  "The derivation fetches the release asset and patches one thing:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "src = pkgs.fetchurl {\n" +
    "  url = \"https://github.com/CrowdHailer/eyg-lang/releases/download/\\\n" +
    "gleam_cli-v0.0.3/eyg-linux-x64\";\n" +
    "  sha256 = \"sha256-…\";\n" +
    "};\n" +
    "\n" +
    "pkgs.stdenv.mkDerivation {\n" +
    "  inherit src;\n" +
    "  nativeBuildInputs = [ pkgs.patchelf ];\n" +
    "  dontUnpack = true;\n" +
    "  dontBuild = true;\n" +
    "  dontStrip = true;    # strip destroys the embedded bundle\n" +
    "  dontPatchELF = true; # no shrink-rpath: RUNPATH segfaults the binary\n" +
    "  installPhase = ''\n" +
    "    install -Dm755 \"$src\" \"$out/bin/eyg\"\n" +
    "    patchelf --set-interpreter ${pkgs.stdenv.cc.libc}/lib64/ld-linux-x86-64.so.2 \\\n" +
    "      \"$out/bin/eyg\"\n" +
    "  '';\n" +
    "}", "nix") }),
]));

// 4. Verifying the fetch
document.body.appendChild($("h2", { textContent: "4. Verifying the fetch" }));
document.body.appendChild($("p", {}, [
  "The ",
  $("code", { textContent: "sha256" }),
  " in ",
  $("code", { textContent: "fetchurl" }),
  " must match the release's published ",
  $("code", { textContent: "SHA256SUMS" }),
  " byte-for-byte. The fetch is a fixed-output derivation: once the store has it, ",
  $("code", { textContent: "nix run --offline" }),
  " works without network. The patched, packaged result: ",
  $("code", { textContent: "eyg eval -c '!int_add(1, 1)'" }),
  " prints ",
  $("code", { textContent: "2" }),
  ".",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
