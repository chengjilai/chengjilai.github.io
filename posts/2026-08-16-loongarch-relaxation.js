"use strict";

const title = document.createElement("title");
title.textContent = "LoongArch linker relaxation: the pcaddi fold";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "LoongArch linker relaxation: the pcaddi fold" }));

document.body.appendChild($("h2", { textContent: "1. The marker" }));
document.body.appendChild($("p", {}, [
  "R_LARCH_RELAX is relocation 100 in the LoongArch ELF ABI: ",
  $("code", { textContent: "Instruction can be relaxed, paired with a normal relocation at the same address" }),
  ". The assembler emits it at the same offset as every ",
  $("code", { textContent: "%pcala_lo12" }),
  " or ",
  $("code", { textContent: "%got_pc_lo12" }),
  " relocation, marking the pair as a relaxation candidate for the linker.",
]));

document.body.appendChild($("h2", { textContent: "2. The fold" }));
document.body.appendChild($("p", {}, [
  "The transformation is lld's ",
  $("code", { textContent: "relaxPCHi20Lo12" }),
  " (lld/ELF/Arch/LoongArch.cpp), quoted in its comment block:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { textContent: "From:\n  pcalau12i $a0, %pc_hi20(sym) | %got_pc_hi20(sym)\n  addi.w/d $a0, $a0, %pc_lo12(sym) | %got_pc_lo12(sym)\nTo:\n  pcaddi    $a0, (sym - PC) >> 2" }),
]));
document.body.appendChild($("p", {}, [
  "pcaddi is the PC-relative add: 22-bit signed immediate, 4-aligned, opcode 0x0C at bits 31:25. The two instructions collapse into one when the delta fits and the pair is canonical: pcalau12i's rd must equal the second instruction's rj, which must equal its rd. The opcode shape is the semantic check: PCALA pairs must end in addi.w/d (an address-take), GOT pairs in ld.w/d (a load).",
]));

document.body.appendChild($("h2", { textContent: "3. The relocation survives" }));
document.body.appendChild($("p", {}, [
  "On a fold the HI20 instruction is deleted, the LO12 word is rewritten as pcaddi, and the LO12 relocation is REWRITTEN to R_LARCH_PCREL20_S2 (103), not removed. Every later layout pass re-applies the delta against the final addresses.",
]));
document.body.appendChild($("p", {}, [
  "Folding with a frozen value is a bug. The first attempt removed the relocation at fold time and wrote the then-current delta into the instruction. Later folds shrank sections that sat before the target, the target moved, and the frozen immediate pointed at the wrong address. The surviving relocation is what makes the fixpoint correct: values are never frozen.",
]));

document.body.appendChild($("h2", { textContent: "4. GOT pairs fold to the symbol" }));
document.body.appendChild($("p", {}, [
  "A GOT pair folds to the symbol's own address, not the GOT slot: lld computes dest = sym->getVA(), and requires the symbol to be defined and non-preemptible. The GOT slot then dies with the pair. Folding to the slot's address changes semantics: the pair loads the slot's value, while pcaddi yields the slot's address.",
]));

document.body.appendChild($("h2", { textContent: "5. The fixpoint" }));
document.body.appendChild($("p", {}, [
  "Relaxation runs as layout, apply, fold, re-layout, until no fold applies. Each fold shrinks the image by four bytes. Shrinking only brings later targets closer, so the process is monotone and terminates.",
]));

document.body.appendChild($("h2", { textContent: "6. The wrong forms" }));
document.body.appendChild($("p", {}, [
  "Two wrong relaxed forms failed before the right one. An r0-based load with a PC-relative delta produced the address where the value belonged; tracing showed r4 = 0x40, the address of magic, instead of M[0x40], its value. Folding a GOT pair to the slot's address jumped to the slot itself. Read lld's source before implementing; its comment block carries the exact From/To sequences and the register and range checks.",
]));

document.body.appendChild($("h2", { textContent: "7. The gap and the verification loop" }));
document.body.appendChild($("p", {}, [
  "The from-scratch LoongArch linker niche is empty: two tiny emulators, no unicorn backend, capstone decode-only. Loongson's ISA documents are CC BY-NC-ND 4.0, which covers the documentation text, not the ISA or implementations; lld is Apache-2.0; binutils and QEMU are GPL and were consulted for functional facts only (opcode constants, the 12-byte PLT stub, bit-pattern cross-checks).",
]));
document.body.appendChild($("p", {}, [
  "No LoongArch toolchain is needed to verify such a linker. Cross-check every encoding against ",
  $("a", { href: "https://github.com/qemu/qemu/blob/master/target/loongarch/insns.decode", textContent: "qemu's target/loongarch/insns.decode" }),
  ", and validate the emitted object files with ",
  $("code", { textContent: "file" }),
  " and ",
  $("code", { textContent: "readelf" }),
  ", which understand foreign-machine ELF. readelf truncates long relocation names to the column width, so assert on ",
  $("code", { textContent: "PCALA_HI" }),
  ", not the full ",
  $("code", { textContent: "R_LARCH_PCALA_HI20" }),
  ".",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
