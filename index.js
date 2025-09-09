"use strict";

// Title, per page. common.js sets up the head and stylesheet.
const title = document.createElement("title");
title.textContent = "Jilai Cheng";
document.head.appendChild(title);

// The post list, generated from posts/ (nub run gen). Order: filename date desc.
document.body.appendChild($("h1", { textContent: "Jilai Cheng" }));

document.body.appendChild($("h2", { textContent: "Posts" }));

document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("a", { href: "posts/ssh-hosts.html", textContent: "SSH, keys, and hostnames across machines" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/wifi-eap.html", textContent: "What happens when a laptop joins a campus/enterprise Wi-Fi" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/emacs-system-config.html", textContent: "Shipping your Emacs config as part of the OS" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/emacs-colors.html", textContent: "Emacs face colors on terminals" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/escape-key.html", textContent: "The escape key: five layers" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/nixos-essentials.html", textContent: "NixOS debugging essentials" }),
  ]),
  $("li", {}, [
    $("a", { href: "posts/building-this-page.html", textContent: "Building this page with DOM, CSSOM, and Houdini" }),
  ]),
]));

document.body.appendChild($("p", {}, [
  "Email: ",
  $("a", { href: "mailto:chengjilai@sjtu.edu.cn", textContent: "chengjilai@sjtu.edu.cn" }),
]));

document.body.appendChild($("p", {}, [
  "GitHub: ",
  $("a", { href: "https://github.com/chengjilai", textContent: "github.com/chengjilai" }),
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
