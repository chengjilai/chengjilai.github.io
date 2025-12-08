"use strict";

// Title, per page. common.js sets up the head and stylesheet.
const title = document.createElement("title");
title.textContent = "Mic hum: diagnose with a 10-second recording";
document.head.appendChild(title);

// The post. One appendChild per element, in document order.
document.body.appendChild($("h1", {
  textContent: "Mic hum: diagnose with a 10-second recording",
}));

document.body.appendChild($("p", {}, [
  "A microphone picks up mains hum. The right fix depends on what the noise ",
  "is: tonal hum at 50 Hz (China mains) with odd harmonics wants an EQ cut; ",
  "broadband hiss wants suppression. A 10-second recording decides.",
]));

// 1. Capture the raw signal
document.body.appendChild($("h2", { textContent: "1. Capture the raw signal" }));
document.body.appendChild($("p", {}, [
  "Record the source's monitor.",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      'ffmpeg -y -f pulse -i "<source>.monitor" -t 10 -ac 1 -ar 48000 hum.wav',
  "shell")}),
]));
document.body.appendChild($("p", {}, [
  "PulseAudio names a source's monitor with a ",
  $("code", { textContent: ".monitor" }),
  " suffix; ffmpeg's pulse input accepts the source name directly (sample ",
  "rate and channel count are input options).",
]));

// 2. Analyze without numpy
document.body.appendChild($("h2", { textContent: "2. Analyze without numpy" }));
document.body.appendChild($("p", {}, [
  "The Goertzel algorithm computes one frequency bin at a time with a ",
  "constant-coefficient recurrence, enough to sweep the frequencies of ",
  "interest. This is the function:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "def goertzel(x, sr, freq, chunk=4096):\n" +
      "    k = round(freq * chunk / sr)\n" +
      "    omega = 2*math.pi*k/chunk\n" +
      "    coeff = 2*math.cos(omega)\n" +
      "    s1 = s2 = 0.0\n" +
      "    for v in x:\n" +
      "        s0 = v + coeff*s1 - s2\n" +
      "        s2, s1 = s1, s0\n" +
      "    return math.sqrt(s1*s1 + s2*s2 - coeff*s1*s2) / chunk",
  "python")}),
]));
document.body.appendChild($("p", {}, [
  "Sweep 40..260 Hz in 1 Hz steps over the signal decimated by 4 (12 kHz, so ",
  "one bin is about 3 Hz wide) and take the top peaks. On a synthetic 50 Hz ",
  "+ 150 Hz signal the same code finds both. The recording measured 50 Hz and ",
  "its 150 Hz harmonic on a broadband floor around -39 dBFS: mains hum plus ",
  "harmonics, not hiss, so the fix is EQ, not suppression alone.",
]));

// 3. Fix in OBS
document.body.appendChild($("h2", { textContent: "3. Fix in OBS" }));
document.body.appendChild($("p", {}, [
  "All three filters process the stream live; no restart needed.",
]));
document.body.appendChild($("ul", {}, [
  $("li", {}, [
    $("strong", { textContent: "Noise Suppression" }),
    " (Speex): a suppression-level slider from -60 to 0 dB ",
    "(",
    $("a", { href: "https://github.com/obsproject/obs-studio/blob/master/plugins/obs-filters/noise-suppress-filter.c", textContent: "noise-suppress-filter.c" }),
    "; a value of -50 works). RNNoise, the other ",
    "method, is a compile-time option (LIBRNNOISE_ENABLED), and the nixpkgs ",
    "OBS build does not link librnnoise; no rnnoise in its buildInputs, so ",
    "only Speex exists there.",
  ]),
  $("li", {}, [
    $("strong", { textContent: "Noise Gate" }),
    ": open and close thresholds ",
    $("a", { href: "https://github.com/obsproject/obs-studio/blob/master/plugins/obs-filters/noise-gate-filter.c", textContent: "(noise-gate-filter.c)" }),
    "; a gate set around ",
    "-45 dB cleans the silence gaps.",
  ]),
  $("li", {}, [
    $("strong", { textContent: "3-Band Equalizer" }),
    ": the crossover frequencies are fixed in the source: 800 Hz and 5 kHz ",
    $("a", { href: "https://github.com/obsproject/obs-studio/blob/master/plugins/obs-filters/eq-filter.c", textContent: "(eq-filter.c)" }),
    ". Only the three gains adjust. Cutting the low band's gain ",
    "attenuates everything below 800 Hz: the 50 Hz hum goes, and the bass with ",
    "it.",
  ]),
]));

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
