"use strict";


const title = document.createElement("title");
title.textContent = "Event-driven VPN reconnect with wpa_cli";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Event-driven VPN reconnect with wpa_cli" }));

document.body.appendChild($("p", {}, [
  "strongSwan's ",
  $("code", { textContent: "auto = start" }),
  " initiates once at daemon start. An SA that dies on a wifi ",
  "switch is never re-initiated: three hours of working internet with ",
  "zero IKE attempts. The designed fix is the wpa_supplicant event hook.",
]));

// 1. Making the hook available
document.body.appendChild($("h2", { textContent: "1. Making the hook available" }));
document.body.appendChild($("p", {}, [
  "NixOS's ",
  $("code", { textContent: "networking.wireless.userControlled = true" }),
  ", the documented option for wpa_cli, makes wpa_supplicant create its ",
  "control socket at ",
  $("code", { textContent: "/run/wpa_supplicant/control" }),
  ". The service runs in a chroot (",
  $("code", { textContent: "RootDirectory=/run/wpa_supplicant" }),
  "), but that does not block the socket: the module binds the runtime ",
  "dir into the chroot for this purpose, and wpa_supplicant ",
  "creates the control directory itself (",
  $("code", { textContent: "mkdir S_IRWXU|S_IRWXG" }),
  ", EEXIST is fine).",
]));

// 2. The action-script contract
document.body.appendChild($("h2", { textContent: "2. The action-script contract" }));
document.body.appendChild($("p", {}, [
  "A ",
  $("code", { textContent: "wpa_cli -a <script>" }),
  " service runs the script on every wpa event, with ",
  $("code", { textContent: "$1" }),
  " = interface name and ",
  $("code", { textContent: "$2" }),
  " = event (wpa_cli.c builds ",
  $("code", { textContent: "\"%s %s\"" }),
  " of ifname and the event name). Checking ",
  $("code", { textContent: "$1" }),
  " for CONNECTED never matches: the interface name is ",
  $("code", { textContent: "$1" }),
  ".",
]));

// 3. The event arrives before DNS
document.body.appendChild($("h2", { textContent: "3. The event arrives before DNS" }));
document.body.appendChild($("p", {}, [
  "The CONNECTED event fires before DHCP and DNS are up. The first ",
  "initiate dies with ",
  $("code", { textContent: "\"unable to resolve the gateway, initiate aborted\"" }),
  ". The action script retries every 3 seconds until the name resolves.",
]));

// 4. Acceptance
document.body.appendChild($("h2", { textContent: "4. Acceptance" }));
document.body.appendChild($("p", {}, [
  "Kill the SA, bounce the wifi, and the tunnel re-establishes on its ",
  "own: ",
  $("code", { textContent: "ipsec down <conn>" }),
  ", then ",
  $("code", { textContent: "wpa_cli disconnect && wpa_cli reconnect" }),
  ", ESTABLISHED 34 seconds later with no manual command.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));