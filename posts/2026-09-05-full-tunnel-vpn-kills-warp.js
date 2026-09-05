"use strict";


const title = document.createElement("title");
title.textContent = "A full-tunnel VPN and WARP cannot coexist";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "A full-tunnel VPN and WARP cannot coexist" }));

document.body.appendChild($("p", {}, [
  "WARP's tunnel transports are QUIC and WireGuard, all UDP. The client ",
  "has no TCP-transport option. A full-tunnel VPN on the same machine ",
  "routes those UDP packets into its own egress, where they can die.",
]));

// 1. The symptom pattern
document.body.appendChild($("h2", { textContent: "1. The symptom pattern" }));
document.body.appendChild($("p", {}, [
  "WARP reported Unable with happy-eyeballs failures, 123 times, while ",
  "Cloudflare HTTPS kept working: ",
  $("code", { textContent: "api.cloudflareclient.com" }),
  " answered every probe. The network was fine; the packets were going ",
  "somewhere else.",
]));
document.body.appendChild($("p", {}, [
  "The correlation: every WARP success happened while the VPN was down. ",
  "Two tunnel systems on one box: one of them was carrying the other's ",
  "traffic into a dead end.",
]));

// 2. The controlled test
document.body.appendChild($("h2", { textContent: "2. The controlled test" }));
document.body.appendChild($("p", {}, [
  "Bring the suspect down and watch the victim: ",
  $("code", { textContent: "ipsec down <conn>" }),
  " and WARP connected within two minutes, 56 attempts. Up again, 123 ",
  "failures. The traffic selector ",
  $("code", { textContent: "0.0.0.0/0" }),
  " made every packet, WARP's QUIC included, leave through the VPN's ",
  "campus egress.",
]));

// 3. The fix: scope the selector
document.body.appendChild($("h2", { textContent: "3. The fix: scope the selector" }));
document.body.appendChild($("p", {}, [
  "The VPN's purpose was campus-only resources from off-campus. The ",
  "traffic selector now lists the campus ranges only: ",
  $("code", { textContent: "111.186.0.0/16, 202.120.0.0/15, 218.193.128.0/17" }),
  ". Everything else stays local.",
]));
document.body.appendChild($("p", {}, [
  "Per-host /32 narrowing negotiated and installed, but the gateway's data ",
  "plane never answered: 54 ESP packets out, zero in, for minutes, with ",
  "ping and curl dead. The campus RANGES worked (portal 302 in 0.4 s). ",
  "The gateway delivers for ranges, not for single hosts.",
]));
document.body.appendChild($("p", {}, [
  $("code", { textContent: "10.0.0.0/8" }),
  " was excluded: on campus wifi, a tunnel route for it would shadow the ",
  "local subnet.",
]));

// 4. WARP's own recovery
document.body.appendChild($("h2", { textContent: "4. WARP's own recovery" }));
document.body.appendChild($("p", {}, [
  "WARP flaps on every wifi or network restart. Its ",
  $("code", { textContent: "Disconnected(Manual)" }),
  " status is the daemon's own reconnect dance, not a user command. It ",
  "self-heals in 2 to 10 minutes through its retry loop and the ",
  "warp-health timer. On a network that blocks its UDP, nothing helps ",
  "until the network allows it.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));