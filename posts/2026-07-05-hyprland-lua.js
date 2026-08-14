"use strict";


const title = document.createElement("title");
title.textContent = "Hyprland 0.56: Lua config, dispatch, and screenshots";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Hyprland 0.56: Lua config, dispatch, and screenshots" }));

document.body.appendChild($("p", {}, [
  "Hyprland 0.56 configures itself from Lua: the shipped ",
  $("code", { textContent: "share/hypr/hyprland.lua" }),
  " plus the config deployed with the compositor. hyprctl dispatch wraps ",
  "its argument as Lua; the compositor has no capture built in, so ",
  "screenshots are grim + slurp.",
]));

// 1. Inspect windows
document.body.appendChild($("h2", { textContent: "1. Inspect windows" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "hyprctl clients -j | jq '.[] | {class, title, workspace: .workspace.id, address}'\n" +
    "hyprctl activewindow -j\n" +
    "hyprctl workspaces -j", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "Inspect the compositor state before assuming what is on screen: a dialog \n",
  "window (e.g. \"Failed to start streaming\") is a real window with its own \n",
  "class and workspace.",
]));

// 2. Act: dispatch goes through Lua
document.body.appendChild($("h2", { textContent: "2. Act: dispatch goes through Lua" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "hyprctl dispatch 'hl.dsp.focus({ workspace = \"2\" })'\n" +
    "hyprctl dispatch 'hl.dsp.focus({ window = \"class:com.obsproject.Studio\" })'\n" +
    "hyprctl dispatch 'hl.dsp.exec_cmd(\"foot\")'", "shell") }),
]));
document.body.appendChild($("p", {}, [
  "hyprctl wraps the argument and evaluates it as Lua; a bare old-style \n",
  "argument fails with an error that shows the wrapper: \n",
  $("code", { textContent: "[string \"return hl.dispatch(...)\"]" }),
  ". \n",
  $("code", { textContent: "hyprctl eval <code>" }),
  " evaluates arbitrary Lua in the running compositor. \n",
  $("code", { textContent: "exec_cmd" }),
  " runs through a shell, so \n",
  $("code", { textContent: "$(...)" }),
  " and pipes work inside the string; both dispatch forms return \n",
  "\"ok\".",
]));

// 3. Screenshots: grim + slurp
document.body.appendChild($("h2", { textContent: "3. Screenshots: grim + slurp" }));
document.body.appendChild($("p", {}, [
  "The hyprctl command list has no capture or text prompt. The standard \n",
  "stack is grim + slurp: slurp reports a \n",
  "region in layout coordinates, grim captures it at the output's scale. \n",
  "Keybind in the deployed hyprland.lua:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "hl.bind(mainMod .. \" + S\", hl.dsp.exec_cmd(\n" +
    "  \"g=$(slurp) && t=$(mktemp --suffix=.png) && grim -g \\\"$g\\\" \\\"$t\\\" && \\\n" +
    "   f=$(zenity --entry --title=\\\"Save screenshot\\\" ...) && \\\n" +
    "   case \\\"$f\\\" in \\\"~/\\\"*) out=\\\"$HOME/${f#\\\\~/}\\\" ;; /*) out=\\\"$f\\\" ;; \\\n" +
    "   *) out=\\\"$HOME/Pictures/$f\\\" ;; esac && mv \\\"$t\\\" \\\"$out\\\" || rm -f \\\"$t\\\"\"))", "shell") }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("code", { textContent: "grim -g \"$(slurp)\" out.png" }),
    ": region capture; the capture must happen before the filename dialog, \n",
    "or the window-close animation lands in the shot",
  ]),
  $("li", {}, [
    "Filename prompt: zenity (GTK) works under Wayland",
  ]),
  $("li", {}, [
    "Shell gotcha: ~ expands only at the start of a word, never inside $f; \n",
    "and ${f#~/} does not strip the home prefix either; bash tilde-expands \n",
    "the pattern too. The config writes ${f#\\\\~/} in the Lua string, which \n",
    "Lua unescapes to ${f#\\~/} for the shell (verbatim in the deployed \n",
    "config)",
  ]),
]));
document.body.appendChild($("p", {}, [
  "The config ships as a system file (environment.etc \"xdg/hypr/hyprland.lua\", \n",
  "read via $XDG_CONFIG_DIRS). A keybind change needs a rebuild, then \n",
  $("code", { textContent: "hyprctl reload" }),
  ".",
]));

// 4. Synthetic clicks: mouse keycodes
document.body.appendChild($("h2", { textContent: "4. Synthetic clicks: mouse keycodes" }));
document.body.appendChild($("p", {}, [
  "There is no click dispatch. ",
  $("code", { textContent: "send_key_state" }),
  " accepts ",
  $("code", { textContent: "mouse:<code>" }),
  " keys in the evdev mouse range 272-0x160 (272 = BTN_LEFT) and emits real ",
  $("code", { textContent: "wl_pointer.button" }),
  " press/release events (",
  $("a", { href: "https://github.com/hyprwm/Hyprland/blob/v0.56.1/src/config/shared/actions/ConfigActions.cpp", textContent: "Actions::pass in ConfigActions.cpp" }),
  "; keyboard keys are key - 8, the xkb offset).",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(
    "hyprctl dispatch 'hl.dsp.send_key_state({ mods = \"\", key = \"mouse:272\", state = \"down\", window = \"class:org.qutebrowser.qutebrowser\" })'\n" +
    "hyprctl dispatch 'hl.dsp.send_key_state({ mods = \"\", key = \"mouse:272\", state = \"up\", window = \"class:org.qutebrowser.qutebrowser\" })'", "shell") }),
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    "The click lands at surface-local (1,1) of the target window, not under \n",
    "the physical cursor: pass() hardcodes ",
    $("code", { textContent: "setPointerFocus(surface, {1, 1})" }),
  ]),
  $("li", {}, [
    "The target window needs no keyboard focus and may sit on another \n",
    "workspace; the selector forces pointer focus onto its surface",
  ]),
  $("li", {}, [
    $("code", { textContent: "hl.dsp.cursor" }),
    " has only move / move_to_corner: ",
    $("code", { textContent: "cursor.move({ x = 5, y = 5, relative = true })" }),
    " warps the pointer, no buttons",
  ]),
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
