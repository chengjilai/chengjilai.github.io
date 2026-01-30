"use strict";


const title = document.createElement("title");
title.textContent = "ssh resolves ~ from the passwd database, not $HOME";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "ssh resolves ~ from the passwd database, not $HOME" }));

document.body.appendChild($("p", {}, [
  "A root systemd unit running an ssh reverse tunnel failed in a restart \n",
  "loop with ",
  $("code", { textContent: "Host key verification failed" }),
  " (exit 255). The unit set ",
  $("code", { textContent: "environment.HOME=/home/<user>" }),
  " so ssh would find the user's ",
  $("code", { textContent: "known_hosts" }),
  ". ssh read ",
  $("code", { textContent: "/root/.ssh/known_hosts" }),
  " anyway.",
]));

// 1. The mechanism
document.body.appendChild($("h2", { textContent: "1. The mechanism" }));
document.body.appendChild($("p", {}, [
  "ssh expands every ",
  $("code", { textContent: "~" }),
  " in its paths at startup. The default user host file is ",
  $("code", { textContent: "~/.ssh/known_hosts" }),
  " (",
  $("a", { href: "https://github.com/openssh/openssh-portable/blob/master/pathnames.h", textContent: "pathnames.h" }),
  "). Each path goes through ",
  $("code", { textContent: "tilde_expand_filename(path, getuid())" }),
  " in ",
  $("a", { href: "https://github.com/openssh/openssh-portable/blob/master/ssh.c", textContent: "ssh.c" }),
  "; the uid is the real uid.",
]));
document.body.appendChild($("p", {}, [
  "tilde_expand in ",
  $("a", { href: "https://github.com/openssh/openssh-portable/blob/master/misc.c", textContent: "misc.c" }),
  " resolves the current user's ",
  $("code", { textContent: "~" }),
  " through the passwd database:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "} else if ((pw = getpwuid(uid)) == NULL) {", "c") }),
]));
document.body.appendChild($("p", {}, [
  "The client's only $HOME-consulting helper is ",
  $("code", { textContent: "get_homedir()" }),
  " in misc.c: it reads $HOME first, then falls back to getpwuid. It has \n",
  "no callers in ssh.c, readconf.c, or misc.c. A root ssh therefore \n",
  "expands ",
  $("code", { textContent: "~/.ssh" }),
  " to /root/.ssh regardless of the $HOME in its environment.",
]));

// 2. The fix
document.body.appendChild($("h2", { textContent: "2. The fix" }));
document.body.appendChild($("p", {}, [
  "Run the unit as the user: ",
  $("code", { textContent: "serviceConfig.User = \"<user>\"" }),
  ". systemd sets HOME from the passwd entry for User= services \n",
  " (",
  $("a", { href: "https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html", textContent: "systemd.exec" }),
  "), and ssh's ",
  $("code", { textContent: "~" }),
  " expands to the user's home. The unit then verifies hosts against the \n",
  "user's known_hosts and authenticates with the user's key.",
]));
document.body.appendChild($("p", {}, [
  "Or point ssh at the files explicitly:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "ssh -o UserKnownHostsFile=/home/<user>/.ssh/known_hosts \\\n" +
    "    -o IdentityFile=/home/<user>/.ssh/id_ed25519 \\\n" +
    "    -NT -R <port>:127.0.0.1:<proxy> <host>", "shell") }),
]));

// 3. A manual tunnel holds the port
document.body.appendChild($("h2", { textContent: "3. A manual tunnel holds the port" }));
document.body.appendChild($("p", {}, [
  "Once host-key verification passed, the unit failed with ",
  $("code", { textContent: "remote port forwarding failed" }),
  ". A manual tunnel started before the unit existed already held the \n",
  "remote port. Check the port's owner on the remote side before enabling \n",
  "a tunnel unit:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "ssh <host> 'ss -tlnp | grep <port>'", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "Kill the manual process, then let the unit bind.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
