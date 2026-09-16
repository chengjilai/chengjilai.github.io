"use strict";

const title = document.createElement("title");
title.textContent = "Installing a bootc OS from a NixOS host";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Installing a bootc OS from a NixOS host" }));

document.body.appendChild($("p", {}, [
  "bootc systems are delivered as container images: the image holds the kernel and userland, ",
  $("a", { href: "https://bootc.dev/bootc/", textContent: "bootc" }),
  " deploys it to a disk, and the installed OS boots without a container runtime.",
]));

// 1. The installer is the image's own bootc
document.body.appendChild($("h2", { textContent: "1. The installer is the image's own bootc" }));
document.body.appendChild($("p", {}, [
  "Each image ships its own ",
  $("code", { textContent: "bootc" }),
  ", and that is the one to run. ",
  "A host-side bootc of another version refuses current images: nixpkgs' bootc 1.6.0 fails on a Fedora 44 image with ",
  $("samp", { textContent: "Failed to find ostree/prepare-root.conf" }),
  ", while the image's bootc 1.16 installs it. ",
  "Compare versions with ",
  $("code", { textContent: "podman run IMG bootc --version" }),
  ". The ",
  $("a", { href: "https://bootc.dev/bootc/bootc-install.html", textContent: "bootc documentation" }),
  " describes the foreign-host flow as a ",
  $("code", { textContent: "podman run" }),
  " of the target image.",
]));

// 2. The install command
document.body.appendChild($("h2", { textContent: "2. The install command" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "podman run --rm --privileged --pid=host --ipc=host \\\n" +
    "  -v /dev:/dev -v /var/lib/containers:/var/lib/containers \\\n" +
    "  --security-opt label=type:unconfined_t \\\n" +
    "  localhost/os:latest \\\n" +
    "  bootc install to-disk --wipe --filesystem xfs --disable-selinux \\\n" +
    "  --target-imgref localhost/os:latest /dev/sda", "shell") }),
]));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "--wipe" }),
  " replaces the whole disk. ",
  "bootc creates its own UEFI entry and removes the stale entry for the same image. ",
  $("code", { textContent: "bootc install to-filesystem" }),
  " and ",
  $("code", { textContent: "bootc install to-existing-root" }),
  " cover mounted-root installs.",
]));

// 3. The NixOS PATH quirk
document.body.appendChild($("h2", { textContent: "3. The NixOS PATH quirk" }));
document.body.appendChild($("p", {}, [
  "bootc re-executes itself in the host mount namespace to reach host ",
  $("code", { textContent: "podman" }),
  " (image digest lookup) and ",
  $("code", { textContent: "udevadm" }),
  ". ",
  "The container's default PATH comes from the image; on NixOS both binaries live in ",
  $("code", { textContent: "/run/current-system/sw/bin" }),
  ". ",
  "Overriding the container PATH with the host's makes the re-exec find them:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "--env PATH=\"$PATH:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\"", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "Without it the install stops at ",
  $("samp", { textContent: "Re-exec in host mountns: exec: No such file or directory" }),
  ".",
]));

// 4. SELinux and filesystem flags
document.body.appendChild($("h2", { textContent: "4. SELinux and filesystem flags" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "--disable-selinux" }),
  " is documented as required when the installing host has SELinux disabled. ",
  "The installed system then carries ",
  $("code", { textContent: "selinux=0" }),
  " on its kernel command line. ",
  "bootc 1.16 also demands an explicit ",
  $("code", { textContent: "--filesystem" }),
  " when the image carries no ",
  $("code", { textContent: "/usr/lib/bootc/install" }),
  " config; without it the install fails with ",
  $("samp", { textContent: "No root filesystem specified" }),
  ". ",
  "xfs, ext4, and btrfs are the supported root filesystem types.",
]));

// 5. Kernel arguments live in the image
document.body.appendChild($("h2", { textContent: "5. Kernel arguments live in the image" }));
document.body.appendChild($("p", {}, [
  "Kernel arguments are fixed at install time by the image. ",
  "A file ",
  $("code", { textContent: "/usr/lib/bootc/install/00-name.toml" }),
  " with ",
  $("code", { textContent: "[install] kargs = [\"...\"]" }),
  " appends them; the ",
  $("a", { href: "https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-install-config.5.md", textContent: "install-config man page" }),
  " is the schema. ",
  $("code", { textContent: "audit=0 loglevel=3" }),
  " clears the console of audit records and driver INFO. ",
  "The result lands in the deployment's BLS entry, readable from ",
  $("code", { textContent: "/boot/loader/entries" }),
  " on the installed disk.",
]));

// 6. What the image build strips or hides
document.body.appendChild($("h2", { textContent: "6. What the image build strips or hides" }));
document.body.appendChild($("p", {}, [
  "buildah discards ",
  $("code", { textContent: "/etc/hostname" }),
  " at commit: a ",
  $("code", { textContent: "RUN" }),
  " writing it produces an image without the file. ",
  "A ",
  $("a", { href: "https://www.freedesktop.org/software/systemd/man/latest/tmpfiles.d.html", textContent: "tmpfiles" }),
  " rule ships the value instead: ",
  $("code", { textContent: "f /etc/hostname 0644 root root - NAME" }),
  " in ",
  $("code", { textContent: "/usr/lib/tmpfiles.d/" }),
  ". ",
  "A fresh install has no ",
  $("code", { textContent: "/var/log/journal" }),
  "; journald's default ",
  $("code", { textContent: "Storage=auto" }),
  " then keeps only RAM logs, and reboot loses them. ",
  "A drop-in ",
  $("code", { textContent: "/etc/systemd/journald.conf.d/*.conf" }),
  " with ",
  $("code", { textContent: "[Journal] Storage=persistent" }),
  " keeps ",
  $("a", { href: "https://www.freedesktop.org/software/systemd/man/latest/journald.conf.html", textContent: "journald" }),
  " logs on disk.",
]));

// 7. Adding repositories, dnf-native
document.body.appendChild($("h2", { textContent: "7. Adding repositories, dnf-native" }));
document.body.appendChild($("p", {}, [
  "dnf5 needs its plugin before repository management: ",
  $("code", { textContent: "dnf -y install dnf5-plugins" }),
  ", then ",
  $("code", { textContent: "dnf config-manager addrepo --from-repofile URL" }),
  " installs any repo file. ",
  $("code", { textContent: "dnf copr enable USER/PROJECT" }),
  " is the ",
  $("a", { href: "https://copr.fedorainfracloud.org/", textContent: "COPR" }),
  " path. ",
  "Google Chrome publishes no .repo file; its repository is a hand-written ",
  $("code", { textContent: "[google-chrome]" }),
  " section with ",
  $("code", { textContent: "baseurl https://dl.google.com/linux/chrome/rpm/stable/$basearch" }),
  ". ",
  "Weak dependencies quietly add packages: niri Recommends fuzzel and xdg-desktop-portal-*, and ",
  $("code", { textContent: "--setopt=install_weak_deps=0" }),
  " drops them. ",
  "Hard Requires remain: niri needs xwayland-satellite, sddm needs a wayland greeter backend.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));