"use strict";

const title = document.createElement("title");
title.textContent = "Transcripts bridge what titles can't";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Transcripts bridge what titles can't" }));

document.body.appendChild($("h2", { textContent: "1. Title-only semantic matching is noisy" }));
document.body.appendChild($("p", {}, [
  "Scoring candidates by TF-IDF cosine against a corpus of talk titles separated junk from tech, ",
  "but not desired from boring: a \"how to switch to Linux\" tutorial scored above deep programming ",
  "talks, because titles are sparse and share few tokens.",
]));

document.body.appendChild($("h2", { textContent: "2. The same community, zero title overlap" }));
document.body.appendChild($("p", {}, [
  "A McCarthy talk scored 0.139 against a corpus containing a Robin Milner talk. Same field, no ",
  "shared title words. With the candidate's TRANSCRIPT in the vector (lambda calculus, formal ",
  "logic, recursion), the same talk scored 0.245: above the threshold, ranked with the desired ",
  "talks. Both sides grow. Each accepted talk's transcript adds its vocabulary to the reference.",
]));

document.body.appendChild($("h2", { textContent: "3. Transcripts are nearly free" }));
document.body.appendChild($("p", {}, [
  "Auto-subtitles arrive with the video for most sources (YouTube auto-subs, conference JSON ",
  "subtitles); scoring a transcript costs about a millisecond. The vocabulary that a title hides ",
  "is right there in the caption file.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
