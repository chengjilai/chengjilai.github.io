"use strict";

const title = document.createElement("title");
title.textContent = "dotnet: no cargo-style toolchain self-satisfaction";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "dotnet: no cargo-style toolchain self-satisfaction" }));

document.body.appendChild($("h2", { textContent: "1. Go downloads its toolchain; dotnet does not" }));
document.body.appendChild($("p", {}, [
  "Go's ",
  $("code", { textContent: "GOTOOLCHAIN=auto" }),
  " downloads the go.mod-declared toolchain on demand (",
  $("a", { href: "https://go.dev/doc/toolchain", textContent: "go.dev/doc/toolchain" }),
  "). dotnet's ",
  $("code", { textContent: "global.json" }),
  " pins the SDK version but only selects among installed SDKs; a missing version fails with \"A compatible .NET SDK was not found\" and nothing downloads (",
  $("a", { href: "https://learn.microsoft.com/en-us/dotnet/core/tools/global-json", textContent: "global.json overview" }),
  ").",
]));

document.body.appendChild($("h2", { textContent: "2. The requests are old and open" }));
document.body.appendChild($("p", {}, [
  $("a", { href: "https://github.com/dotnet/sdk/issues/2334", textContent: "dotnet/sdk#2334" }),
  " (2018): ",
  $("code", { textContent: "dotnet --version" }),
  " fails when global.json pins a newer SDK than the host has. ",
  $("a", { href: "https://github.com/dotnet/sdk/issues/10311", textContent: "#10311" }),
  " (2019, still open): \"Allow dotnet commands to bypass the global.json version check\". Its body: \"We can't download the tool that would fix the SDK version conflict since the downloader already requires the correct SDK.\" ",
  $("a", { href: "https://github.com/dotnet/sdk/issues/4093", textContent: "#4093" }),
  " (2019, still open): \"[proposal] I think that dotnet sdk need a rustup-like tool\". ",
  $("a", { href: "https://github.com/dotnet/sdk/issues/26255", textContent: "#26255" }),
  " (2022): \"Add download link for specific SDK version\". ",
  $("a", { href: "https://github.com/dotnet/sdk/issues/51993", textContent: "#51993" }),
  " (2025-12): a GitHub Action runner lacked a pinned 9.0.306.",
]));

document.body.appendChild($("h2", { textContent: "3. .NET 10 added paths, not downloads" }));
document.body.appendChild($("p", {}, [
  "Since the .NET 10 SDK, global.json accepts ",
  $("code", { textContent: "sdk.paths" }),
  ": search repo-local SDK directories (a ",
  $("code", { textContent: ".dotnet" }),
  " folder in the repository, ",
  $("code", { textContent: "$host$" }),
  " for the running dotnet) before the default install. ",
  $("code", { textContent: "sdk.errorMessage" }),
  " replaces the missing-SDK error with a custom hint. Both are selection only; installation stays a manual step.",
]));

document.body.appendChild($("h2", { textContent: "4. dotnetup is the planned rustup" }));
document.body.appendChild($("p", {}, [
  "dotnetup (dnUp) is the rustup-style SDK and runtime installer being built in dotnet/sdk (label Area-dotnetup, under end-to-end testing as of 2026-08). Design docs live in dotnet/designs on the ",
  $("a", { href: "https://github.com/dotnet/designs/tree/dnvm-e2e-experience", textContent: "dnvm-e2e-experience branch" }),
  ": ",
  $("code", { textContent: "dnup install" }),
  " reads global.json, installs into a user-scoped DOTNET_HOME, no admin installs. The doc's endgame: \"add the CLI to dotnet itself\". It is not shipped in any SDK as of 11.0.100-preview.6 (2026-08).",
]));

document.body.appendChild($("h2", { textContent: "5. What dotnet does satisfy" }));
document.body.appendChild($("p", {}, [
  "NuGet restores library dependencies from a lockfile. ",
  $("code", { textContent: "dotnet publish --self-contained" }),
  " and PublishAot pull the runtime itself as NuGet runtime packs. The Elixir ecosystem covers the toolchain gap with mise: a ",
  $("code", { textContent: ".mise.toml" }),
  " declares erlang and elixir versions, and mise's shims install a missing version on first use (",
  $("a", { href: "https://mise.jdx.dev/dev-tools/", textContent: "mise dev tools" }),
  ").",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
