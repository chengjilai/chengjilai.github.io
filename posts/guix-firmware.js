"use strict";

const title = document.createElement("title");
title.textContent = "Guix firmware: why a machine can silently lose its sound card";
document.head.appendChild(title);

// The post. One appendChild per element, in document order.
document.body.appendChild($("h1", {
  textContent: "Guix firmware: why a machine can silently lose its sound card",
}));

document.body.appendChild($("p", {}, [
  "A laptop rebooted into a working system with no sound at all: ",
  $("code", { textContent: "/proc/asound/cards" }),
  " empty, dmesg showing ",
  $("code", { textContent: "sof_probe_work failed err: -2" }),
  " for the Intel audio DSP. The machine had not broken; the firmware was ",
  "absent.",
]));

// 1. The mechanism
document.body.appendChild($("h2", { textContent: "1. The mechanism" }));
document.body.appendChild($("p", {}, [
  "Guix's ",
  $("code", { textContent: "(firmware (list ...))" }),
  " field defaults to ",
  $("code", { textContent: "%base-firmware" }),
  ": three wifi firmwares, ath9k-htc-ar7010, ath9k-htc-ar9271, openfwwf ",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/system.scm", textContent: "(gnu/system.scm)" }),
  ". The firmware service merges the list with ",
  $("code", { textContent: "directory-union \"firmware\"" }),
  ", and an activation snippet calls activate-firmware on the union's ",
  $("code", { textContent: "/lib/firmware" }),
  " ",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/services.scm", textContent: "(gnu/services.scm)" }),
  ".",]));
document.body.appendChild($("p", {}, [
  "activate-firmware writes that store path to ",
  $("code", { textContent: "/sys/module/firmware_class/parameters/path" }),
  ". The comment says it \"allows Linux to handle firmware loading directly ",
  "by itself\" ",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/build/activation.scm", textContent: "(gnu/build/activation.scm)" }),
  ". The kernel looks for blobs there: ",
  "not in the initrd, not on ",
  $("code", { textContent: "/lib/firmware" }),
  ". The path is writable at runtime, which is what makes the no-reboot fix ",
  "possible.",
]));

// 2. The bug
document.body.appendChild($("h2", { textContent: "2. The bug" }));
document.body.appendChild($("p", {}, [
  "The default list contains no Intel audio-DSP firmware. The SOF driver ",
  "probes the DSP, asks for its firmware, gets ",
  $("code", { textContent: "-ENOENT" }),
  " (",
  $("code", { textContent: "-2" }),
  ", \"No such file or directory\"), and the card never appears. The exact ",
  "dmesg line is built in the kernel: ",
  $("code", { textContent: "dev_err(..., \"error: %s failed err: %d\", __func__, ret)" }),
  " in sof_probe_work ",
  $("a", { href: "https://github.com/torvalds/linux/blob/master/sound/soc/sof/core.c", textContent: "(sound/soc/sof/core.c)" }),
  ".",]));
document.body.appendChild($("p", {}, [
  "Intel's SOF firmware (",
  $("code", { textContent: "intel/sof/" }),
  ") is not in the guix tree at all: there is no SOF firmware package, so you ",
  "package it yourself and add it to the list.",
]));

// 3. The fix
document.body.appendChild($("h2", { textContent: "3. The fix" }));
document.body.appendChild($("p", {}, [
  "Write a small trivial-build-system package that git-fetches the upstream ",
  $("a", { href: "https://github.com/thesofproject/sof-bin", textContent: "sof-bin" }),
  " repo at a release tag; a local sof-firmware module wraps it. Add it, ",
  "plus wireless-regdb, to ",
  $("code", { textContent: "(firmware ...)" }),
  ". wireless-regdb's regulatory.db is also missing from the defaults, ",
  "and the package exists in the guix tree ",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/packages/linux.scm", textContent: "(gnu/packages/linux.scm)" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "No reboot needed: the reconfigure's activation already rewrote the sysfs ",
  "path, so reloading the modules ",
  $("code", { textContent: "modprobe -r snd_sof_pci_intel_tgl" }),
  " and ",
  $("code", { textContent: "modprobe snd_sof_pci_intel_tgl" }),
  " (a real module, sound/soc/sof/intel/Makefile) brought the card up ",
  "immediately.",
]));
document.body.appendChild($("p", {}, [
  "Silent hardware: check dmesg for the missing-firmware sign; the driver ",
  "names the file it wants. Firmware on Guix is a build-time list, not a ",
  "filesystem convention, and the sysfs path being runtime-writable is what ",
  "makes the fix apply without a reboot.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
