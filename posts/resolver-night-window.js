"use strict";

const title = document.createElement("title");
title.textContent = "A resolver that withholds video sites at night";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "A resolver that withholds video sites at night" }));

document.body.appendChild($("p", {}, [
  "A campus DNS server answered NXDOMAIN for the seven big video sites at \n",
  "night and resolved them again by morning. Control domains always \n",
  "resolved, and direct TCP to the blocked hosts worked -- the block was \n",
  "DNS-only and time-scheduled.",
]));

// 1. The pattern
document.body.appendChild($("h2", { textContent: "1. The pattern" }));
document.body.appendChild($("p", {}, [
  "At 03:51 the resolver returned NXDOMAIN for bilibili.com, douyin.com, \n",
  "youku.com, iqiyi.com, v.qq.com, mgtv.com and ixigua.com. baidu.com and \n",
  "qq.com resolved in the same query set -- the block is selective, not an \n",
  "outage. Direct HTTPS to a blocked host's CDN returned 200 at the same \n",
  "hour: the transport path is untouched.",
]));

// 2. The chase is withheld too
document.body.appendChild($("h2", { textContent: "2. The chase is withheld too" }));
document.body.appendChild($("p", {}, [
  "The CDN CNAME targets are withheld along with the apex: 13 of 14 zones \n",
  "(the authoritative DNS, cdngslb, the queniu family, alikunlun, and \n",
  "others) returned NXDOMAIN at night. A resolver that chases a CNAME \n",
  "through its own routing fails when the target zone is missing from that \n",
  "routing -- the failure mode that broke a QR-login poll once.",
]));

// 3. DoT bypasses it
document.body.appendChild($("h2", { textContent: "3. DoT bypasses it" }));
document.body.appendChild($("p", {}, [
  "DoT (port 853) to public resolvers resolved the same names to real IPs at \n",
  "night, while UDP 53 to those resolvers was blocked on the network. \n",
  "Routing the withheld domains to a DoT server makes them resolve at any \n",
  "hour by construction -- the bypass does not care when the block switches.",
]));

// 4. The window is measurable
document.body.appendChild($("h2", { textContent: "4. The window is measurable" }));
document.body.appendChild($("p", {}, [
  "An hourly probe of both resolver addresses against the seven domains plus \n",
  "a control logs one CSV line per run: timestamp, per-server-per-domain \n",
  "status. By 05:30 the same morning all seven resolved again, so the \n",
  "transition points are observable, not assumed. One probing rule: apex \n",
  "CDN domains legitimately answer NOERROR with SOA only -- read the status \n",
  "line, not the answer count.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
