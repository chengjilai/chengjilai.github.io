"use strict";


const title = document.createElement("title");
title.textContent = "Fetching the OpenHarmony source tree from China";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Fetching the OpenHarmony source tree from China" }));

document.body.appendChild($("p", {}, [
  "OpenHarmony lives in ",
  $("a", { href: "https://gitcode.com/openharmony", textContent: "gitcode.com/openharmony" }),
  ". The GitHub org is a ",
  "read-only mirror, and a release is one tag on the manifest repo, not a ",
  "tarball.",
]));

// 1. Hosts
document.body.appendChild($("h2", { textContent: "1. Hosts" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Canonical: ",
    $("a", { href: "https://gitcode.com/openharmony", textContent: "gitcode.com/openharmony" }),
    ". ",
    $("a", { href: "https://github.com/openharmony", textContent: "github.com/openharmony" }),
    " is a read-only mirror whose manifest repo carries only weekly ",
    "bak_v0_weekly_* tags, no release tags",
  ]),
  $("li", {}, [
    $("a", { href: "https://gitee.com/openharmony", textContent: "gitee.com/openharmony" }),
    "/<repo>/raw/<branch>/<file> serves raw text, e.g. ",
    $("a", { href: "https://gitee.com/openharmony/docs/raw/master/en/OpenHarmony-Overview.md", textContent: "the docs overview" }),
    "; gitcode's /raw/ endpoint returns its SPA shell",
  ]),
]));

// 2. Tags and repo init
document.body.appendChild($("h2", { textContent: "2. Tags and repo init" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "git ls-remote --tags https://gitcode.com/openharmony/manifest.git\n" +
    "# refs/tags/OpenHarmony-v7.0-Release   (latest release)\n" +
    "# refs/tags/OpenHarmony-v6.1-LTS\n" +
    "\n" +
    "repo init -u https://gitcode.com/openharmony/manifest.git \\\n" +
    "  -b refs/tags/OpenHarmony-v7.0-Release \\\n" +
    "  --repo-url=https://gitee.com/oschina/repo.git", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "repo init self-clones the repo tool from ",
  $("code", { textContent: "gerrit.googlesource.com" }),
  ", which is unreachable; --repo-url supplies a reachable source. The nixpkgs ",
  "git-repo 2.65 has no --depth option. The v7.0 ",
  $("a", { href: "https://gitcode.com/openharmony/manifest", textContent: "manifest" }),
  " resolves to 518 projects, all pinned to the one tag.",
]));

// 3. The sync
document.body.appendChild($("h2", { textContent: "3. The sync" }));
document.body.appendChild($("p", {}, [
  "gitcode drops large pack transfers: RPC failed; curl 56 OpenSSL ",
  "SSL_read: ... unexpected eof, for arkui_ace_engine (1.35 M objects), docs ",
  "(2.1 GB even shallow), kernel_linux_6.6, applications_app_samples, ",
  "device_soc_hisilicon, graphic_graphic_3d and the arkcompiler_* repos. ",
  "The sync then reports the repo as \"revision ... not found\".",
]));
document.body.appendChild($("p", {}, [
  "Shallow-fetch that one repo into its gitdir, then re-run sync:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "git --git-dir=.repo/projects/<path>.git fetch --depth=1 gitcode \\\n" +
    "  refs/tags/<tag>:refs/tags/<tag>\n" +
    "# leftover files block the checkout:\n" +
    "cd <worktree> && git clean -fdx && git checkout -f <tag>", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "arkui_ace_engine is 48 MB shallow instead of gigabytes. Repos with lfs ",
  "pointers fail without git-lfs; sync as env GIT_LFS_SKIP_SMUDGE=1 repo ",
  "sync -c -j4 with git-lfs on PATH.",
]));
document.body.appendChild($("p", {}, [
  "The finished tree is 58 GB: 32 GB worktree (1,232,263 files) plus 27 GB ",
  "of git data. repo forall -c 'git lfs pull' would add the 2263 tracked ",
  "lfs files.",
]));

// 4. What is inside
document.body.appendChild($("h2", { textContent: "4. What is inside" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "The kernel component is a full Linux 5.10.210 tree (its ",
    "README.OpenSource names upstream linux-5.10.y) with OpenHarmony ",
    "patches on top",
  ]),
  $("li", {}, [
    "Drivers run on the HDF framework (C, kernel-decoupled); app code runs ",
    "on the ArkTS runtime (PANDA bytecode)",
  ]),
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
