"use strict";


const title = document.createElement("title");
title.textContent = "Mill 1.1 build files: what changed";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Mill 1.1 build files: what changed" }));

// 1. Build files are Scala 3
document.body.appendChild($("h2", { textContent: "1. Build files are Scala 3" }));
document.body.appendChild($("p", {}, [
  "Mill 1.1 build files compile with Scala 3: the mill jars are ",
  $("code", { textContent: "_3" }),
  " artifacts, type errors print union types (",
  $("code", { textContent: "Seq[mill.PathRef | os.Path]" }),
  "), and macro errors read ",
  $("code", { textContent: "Task.ctx() can only be used within a Task{...} block" }),
  ". Most 0.12-era tutorials are stale on the points below.",
]));

// 2. The renames
document.body.appendChild($("h2", { textContent: "2. The renames" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "Agg" }),
  " is gone: ",
  $("code", { textContent: "Seq[Dep]" }),
  " instead. ",
  $("code", { textContent: "ivyDeps" }),
  " is ",
  $("code", { textContent: "mvnDeps" }),
  " (plus ",
  $("code", { textContent: "compileMvnDeps" }),
  " and ",
  $("code", { textContent: "runMvnDeps" }),
  "). ",
  $("code", { textContent: "T.dest" }),
  " is ",
  $("code", { textContent: "Task.dest" }),
  ". ",
  $("code", { textContent: "ivy\"...\"" }),
  " is ",
  $("code", { textContent: "mvn\"...\"" }),
  ": ",
  $("code", { textContent: "org:name:ver" }),
  " plain, ",
  $("code", { textContent: "org::name:ver" }),
  " binary cross, ",
  $("code", { textContent: "org::name::ver" }),
  " cross plus platformed, ",
  $("code", { textContent: "org:::name:ver" }),
  " full cross (",
  $("a", { href: "https://github.com/com-lihaoyi/mill/blob/main/libs/javalib/src/mill/javalib/Dep.scala", textContent: "Dep.scala" }),
  ").",
]));

// 3. Tasks write only in Task.dest
document.body.appendChild($("h2", { textContent: "3. Tasks write only in Task.dest" }));
document.body.appendChild($("p", {}, [
  "A plain ",
  $("code", { textContent: "Task" }),
  " may not write outside ",
  $("code", { textContent: "Task.dest" }),
  ": ",
  $("code", { textContent: "Jvm.callProcess(cwd=moduleDir)" }),
  " fails inside a Task with ",
  $("code", { textContent: "Writing to  not allowed during execution of" }),
  ". Pass ",
  $("code", { textContent: "cwd = null" }),
  " to inherit Mill's working directory. ",
  $("code", { textContent: "Task.Command" }),
  "s may write anywhere. Helper methods cannot call tasks at all: pass values and ",
  $("code", { textContent: "(using ctx: mill.api.TaskCtx)" }),
  " explicitly.",
]));

// 4. Test sources live in test/src/
document.body.appendChild($("h2", { textContent: "4. Test sources live in test/src/" }));
document.body.appendChild($("p", {}, [
  "The test module reads sources from ",
  $("code", { textContent: "test/src/" }),
  ", not ",
  $("code", { textContent: "test/" }),
  ". A misplaced test file compiles nothing and ",
  $("code", { textContent: "mill test" }),
  " reports success with 0 tests: discovery uses the zinc analysis plus the framework's fingerprints, not a directory scan.",
]));

// 5. The separator is a literal argument in single-select mode
document.body.appendChild($("h2", { textContent: "5. The separator is a literal argument in single-select mode" }));
document.body.appendChild($("p", {}, [
  "In single-select mode the ",
  $("code", { textContent: "--" }),
  " separator is a literal argument: ",
  $("code", { textContent: "./mill run -- x" }),
  " passes ",
  $("code", { textContent: "\"--\"" }),
  " to the program (",
  $("a", { href: "https://github.com/com-lihaoyi/mill/blob/main/core/api/src/mill/api/internal/ParseArgs.scala", textContent: "ParseArgs.scala" }),
  " takes the first token as the selector and drops the rest). Only ",
  $("code", { textContent: "+" }),
  " multi-select splits on the separator. Mill's own ",
  $("code", { textContent: "ScalaModule.run" }),
  " does not strip it.",
]));

// 6. Declarative YAML and helper files
document.body.appendChild($("h2", { textContent: "6. Declarative YAML and helper files" }));
document.body.appendChild($("p", {}, [
  "Since 1.1.0 a build can be ",
  $("code", { textContent: "build.mill.yaml" }),
  " plus ",
  $("code", { textContent: "test/package.mill.yaml" }),
  " with no build.mill at all (",
  $("a", { href: "https://github.com/com-lihaoyi/mill/blob/main/changelog.adoc", textContent: "changelog" }),
  "). Task values are settable: ",
  $("code", { textContent: "extends: [build.ScalaTests, TestModule.Munit]" }),
  ", ",
  $("code", { textContent: "munitVersion: 1.3.5" }),
  ", ",
  $("code", { textContent: "jvmVersion: temurin:21" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "Any ",
  $("code", { textContent: "*.mill" }),
  " file beside build.mill compiles into the same ",
  $("code", { textContent: "package build" }),
  ": reusable traits go there, and the root build file stays small.",
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
