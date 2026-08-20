"use strict";

const title = document.createElement("title");
title.textContent = "Scholarly paper search APIs";
document.head.appendChild(title);

document.body.appendChild($("h1", { textContent: "Scholarly paper search APIs" }));

document.body.appendChild($("p", {}, [
  "Twenty-one scholarly search APIs were probed with live requests. ",
  "Every endpoint and field shape below is the response that came back, not what the documentation promised.",
]));

document.body.appendChild($("h2", { textContent: "1. The free, keyless APIs" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [$("code", { textContent: "arXiv" }), ": ", $("code", { textContent: "https://export.arxiv.org/api/query?search_query=all:Q&max_results=N" }), " returns Atom XML.", $("a", { href: "https://info.arxiv.org/help/api/index.html", textContent: "docs" })]),$("li", {}, [$("code", { textContent: "Crossref" }), ": ", $("code", { textContent: "https://api.crossref.org/works?query=Q&rows=N&mailto=E" }), " returns JSON; the mailto gets the polite pool. "
, $("a", { href: "https://api.crossref.org/", textContent: "docs" })]),
  $("li", {}, [$("code", { textContent: "OpenAlex" }), ": ", $("code", { textContent: "https://api.openalex.org/works?search=Q&per-page=N&mailto=E" }), " JSON; the abstract arrives as a word to positions inverted index."]),
  $("li", {}, [$("code", { textContent: "Semantic Scholar" }), ": ", $("code", { textContent: "https://api.semanticscholar.org/graph/v1/paper/search?query=Q&limit=N&fields=..." }), " 429s hard from a datacenter IP without a key; a retry sometimes lands. ", $("a", { href: "https://www.semanticscholar.org/product/api", textContent: "docs" })]),
  $("li", {}, [$("code", { textContent: "PubMed" }), ": NCBI E-utilities, esearch.fcgi for PMIDs then esummary.fcgi for metadata."]),
  $("li", {}, [$("code", { textContent: "Europe PMC" }), ": ", $("code", { textContent: "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=Q&format=json&pageSize=N" }), " JSON; occasional transient 503."]),
  $("li", {}, [$("code", { textContent: "DBLP" }), ": ", $("code", { textContent: "https://dblp.org/search/publ/api?q=Q&format=json&h=N" }), " JSON; titles arrive HTML-escaped."]),
  $("li", {}, [$("code", { textContent: "DOAJ" }), ": ", $("code", { textContent: "https://doaj.org/api/v3/search/articles/Q?pageSize=N" }), " JSON; v3 needs no key."]),
  $("li", {}, [$("code", { textContent: "HAL" }), ": ", $("code", { textContent: "https://api.archives-ouvertes.fr/search/?q=Q&wt=json&rows=N" }), " Solr JSON."]),
  $("li", {}, [$("code", { textContent: "INSPIRE-HEP" }), ": ", $("code", { textContent: "https://inspirehep.net/api/literature?q=Q&size=N" }), " JSON, high-energy physics."]),
  $("li", {}, [$("code", { textContent: "Zenodo" }), ": ", $("code", { textContent: "https://zenodo.org/api/records?q=Q&size=N" }), " JSON; descriptions are HTML."]),
  $("li", {}, [$("code", { textContent: "OSF" }), ": ", $("code", { textContent: "https://api.osf.io/v2/nodes/?search=Q&page[size]=N" }), " JSON, anonymous read."]),
  $("li", {}, [$("code", { textContent: "OpenAIRE" }), ": ", $("code", { textContent: "https://api.openaire.eu/search/publications?keywords=Q&size=N" }), " returns XML with a DRI ontology; elements are bare tags under optional dri: wrappers."]),
  $("li", {}, [$("code", { textContent: "Dryad" }), ": ", $("code", { textContent: "https://datadryad.org/api/v2/search?q=Q&limit=N" }), " JSON; records sit under ", $("code", { textContent: "_embedded.stash:datasets" }), "."]),
]));

document.body.appendChild($("h2", { textContent: "2. The keyed APIs" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, [$("code", { textContent: "CORE" }), ": ", $("code", { textContent: "https://api.core.ac.uk/v3/search/works?q=Q&limit=N" }), " with ",
    $("code", { textContent: "Authorization: Bearer" }), ". Azure Search backed; 503 throttles that clear within seconds. ", $("a", { href: "https://core.ac.uk/services/api", textContent: "docs" })]),
  $("li", {}, [$("code", { textContent: "NASA ADS" }), " (SciX, astronomy): ", $("code", { textContent: "https://api.adsabs.harvard.edu/v1/search/query?q=Q&rows=N&fl=..." }), " with a Bearer token. ", $("a", { href: "https://ui.adsabs.harvard.edu/help/api/api-docs.html", textContent: "docs" })]),
  $("li", {}, [$("code", { textContent: "Springer Nature" }), ": ", $("code", { textContent: "https://api.springernature.com/meta/v2/json?q=Q&api_key=K&p=N" }), ", key in the query."]),
  $("li", {}, [$("code", { textContent: "IEEE Xplore" }), ": ", $("code", { textContent: "https://ieeexploreapi.ieee.org/api/v1/search/articles?querytext=Q&apikey=K&format=json" }), ", key in the query."]),
  $("li", {}, [$("code", { textContent: "Lens.org" }), ": POST JSON to ", $("code", { textContent: "https://api.lens.org/scholarly/search" }), " with an Elasticsearch-style query body, Bearer."]),
  $("li", {}, [$("code", { textContent: "Google Scholar" }), " has no official API. SerpAPI, ", $("code", { textContent: "https://serpapi.com/search.json?engine=google_scholar&q=Q&num=N&api_key=K" }), ", is the paid proxy. ", $("a", { href: "https://serpapi.com", textContent: "SerpAPI" })]),
]));

document.body.appendChild($("h2", { textContent: "3. Field shapes and traps" }));
document.body.appendChild($("p", {}, [
  "DataCite's legacy ",
  $("code", { textContent: "api.datacite.org/works" }),
  " is dead (410 Gone); ",
  $("code", { textContent: "https://api.datacite.org/dois?query=Q&page[size]=N" }),
  " replaces it. ", $("a", { href: "https://api.datacite.org/dois", textContent: "docs" }),
]));
document.body.appendChild($("p", {}, [
  "ADS filters years on an integer field: ", $("code", { textContent: "fq=year:[2024 TO *]" }),
  ". The date form ", $("code", { textContent: "year:[2024-01-01 TO *]" }),
  " silently under-matches, and the brackets and asterisk must be URL-encoded or the API returns 400.",
]));
document.body.appendChild($("p", {}, [
  "PubMed esummary returns a literal ",
  $("code", { textContent: "uids" }),
  " array inside its result object, so map[string]struct unmarshal breaks; unmarshal each PMID from map[string]json.RawMessage.",
]));
document.body.appendChild($("p", {}, [
  "DBLP authors come back as ",
  $("code", { textContent: '{"author": [...]}' }),
  ", ",
  $("code", { textContent: '{"author": {...}}' }),
  ", or a plain string. HAL and INSPIRE return a field as string or array, and INSPIRE's record id as number or string.",
]));
document.body.appendChild($("p", {}, [
  "IEEE returns ",
  $("code", { textContent: "403 Developer Inactive" }),
  " for an unapproved account no matter how valid the key is; activation is server side and takes days.",
]));

document.body.appendChild($("h2", { textContent: "4. Dead or lookup-only" }));
document.body.appendChild($("ul", {}, [
  $("li", {}, ["From a China-hosted network: Figshare 403, science.gov and BASE unreachable, RePEc/IDEAS 404."]),
  $("li", {}, ["OpenCitations, Unpaywall and ORCID answer queries by DOI or identifier only, not by keyword. Unpaywall takes the email address as its auth."]),
]));


appendReferences();

document.body.appendChild($("p", {}, [
  "Source: ",
  $("a", {
    href: "https://github.com/chengjilai/chengjilai.github.io",
    textContent: "github.com/chengjilai/chengjilai.github.io",
  }),
]));
