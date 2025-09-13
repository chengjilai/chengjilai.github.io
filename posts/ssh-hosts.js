"use strict";

const title = document.createElement("title");
title.textContent = "SSH, keys, and hostnames across machines";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "SSH, keys, and hostnames across machines" }));

document.body.appendChild($("p", {}, [
  "Three systems on two laptops, one jump host, and a network that renames ",
  "your computers. All of it declared, none of it hand-edited.",
]));

// 1. Topology and keys
document.body.appendChild($("h2", { textContent: "1. Topology and keys" }));
document.body.appendChild($("p", {}, [
  "One USB disk runs NixOS and boots both laptops; one of the laptops also ",
  "boots Guix from its NVMe. Client isolation blocks laptop-to-laptop ",
  "traffic, so SSH goes through a campus jump host via ",
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
document.body.appendChild($("p", {}, [
  "Two systems sharing one hostname collide in known_hosts, where the host ",
  "key is stored per name ",
  $("a", { href: "https://man.openbsd.org/sshd", textContent: "(sshd(8))" }),
  ", and in mDNS. Distinct nickname hostnames avoid both.",
]));

// 2. The hostname keeps reverting (DHCP option 12)
document.body.appendChild($("h2", { textContent: "2. The hostname keeps reverting (DHCP option 12)" }));
document.body.appendChild($("p", {}, [
  "NetworkManager overrides the hostname from DHCP (option 12); the declared ",
  "name keeps reverting. The fix is a one-line config:",
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
  " (NixOS: restart the service). Restarting NetworkManager drops Wi-Fi, ",
  "which drops the SSH session you are using. Plan for it. On Guix the ",
  "declared name is set by a one-shot shepherd service ",
  $("code", { textContent: "host-name" }),
  " (",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/services/base.scm", textContent: "gnu/services/base.scm" }),
  "). The recurring revert has a simpler cause: a DHCP client sets the ",
  "hostname from option 12: NetworkManager by default ",
  "(hostname-mode=dhcp), dhcpcd via its hostname hook unless started with ",
  $("code", { textContent: "--nohook hostname" }),
  ". Verify the live name with ",
  $("code", { textContent: "hostname" }),
  ", not by reading config.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
