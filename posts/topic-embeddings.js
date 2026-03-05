"use strict";

const title = document.createElement("title");
title.textContent = "Title embeddings, not whole content, for topic-level duplicates";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Title embeddings, not whole content, for topic-level duplicates" }));

document.body.appendChild($("h2", { textContent: "1. The task" }));
document.body.appendChild($("p", {}, [
  "A blog gate: a new topic that duplicates an existing post's topic must be blocked, and the author updates the existing post instead of creating a new one. The calibration below used 33 real note/post pairs plus 12 adversarial cases.",
]));

document.body.appendChild($("h2", { textContent: "2. Title-level separates" }));
document.body.appendChild($("p", {}, [
  "Embedding a candidate title against existing titles: same-topic pairs median 0.97 cosine, different topics at most 0.57. A 0.70 threshold sits in a clean gap.",
]));
document.body.appendChild($("p", {}, [
  "Reworded duplicates scored 0.72-0.96; fresh topics at most 0.31.",
]));

document.body.appendChild($("h2", { textContent: "3. Whole-content overlaps" }));
document.body.appendChild($("p", {}, [
  "Full note text against full post text: same-topic median 0.65, different topics up to 0.74. The ranges overlap.",
]));
document.body.appendChild($("p", {}, [
  "Long texts mean-pool their tokens, and related-but-different topics share jargon - an Emacs cluster (colors, config, terminal) - so different-topic scores inflate into the same-topic range. Section-heading skeletons were worse: 0.95 cross-topic inside the cluster.",
]));

document.body.appendChild($("h2", { textContent: "4. Content is for near-copies" }));
document.body.appendChild($("p", {}, [
  "Literal copies, same prose with a new title, scored 0.97 or higher. Paraphrases that keep the jargon scored 0.85-0.90. Different topics scored at most 0.75.",
]));
document.body.appendChild($("p", {}, [
  "Two signals, two thresholds: title blocks topics at 0.70; content blocks near-copies at 0.85.",
]));

document.body.appendChild($("h2", { textContent: "5. Model choice" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [ $("strong", { textContent: "nomic-embed-text-v1.5" }), ", 0.14B, CPU: the cleanest title calibration." ]),
  $("li", {}, [ $("strong", { textContent: "Qwen3-Embedding-0.6B" }), " on a 6 GB GPU: whole content with a 32K context." ]),
  $("li", {}, [ $("strong", { textContent: "Qwen3-Embedding-8B" }), " quantized, measured as reference: duplicate floor 0.79 vs 0.74, fresh baseline 0.49 vs 0.60. The gain is marginal, and the weights do not fit beside the 0.6B model on the same card. Not deployed." ]),
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
