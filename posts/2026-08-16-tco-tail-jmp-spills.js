"use strict";

const title = document.createElement("title");
title.textContent = "TCO: the self-tail-call jmp must precede the param spills";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "TCO: the self-tail-call jmp must precede the param spills" }));

document.body.appendChild($("h2", { textContent: "1. The bug" }));
document.body.appendChild($("p", {}, [
  "Tail-call optimization in a compiler that spills parameters to stack slots: the self-tail-call ",
  $("code", { textContent: "jmp" }),
  " target must be BEFORE the parameter re-spill block. The body reads parameters from the stack slots, so a jump that re-enters after the spills re-reads the old values. The compiled program hangs in an infinite loop with ",
  $("code", { textContent: "n" }),
  " never changing.",
]));

document.body.appendChild($("h2", { textContent: "2. The diagnosis split" }));
document.body.appendChild($("p", {}, [
  "Split the pipeline: emit the generated ",
  $("code", { textContent: ".s" }),
  " to a file, run the assembler yourself (exits 0), run the binary under ",
  $("code", { textContent: "timeout" }),
  " (exit 124). The hang is the emitted code, not the toolchain. In a pipeline run the hang lands in the subprocess call, so it looks like the assembler or linker hung; ",
  $("code", { textContent: "faulthandler" }),
  " on the parent shows the subprocess, not the bug.",
]));

document.body.appendChild($("h2", { textContent: "3. The fix" }));
document.body.appendChild($("p", {}, [
  "Place the tail label before the parameter stores, so the jump re-runs ",
  $("code", { textContent: "movq %rdi, -8(%rbp)" }),
  " with the fresh registers. The frame is reused without ",
  $("code", { textContent: "pushq" }),
  ", so the frame-depth counter stays flat; that part was correct.",
]));

document.body.appendChild($("h2", { textContent: "4. The same class of bug" }));
document.body.appendChild($("p", {}, [
  "GOSUB/NEXT in a BASIC interpreter that pushes the GOSUB's own line number: RETURN re-executes the GOSUB forever. Continuation targets must point past the resuming statement.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
