"use strict";

const title = document.createElement("title");
title.textContent = "NixOS debugging essentials";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "NixOS debugging essentials" }));

document.body.appendChild($("p", {}, [
  "The flake layout, what switch actually does, and how the machine gets its ",
  "name. All of it is declared, none of it is remembered. The flake lives at ",
  $("a", { href: "https://github.com/chengjilai/nixos", textContent: "github.com/chengjilai/nixos" }),
  ".",
]));

// 1. Flake structure
document.body.appendChild($("h2", { textContent: "1. Flake structure" }));
document.body.appendChild($("p", {}, [
  "One ",
  $("code", { textContent: "nixosConfiguration" }),
  " per ",
  $("code", { textContent: "machines/<name>/default.nix" }),
  ", auto-discovered - adding a machine means dropping a directory, no ",
  "flake.nix edit:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight("machineModule = import (./machines + \"/${name}/default.nix\");", "nix") }),
]));
document.body.appendChild($("p", {}, [
  "Shared, machine-agnostic modules live in ",
  $("code", { textContent: "modules/" }),
  "; a machine adds its own hardware bits. Store paths and boot entries embed ",
  "the hostname and ",
  $("code", { textContent: "system.nixos.label" }),
  ".",
]));

// 2. Switch semantics
document.body.appendChild($("h2", { textContent: "2. Switch semantics" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "nixos-rebuild switch    # activate now: /etc, hostname, services\n" +
    "nixos-rebuild boot      # set boot default; activate at next boot\n" +
    "readlink /run/current-system   # the live generation", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "switch activates the new userspace now; a kernel change only takes effect ",
  "at the next boot (" ,
  $("code", { textContent: "uname -r" }),
  " stays old). Activation runs synchronously, and ",
  $("code", { textContent: "readlink /run/current-system" }),
  " shows the live generation. Verify what actually runs (" ,
  $("code", { textContent: "ps" }),
  " start time) against config changes - a stale instance explains \"my ",
  "change did nothing\".",
]));

// 3. Boot-menu names
document.body.appendChild($("h2", { textContent: "3. Boot-menu names" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "system.nixos.label = \"aturing\";           # version line: \"NixOS 26.11 (Zokor) aturing\"\n" +
    "nixos-rebuild switch --flake .#aturing -p aturing   # menu title: \"NixOS [aturing]\"", "nix") }),
]));
document.body.appendChild($("p", {}, [
  "Both are first-class NixOS features. The label is set in ",
  $("code", { textContent: "machines/aturing/default.nix" }),
  " (verified on this machine); the ",
  $("code", { textContent: "-p" }),
  " profile name becomes the menu title - the live store path is ",
  $("code", { textContent: "nixos-system-aturing-aturing" }),
  ".",
]));

// 4. SSH client config, the NixOS way
document.body.appendChild($("h2", { textContent: "4. SSH client config, the NixOS way" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "programs.ssh.extraConfig = ''\n" +
    "  Host lab\n" +
    "    HostName 202.120.54.157\n" +
    "    User sjtu\n" +
    "    Port 11117\n" +
    "\n" +
    "  Host aturing\n" +
    "    HostName 10.180.150.58\n" +
    "    User chengjilai\n" +
    "    ProxyJump lab\n" +
    "'';", "nix") }),
]));
document.body.appendChild($("p", {}, [
  "Writes a system-wide client config (" ,
  $("code", { textContent: "/etc/ssh/ssh_config.d/" }),
  ") for all users - no " ,
  $("code", { textContent: "~/.ssh/config" }),
  " anywhere (verified: none exists on this machine). Hosts can include ",
  $("code", { textContent: "ProxyJump" }),
  " to a hub host when client isolation blocks laptop-to-laptop traffic.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
