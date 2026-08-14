"use strict";


const title = document.createElement("title");
title.textContent = "qutebrowser IPC: JSON, not plain text";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "qutebrowser IPC: JSON, not plain text" }));

document.body.appendChild($("h2", { textContent: "1. Socket and protocol" }));
document.body.appendChild($("p", {}, [
  "The IPC socket speaks JSON, not plain text. One message is one JSON object: ",
  $("code", { textContent: "args" }),
  " (each element one command string, colon included), ",
  $("code", { textContent: "target_arg" }),
  ", ",
  $("code", { textContent: "version" }),
  ", ",
  $("code", { textContent: "protocol_version: 1" }),
  ". The server validates only args, target_arg and protocol_version (",
  $("a", { href: "https://github.com/qutebrowser/qutebrowser/blob/v3.7.0/qutebrowser/misc/ipc.py", textContent: "misc/ipc.py _handle_data" }),
  "). The reply is empty bytes; results go to the log.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "import json, socket\n" +
    "msg = {\"args\": [\":open data:text/html,<h1>x</h1>\"], \"target_arg\": \"\",\n" +
    "       \"version\": \"3.7.0\", \"protocol_version\": 1}\n" +
    "s = socket.socket(socket.AF_UNIX)\n" +
    "s.connect(\"/run/user/1000/qutebrowser/ipc-<hash>\")\n" +
    "s.sendall(json.dumps(msg).encode())\n" +
    "s.close()", "python") }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "Socket: ",
    $("code", { textContent: "$XDG_RUNTIME_DIR/qutebrowser/ipc-<hash>" }),
    "; the hash derives from the config basedir and is stable across restarts",
  ]),
  $("li", {}, [
    "Args starting with ':' run as commands in the current window (",
    $("a", { href: "https://github.com/qutebrowser/qutebrowser/blob/v3.7.0/qutebrowser/app.py", textContent: "app.py process_pos_args" }),
    "); bare strings are URLs",
  ]),
]));

document.body.appendChild($("h2", { textContent: "2. Commands" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: ":open data:text/html,..." }),
  " opens a tab without the network; ",
  $("code", { textContent: ":tab-select N" }),
  " and ",
  $("code", { textContent: ":tab-close" }),
  " move and close tabs. Multiple commands per message: one ",
  $("code", { textContent: "args" }),
  " element each.",
]));

document.body.appendChild($("h2", { textContent: "3. Element clicks" }));
document.body.appendChild($("p", {}, [
  $("code", { textContent: ":jseval document.querySelector('...').click()" }),
  " is the precise alternative to Hyprland's (1,1)-only click synthesis.",
]));
document.body.appendChild($("p", {}, [
  "On Hyprland the window class is ",
  $("code", { textContent: "org.qutebrowser.qutebrowser" }),
  "; the main process is the python wrapper ",
  $("code", { textContent: ".qutebrowser-wrapped" }),
  ", so ",
  $("code", { textContent: "pgrep -a qutebrowser" }),
  " misses it.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
