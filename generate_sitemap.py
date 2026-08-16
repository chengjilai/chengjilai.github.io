#!/usr/bin/env python3
"""Generate robots.txt and sitemap.xml from posts/*.js filenames.

Usage: python3 generate_sitemap.py [SITE_URL]

lastmod comes from each file's most recent commit date when available,
falling back to today. Run again after adding or renaming a post.
"""

import datetime
import pathlib
import subprocess
import sys

SITE = (sys.argv[1] if len(sys.argv) > 1 else "https://chengjilai.github.io").rstrip("/")
ROOT = pathlib.Path(__file__).parent
POSTS = ROOT / "posts"


def lastmod(path: pathlib.Path) -> str:
    out = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", str(path.relative_to(ROOT))],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    value = out.stdout.strip()
    if value:
        return value
    return datetime.date.today().isoformat()


def main() -> int:
    posts = sorted(POSTS.glob("*.js"))
    urls = [(f"{SITE}/", datetime.date.today().isoformat())]
    urls.extend((f"{SITE}/posts/{p.stem}.html", lastmod(p)) for p in posts)

    (ROOT / "robots.txt").write_text(
        "User-agent: *\n"
        "Allow: /\n\n"
        f"Sitemap: {SITE}/sitemap.xml\n"
    )

    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for loc, modified in urls:
        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lines.append(f"    <lastmod>{modified}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")

    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n")
    print(f"wrote robots.txt and sitemap.xml ({len(posts)} posts)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
