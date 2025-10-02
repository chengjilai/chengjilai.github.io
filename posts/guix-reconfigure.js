"use strict";

const title = document.createElement("title");
title.textContent = "guix system reconfigure: what it does and does not do";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "guix system reconfigure: what it does and does not do" }));

document.body.appendChild($("p", {}, [
  "guix system reconfigure is transactional but not a restart: it stages the ",
  "new system and starts what is missing. The manual says what it does not do, ",
  "plainly, and a real service swap (NetworkManager to wpa_supplicant + ",
  "dhcpcd) showed the comparison-by-provision in action.",
]));

// 1. What reconfigure does
document.body.appendChild($("h2", { textContent: "1. What reconfigure does" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Builds the new system, creates a generation, runs the activation script ",
    "(users, /etc farm, setuid), then atomically re-points ",
    $("code", { textContent: "/run/current-system" }),
  ]),
  $("li", {}, [
    "Talks to Shepherd: loads new services, unloads obsolete ones, starts new ",
    "ones",
  ]),
]));

// 2. It does not restart running services
document.body.appendChild($("h2", { textContent: "2. It does not restart running services" }));
document.body.appendChild($("p", {}, [
  "The manual: \"it does not restart system services that were already ",
  "running\" (Getting Started with the System), and \"by default guix system ",
  "reconfigure only restarts services that are not currently running\" ",
  "(Unattended Upgrades). A changed service keeps its old definition until ",
  $("code", { textContent: "herd restart <svc>" }),
  ". Staged != applied; verify with ",
  $("code", { textContent: "ps" }),
  " and ",
  $("code", { textContent: "herd status" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "The comparison is by PROVISION, not by unit. shepherd-service-upgrade ",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/services/shepherd.scm", textContent: "(gnu/services/shepherd.scm)" }),
  " looks up both the live and the target service sets with lookup ",
  "procedures keyed on ",
  $("code", { textContent: "shepherd-service-provision" }),
  ". When two services provide the same symbol, a swap looks \"unchanged\".",
]));

// 3. Case study: NetworkManager to wpa_supplicant + dhcpcd
document.body.appendChild($("h2", { textContent: "3. Case study: NetworkManager to wpa_supplicant + dhcpcd" }));
document.body.appendChild($("p", {}, [
  "Replacing NetworkManager with guix's own ",
  $("code", { textContent: "wpa-supplicant-service-type" }),
  " + ",
  $("code", { textContent: "dhcpcd-service-type" }),
  " on a wifi-only laptop (campus WPA2-Enterprise). Both NetworkManager ",
  "and dhcpcd provide ",
  $("code", { textContent: "'networking" }),
  " (",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/services/networking.scm", textContent: "gnu/services/networking.scm" }),
  ": ",
  $("code", { textContent: "(provision '(NetworkManager networking))" }),
  " vs ",
  $("code", { textContent: "(shepherd-provision (list-of-symbols '(networking)))" }),
  "), so reconfigure found the provision already running and never loaded ",
  "dhcpcd. The reconfigure output prints the hint (",
  $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/guix/scripts/system.scm", textContent: "guix/scripts/system.scm" }),
  "): ",
  $("code", { textContent: "\"To complete the upgrade, run 'herd restart SERVICE' to stop,\"" }),
  " and the fix is manual:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "sudo herd restart wpa-supplicant\n" +
    "sudo herd restart networking   # stops NM, starts dhcpcd", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "A wifi-only machine has no ethernet fallback; SSH runs over the same ",
  "wifi, and the interface handoff cannot be tested over SSH at all (NM ",
  "must yield the radio first). Recovery is a previous generation from the ",
  "boot menu or ",
  $("code", { textContent: "guix system roll-back" }),
  " (then reboot; the network only changes at boot).",
]));

// 4. Toolchain: the system guix must match the pinned channels
document.body.appendChild($("h2", { textContent: "4. Toolchain: the system guix must match the pinned channels" }));
document.body.appendChild($("p", {}, [
  "Building the config failed with ",
  $("code", { textContent: "linux-libre-7.1: unbound variable" }),
  "; the installed guix predated the pinned nonguix commit. Fix: ",
  $("code", { textContent: "guix pull --channels=channels.scm" }),
  " (builds guix from source; slow). Every build needs the local module and ",
  "the nonguix checkout on the load path:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "guix system build -L . -L /gnu/store/*nonguix-*/ config.scm", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "guix system build works as an unprivileged user (it goes through the ",
  "daemon); only reconfigure needs root. The pulled guix lives at ",
  $("code", { textContent: "~/.config/guix/current" }),
  " and PATH may not include it; call it by absolute path.",
]));

// 5. VM-testing the config
document.body.appendChild($("h2", { textContent: "5. VM-testing the config (guix system vm)" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "guix system vm BUILDS and PRINTS the run-vm.sh path; it does not run ",
    "it; execute the script yourself",
  ]),
  $("li", {}, [
    "It cannot boot EFI/GPT configs: \"EFI bootloader required with GPT ",
    "partitioning\" (",
    $("a", { href: "https://codeberg.org/guix/guix/src/branch/master/gnu/system/image.scm", textContent: "gnu/system/image.scm" }),
    "; guix issue ",
    $("a", { href: "https://issues.guix.gnu.org/68488", textContent: "#68488" }),
    "). Use a BIOS test config mirroring the services, or ",
    $("code", { textContent: "guix system image -t qcow2-gpt" }),
    " + OVMF for the real config",
  ]),
  $("li", {}, [
    "The script uses -enable-kvm (root or the kvm group) and needs ",
    "--no-graphic headless",
  ]),
  $("li", {}, [
    "Drive the serial console via a FIFO; open the write end only after the ",
    "reader (opening a read-only FIFO blocks until a writer appears)",
  ]),
  $("li", {}, [
    "What the VM tests: the software stack (dhcpcd lease, resolv.conf, DNS ",
    "through the host wifi). Not the radio; that part is only provable at ",
    "the laptop",
  ]),
]));

// 6. shepherd hygiene
document.body.appendChild($("h2", { textContent: "6. shepherd hygiene" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "make-forkexec-constructor sends stdout/stderr to /dev/null by default; ",
    "add ",
    $("code", { textContent: "#:log-file" }),
    " or daemon diagnostics vanish",
  ]),
  $("li", {}, [
    "Long-running daemons: add ",
    $("code", { textContent: "#:respawn? #t" }),
  ]),
]));

// 7. Workflow
document.body.appendChild($("h2", { textContent: "7. Workflow" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Validate before reconfiguring: ",
    $("code", { textContent: "guix system build config.scm --dry-run" }),
    " catches paren errors and unknown packages fast",
  ]),
  $("li", {}, [
    "Count parens: ",
    $("code", { textContent: "tr -cd '()' < file | wc -c" }),
    "; a mismatch means a structural bug",
  ]),
  $("li", {}, [
    "Backward reconfigures warn; old generations stay bootable and ",
    $("code", { textContent: "guix system roll-back" }),
    " reverts (same as switch-generation one step back; switch-generation ",
    "also makes that generation the default boot entry)",
  ]),
  $("li", {}, [
    "The built-but-not-installed system is NOT a generation: guix system ",
    "build does not create one; only reconfigure does",
  ]),
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
  ", manual: ",
  $("a", { href: "https://guix.gnu.org/manual/devel/en/html_node/Getting-Started-with-the-System.html", textContent: "Getting Started with the System" }),
  ", ",
  $("a", { href: "https://guix.gnu.org/manual/stable/en/html_node/Unattended-Upgrades.html", textContent: "Unattended Upgrades" }),
]));
