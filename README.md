# HBD ALLAH · ROCKSOUL Q4Q Command Center

A source-aware, static research dashboard for ROCKSOUL Ontology and Q4Q comparative religion mapping. This is a **research prototype**, not a verdict on the truth of any religious tradition.

## What is included

- Q4Q point scoring: `Q4Q = 8T + 4A + 2R + M`, with each input an integer from 0–10; maximum 150.
- 25 unique root traditions, 19 nested branch/practice entries; no root double-counting.
- Historical A/T/R values preserved **only** as unreviewed legacy estimates, with a clearly labelled archival projection.
- Major / Minor lineage registry separated from broad historical family labels.
- Universe / Cosmic Order (U) and Ruh / Spirit World (RU) qualitative domain registry.
- Local-only point scoring lab, local browser draft persistence, JSON export.
- Responsive dark command center design. No account, API key, tracking, database or external AI service required.

## Important research limitations

1. 75 traditions is the *target*, but only 25 roots are registered so far.
2. Zero Q4Q scores have undergone source-by-source independent validation.
3. Historical scores are **not** new verified 0–10 point inputs.
4. A root may represent a broad tradition with internally diverse doctrines. Branch-aware scoring remains future work.
5. U/RU are research domains, **not** additional weighted dimensions.
6. Religion, denomination, branch, school, practice and historical relationship must not be conflated.
7. Comparative affinity to Islamic concepts does **not** establish which religion is true or accepted by God.

## Run locally

Open `index.html` in a browser, or serve the directory:

```sh
python3 -m http.server 8080
```

Go to http://localhost:8080

There is **no build step**. Deploy the repository root as a static Vercel project.

## Repository structure

- `index.html` — accessible page and all views
- `styles.css` — responsive UI
- `data.js` — provisional 25-root registry and source references
- `app.js` — filters, lineage, scoring lab, local drafts, export
- `vercel.json` — Vercel static deployment settings

## Roadmap

1. Add explicit source locators, references and reviewer evidence for every indicator.
2. Migrate drafts to controlled assessments with author and audit status.
3. Normalize community variants for root/branch scoring.
4. Add validation gates and quality metrics.
5. Expand registry to 75 root traditions.
6. Add source-aware knowledge graph and local AI extraction with human review.

No private keys, credentials, user accounts or sensitive data are required.
