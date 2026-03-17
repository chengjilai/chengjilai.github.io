"use strict";

const title = document.createElement("title");
title.textContent = "systemd already does what you were about to write";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "systemd already does what you were about to write" }));

document.body.appendChild($("p", {}, [
  "Four hand-rolled mechanisms turned out to be systemd \n",
  "builtins: a secret path list, a backlight-restore loop, a wait-online \n",
  "\"disable\", and a udev RUN+= shell. The rule: ask what the platform \n",
  "already ships before writing a service, script, or loop.",
]));

// 1. Secrets: ImportCredential instead of path lists
document.body.appendChild($("h2", { textContent: "1. Secrets: ImportCredential instead of path lists" }));
document.body.appendChild($("p", {}, [
  "Encrypted credentials live at /etc/credstore.encrypted/<name>, sealed with \n",
  "the host key. The old style named every file explicitly (LoadCredentialEncrypted \n",
  "with a path per secret). ImportCredential=<name> (systemd 254+, systemd.exec) \n",
  "searches the credential stores (/etc/credstore, /etc/credstore.encrypted, \n",
  "/run/credstore, ...) by name; a glob is allowed too. No paths to \n",
  "maintain; adding a secret is one line. A provisioner that lists names, \n",
  "not paths:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "ImportCredential = [ \"<name>\" ... ];\n" +
    "ExecStart = ... tr -d '\\n\\r' < \"$CREDENTIALS_DIRECTORY/$s\" > \"/run/secrets/$s\"", "nix") }),
]));
document.body.appendChild($("p", {}, [
  "Validate the mechanism on YOUR version before switching to it; units \n",
  "have an empty PATH, so use bash builtins:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "sudo systemd-run --unit=t --property=ImportCredential=<name> \\\n" +
    "  --property=Type=oneshot bash -c 'IFS= read -r -n 8 c < \"$CREDENTIALS_DIRECTORY/<name>\"; echo \"$c\"'", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "It printed the token prefix; the decrypt path works on this systemd \n",
  "version.",
]));

// 2. Backlight: systemd-backlight instead of a custom oneshot
document.body.appendChild($("h2", { textContent: "2. Backlight: systemd-backlight instead of a custom oneshot" }));
document.body.appendChild($("p", {}, [
  "A GPU quirk resets the panel backlight to ~0% at boot. The hand-rolled \n",
  "fix was a oneshot service with a retry loop forcing 100%. But ",
  $("code", { textContent: "systemd-backlight@backlight:<name>" }),
  " is built in, enabled, and already running; it restores the brightness \n",
  "saved at shutdown (/var/lib/systemd/backlight/). The custom service was \n",
  "redundant and got deleted. Check ",
  $("code", { textContent: "systemctl list-units 'systemd-backlight@*'" }),
  " before writing a backlight fixer.",
]));

// 3. network-online: wait-online instead of "disabled"
document.body.appendChild($("h2", { textContent: "3. network-online: wait-online instead of \"disabled\"" }));
document.body.appendChild($("p", {}, [
  "network-online.target exists to delay network-client services until the \n",
  "network is up. Someone had disabled networkd-wait-online with a stale \n",
  "comment (\"it waits on links I don't control\"). With the actual config, \n",
  "SSID-matched wifi units (no network file until connected) and aux links \n",
  "marked RequiredForOnline=no, wait-online has nothing to wait for at boot \n",
  "and passes instantly: it is inert but correct, and keeps the target's \n",
  "documented meaning for services that pull it in.",
]));

// 4. Firewall inspection: nft
document.body.appendChild($("h2", { textContent: "4. Firewall inspection: nft" }));
document.body.appendChild($("p", {}, [
  "The distro firewall was on the whole time (nixos-fw chains in \n",
  "iptables-nft) but invisible because the ",
  $("code", { textContent: "nft" }),
  " binary was not installed. ",
  $("code", { textContent: "sudo nft list tables" }),
  " after adding the nftables package.",
]));

// 5. The udev case: give the work to a unit
document.body.appendChild($("h2", { textContent: "5. The udev case: give the work to a unit" }));
document.body.appendChild($("p", {}, [
  "A laptop touchscreen ghost-touches; the fix is to unbind its HID device \n",
  "from hid-multitouch the moment it appears. The natural first attempt, ",
  $("code", { textContent: "RUN+= .../bin/sh -c 'for i in 1 2 3 4 5; do ...'" }),
  ", is wrong twice: RUN+= with a shell forks inside hotplug context, and \n",
  "the retry loop is hand-rolled timing inside the rule. systemd's \n",
  "Restart=on-failure IS the retry loop.",
]));
document.body.appendChild($("p", {}, [
  "The trap in between: docs-style examples show ",
  $("code", { textContent: "SYSTEMD_WANTS=\"x.service\"" }),
  " as a bare rule key. The build failed: ",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "udevadm verify: 99-local.rules:1 Invalid key 'SYSTEMD_WANTS'.", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "Reproduced with udevadm verify. SYSTEMD_WANTS is a device property that \n",
  "the service manager reads; in a rule it is set via ENV{}. The correct \n",
  "form:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "ACTION==\"add\", SUBSYSTEM==\"hid\", ENV{MODALIAS}==\"*v0000XXXXp0000YYYY*\", \\\n",
    "  TAG+=\"systemd\", ENV{SYSTEMD_WANTS}=\"unbind-touchscreen.service\"", "shell") }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "TAG+=\"systemd\" makes the device exist as a systemd unit at all",
  ]),
  $("li", {}, [
    "ENV{SYSTEMD_WANTS}=\"unit\" pulls the unit in with a Wants= dependency \n",
    "when the device appears",
  ]),
  $("li", {}, [
    "No %k passing needed; the unit finds the device itself by scanning /sys \n",
    "for the modalias",
  ]),
]));
document.body.appendChild($("p", {}, [
  "The unit iterates /sys/bus/hid/devices/*, unbinds every match, and exits 0 \n",
  "only if at least one unbind landed; non-zero makes systemd retry in 1 s \n",
  "until the driver's sysfs entries exist. Test with ",
  $("code", { textContent: "udevadm test /sys/bus/hid/devices/<name>" }),
  ", then ",
  $("code", { textContent: "udevadm control --reload-rules && udevadm trigger" }),
  ".",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
