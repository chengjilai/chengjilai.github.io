"use strict";


const title = document.createElement("title");
title.textContent = "Childhurd by hand: GNU/Hurd in QEMU";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Childhurd by hand: GNU/Hurd in QEMU" }));

document.body.appendChild($("p", {}, [
  "The childhurd is the GNU/Hurd system that Guix's hurd-vm-service-type ",
  "runs. On a host that is not Guix System, the image and the boot can be ",
  "reproduced by hand.",
]));

// 1. The image
document.body.appendChild($("h2", { textContent: "1. The image" }));
document.body.appendChild($("p", {}, [
  "The service builds the image from %hurd-vm-operating-system through a ",
  "transform: secret-service-operating-system, a locked root account, and ",
  "the offloading account. Only hurd-vm-disk-image is exported, so the rest ",
  "comes from the module's private bindings.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "(use-modules (gnu services virtualization))\n" +
    "\n" +
    "(let* ((locked-root       (@@ (gnu services virtualization)\n" +
    "                              operating-system-with-locked-root-account))\n" +
    "       (add-offloading    (@@ (gnu services virtualization)\n" +
    "                              operating-system-with-offloading-account))\n" +
    "       (secret-service-os (@@ (gnu services virtualization)\n" +
    "                              secret-service-operating-system)))\n" +
    "  (secret-service-os\n" +
    "   (locked-root\n" +
    "    (add-offloading %hurd-vm-operating-system))))", "elisp") }),
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "guix system image -t hurd-qcow2 childhurd-os.scm", "shell") }),
]));

// 2. Boot
document.body.appendChild($("h2", { textContent: "2. Boot" }));
document.body.appendChild($("p", {}, [
  "The 32-bit image boots with -hda; its sshd listens on guest port 22, and ",
  "the secret service on 1004.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "qemu-system-x86_64 -m 2048 --enable-kvm --no-reboot -snapshot \\\n" +
    "  -hda IMG -device rtl8139,netdev=net0 \\\n" +
    "  -netdev user,id=net0,hostfwd=tcp:127.0.0.1:11004-:1004,hostfwd=tcp:127.0.0.1:10022-:22 \\\n" +
    "  -display none", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "The 64-bit image takes -M q35 -drive file=IMG,if=virtio,format=qcow2. It ",
  "reaches Shepherd but never answers the secret handshake, so it reboots ",
  "after 60 s.",
]));

// 3. Secrets
document.body.appendChild($("h2", { textContent: "3. Secrets" }));
document.body.appendChild($("p", {}, [
  "The guest reboots when it receives no secrets: its shepherd service runs ",
  "secret-service-receive-secrets and then (unless sent (sleep 3) (reboot)). ",
  "Start the sender before QEMU, or the guest loses the race.",
]));
document.body.appendChild($("p", {}, [
  "The guest listens on port 1004 and opens with:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight("(secret-service-server (version 0))", "elisp") }),
]));
document.body.appendChild($("p", {}, [
  "The host replies with a file list followed by the raw bytes of each file, ",
  "in order:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "(secrets (version 0) (files ((\"/etc/ssh/ssh_host_ed25519_key\" SIZE MODE) ...)))",
    "elisp") }),
]));
document.body.appendChild($("p", {}, [
  "Minimum for a usable system: ssh_host_ed25519_key and ssh_host_ecdsa_key ",
  "with their .pub files (mode 0600 for the private keys), and ",
  "/etc/ssh/authorized_keys.d/offloading. The guest's sshd is configured ",
  "with generate-host-keys? #f because the Hurd has no entropy for key ",
  "generation.",
]));

// 4. Login
document.body.appendChild($("h2", { textContent: "4. Login" }));
document.body.appendChild($("p", {}, [
  "Root is locked by the transform; the login is the offloading account: ",
  "ssh -p 10022 offloading@127.0.0.1. Use the system ssh: Guix's OpenSSH ",
  "prints \"bad ownership or modes for directory /nix/store\" before ",
  "connecting, because /etc/ssh/ssh_config includes a file under the ",
  "group-writable /nix/store. ssh -F /dev/null skips the include.",
]));

// 5. Inside
document.body.appendChild($("h2", { textContent: "5. Inside" }));
document.body.appendChild($("pre", {}, [
  $("samp", { textContent:
    "GNU childhurd 0.9 GNU-Mach 1.8/Hurd-0.9 i686-AT386 GNU" }),
]));
document.body.appendChild($("p", {}, [
  "ps -e shows Shepherd (Guile) as PID 1 plus gnumach, startup, rumpdisk, ",
  "ext2fs, pci-arbiter and proc; df puts the root on /dev/hd0s1 through the ",
  "ext2fs translator.",
]));
document.body.appendChild($("pre", {}, [
  $("samp", { textContent:
    "guix (GNU Guix) 1.5.0rc1\n" +
    "$ guix build --dry-run hello\n" +
    "  ... perl-5.36.0.drv ... diffutils-3.12.drv ... hello-2.12.2.drv" }),
]));

// 6. Stop
document.body.appendChild($("h2", { textContent: "6. Stop" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight("pkill -f '[q]emu-system-x86_64'", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "The bracket keeps the pattern from matching the shell that runs the ",
  "pkill.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
