"use strict";

const title = document.createElement("title");
title.textContent = "What happens when a laptop joins a campus/enterprise Wi-Fi";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "What happens when a laptop joins a campus/enterprise Wi-Fi" }));

document.body.appendChild($("p", {}, [
  "A failure that looks like \"wifi is broken\" actually lives in exactly one \n",
  "layer of a four-layer stack: the driver owns the radio, wpa_supplicant \n",
  "scans and runs EAP, systemd-networkd does DHCP, systemd-resolved does \n",
  "DNS. Two silent killers hide in wpa_supplicant's defaults.",
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
  "password bytes, not the network. \"The right length but wrong\" is the ",
  "classic enterprise-EAP failure signature; the verdict line (691) points ",
  "at credentials, not radio. The campus config also pins ",
  $("code", { textContent: "phase1=\"peaplabel=0\"" }),
  " and ",
  $("code", { textContent: "scan_ssid=1" }),
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
  "manual restart gave it a fresh try. Defaults that disable whole feature ",
  "classes (key_mgmt) and interactive prompts in headless services are the ",
  "two silent killers.",
]));

// 5. The password mechanism: ext backend
document.body.appendChild($("h2", { textContent: "5. The password mechanism: ext backend" }));
document.body.appendChild($("p", {}, [
  "The password comes from a file via ext_password_backend=file:... and the \n",
  "config says password=ext:<name>. The backend parses name=value lines, \n",
  "taking everything after the first =. This is where the secret pipeline \n",
  "(see the declarative-secrets post) meets the protocol: a subtly wrong \n",
  "file = a subtly wrong MSCHAPv2 hash = error 691, every time.",
]));

// 6. Debug logging
document.body.appendChild($("h2", { textContent: "6. Debug logging when you need the full exchange" }));
document.body.appendChild($("p", {}, [
  "-dd on the wpa_supplicant command line emits the whole EAP state-machine \n",
  "walkthrough; it also floods the journal, so it belongs in a temporary \n",
  "override, not the permanent config. Remove it once the problem is solved.",
]));


document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
