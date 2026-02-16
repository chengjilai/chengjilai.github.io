"use strict";

const title = document.createElement("title");
title.textContent = "Nix strings inside strings";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Nix strings inside strings" }));

document.body.appendChild($("p", {}, [
  "A systemd unit needed to run a bash loop. The natural first attempt put \n",
  "the whole one-liner in a double-quoted Nix string and blew up the parse; \n",
  "the fix is Nix's indented string, which holds any quotes with no \n",
  "escaping. Every ExecStart and writeShellScript body in this repo uses \n",
  "indented strings.",
]));

// 1. The failure that started it
document.body.appendChild($("h2", { textContent: "1. The failure that started it" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "ExecStart = \"${pkgs.bash}/bin/bash -c '\n" +
    "        ...\n" +
    "          if echo \"$(basename \"$d\")\" > /sys/.../unbind 2>/dev/null; then\n" +
    "        ...'\";", "nix") }),
]));
document.body.appendChild($("p", {}, [
  "Build error: ",
  $("code", { textContent: "syntax error, unexpected invalid token, expecting ';'" }),
  " pointing at the content: the first inner quote (before $(basename ...)) \n",
  "ended the Nix string. Double-quoted Nix strings end at the first \n",
  "unescaped quote; shell code is full of them. The error appears far from ",
  "the cause: \"unexpected invalid token\" at a line of shell content, when ",
  "the real problem is the string delimiter two lines up.",
]));

// 2. The fix: indented strings
document.body.appendChild($("h2", { textContent: "2. The fix: indented strings" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "ExecStart = ''${pkgs.bash}/bin/bash -c '\n" +
    "        ok=1\n" +
    "        for d in /sys/bus/hid/devices/*; do\n" +
    "          grep -q \"v0000XXXXp0000YYYY\" \"$d/modalias\" 2>/dev/null || continue\n" +
    "          if echo \"$(basename \"$d\")\" > /sys/bus/hid/drivers/hid-multitouch/unbind 2>/dev/null; then\n" +
    "            ok=0\n" +
    "          fi\n" +
    "        done\n" +
    "        exit $ok\n" +
    "      '';", "nix") }),
]));
document.body.appendChild($("p", {}, [
  "Indented strings (''...'') hold any quotes, so no escaping is needed. The \n",
  "build succeeded and udevadm verify passed.",
]));

// 3. How $ behaves in each string kind
document.body.appendChild($("h2", { textContent: "3. How $ behaves in each string kind" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Double-quoted: ${var} interpolates; you escape quotes and \\$ by hand",
  ]),
  $("li", {}, [
    "Indented: only ${ and $' start interpolation. $d, $(...), $ok stay \n",
    "literal, exactly what a shell script wants. The only escape needed: \n",
    "write ''' if the content itself contains ''",
  ]),
]));
document.body.appendChild($("p", {}, [
  "The corollary bites the other way: inside an indented string ${ always \n",
  "opens interpolation. To hand a literal ${var} to bash, escape the $ by \n",
  "prefixing it with two single quotes: write ''${var} (the manual: \"$ is \n",
  "escaped by prefixing it with two single quotes ('')\" on indented strings, \n",
  "which differs from double-quoted \"\${var}\"; know which one you need). A \n",
  "$$-sequence stays literal. A provisioner sidesteps the whole class by \n",
  "using cut -d= -f2- instead of bash parameter expansion.",
]));

// 4. The repo convention
document.body.appendChild($("h2", { textContent: "4. The repo convention" }));
document.body.appendChild($("p", {}, [
  "Every ExecStart and writeShellScript body uses ''...''. If you ever see a \n",
  "Nix file with \"bash -c '...'\" and inner quotes, that is a bug waiting to \n",
  "break the parse; convert it to an indented string. Rule of thumb: shell ",
  "in Nix, use an indented string.",
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
