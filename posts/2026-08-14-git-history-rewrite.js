"use strict";

const title = document.createElement("title");
title.textContent = "Rebuilding git history from per-file change chains";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Rebuilding git history from per-file change chains" }));

document.body.appendChild($("p", {}, [
  "A linear history can be rebuilt commit by commit with git commit-tree. ",
  "The final tree stays byte-identical: every file's last version is the ",
  "original last version. This blog's history was rebuilt this way; each post ",
  "sits in its own commit, dated at its declared date.",
]));

document.body.appendChild($("h2", { textContent: "1. The per-file chain is the unit of order" }));
document.body.appendChild($("p", {}, [
  "A commit is a tree snapshot; the history is the sequence of snapshots. ",
  "Rebuilding means choosing a new sequence with the same last snapshot.",
]));
document.body.appendChild($("p", {}, [
  "The ordering unit is the per-file chain: the versions of one file in ",
  "original order. Commits on disjoint file sets can be reordered freely. ",
  "Commits touching the same file keep their original order.",
]));
document.body.appendChild($("p", {}, [
  "A batch commit that adds N files splits into N commits. The parts are ",
  "independent when no two parts touch the same file.",
]));
document.body.appendChild($("p", {}, [
  "Dates are assigned per chain: the introduction at its declared date, each ",
  "later change one day later. Emitting commits sorted by date and original ",
  "index preserves every chain. No conflict resolution is needed.",
]));

document.body.appendChild($("h2", { textContent: "2. Trees through a scratch index" }));
document.body.appendChild($("p", {}, [
  "git mktree rejects paths containing slashes: fonts/, posts/. Build each ",
  "tree through a scratch index instead:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "GIT_INDEX_FILE=.rewrite-index git read-tree <parent>\n" +
    "git update-index --add --cacheinfo 100644,<blob>,<path>\n" +
    "git update-index --force-remove <path>\n" +
    "git write-tree", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "git hash-object -w --stdin prints the hash with a trailing newline; strip ",
  "it. A rename commit can carry a content edit in passing: fold that blob ",
  "into the last content commit, and let the rename use the final blobs.",
]));

document.body.appendChild($("h2", { textContent: "3. Generated files are regenerated, not inherited" }));
document.body.appendChild($("p", {}, [
  "A generated file changes at every commit that would change it. Rebuild it ",
  "synthetically at each such commit. The format can change at one specific ",
  "commit: the index went from undated links to dated links at the ",
  "date-in-filename commit.",
]));
document.body.appendChild($("p", {}, [
  "The final generated file must byte-match the real generator's output. The ",
  "end-of-build tree diff proves it.",
]));

document.body.appendChild($("h2", { textContent: "4. Verify before pushing" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "diff <(git ls-tree -r HEAD) <(git ls-tree -r \"$NEW\")   # empty = identical trees\n" +
    "git fsck", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "Check each file's first-change date against its declared date. Check that ",
  "commit dates are monotonic along the history.",
]));
document.body.appendChild($("p", {}, [
  "Keep a backup branch at the old HEAD. Push with --force-with-lease; the ",
  "old history stays reachable in the backup branch and the scratch clone.",
]));

document.body.appendChild($("h2", { textContent: "5. --follow follows splits, not just renames" }));
document.body.appendChild($("p", {}, [
  "git log --follow traces a file through renames. When a new file was split ",
  "from an old one, script.js became building-this-page.js, the older commits ",
  "it lists are the source file's history, not the new file's.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
