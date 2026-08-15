"use strict";

const title = document.createElement("title");
title.textContent = "buildDotnetModule: JSON lockfile and the silent AOT skip";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "buildDotnetModule: JSON lockfile and the silent AOT skip" }));

document.body.appendChild($("h2", { textContent: "1. The lockfile is JSON" }));
document.body.appendChild($("p", {}, [
  "nixpkgs ",
  $("code", { textContent: "buildDotnetModule" }),
  " parses ",
  $("code", { textContent: "nugetDeps" }),
  " by filename suffix: a ",
  $("code", { textContent: ".nix" }),
  " path is callPackage'd as Nix code, anything else is ",
  $("code", { textContent: "lib.importJSON" }),
  " (",
  $("a", { href: "https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/dotnet/add-nuget-deps/default.nix", textContent: "add-nuget-deps/default.nix" }),
  "). The fetch-deps script writes JSON, so the file must be named ",
  $("code", { textContent: "nuget-deps.json" }),
  "; a JSON file named ",
  $("code", { textContent: "*.nix" }),
  " fails eval at the first entry.",
]));

document.body.appendChild($("h2", { textContent: "2. The fetch-deps invocation" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "nix run .#pkg.fetch-deps" }),
  " fails: the passthru is a writeShellScript with no bin/ directory. The working form:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "touch nuget-deps.json\n" +
    "nix build .#pkg.fetch-deps\n" +
    "./result nuget-deps.json", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "The script's first argument is the output path, and the file must already exist (the script resolves it with ",
  $("code", { textContent: "realpath" }),
  ").",
]));

document.body.appendChild($("h2", { textContent: "3. The target framework must match the SDK's runtime" }));
document.body.appendChild($("p", {}, [
  "The default ",
  $("code", { textContent: "dotnet-runtime" }),
  " is the SDK's bundled runtime. A net10.0 app built with ",
  $("code", { textContent: "dotnet-sdk_11" }),
  " runs against the 11 preview runtime and fails: \"You must install or update .NET to run this application\" (framework 10.0.0 not found, 11.0.0 found). Fix: target net11.0, or pass ",
  $("code", { textContent: "dotnet-runtime = pkgs.dotnet-runtime_10" }),
  ".",
]));

document.body.appendChild($("h2", { textContent: "4. AOT is silently skipped without all three flags" }));
document.body.appendChild($("p", {}, [
  "The hook restores in configurePhase, builds with ",
  $("code", { textContent: "--no-restore" }),
  ", and publishes with ",
  $("code", { textContent: "--no-restore --no-build" }),
  ". The AOT ILCompiler package is resolved at restore time, so a publish that skipped restore cannot compile AOT. dotnet falls back to a regular self-contained publish with no error and no warning. ",
  $("code", { textContent: "-p:PublishAot=true" }),
  " must reach restore, build, and publish:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "selfContainedBuild = true;\n" +
    "dotnetRestoreFlags = [ \"-p:PublishAot=true\" ];\n" +
    "dotnetBuildFlags   = [ \"-p:PublishAot=true\" ];\n" +
    "dotnetInstallFlags = [ \"-p:PublishAot=true\" ];\n" +
    "nativeBuildInputs  = [ pkgs.clang pkgs.zlib ];", "nix") }),
]));
document.body.appendChild($("p", {}, [
  "Reproduced outside nixpkgs: ",
  $("code", { textContent: "dotnet build -p:PublishAot=true" }),
  " followed by ",
  $("code", { textContent: "dotnet publish --no-build -p:PublishAot=true" }),
  " prints \"Generating native code\"; build or restore without the flag does not. Earlier AOT builds in nixpkgs failed with ",
  $("code", { textContent: "jitinterface_x64.so: cannot open shared object file" }),
  " (",
  $("a", { href: "https://github.com/NixOS/nixpkgs/issues/280923", textContent: "nixpkgs#280923" }),
  "), fixed by an rpath for icu/zlib/openssl in ",
  $("a", { href: "https://github.com/NixOS/nixpkgs/pull/309409", textContent: "nixpkgs#309409" }),
  ".",
]));

document.body.appendChild($("h2", { textContent: "5. Output shape and F#" }));
document.body.appendChild($("p", {}, [
  "The native binary lands in ",
  $("code", { textContent: "result/lib/<pname>/<exe>" }),
  " (a hello-world console app is ~1.5 MB); ",
  $("code", { textContent: "result/bin/<exe>" }),
  " is a bash wrapper. F# is identical: ",
  $("code", { textContent: "projectFile = \"*.fsproj\"" }),
  " with ordered ",
  $("code", { textContent: "<Compile Include>" }),
  " entries; FSharp.Core ships with the SDK, so restore succeeds without a lockfile entry; the IL3053 \"FSharp.Core produced AOT analysis warnings\" message is benign.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
