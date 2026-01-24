"use strict";

const title = document.createElement("title");
title.textContent = "How to submit a change to Guix (2026)";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "How to submit a change to Guix (2026)" }));

document.body.appendChild($("p", {}, [
  "Since 2026-01-01 Guix accepts pull requests on codeberg.org/guix/guix; the ",
  "email route (guix-patches@gnu.org) is retired. The GitHub mirror is ",
  "read-only; GitHub PRs are not the channel.",
]));

// 1. Two submission methods
document.body.appendChild($("h2", { textContent: "1. Two submission methods" }));
document.body.appendChild($("ol", {}, [
  $("li", {}, ["Fork on Codeberg, push a branch, open a PR."]),
  $("li", {}, [
    "AGit workflow (no fork, less disk):",
    $("pre", {}, [
      $("code", { innerHTML: highlight(
        "git push origin HEAD:refs/for/master \\\n" +
        "  -o topic=my-topic \\\n" +
        "  -o title=\"gnu: kmscon: Update to 10.0.1-2.7ae1c81.\" \\\n" +
        "  -o description=\"one line, no newlines\"\n" +
        "# updates:\n" +
        "git push origin HEAD:refs/for/master -o topic=my-topic -o force-push=yes", "shell") }),
    ]),
    "Push options must be single-line; the PR URL is printed on push.",
  ]),
]));

// 2. Commit conventions
document.body.appendChild($("h2", { textContent: "2. Commit conventions" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "ChangeLog format: \"gnu: pkg: Update to ...\" then a blank line, then ",
    "\"* gnu/packages/terminals.scm (pkg)[version]: ...\"",
  ]),
  $("li", {}, [
    "Describe context, impact, and how you tested",
  ]),
  $("li", {}, [
    "Bump checklist: pick a commit that builds AND passes its tests (a later ",
    "commit added a flaky test; check); version via ",
    $("code", { textContent: "(git-version \"10.0.1\" \"2\" \"commit\")" }),
    "; get the git-fetch sha256 from a build's \"actual hash\" error",
  ]),
]));

// 3. A real PR: the kmscon --blink bump (#10473)
document.body.appendChild($("h2", { textContent: "3. A real PR: the kmscon --blink bump (#10473)" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Check upstream first: the \"missing\" option may already exist in a newer ",
    "commit; the real gap was Guix packaging an old release",
  ]),
  $("li", {}, [
    "GitHub blocked locally; SWH is the fallback. Request SWH ingestion for recent ",
    "commits",
  ]),
  $("li", {}, [
    "A local-source test build proves compile + tests without the network; ",
    "keep the real origin URL in the PR",
  ]),
  $("li", {}, [
    "A kmscon PR (",
    $("a", { href: "https://github.com/kmscon/kmscon/pull/487", textContent: "#487" }),
    ", \"Add cursor style support\") already covered the DECSCUSR angle; ",
    "check for existing open work before duplicating it; the careful check is ",
    "part of the contribution",
  ]),
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
  ", ",
  $("a", { href: "https://codeberg.org/guix/guix/pulls/10473", textContent: "PR #10473" }),
]));
