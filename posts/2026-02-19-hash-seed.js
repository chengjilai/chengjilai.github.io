"use strict";


const title = document.createElement("title");
title.textContent = "Python set iteration order is seed-dependent";
document.head.appendChild(title);

document.body.appendChild($("h1", {
  textContent: "Python set iteration order is seed-dependent",
}));

document.body.appendChild($("h2", {
  textContent: "1. The hash seed changes set order",
}));
document.body.appendChild($("p", {}, [
  "Set iteration order derives from element hashes. String hashing is salted ",
  "per process by ",
  $("a", {
    href: "https://docs.python.org/3/using/cmdline.html#envvar-PYTHONHASHSEED",
    textContent: "PYTHONHASHSEED",
  }),
  ", so the same set iterates in a different order in every process:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "$ PYTHONHASHSEED=1 python3 -c 'print(\"|\".join({\"c\",\"c++\",\"rust\",\"go\"}))'\n" +
      "rust|go|c++|c\n" +
      "$ PYTHONHASHSEED=2 python3 -c 'print(\"|\".join({\"c\",\"c++\",\"rust\",\"go\"}))'\n" +
      "c|go|rust|c++",
      "shell"),
  }),
]));

document.body.appendChild($("h2", {
  textContent: "2. Order in, order out",
}));
document.body.appendChild($("p", {}, [
  "Code that joins set members into an ordered structure inherits the order. ",
  "A regex alternation is one such structure: ",
  $("code", { textContent: "'|'.join(some_set)" }),
  " places the alternatives in set order, and alternation matching is ",
  "leftmost-first.",
]));

document.body.appendChild($("h2", {
  textContent: "3. Prefix markers shadow each other",
}));
document.body.appendChild($("p", {}, [
  "At a position where two alternatives both match, the earlier one wins. ",
  $("code", { textContent: '"c"' }),
  " is a prefix of ",
  $("code", { textContent: '"c++"' }),
  ", so which one the alternation reports depends on the join order. ",
  "A scoring function over one input returned 27.25 in one process and ",
  "26.25 in another; the two runs differed only in which prefix marker ",
  "the alternation picked.",
]));

document.body.appendChild($("h2", {
  textContent: "4. The fix: sort before joining",
}));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "'|'.join(sorted(markers))" }),
  " makes the order deterministic across processes. The output stops ",
  "varying, and a port to another language can reproduce the order.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
