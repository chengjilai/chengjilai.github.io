"use strict";


const title = document.createElement("title");
title.textContent = "Keeping a language model out of your prose";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Keeping a language model out of your prose" }));

document.body.appendChild($("p", {}, [
  "A model composing prose adds words that carry no fact: invented reasons, ",
  "intensifiers, metaphors. Two checks remove them. The first is a deletion ",
  "test; the second is a lexical audit of the words models overuse.",
]));

// 1. The deletion test
document.body.appendChild($("h2", { textContent: "1. The deletion test" }));
document.body.appendChild($("p", {}, [
  "Delete any word, then ask if a fact was lost. If nothing was lost, the ",
  "word was decoration. The test catches the class even when no list names ",
  "the word:",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "\"No numpy on the machine\" is a fabricated reason; the method stands ",
    "alone: \"a Goertzel sweep over the frequencies of interest\".",
  ]),
  $("li", {}, [
    "\"Record the source's monitor, not through an app\" adds nothing and is ",
    "wrong; the sentence is \"Record the source's monitor.\"",
  ]),
  $("li", {}, [
    "\"pure-Python\" is an adjective about intent; the noun is the fact.",
  ]),
  $("li", {}, [
    "\"the fix is EQ, not suppression alone\" restates the diagnosis already ",
    "given; cut it.",
  ]),
]));
document.body.appendChild($("p", {}, [
  "Reasons survive only when they are verified mechanisms: \"the speaker ",
  "follows 0x16, so the auto-mute mutes the wrong DAC\" is a fact. A reason ",
  "that is invented or inferable is cut.",
]));

// 2. The words that give a model away
document.body.appendChild($("h2", { textContent: "2. The words that give a model away" }));
document.body.appendChild($("p", {}, [
  "Some words mark model prose statistically. ",
  $("a", { href: "https://gist.github.com/swyxio/8ac555e88ad153764051012d2db27ea7", textContent: "swyxio's list of overused words" }),
  " collects them: delve, seamless, unlock. The list cites two ",
  "arXiv papers that measure the shift: ",
  $("a", { href: "https://arxiv.org/abs/2403.07183", textContent: "Liang et al. 2024" }),
  " (vocabulary in AI-assisted peer reviews) and ",
  $("a", { href: "https://arxiv.org/abs/2404.08627", textContent: "Geng and Trotta 2024" }),
  " (academics' writing style). A ",
  $("a", { href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12679996", textContent: "2025 PubMed study" }),
  " counts the word delve in medical papers before and after ChatGPT; the ",
  "frequency jump is the marker.",
]));

// 3. The audit is a linter
document.body.appendChild($("h2", { textContent: "3. The audit is a linter" }));
document.body.appendChild($("p", {}, [
  "The second check is a regex list scanned over the prose, emitting a ",
  "warning per match. The genre exists for human prose: ",
  $("a", { href: "https://github.com/btford/write-good", textContent: "write-good" }),
  " (passive voice, \"so\" at sentence start, \"there is\", weasel words) and ",
  $("a", { href: "https://github.com/amperser/proselint", textContent: "proselint" }),
  " (weasel words, redundancy, cliches). A list need not be complete: the ",
  "deletion test catches whatever the list misses. A warning is a judgment ",
  "call: a word that carries a fact stays, the rest go.",
]));

// 4. Edit, don't compose
document.body.appendChild($("h2", { textContent: "4. Edit, don't compose" }));
document.body.appendChild($("p", {}, [
  "The reliable workflow keeps the writer's own sentences. The draft is an ",
  "edit of the source notes: cut, link, de-identify; keep the note's ",
  "sentences verbatim. Every sentence must trace to a note fact or a linked ",
  "source. A sentence that traces to neither was composed and gets deleted. ",
  "Composition is where the decoration enters; editing leaves no room for ",
  "it.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
