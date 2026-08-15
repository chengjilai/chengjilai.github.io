"use strict";


const title = document.createElement("title");
title.textContent = "kotlin-toolchain: Gradle distribution mirror and the missing power-assert runtime";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "kotlin-toolchain: Gradle distribution mirror and the missing power-assert runtime" }));

// 1. The Tooling API downloads its own distribution
document.body.appendChild($("h2", { textContent: "1. The Tooling API downloads its own distribution" }));
document.body.appendChild($("p", {}, [
  "A Gradle Tooling API client downloads the Gradle distribution itself when the connector specifies none. ",
  $("code", { textContent: "GradleConnector.newConnector().forProjectDirectory(...)" }),
  " without ",
  $("code", { textContent: "useDistribution()" }),
  " fetches ",
  $("code", { textContent: "https://services.gradle.org/distributions/gradle-VERSION-bin.zip" }),
  ". The kotlin-toolchain's Android builds connect this way (",
  $("a", { href: "https://github.com/JetBrains/kotlin-toolchain/blob/main/sources/android-integration/amper-android-runner/src/org.jetbrains.amper.android/Runner.kt", textContent: "Runner.kt" }),
  "). From mainland China the first Android build fails with ",
  $("code", { textContent: "GradleConnectionException: Could not run build action using connection to Gradle distribution" }),
  ": services.gradle.org redirects to GitHub release assets, which are throttled.",
]));

// 2. The mirror environment variable
document.body.appendChild($("h2", { textContent: "2. The mirror environment variable" }));
document.body.appendChild($("p", {}, [
  "PR ",
  $("a", { href: "https://github.com/JetBrains/kotlin-toolchain/pull/18", textContent: "#18" }),
  " (KTC-5696) makes the distribution URL configurable: when ",
  $("code", { textContent: "KOTLIN_TOOLCHAIN_GRADLE_DISTRIBUTION_URL" }),
  " is set, the connector calls ",
  $("code", { textContent: "useDistribution(URI(it))" }),
  "; when unset, behavior is unchanged. The Gradle version matching the embedded Tooling API is ",
  $("code", { textContent: "8.14.3" }),
  " (",
  $("code", { textContent: "gradle-toolingApi" }),
  " in libs.versions.toml). The test fixtures already use the JetBrains redirector for this exact purpose: ",
  $("code", { textContent: "https://cache-redirector.jetbrains.com/services.gradle.org/distributions/gradle-$gradleVersion-bin.zip" }),
  " (",
  $("a", { href: "https://github.com/JetBrains/kotlin-toolchain/blob/main/sources/test-base/src/org/jetbrains/amper/test/gradle/gradle.kt", textContent: "test-base gradle.kt" }),
  ").",
]));

// 3. The repository is unbuildable from a clean machine
document.body.appendChild($("h2", { textContent: "3. The repository is unbuildable from a clean machine" }));
document.body.appendChild($("p", {}, [
  "The build template pins kotlin 2.3.10 with ",
  $("code", { textContent: "powerAssert: enabled" }),
  " (",
  $("a", { href: "https://github.com/JetBrains/kotlin-toolchain/blob/main/sources/common.module-template.yaml", textContent: "common.module-template.yaml" }),
  "), so resolution demands ",
  $("code", { textContent: "org.jetbrains.kotlin:kotlin-power-assert-runtime:2.3.10" }),
  ". That artifact is not on Maven Central: its ",
  $("a", { href: "https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-power-assert-runtime/maven-metadata.xml", textContent: "metadata" }),
  " starts at 2.4.0-Beta2, and the pom 404s on repo1.maven.org and on the JetBrains redirector (307 to artifacts-caching-proxy.aws.intellij.net, then 404). Every external build fails at dependency resolution before compilation; internal CI has the artifact cached. Filed as ",
  $("a", { href: "https://youtrack.jetbrains.com/issues/KTC-5713", textContent: "KTC-5713" }),
  ".",
]));

// 4. Amper's default repositories
document.body.appendChild($("h2", { textContent: "4. Amper's default repositories" }));
document.body.appendChild($("p", {}, [
  "Amper hardcodes ",
  $("code", { textContent: "https://maven.google.com" }),
  " as a default resolution repository (frontend/dr ModuleDependencies.kt ",
  $("code", { textContent: "defaultRepositories" }),
  "), so every dependency is checked against Google Maven first. The Maven Central default is repo1.maven.org, overridable via the ",
  $("code", { textContent: "KOTLIN_DEFAULT_MAVEN_CENTRAL_URL" }),
  " environment variable (",
  $("a", { href: "https://github.com/JetBrains/kotlin-toolchain/blob/main/sources/libraries/maven-central-configuration/src/org/jetbrains/amper/mavencentral/mavenUtil.kt", textContent: "mavenUtil.kt" }),
  ").",
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
