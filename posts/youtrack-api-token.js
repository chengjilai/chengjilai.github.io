"use strict";


const title = document.createElement("title");
title.textContent = "YouTrack: the REST API takes the SPA's own token";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "YouTrack: the REST API takes the SPA's own token" }));

// 1. The GitHub redirect is a workaround for a GitHub bug
document.body.appendChild($("h2", { textContent: "1. The GitHub redirect is a workaround for a GitHub bug" }));
document.body.appendChild($("p", {}, [
  "JetBrains' kotlin-toolchain routes GitHub issues to YouTrack. Its only issue template is a form \n",
  "whose required checkbox reads \"I have read the message and will create the issue in YouTrack \n",
  "instead\"; config.yml sets blank_issues_enabled: false (",
  $("a", { href: "https://github.com/JetBrains/kotlin-toolchain/blob/main/.github/ISSUE_TEMPLATE/youtrack-redirect.yml", textContent: "youtrack-redirect.yml" }),
  ").",
]));
document.body.appendChild($("p", {}, [
  "The form's own text names the cause: \"We had to create this issue template as a workaround for \n",
  "this GitHub bug\" (",
  $("a", { href: "https://github.com/orgs/community/discussions/153714", textContent: "community discussion 153714" }),
  "). The repos carried only a config.yml with contact links and no template files; the discussion: \n",
  "\"GitHub no longer recognizes our config.yml file unless we add some templates or forms\". The \n",
  "checkbox form is the workaround.",
]));

// 2. The persisted cookies are not the session
document.body.appendChild($("h2", { textContent: "2. The persisted cookies are not the session" }));
document.body.appendChild($("p", {}, [
  "YouTrack 2026.3 is an SPA that authenticates against hub.jetbrains.com. The session cookie stays \n",
  "in browser memory. The on-disk cookie store holds only hub.jetbrains.com CASTGC entries \n",
  "path-scoped to /oauth2 and /api/rest/oauth2; sent to the YouTrack API they authenticate as the \n",
  "guest user, and /api/users/me returns ",
  $("code", { textContent: "{\"login\":\"guest\"}" }),
  ".",
]));

// 3. The SPA keeps its bearer token in localStorage
document.body.appendChild($("h2", { textContent: "3. The SPA keeps its bearer token in localStorage" }));
document.body.appendChild($("p", {}, [
  "The SPA stores its OAuth access token in localStorage under the key ",
  $("code", { textContent: "\"<serviceId>-token\"" }),
  ". The serviceId is public: ",
  $("a", { href: "https://youtrack.jetbrains.com/api/config?fields=ring(serviceId,url)", textContent: "GET /api/config?fields=ring(serviceId,url)" }),
  " returns it together with the hub URL.",
]));
document.body.appendChild($("p", {}, [
  "The stored value is JSON: ",
  $("code", { textContent: "{\"accessToken\": \"...\", \"scopes\": [...], \"expires\": <epoch seconds>, \"lifeTime\": 3600}" }),
  ". The accessToken is a JWT. The SPA refreshes it hourly; a 401 means the token rotated, and the \n",
  "newest entry (largest expires) is the current one.",
]));
document.body.appendChild($("p", {}, [
  "qutebrowser keeps localStorage in a LevelDB under the profile's webengine directory, with values \n",
  "stored as plaintext. The newest token wins:",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(String.raw`python3 - <<'EOF' > /tmp/yt_token.txt
import re, json, glob, os
base = os.path.expanduser('~/.local/share/qutebrowser/webengine/Local Storage/leveldb')
pat = re.compile(rb'\{"accessToken":"[A-Za-z0-9_\-\.]+","scopes":\[[^\]]*\],"expires":\d+,"lifeTime":\d+\}')
toks = []
for f in glob.glob(base + '/*'):
    for m in pat.finditer(open(f, 'rb').read()):
        toks.append(json.loads(m.group(0).decode()))
toks.sort(key=lambda j: j['expires'])
print(toks[-1]['accessToken'], end='')
EOF`, "python")}),
]));

// 4. The REST API takes the token
document.body.appendChild($("h2", { textContent: "4. The REST API takes the token" }));
document.body.appendChild($("p", {}, [
  "The ",
  $("a", { href: "https://www.jetbrains.com/help/youtrack/devportal/youtrack-rest-api.html", textContent: "REST API" }),
  " accepts the token as Authorization: Bearer. GET /api/users/me?fields=login,guest returns the user.",
]));
document.body.appendChild($("pre", {}, [
  $("code", { innerHTML: highlight(String.raw`TOK=$(cat /tmp/yt_token.txt)
curl -s -X POST 'https://youtrack.jetbrains.com/api/issues?fields=idReadable' \
  -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' \
  -d '{"project":{"id":"22-451"},"summary":"...","description":"..."}'
curl -s -X POST 'https://youtrack.jetbrains.com/api/issues/{id}/comments?fields=id,text' \
  -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' \
  -d '{"text":"..."}'`, "shell")}),
]));
document.body.appendChild($("p", {}, [
  "POST /api/issues?fields=idReadable creates an issue from ",
  $("code", { textContent: "{\"project\":{\"id\":\"...\"},\"summary\":\"...\",\"description\":\"...\"}" }),
  ". The description is YouTrack markup (h2., *, {code}), not Markdown. Project ids come from GET \n",
  "/api/admin/projects?fields=id,shortName.",
]));
document.body.appendChild($("p", {}, [
  "A comment is created with POST /api/issues/{id}/comments?fields=id,text and a ",
  $("code", { textContent: "{\"text\":\"...\"}" }),
  " body; editing is a POST to the same URL. Deleting a comment 403s with the SPA token: the \n",
  "permission is not in its scopes.",
]));
document.body.appendChild($("p", {}, [
  "The login page carries a note for AI clients: \"AI clients should read ",
  $("a", { href: "https://youtrack.jetbrains.com/llms.txt", textContent: "/llms.txt" }),
  " and use the REST API for structured data\".",
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", { href: "https://github.com/chengjilai/chengjilai.github.io", textContent: "github.com/chengjilai/chengjilai.github.io" }),
]));
