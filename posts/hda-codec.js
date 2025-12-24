"use strict";

// Title, per page. common.js sets up the head and stylesheet.
const title = document.createElement("title");
title.textContent = "HDA codec debugging from userspace";
document.head.appendChild(title);

// The post. One appendChild per element, in document order.
document.body.appendChild($("h1", {
  textContent: "HDA codec debugging from userspace",
}));

document.body.appendChild($("p", {}, [
  "A laptop speaker kept playing together with the headphones, and the mixer ",
  "controls did nothing. Fixing it meant reading the HD-audio codec and ",
  "driving it directly with HDA verbs. Linux exposes the codec at three ",
  "levels, and the deepest one bypasses the kernel's quirk tables entirely.",
]));

// 1. Read the codec
document.body.appendChild($("h2", { textContent: "1. Read the codec" }));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight( "cat /proc/asound/cardN/codec#0" , "shell")}),
]));
document.body.appendChild($("p", {}, [
  "Prints the codec's widgets: DACs, pin complexes, amps, EAPD, connections. ",
  "Here: ",
  $("code", { textContent: "/proc/asound/card1/codec#0" }),
  " shows an ATI R6xx HDMI codec. The dump is a snapshot; re-read it after ",
  "toggling a control to confirm it is live.",
]));

// 2. Drive controls without alsa-utils
document.body.appendChild($("h2", { textContent: "2. Drive controls without alsa-utils" }));
document.body.appendChild($("p", {}, [
  "No alsa-utils on the machine, but ",
  $("code", { textContent: "libasound.so.2" }),
  " is present. ctypes can call the mixer API directly (documented in the ",
  $("a", { href: "https://www.alsa-project.org/alsa-doc/alsa-lib/group___mixer.html", textContent: "ALSA C library reference" }),
  "): ",
  $("code", { textContent: "snd_mixer_open" }),
  ", attach ",
  $("code", { textContent: "hw:N" }),
  ", ",
  $("code", { textContent: "snd_mixer_selem_register" }),
  ", ",
  $("code", { textContent: "snd_mixer_load" }),
  ", then iterate the elements. That is enough to read and set switches and ",
  "volumes.",
]));

// 3. Raw verbs through the hwdep device
document.body.appendChild($("h2", { textContent: "3. Raw verbs through the hwdep device" }));
document.body.appendChild($("p", {}, [
  "Every HDA codec command is one 32-bit word: node id, verb code, parameter. ",
  "The kernel header defines it verbatim:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight( "#define HDA_VERB(nid,verb,param) ((nid)<<24 | (verb)<<8 | (param))",
  "c")}),
]));
document.body.appendChild($("p", {}, [
  "The codec also exposes an hwdep device, ",
  $("code", { textContent: "/dev/snd/hwC<N>D0" }),
  ", which accepts a verb and returns the codec's response. It is ",
  "single-open: the kernel sets ",
  $("code", { textContent: "exclusive" }),
  ", and a second opener gets EBUSY (",
  $("a", { href: "https://github.com/torvalds/linux/blob/master/sound/core/hwdep.c", textContent: "sound/core/hwdep.c" }),
  ", ",
  $("code", { textContent: "hwdep->exclusive = 1" }),
  " in ",
  $("a", { href: "https://github.com/torvalds/linux/blob/master/sound/hda/common/hwdep.c", textContent: "sound/hda/common/hwdep.c" }),
  "). A guard daemon may hold it.",
]));
document.body.appendChild($("p", {}, [
  "The current ioctl ",
  $("a", { href: "https://github.com/torvalds/linux/blob/master/include/sound/hda_hwdep.h", textContent: "(include/sound/hda_hwdep.h)" }),
  ": ",
  $("code", { textContent: "HDA_IOCTL_VERB_WRITE = _IOWR('H', 0x11, struct hda_verb_ioctl)" }),
  " with ",
  $("code", { textContent: "{ u32 verb; u32 res; }" }),
  ", ioctl number 0xC0084811. The daemon in section 4 probes two ioctl ",
  "variants at startup and uses whichever the kernel accepts; its README ",
  "documents Linux 6.16+ for the new one, with a legacy fallback.",
]));
document.body.appendChild($("p", {}, [
  "The verbs used here ",
  $("a", { href: "https://github.com/torvalds/linux/blob/master/include/sound/hda_verbs.h", textContent: "(include/sound/hda_verbs.h)" }),
  ":",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    innerHTML: highlight(
      "AC_VERB_PARAMETERS          0xf00   # param 0 = vendor id\n" +
      "AC_VERB_GET_PIN_SENSE       0xf09   # presence bit = 1 << 31\n" +
      "AC_VERB_GET_EAPD_BTLENABLE  0xf0c\n" +
      "AC_VERB_SET_EAPD_BTLENABLE  0x70c\n" +
      "AC_VERB_SET_CONNECT_SEL     0x701",
  "c")}),
]));

// 4. The SN6140 quirk
document.body.appendChild($("h2", { textContent: "4. The SN6140 quirk" }));
document.body.appendChild($("p", {}, [
  "The Conexant SN6140 is wired so the internal speaker follows the ",
  "headphone pin:",
]));
document.body.appendChild($("pre", {}, [
  $("code", {
    textContent:
      "0x10  Audio Output   headphones DAC\n" +
      "0x11  Audio Output   speaker DAC\n" +
      "0x16  Pin Complex    headphones jack\n" +
      "0x17  Pin Complex    internal speaker",
  }),
]));
document.body.appendChild($("p", {}, [
  "The speaker ignores its own connection select and follows 0x16, and the ",
  "kernel probes the board with zero internal-speaker pins ",
  $("code", { textContent: "speaker_outs=0" }),
  ", so the generic auto-mute mutes the wrong DAC and never touches the ",
  "speaker amp. Symptoms: headphones plugged, speaker and headphones play ",
  "together; unplugged, total silence; the Speaker mixer controls do nothing.",
]));
document.body.appendChild($("p", {}, [
  "The fix is a daemon ",
  $("a", { href: "https://github.com/chengjilai/huawei-sn6140-speaker-guard", textContent: "github.com/chengjilai/huawei-sn6140-speaker-guard" }),
  " that reads ",
  $("code", { textContent: "GET_PIN_SENSE" }),
  " on 0x16; headphones plugged, set EAPD on 0x17 to 0 (amp off); unplugged, ",
  "to 2 (amp on). The verb recipe comes from ",
  $("a", { href: "https://github.com/Smoren/huawei-ubuntu-sound-fix", textContent: "Smoren/huawei-ubuntu-sound-fix" }),
  " (hardware analysis of the same laptop family), with the kernel-side ",
  "discussion in ",
  $("a", { href: "https://github.com/thesofproject/linux/issues/3350", textContent: "thesofproject/linux#3350" }),
  ". The verbs are idempotent and re-applied every 0.5 s, so suspend/resume ",
  "and profile switches correct themselves.",
]));

appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
