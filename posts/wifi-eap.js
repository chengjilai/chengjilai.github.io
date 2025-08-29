"use strict";

const title = document.createElement("title");
title.textContent = "What happens when a laptop joins a campus/enterprise Wi-Fi";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "What happens when a laptop joins a campus/enterprise Wi-Fi" }));

document.body.appendChild($("p", {}, [
  "A failure that looks like \"wifi is broken\" lives in one layer of a ",
  "four-layer stack: the driver owns the radio, wpa_supplicant scans and ",
  "runs EAP, systemd-networkd does DHCP, systemd-resolved does DNS. Two ",
  "wpa_supplicant defaults break the connection silently.",
]));

// 1. Layers, each its own program
document.body.appendChild($("h2", { textContent: "1. Layers, each its own program" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "journalctl -u wpa_supplicant -b   # association + EAP exchange\n" +
    "networkctl status wlo1            # DHCP / IP / online state\n" +
    "resolvectl status                 # DNS", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "Read the wpa_supplicant journal UNFILTERED; greps hide the sequence: ",
  "scan, associate, certificate exchange, \"TLS done, proceed to Phase 2\", ",
  "MSCHAPv2 challenge, response, verdict. Debug one layer at a time: ",
  "association, EAP, DHCP, DNS.",
]));

// 2. The login itself: EAP-PEAP
document.body.appendChild($("h2", { textContent: "2. The login itself: EAP-PEAP" }));
document.body.appendChild($("p", {}, [
  "Associate. The server presents a certificate (verify it with ",
  $("code", { textContent: "altsubject_match=DNS:radius.example.edu" }),
  "). A TLS tunnel is built. Inside the tunnel, MSCHAPv2 exchanges the \n",
  "username and a hash of the password. The server's error 691 / \n",
  "Authentication failed means it rejected the CREDENTIALS, usually the \n",
  "password bytes, not the network. \"The right length but wrong\" is the \n",
  "classic enterprise-EAP failure signature; the verdict line (691) points ",
  "at credentials, not radio.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "network={\n" +
    "  ssid=\"<campus>\"\n" +
    "  scan_ssid=1\n" +
    "  key_mgmt=WPA-EAP\n" +
    "  eap=PEAP\n" +
    "  identity=\"<user>\"\n" +
    "  password=\"<password>\"\n" +
    "  ca_cert=\"/etc/ssl/certs/ca-certificates.crt\"\n" +
    "  phase1=\"peaplabel=0\"\n" +
    "  phase2=\"auth=MSCHAPV2\"\n" +
    "  altsubject_match=\"DNS:radius.example.edu\"\n" +
    "}", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "The campus network's official Linux guide (",
  $("a", { href: "https://net.sjtu.edu.cn/info/1215/2712.htm", textContent: "net.sjtu.edu.cn/info/1215/2712.htm" }),
  ") pins these options ",
  ": scan_ssid=1, key_mgmt=WPA-EAP, phase1=\"peaplabel=0\" (its recommended ",
  "config A), and altsubject_match. altsubject_match needs the CA bundle, ",
  "whose path differs per distro; the guide shows the debian/ubuntu and ",
  "redhat paths.",
]));

// 3. Trap 1: the default key_mgmt disables your network
document.body.appendChild($("h2", { textContent: "3. Trap 1: the default key_mgmt disables your network" }));
document.body.appendChild($("p", {}, [
  "The NixOS wpa_supplicant module defaults authProtocols to WPA-PSK, \n",
  "WPA-EAP, SAE, FT-PSK, FT-EAP, FT-SAE (",
  $("a", { href: "https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/networking/wpa_supplicant.nix", textContent: "wpa_supplicant.nix" }),
  "). An EAP-only network with no PSK is silently DISABLED at startup; the ",
  "binary prints \n",
  "\"No enabled networks - do not scan\", and a disabled network is never \n",
  "scanned, so the card looks dead. The fix \n",
  "is key_mgmt=WPA-EAP only (authProtocols [ \"WPA-EAP\" ] in the module). \n",
  "This one line was the difference between \"no scan, ever\" and a working \n",
  "connection.",
]));

// 4. Trap 2: a failed EAP waits forever
document.body.appendChild($("h2", { textContent: "4. Trap 2: a failed EAP waits forever" }));
document.body.appendChild($("p", {}, [
  "After a rejected login, wpa_supplicant asks for the password interactively \n",
  "(CTRL-REQ-PASSWORD). With no control interface attached, nothing answers \n",
  "- it hangs indefinitely. This is the real meaning of \"restarting the \n",
  "service fixed it\": the restart cleared the hang, not the cause. The \n",
  "password had been wrong for days; each boot failed, hung, and only a \n",
  "manual restart gave it a fresh try. Defaults that disable whole feature \n",
  "classes (key_mgmt) and interactive prompts in headless services are the \n",
  "two traps.",
]));

// 5. The password mechanism: ext backend
document.body.appendChild($("h2", { textContent: "5. The password mechanism: ext backend" }));
document.body.appendChild($("p", {}, [
  "The password comes from a file: ",
  $("code", { textContent: "ext_password_backend=file:/path/to/passwords" }),
  " and ",
  $("code", { textContent: "password=ext:<name>" }),
  ". The backend reads name=value lines and takes everything after the first ",
  "= ",
  $("a", { href: "https://w1.fi/cgit/hostap/plain/src/utils/ext_password_file.c", textContent: "(src/utils/ext_password_file.c)" }),
  ". A wrong byte in the value is a wrong MSCHAPv2 hash, and the server ",
  "answers error 691.",
]));

// 6. Debug logging
document.body.appendChild($("h2", { textContent: "6. Debug logging when you need the full exchange" }));
document.body.appendChild($("p", {}, [
  "-dd on the wpa_supplicant command line emits the whole EAP state-machine \n",
  "walkthrough; it also floods the journal, so it belongs in a temporary \n",
  "override, not the permanent config. Remove it once the problem is solved.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
