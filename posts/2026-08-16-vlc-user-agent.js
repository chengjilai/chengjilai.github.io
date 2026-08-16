"use strict";

const title = document.createElement("title");
title.textContent = "VLC 3.0.23 ignores --http-user-agent";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "VLC 3.0.23 ignores --http-user-agent" }));

document.body.appendChild($("h2", { textContent: "1. The option is dead weight" }));
document.body.appendChild($("p", {}, [
  "VLC 3.0.23 sends a hardcoded User-Agent on every HTTP request. ",
  $("code", { textContent: "--http-user-agent" }),
  " on the command line and ",
  $("code", { textContent: "http-user-agent=" }),
  " in vlcrc are both ignored. A GET to a local listener carried ",
  $("samp", { textContent: "User-Agent: VLC/3.0.23 LibVLC/3.0.23" }),
  " with both set.",
]));

document.body.appendChild($("h2", { textContent: "2. The mechanism" }));
document.body.appendChild($("p", {}, [
  $("a", {
    href: "https://github.com/videolan/vlc/blob/3.0.23/bin/vlc.c",
    textContent: "bin/vlc.c",
  }),
  " calls ",
  $("code", { textContent: "libvlc_set_user_agent(vlc, \"VLC media player\", \"VLC/\"PACKAGE_VERSION)" }),
  " unconditionally in ",
  $("code", { textContent: "main()" }),
  ", after config parsing. The function stores ",
  $("code", { textContent: "http-user-agent" }),
  " on the libvlc instance, appending ",
  $("code", { textContent: "\" LibVLC/\"PACKAGE_VERSION" }),
  " (",
  $("a", {
    href: "https://github.com/videolan/vlc/blob/3.0.23/lib/core.c",
    textContent: "lib/core.c",
  }),
  "). ",
  $("a", {
    href: "https://github.com/videolan/vlc/blob/3.0.23/modules/access/http.c",
    textContent: "modules/access/http.c",
  }),
  " resolves it with ",
  $("code", { textContent: "var_InheritString" }),
  ", which prefers the instance variable over the identically named config option.",
]));

document.body.appendChild($("h2", { textContent: "3. The consequence" }));
document.body.appendChild($("p", {}, [
  "YouTube bot-checks the stock UA. A watch URL 302s to ",
  $("code", { textContent: "google.com/sorry" }),
  ", then 429, and VLC reports:",
]));
document.body.appendChild($("samp", { textContent: "VLC is unable to open the MRL 'https://www.youtube.com/watch?v=...'. Check the log for details." }));
document.body.appendChild($("p", {}, [
  "Bare watch URLs are bot-checked even with a browser UA from a shared egress IP. Only signed stream URLs play; VLC must receive those from a resolver, not open the watch page itself.",
]));

document.body.appendChild($("h2", { textContent: "4. The fix" }));
document.body.appendChild($("p", {}, [
  "An ",
  $("code", { textContent: "LD_PRELOAD" }),
  " shim interposes ",
  $("code", { textContent: "libvlc_set_user_agent" }),
  " and substitutes a Chrome UA:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(`#define _GNU_SOURCE
#include <dlfcn.h>

static const char *shim_ua =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36";

void libvlc_set_user_agent(void *p_i, const char *name, const char *http)
{
    static void (*real)(void *, const char *, const char *) = 0;
    if (!real)
        real = (void *)dlsym(RTLD_NEXT, "libvlc_set_user_agent");
    real(p_i, name, shim_ua);
}`, "c") }),
]));
document.body.appendChild($("p", {}, [
  "The real function appends ",
  $("code", { textContent: "\" LibVLC/3.0.23\"" }),
  " to the value; the wire UA stays browser-shaped. Hardware decoding starts once the stream is served.",
]));

document.body.appendChild($("h2", { textContent: "5. Related: wrappers that drop their args" }));
document.body.appendChild($("p", {}, [
  "A wrapper script whose body is a bare interpreter invocation without ",
  $("code", { textContent: "\"$@\"" }),
  " drops every argument. ",
  $("code", { textContent: "python3 /path/x.py" }),
  " with no ",
  $("code", { textContent: "\"$@\"" }),
  " made the tool print usage and exit 2 on every call, and the launcher exited 1 before starting. Forward the arguments explicitly.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
