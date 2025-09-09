"use strict";

const title = document.createElement("title");
title.textContent = "SSH, keys, and hostnames across machines";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "SSH, keys, and hostnames across machines" }));

document.body.appendChild($("p", {}, [
  "A few machines, one jump host, and a network that renames your computers ",
  "behind your back. All of it declared, none of it hand-edited.",
]));

// 1. Topology and keys
document.body.appendChild($("h2", { textContent: "1. Topology and keys" }));
document.body.appendChild($("p", {}, [
  "Two laptops (one NixOS, one Guix on the same disk) and a campus jump host. ",
  "Client isolation blocks laptop-to-laptop traffic, so SSH goes through the ",
  "jump host via ",
  $("code", { textContent: "ProxyJump" }),
  ". Generate ed25519 keys per machine, upload the pubkeys, and declare the ",
  "client config system-wide (no ",
  $("code", { textContent: "~/.ssh/config" }),
  "): NixOS ",
  $("code", { textContent: "programs.ssh.extraConfig" }),
  ", Guix an activation snippet writing ",
  $("code", { textContent: "/etc/ssh/ssh_config" }),
  ". First connection needs the host key: ",
  $("code", { textContent: "ssh-keyscan -p <port> <host> >> ~/.ssh/known_hosts" }),
  ".",
]));

// 2. The hostname keeps reverting (DHCP option 12)
document.body.appendChild($("h2", { textContent: "2. The hostname keeps reverting (DHCP option 12)" }));
document.body.appendChild($("p", {}, [
  "NetworkManager overrides the hostname from DHCP (option 12); the declared ",
  "name keeps reverting. The fix is a one-line config, verified in ",
  "modules/networking.nix:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "environment.etc.\"NetworkManager/conf.d/hostname.conf\".text = ''\n" +
    "  [main]\n" +
    "  hostname-mode=none\n" +
    "'';", "nix") }),
]));
document.body.appendChild($("p", {}, [
  "Then ",
  $("code", { textContent: "herd restart NetworkManager" }),
  " (NixOS: restart the service) - and note that restarting NetworkManager ",
  "drops Wi-Fi, which drops the SSH session you are using. Plan for it. On a ",
  "Guix box the hostname applies at boot; a machine booted before a rename ",
  "keeps the old name until the next boot (set it live with ",
  $("code", { textContent: "sudo hostname <name>" }),
  ").",
]));

// 3. Verify what is running
document.body.appendChild($("h2", { textContent: "3. Verify what is running" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "System-wide client config beats per-user dotfiles for reproducibility",
  ]),
  $("li", {}, [
    "Anything that restarts the network will cut your own SSH - plan for it",
  ]),
  $("li", {}, [
    "Verify the running kernel hostname with ",
    $("code", { textContent: "hostname" }),
    ", not by reading config",
  ]),
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
  " - ",
  $("a", { href: "https://github.com/chengjilai/nixos", textContent: "nixos" }),
]));
