"use strict";

const title = document.createElement("title");
title.textContent = "Declarative configuration and secrets pipelines";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Declarative configuration and secrets pipelines" }));

document.body.appendChild($("p", {}, [
  "The repo IS the system: services, configs, secrets, even the AI model \n",
  "the coding agent uses are declared, committed, rebuilt. User-state files \n",
  "under the home directory are ephemeral copies, not the source of truth. \n",
  "A secret pipeline has two ways to silently corrupt a value before the \n",
  "program ever sees it.",
]));

// 1. The rule
document.body.appendChild($("h2", { textContent: "1. The rule" }));
document.body.appendChild($("p", {}, [
  "Everything is declared in the system repo and deployed by a rebuild. A \n",
  "token that only exists in a hand-edited file is not \"configured\"; it \n",
  "will be lost, or silently diverge on the next machine.",
]));

// 2. How a model and key became declarative
document.body.appendChild($("h2", { textContent: "2. How a model and key became declarative" }));
document.body.appendChild($("p", {}, [
  "pi (the coding agent) selects its provider/model from user state by \n",
  "default. The fix: a NixOS overlay wraps the pi binary so EVERY invocation \n",
  "gets the same environment and flags:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "wrapProgram $out/bin/pi \\\n" +
    "  --run 'export OPENCODE_API_KEY=\"$(tr -d \"\\r\\n\" < /run/secrets/<name> 2>/dev/null || true)\"' \\\n" +
    "  --add-flags \"--model <provider>/<model> ...\"", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "The key comes from a systemd credential (repo-declared) and the model is \n",
  "forced on the command line. Interactive pi and subagent children all \n",
  "spawn this same wrapped binary, so there is one source and nothing to drift.",
]));

// 3. The secrets pipeline
document.body.appendChild($("h2", { textContent: "3. The secrets pipeline" }));
document.body.appendChild($("pre", {}, [
  $("code", { textContent:
    "printf '%s' \"$V\" | systemd-creds encrypt --name=X --with-key=host - /etc/credstore.encrypted/X\n" +
    "  -> /etc/credstore.encrypted/X          (blob on disk, host-key sealed)\n" +
    "  -> ImportCredential=X in the unit      (auto-discovers by name)\n" +
    "  -> provisioner copies to /run/secrets/X (tr -d newlines, mode 0444)\n" +
    "  -> the program reads the file" }),
]));
document.body.appendChild($("p", {}, [
  "--with-key=host (not tpm2) is deliberate: the host key lives on the USB \n",
  "root, so the same blobs work on every machine the disk boots. TPM sealing \n",
  "would bind them to one machine.",
]));

// 4. Break mode 1: a template prefix baked in
document.body.appendChild($("h2", { textContent: "4. Break mode 1: a template prefix baked in" }));
document.body.appendChild($("p", {}, [
  "The stored value was ",
  $("code", { textContent: "name=PREFIX=value" }),
  "; the literal template text ended up in the file. The program's file \n",
  "backend parses name=value and takes everything after the FIRST =, so the \n",
  "password became ",
  $("code", { textContent: "PREFIX=value" }),
  ". The server rejected every login with error 691 for days. The log showed \n",
  "the password was the right length. Length is not content.",
]));

// 5. Break mode 2: a trailing newline
document.body.appendChild($("h2", { textContent: "5. Break mode 2: a trailing newline" }));
document.body.appendChild($("p", {}, [
  "echo \"$V\" | systemd-creds encrypt appends \\n. A line-oriented backend \n",
  "treats it as part of the value: a password with a trailing newline \n",
  "hashes to nothing the server accepts. (This was even a plausible red \n",
  "herring for the 691 bug; fixing it changed nothing, because break mode \n",
  "1 was the real cause.)",
]));

// 6. Fixes and hygiene
document.body.appendChild($("h2", { textContent: "6. Fixes and hygiene" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "printf '%s' \"$V\" | sudo systemd-creds encrypt --name=X --with-key=host - /etc/credstore.encrypted/X\n" +
    "# provisioner: tr -d '\\n\\r' < \"$CREDENTIALS_DIRECTORY/$s\" > /run/secrets/$s", "shell") }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Write secrets with printf '%s', never echo",
  ]),
  $("li", {}, [
    "Strip newlines in the provisioner as a safety net for every key",
  ]),
  $("li", {}, [
    "The /run/secrets directory must be 0755 (files 0444): user-level \n",
    "consumers (wrappers, scripts) get EACCES on traversal at 0700. A secret \n",
    "nobody can read is as broken as a wrong secret",
  ]),
]));

// 7. Env-var contracts live in the software's source
document.body.appendChild($("h2", { textContent: "7. Env-var contracts live in the software's source" }));
document.body.appendChild($("p", {}, [
  "pi resolves a provider's key from the environment. The mapping is in the \n",
  "installed package (pi-ai env-api-keys.js): provider id to ",
  $("code", { textContent: "<PROVIDER>_API_KEY" }),
  ", and notably ",
  $("code", { textContent: "\"opencode-go\": \"OPENCODE_API_KEY\"" }),
  " (not OPENCODE_GO_API_KEY). When wiring any key, read the resolver in \n",
  "the installed package, don't guess the name.",
]));

// 8. Verify the bytes, not the variable
document.body.appendChild($("h2", { textContent: "8. Verify the bytes, not the variable" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "sudo systemd-creds decrypt /etc/credstore.encrypted/X - | xxd", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "Compare with the known-good value byte for byte. Both break modes keep \n",
  "the string length identical; only the bytes tell. Also compare against \n",
  "the known-good consumer: the other program (e.g. NetworkManager's \n",
  "profile) that has always worked holds the true password; diff against it.",
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
