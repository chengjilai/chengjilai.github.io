"use strict";

const title = document.createElement("title");
title.textContent = "ty, the Astral type checker: strict mode without --strict";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "ty, the Astral type checker: strict mode without --strict" }));

document.body.appendChild($("h2", { textContent: "1. Strictness is per-rule, not a flag" }));
document.body.appendChild($("p", {}, [
  "ty 0.0.67 has no ",
  $("code", { textContent: "--strict" }),
  " flag; ",
  $("code", { textContent: "ty check --strict" }),
  " fails with ",
  $("code", { textContent: "unexpected argument" }),
  ". Strictness is configured per rule in ",
  $("code", { textContent: "[tool.ty.rules]" }),
  " with severities ",
  $("code", { textContent: "ignore" }),
  ", ",
  $("code", { textContent: "warn" }),
  " and ",
  $("code", { textContent: "error" }),
  ".",
]));
document.body.appendChild($("pre", {}, [
  $("code", { textContent: "[tool.ty.rules]\n\"missing-type-argument\" = \"error\"" }),
]));
document.body.appendChild($("p", {}, [
  "There is no wildcard key. ",
  $("code", { textContent: "\"*\" = \"error\"" }),
  " is rejected with ",
  $("code", { textContent: "warning[unknown-rule]: Unknown rule `*`" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "The ",
  $("code", { textContent: "[tool.ty]" }),
  " table accepts only six keys: ",
  $("code", { textContent: "environment" }),
  ", ",
  $("code", { textContent: "src" }),
  ", ",
  $("code", { textContent: "rules" }),
  ", ",
  $("code", { textContent: "terminal" }),
  ", ",
  $("code", { textContent: "analysis" }),
  " and ",
  $("code", { textContent: "overrides" }),
  ". A ",
  $("code", { textContent: "python-version" }),
  " key at the top level is a parse error; it lives under ",
  $("code", { textContent: "[tool.ty.environment]" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "src" }),
  " is a boolean toggle, not a path list. ",
  $("code", { textContent: "src = [\"fc.py\"]" }),
  " is rejected with ",
  $("code", { textContent: "invalid type: string, expected a boolean" }),
  ".",
]));

document.body.appendChild($("h2", { textContent: "2. type(x) is C narrows; t = type(x) does not" }));
document.body.appendChild($("p", {}, [
  "A dispatch written as ",
  $("code", { textContent: "t = type(x)" }),
  " followed by ",
  $("code", { textContent: "if t is C:" }),
  " does not narrow. ty still reports the attribute access against the whole union: ",
  $("code", { textContent: "Attribute `v` is not defined on `B` in union `A | B`" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "The inline form ",
  $("code", { textContent: "if type(x) is C:" }),
  " narrows correctly. Dispatch functions must call ",
  $("code", { textContent: "type()" }),
  " in the condition, not store it in a variable first.",
]));

document.body.appendChild($("h2", { textContent: "3. The rule list comes from the tool" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "ty explain rule" }),
  " prints every rule with its default level. In 0.0.67 the count of rules defaulting below ",
  $("code", { textContent: "error" }),
  " is 31: ",
  $("code", { textContent: "missing-type-argument" }),
  ", ",
  $("code", { textContent: "possibly-unresolved-reference" }),
  ", ",
  $("code", { textContent: "possibly-missing-import" }),
  ", ",
  $("code", { textContent: "possibly-missing-attribute" }),
  ", ",
  $("code", { textContent: "deprecated" }),
  ", ",
  $("code", { textContent: "division-by-zero" }),
  ", ",
  $("code", { textContent: "unused-awaitable" }),
  ", ",
  $("code", { textContent: "unused-ignore-comment" }),
  " and the rest. Strict mode is the list of 31 rules set to ",
  $("code", { textContent: "error" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "The elevation is real. A bare generic annotation such as ",
  $("code", { textContent: "re.Match" }),
  " is invisible by default, then caught by ",
  $("code", { textContent: "missing-type-argument" }),
  " once the rule is elevated.",
]));
document.body.appendChild($("p", {}, [
  "ty is inference-first and has no require-annotations rule; mypy's ",
  $("code", { textContent: "disallow_untyped_defs" }),
  " has no equivalent. Annotating the entry points and the AST node classes makes ty check the whole call graph. The annotation pass surfaced real defects: a class-level discriminator attribute and an instance attribute sharing one name, an out-of-bounds sentinel tuple that did not match the declared token type, and two unreachable ",
  $("code", { textContent: "None" }),
  " paths.",
]));

document.body.appendChild($("h2", { textContent: "4. ruff ALL" }));
document.body.appendChild($("p", {}, [
  "Ruff strict is ",
  $("code", { textContent: "select = [\"ALL\"]" }),
  ". On an 1800-line typed Python file it fired 285 diagnostics: D docstrings (124), ANN204 ",
  $("code", { textContent: "__init__" }),
  " return annotations (39), T201 ",
  $("code", { textContent: "print" }),
  " (26), then TRY003 and EM exception-message rules, C901 and PLR09xx complexity on the type-dispatch functions, S101 ",
  $("code", { textContent: "assert" }),
  ", FBT boolean-typed arguments, COM812 trailing commas, PLR2004 magic numbers and ERA001 pseudo-code comments.",
]));
document.body.appendChild($("p", {}, [
  "The fixable classes: ANN204 is ",
  $("code", { textContent: "-> None" }),
  " on every ",
  $("code", { textContent: "__init__" }),
  "; FBT is keyword-only boolean parameters; PLR2004 is a named constant for the magic number; ERA001 is rewording a comment that reads like code. The rest get documented ignores: ",
  $("code", { textContent: "print" }),
  " in a demo, ",
  $("code", { textContent: "assert" }),
  " in a correctness harness.",
]));
document.body.appendChild($("p", {}, [
  "COM812 conflicts with ",
  $("code", { textContent: "ruff format" }),
  ". Ruff's own warning says so: ",
  $("code", { textContent: "may cause conflicts when used with the formatter" }),
  ". With the formatter in use, COM812 goes to the ignore list; the formatter owns trailing commas.",
]));
document.body.appendChild($("p", {}, [
  "Ruff's cache write fails in read-only directories: ",
  $("code", { textContent: "Failed to create temporary file" }),
  ". ",
  $("code", { textContent: "--no-cache" }),
  " fixes lint apps that run against files in a read-only tree.",
]));

document.body.appendChild($("h2", { textContent: "5. Python 3.14 makes annotations lazy anyway" }));
document.body.appendChild($("p", {}, [
  "PEP 649 makes annotation evaluation lazy by default on Python 3.14. ",
  $("code", { textContent: "from __future__ import annotations" },
  ),
  " is a no-op there, accepted without a warning.",
]));
document.body.appendChild($("p", {}, [
  "On 3.11 to 3.13 the same forward references need the future import. A class that annotates with a type alias defined later in the module raises ",
  $("code", { textContent: "NameError" }),
  " at class definition time. The import can be dropped only when ",
  $("code", { textContent: "requires-python" }),
  " is ",
  $("code", { textContent: ">=3.14" }),
  ".",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
