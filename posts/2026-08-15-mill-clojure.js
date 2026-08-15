"use strict";


const title = document.createElement("title");
title.textContent = "Self-contained Clojure builds with Mill";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Self-contained Clojure builds with Mill" }));

// 1. The JVM is declared, not installed
document.body.appendChild($("h2", { textContent: "1. The JVM is declared, not installed" }));
document.body.appendChild($("p", {}, [
  "Mill declares its JVM in a ",
  $("code", { textContent: ".mill-jvm-version" }),
  " file (",
  $("code", { textContent: "name:version" }),
  ", e.g. ",
  $("code", { textContent: "zulu:26" }),
  "), a ",
  $("code", { textContent: "//| mill-jvm-version" }),
  " build header, or the declarative ",
  $("code", { textContent: "jvmVersion:" }),
  " key, and provisions it automatically from coursier's jvm-index (",
  $("a", { href: "https://github.com/com-lihaoyi/mill/blob/main/example/fundamentals/javahome/3-custom-jvm/build.mill", textContent: "the javahome walkthrough" }),
  "). The default in mill 1.1.7 is ",
  $("code", { textContent: "zulu:21" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  "JDK 24, 25 and 26 run the daemon, zinc and munit on mill 1.1.7. ",
  $("code", { textContent: "zulu:27" }),
  " fails with ",
  $("code", { textContent: "JVM zulu:27 not found in index: No zulu version matching '27' found" }),
  "; the index maxed at 26.0.2.",
]));

// 2. Scala 3 support is per-version
document.body.appendChild($("h2", { textContent: "2. Scala 3 support is per-version" }));
document.body.appendChild($("p", {}, [
  "Mill resolves ",
  $("code", { textContent: "org.scala-lang:scala3-sbt-bridge:<scalaVersion>" }),
  " from Maven Central for any Scala 3 version (",
  $("a", { href: "https://github.com/com-lihaoyi/mill/blob/main/libs/javalib/api/src/mill/javalib/api/JvmWorkerUtil.scala", textContent: "JvmWorkerUtil.scala" }),
  "). scala-lang publishes the bridge for release candidates as well. Scala 3.9.0-RC5 compiles and tests on mill 1.1.7. A new Scala version works when its bridge exists.",
]));

// 3. Clojure has no Mill integration
document.body.appendChild($("h2", { textContent: "3. Clojure has no Mill integration" }));
document.body.appendChild($("p", {}, [
  "Mill's tracker has no Clojure issue or discussion. No plugin, tutorial or Maven artifact exists; the r/Clojure archive, ClojureVerse, ask.clojure.org and Hacker News carry no Mill-for-Clojure thread. The documented route for a language Mill does not ship is a user-defined module trait: the ",
  $("a", { href: "https://github.com/com-lihaoyi/mill/blob/main/example/extending/python/1-hello-python/build.mill", textContent: "python walkthrough" }),
  " is the template, and ",
  $("code", { textContent: "pythonlib" }),
  " and ",
  $("code", { textContent: "javascriptlib" }),
  " are first-party.",
]));

// 4. deps.edn is the manifest
document.body.appendChild($("h2", { textContent: "4. deps.edn is the manifest" }));
document.body.appendChild($("p", {}, [
  "A ClojureModule reads ",
  $("code", { textContent: ":deps" }),
  " from deps.edn with a bootstrap Clojure jar (",
  $("code", { textContent: "clojure.edn/read-string" }),
  ") and converts each ",
  $("code", { textContent: "{lib {:mvn/version \"v\"}}" }),
  " into a coursier dependency. deps.edn is a task input, so editing it invalidates the build graph. Git deps without ",
  $("code", { textContent: ":mvn/version" }),
  " are skipped; a missing ",
  $("code", { textContent: "org.clojure/clojure" }),
  " falls back to the bootstrap version. A working module: ",
  $("a", { href: "https://github.com/chengjilai/clojure-mill-example", textContent: "clojure-mill-example" }),
  ".",
]));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "compile" }),
  " is a cached task running the AOT compiler (",
  $("code", { textContent: "(binding [*compile-path* ...] (compile 'ns))" }),
  "). ",
  $("code", { textContent: "test" }),
  " runs clojure.test and exits non-zero on failures. ",
  $("code", { textContent: "run" }),
  " and ",
  $("code", { textContent: "test" }),
  " classpaths omit src/ so ",
  $("code", { textContent: "require" }),
  " loads the compiled classes; Clojure prefers a .clj when both are on the classpath.",
]));

// 5. The other self-contained tools
document.body.appendChild($("h2", { textContent: "5. The other self-contained tools" }));
document.body.appendChild($("p", {}, [
  "lein, the Clojure CLI and tools.build run on an installed java. The ",
  $("a", { href: "https://clojure.org/guides/install_clojure", textContent: "install guide" }),
  " says \"Clojure requires Java\" and points at Temurin. The Gradle wrapper dies without a bootstrap java: gradlew checks ",
  $("code", { textContent: "JAVA_HOME" }),
  " and ",
  $("code", { textContent: "command -v java" }),
  " (",
  $("a", { href: "https://github.com/gradle/gradle/blob/master/gradlew", textContent: "gradlew" }),
  "); toolchains plus foojay provision JDKs only for build execution (",
  $("a", { href: "https://docs.gradle.org/current/userguide/toolchains.html", textContent: "Gradle toolchains" }),
  ").",
]));
document.body.appendChild($("p", {}, [
  "The Kotlin Toolchain (formerly Amper, moved into ",
  $("a", { href: "https://github.com/JetBrains/kotlin-toolchain", textContent: "JetBrains/kotlin-toolchain" }),
  ") provisions its own JRE for the CLI and a JDK 21 by default, declared in module.yaml (",
  $("a", { href: "https://github.com/JetBrains/kotlin-toolchain/blob/main/docs/src/cli/provisioning.md", textContent: "the provisioning doc" }),
  "), and builds Kotlin and Java only. ",
  $("a", { href: "https://babashka.org/", textContent: "babashka" }),
  " is a JVM-free Clojure runtime (not the only one: Joker is a Go Clojure interpreter, and ClojureCLR runs on .NET); it is a subset interpreter, and tools.bbuild is an imperative port without a task graph.",
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
