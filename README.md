# chengjilai.github.io — pure-JS blog

Pages are built by JS at runtime (no HTML content, no CSS files): each page is
`common.js` + a per-page script; `posts/YYYY-MM-DD-<slug>.js` (the date is the
publication date — Jekyll convention, written once at creation). The index is
**generated** from `posts/` — never hand-edited.

## Harness (run before committing)

The harness lives in the pi blog skill: `~/nixos/config/pi/skills/blog/scripts/`
(read `SKILL.md` there for the full rules: voice, write surface, references).

```sh
cd ~/nixos/config/pi/skills/blog/scripts
nub install        # first use only (node-html-parser)
nub run gen        # regenerate index.js from posts/ (after add/delete/retitle)
nub run check      # structure+cringe (test.js) + live links (check-links.js) + notes mapping (check-notes.js)
nub run fix        # same, but regenerates index.js first
nub run dupe -- <note-or-draft>   # semantic duplicate-topic gate (embeddings on lab)
```

## Conventions

- Post files: `posts/YYYY-MM-DD-<slug>.js` (+ a copied `.html` shell when adding).
- The agent writes ONLY the note and the post; `index.js`/`common.js` are
  hands-off except `nub run gen` / a check warning (e.g. a new highlight lang).
- Session-recap notes (`~/session-recap`) carry the note→blog mapping
  (`<!-- blog: slug|pending|shelved -->` + `<!-- review: yes|no -->`);
  `check-notes.js` enforces it and prints the REVIEW/SKIP lists.
- The duplicate-topic gate blocks creating a post whose topic already exists
  (title signal nomic ≥ 0.70; content signal Qwen3-0.6B on lab's GPU ≥ 0.85);
  on a block, update the existing post and mark the note to it instead.
