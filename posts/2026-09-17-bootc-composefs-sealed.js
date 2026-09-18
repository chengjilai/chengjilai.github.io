"use strict";

const title = document.createElement("title");
title.textContent = "bootc, composefs and the sealed images";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "bootc, composefs and the sealed images" }));

document.body.appendChild($("p", {}, [
  $("a", { href: "https://bootc.dev/bootc/", textContent: "bootc" }),
  " performs transactional, in-place operating system updates from OCI container images: the image carries the kernel (",
  $("code", { textContent: "/usr/lib/modules/$kver/vmlinuz" }),
  " plus ",
  $("code", { textContent: "initramfs.img" }),
  ") and the bootloader, and the installed system runs systemd as pid 1 with no outer container process.",
]));

// 1
document.body.appendChild($("h2", { textContent: "1. bootc and ostree" }));
document.body.appendChild($("p", {}, [
  "bootc is a component of the ",
  $("a", { href: "https://containers.github.io/bootable/", textContent: "bootable containers initiative" }),
  ", a CNCF sandbox project; the CLI and API are declared stable while the storage underneath is ostree. ",
  "OSTree provides a git-like OS repository, a bootloader integration layer and an HTTP transport; bootc does not use the transport, it pulls OCI with skopeo and imports the content into the local ostree repository for a deployment checkout (",
  $("a", { href: "https://bootc.dev/bootc/relationships.html", textContent: "relationships" }),
  "). ",
  "On container sources ",
  $("code", { textContent: "rpm-ostree upgrade" }),
  " and ",
  $("code", { textContent: "bootc upgrade" }),
  " are equivalent, and any local mutation (",
  $("code", { textContent: "rpm-ostree install" }),
  ", ",
  $("code", { textContent: "initramfs --enable" }),
  ") makes a bootc upgrade error, because bootc wants all state from the image.",
]));

// 2
document.body.appendChild($("h2", { textContent: "2. The image contract and the filesystem" }));
document.body.appendChild($("p", {}, [
  "The ",
  $("a", { href: "https://bootc.dev/bootc/bootc-images.html", textContent: "image contract" }),
  " is a ",
  $("code", { textContent: "/sysroot" }),
  " directory, ",
  $("code", { textContent: "LABEL containers.bootc=1" }),
  ", the kernel in ",
  $("code", { textContent: "/usr/lib/modules" }),
  ", no content in ",
  $("code", { textContent: "/boot" }),
  ", and ",
  $("code", { textContent: "[composefs] enabled = true" }),
  " in ",
  $("code", { textContent: "/usr/lib/ostree/prepare-root.conf" }),
  "; ",
  $("code", { textContent: "bootc container lint" }),
  " checks all of it.",
]));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "/etc" }),
  " is persistent and gets a three-way merge per deployment: the new image default is the base, the diff of the running system against the old default is re-applied, and locally modified files are retained. ",
  "The merge compares metadata too, so a changed uid, gid or extended attribute keeps the local file and skips the image update. ",
  $("code", { textContent: "/usr/etc" }),
  " holds the image's default ",
  $("code", { textContent: "/etc" }),
  " and is generated on the client. ",
  $("code", { textContent: "/var" }),
  " behaves like a Docker ",
  $("code", { textContent: "VOLUME" }),
  ": content shipped in it is unpacked only from the initial image, and later image changes to ",
  $("code", { textContent: "/var" }),
  " are not applied (",
  $("a", { href: "https://bootc.dev/bootc/filesystem.html", textContent: "filesystem" }),
  ").",
]));

// 3
document.body.appendChild($("h2", { textContent: "3. composefs, the mount and the backend" }));
document.body.appendChild($("p", {}, [
  $("a", { href: "https://github.com/composefs/composefs", textContent: "composefs" }),
  " mounts a read-only tree: an EROFS metadata image whose entries point at content-addressed objects in a backing store, mounted through overlayfs, with optional fs-verity on the objects. ",
  "composefs stores no persistent data itself.",
]));
document.body.appendChild($("p", {}, [
  "There are two distinct uses. ",
  "The first is the root mount of an ostree deployment: Fedora bootc, CoreOS and Atomic images set ",
  $("code", { textContent: "[composefs] enabled = yes" }),
  " in prepare-root.conf, which Fedora calls unsigned mode, with fs-verity where the filesystem supports it. ",
  "With that mount ",
  $("code", { textContent: "/" }),
  " and ",
  $("code", { textContent: "/usr" }),
  " are the same immutable image, so top-level directories can only be created at image build time. ",
  "The second is an alternative bootc storage backend.",
]));
document.body.appendChild($("p", {}, [
  "The ",
  $("a", { href: "https://bootc.dev/bootc/experimental-composefs.html", textContent: "composefs backend" }),
  " replaces ostree with composefs-rs: ",
  $("code", { textContent: "/composefs/{objects,images,streams}" }),
  ", objects keyed by SHA-512 fs-verity digest and reflink-shared, one EROFS image per deployment, per-deployment state in ",
  $("code", { textContent: "/state/deploy/<digest>/" }),
  " (an ",
  $("code", { textContent: "etc" }),
  " copy and a ",
  $("code", { textContent: "var" }),
  " symlink into the shared ",
  $("code", { textContent: "/state/os/default/var" }),
  "), staging under ",
  $("code", { textContent: "/run/composefs/staged-deployment" }),
  ", and no ",
  $("code", { textContent: "/ostree/repo" }),
  " beyond a compatibility symlink. ",
  "SHA-512 is hardcoded for the repository.",
]));

// 4
document.body.appendChild($("h2", { textContent: "4. Sealed images and what the digest covers" }));
document.body.appendChild($("p", {}, [
  "Unsealed means fs-verity enforcement is optional, so the system boots a plain ",
  $("code", { textContent: "vmlinuz" }),
  " and ",
  $("code", { textContent: "initramfs" }),
  " from a BLS entry; a UKI built with ",
  $("code", { textContent: "--allow-missing-verity" }),
  " is also unsealed. ",
  "Sealed means the composefs digest is baked into the kernel command line of a UKI and required to match at boot. ",
  "In-place upgrades are guaranteed for systems deployed since bootc 1.16.0.",
]));
document.body.appendChild($("p", {}, [
  "The digest covers ",
  $("code", { textContent: "/etc" }),
  " and ",
  $("code", { textContent: "/var" }),
  " content. ",
  "The boot transform empties only ",
  $("code", { textContent: "/boot" }),
  " and ",
  $("code", { textContent: "/sysroot" }),
  " (",
  $("code", { textContent: "REQUIRED_TOPLEVEL_TO_EMPTY_DIRS" }),
  " in ",
  $("a", { href: "https://github.com/composefs/composefs-rs/blob/main/crates/composefs-boot/src/lib.rs", textContent: "composefs-rs" }),
  "), regenerates SELinux labels, and strips ",
  $("code", { textContent: "user.*" }),
  " extended attributes by default. ",
  "So any ",
  $("code", { textContent: "/etc" }),
  " or ",
  $("code", { textContent: "/var" }),
  " file in a derived image changes the digest just like a package would, while the running system's writable ",
  $("code", { textContent: "/etc" }),
  " copy and shared ",
  $("code", { textContent: "/var" }),
  " sit outside the image and outside the seal.",
]));

// 5
document.body.appendChild($("h2", { textContent: "5. Building a sealed image" }));
document.body.appendChild($("p", {}, [
  "Sealing happens in the build, not at install. ",
  "The image build splits the kernel and initramfs out of the rootfs with ",
  $("code", { textContent: "bootc container split-kernel-and-rootfs" }),
  ", then ",
  $("code", { textContent: "bootc container ukify" }),
  " computes the composefs digest, reads extra kernel arguments from ",
  $("code", { textContent: "/usr/lib/bootc/kargs.d" }),
  ", embeds the digest in the command line, and invokes ",
  $("a", { href: "https://www.freedesktop.org/software/systemd/man/latest/ukify.html", textContent: "ukify" }),
  " to sign the result (",
  $("a", { href: "https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-container-ukify.8.md", textContent: "bootc-container-ukify" }),
  "). ",
  "A final step removes the raw kernel and leaves the UKI at ",
  $("code", { textContent: "/boot/EFI/Linux/<kver>.efi" }),
  ". ",
  "The digest and the signature cover the finished rootfs, so the UKI is generated last.",
]));
document.body.appendChild($("p", {}, [
  "The ",
  $("a", { href: "https://github.com/travier/fedora-atomic-desktops-sealed", textContent: "Fedora Atomic Desktop sealed images" }),
  " follow the same shape: rebuild the initramfs, move the kernel out, remove kernel and initramfs from the rootfs, rechunk with chunkah so the composefs digest matches the installed objects, then compute the digest and build the cmdline (",
  $("code", { textContent: "composefs=<digest> rw" }),
  ", btrfs zstd, ",
  $("code", { textContent: "quiet rhgb" }),
  ") before signing with ",
  $("code", { textContent: "sbsign" }),
  ". ",
  "Their disk images come from ",
  $("code", { textContent: "bcvk to-disk --filesystem=btrfs --composefs-backend --bootloader=systemd" }),
  "; the documented manual install is ",
  $("code", { textContent: "bootc install to-filesystem --bootloader=systemd --composefs-backend --skip-finalize" }),
  " plus a manual shim step. ",
  "The ",
  $("a", { href: "https://fedoramagazine.org/sealed-atomic-desktops-test-images/", textContent: "test images" }),
  " are signed with the project's keys, not Fedora's official ones.",
]));

// 6
document.body.appendChild($("h2", { textContent: "6. The -uki tags are not UKIs" }));
document.body.appendChild($("p", {}, [
  "The ",
  $("a", { href: "https://github.com/bootc-dev/bootc/blob/main/.github/workflows/build-and-publish.yml", textContent: "publish workflow" }),
  " builds one image per OS and variant and tags the composefs variant ",
  $("code", { textContent: "<os>-uki" }),
  ". ",
  "It passes only ",
  $("code", { textContent: "BOOTC_variant" }),
  ", while the ",
  $("a", { href: "https://github.com/bootc-dev/bootc/blob/main/Dockerfile", textContent: "Dockerfile" }),
  " has taken explicit ",
  $("code", { textContent: "boot_type" }),
  ", ",
  $("code", { textContent: "bootloader" }),
  " and ",
  $("code", { textContent: "seal_state" }),
  " arguments since ",
  $("a", { href: "https://github.com/bootc-dev/bootc/commit/12bf7dc8dc", textContent: "commit 12bf7dc8dc" }),
  " (2026-02-27), and the Justfile defaults them to ",
  $("code", { textContent: "bls" }),
  ", ",
  $("code", { textContent: "grub" }),
  " and ",
  $("code", { textContent: "unsealed" }),
  ". ",
  "The config blob of every ",
  $("code", { textContent: "-uki" }),
  " tag rebuilt on 2026-09-16 records ",
  $("code", { textContent: "boot_type=bls bootloader=grub seal_state=unsealed" }),
  ", and none of the non-base layers contains a ",
  $("code", { textContent: "/boot" }),
  " entry. ",
  "The tag names have been wrong for six months.",
]));
document.body.appendChild($("p", {}, [
  "An image's build arguments are readable from the registry without pulling it:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "T=$(curl -s \"https://ghcr.io/token?scope=repository:ORG/REPO:pull&service=ghcr.io\" | jq -r .token)\n" +
    "curl -sL -H \"Authorization: Bearer $T\" -H \"Accept: application/vnd.oci.image.manifest.v1+json\" \\\n" +
    "  \"https://ghcr.io/v2/ORG/REPO/manifests/TAG\" | jq -r .config.digest\n" +
    "curl -sL -H \"Authorization: Bearer $T\" \"https://ghcr.io/v2/ORG/REPO/blobs/<digest>\" \\\n" +
    "  | jq -r '.history[].created_by'", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "The ",
  $("code", { textContent: "-L" }),
  " on the blob fetch is required, because the registry redirects to storage and a body-less response otherwise. ",
  "Each history entry prints the build arguments of its stage. ",
  "These images are integration-test images besides: ",
  $("code", { textContent: "LABEL bootc.testimage=1" }),
  ", test kernel arguments, test packages and bound images, and Secure Boot keys generated per run and discarded.",
]));

// 7
document.body.appendChild($("h2", { textContent: "7. What a sealed image cannot do" }));
document.body.appendChild($("p", {}, [
  "A sealed image cannot be extended. ",
  "Any derived layer changes the rootfs and therefore the digest, so install or upgrade fails with ",
  $("samp", { textContent: "The UKI has the wrong composefs= parameter" }),
  " (",
  $("a", { href: "https://github.com/bootc-dev/bootc/issues/2334", textContent: "bootc#2334" }),
  "). ",
  "Re-sealing needs the private key, and a CI key is thrown away after the build. ",
  "A sealed base is an end product, not a base to layer on.",
]));
document.body.appendChild($("p", {}, [
  "Sealed installs need a filesystem with fs-verity support: ",
  $("code", { textContent: "bootc install" }),
  " rejects xfs with ",
  $("samp", { textContent: "Specified filesystem xfs does not support fs-verity" }),
  " and takes ext4 or btrfs. ",
  "Kernel arguments are baked into the UKI at build time via ",
  $("code", { textContent: "/usr/lib/bootc/kargs.d" }),
  ", so install-time ",
  $("code", { textContent: "--karg" }),
  " values do not apply. ",
  "The backend is still experimental: its documentation says on-disk formats are subject to change, the composefs-UKI integration tests are an open issue, and upgrade with a UKI has an open digest mismatch bug. ",
  "Fedora's ",
  $("a", { href: "https://fedoraproject.org/wiki/Changes/ComposefsAtomicDesktops", textContent: "composefs change" }),
  " enabled the root mount as a first step, while the sealed backend and its signing keys remain a test-image effort.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
