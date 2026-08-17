"use strict";

const title = document.createElement("title");
title.textContent = "nix flake check does not run your test apps";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "nix flake check does not run your test apps" }));

document.body.appendChild($("p", {}, [
  "A workspace's test suites were wired as ",
  $("code", { textContent: "apps.$\{system\}.test" }),
  " flakes and the gate was ",
  $("code", { textContent: "nix flake check" }),
  ". Every check was green. Running ",
  $("code", { textContent: "nix run .#test" }),
  " across the same flakes failed on 27 suites in a row: the tests were wired as a custom app, and ",
  $("code", { textContent: "nix flake check" }),
  " never runs apps.",
]));

document.body.appendChild($("h2", { textContent: "1. What flake check evaluates" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "nix flake check" }),
  " evaluates the ",
  $("code", { textContent: "checks" }),
  " output of a flake, and builds everything the ",
  $("code", { textContent: "apps" }),
  " output references; it does not execute ",
  $("code", { textContent: "apps" }),
  " as programs. ",
  "A test wired as ",
  $("code", { textContent: "apps.$\{system\}.test" }),
  " is built and then discarded; the flake is green no matter what the test does at runtime.",
]));

document.body.appendChild($("h2", { textContent: "2. The two safe wirings" }));
document.body.appendChild($("p", {}, [
  "Wire tests as ",
  $("code", { textContent: "checks.$\{system\}.test" }),
  " (a ",
  $("code", { textContent: "runCommand" }),
  " whose builder runs the suite and ",
  $("code", { textContent: "touch $out" }),
  "), so ",
  $("code", { textContent: "nix flake check" }),
  " runs them itself. ",
  "Or keep the test app and run it explicitly as the CI step: ",
  $("code", { textContent: "nix run .#test --offline" }),
  ".",
]));

document.body.appendChild($("h2", { textContent: "3. What the sweep caught" }));
document.body.appendChild($("p", {}, [
  "The 27 broken suites were mostly a rename bug: the test files were renamed (test_base64.py from an old test_b64.py) and each test app kept its old ",
  $("code", { textContent: "-m unittest -v test_old_name" }),
  " module argument, which now names nothing. ",
  "The robust form is discovery, not a module name: ",
  $("code", { textContent: "unittest discover -s <src> -p 'test_*.py'" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "A few were real code drift the suite had been designed to catch: an AVL and a splay tree whose insert created a second node for an existing key, a cycle finder that hardcoded its start node, and a suite with no test file at all.",
]));

document.body.appendChild($("h2", { textContent: "4. Verifying the gate " }));
document.body.appendChild($("p", {}, [
  "After switching the broken apps to ",
  $("code", { textContent: "discover" }),
  " forms and fixing the suites, ",
  $("code", { textContent: "nix run .#test --offline" }),
  " passed 286 of 286, and ",
  $("code", { textContent: "nix flake check --offline" }),
  " passed for all 358 flakes.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
