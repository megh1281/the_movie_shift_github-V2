# THE MOVIE SHIFT

**How genres, screens and audiences changed.**

A research-led interactive data story for a Master's-level Visual Experiential Design project.

## What this repository is

This is the **GitHub / Google AI Studio build package** for the project.

It contains:
- a working visual shell
- the narrative architecture
- the data methodology
- the exact Google AI Studio build prompt
- the TMDB analysis pipeline
- documentation for the final data handoff

It intentionally does **not** contain the 500+ MB raw TMDB CSV and it does not fabricate final statistics.

## Recommended workflow

1. Create a GitHub repository.
2. Upload this entire folder.
3. Open Google AI Studio Build mode.
4. Import the GitHub repository.
5. Give Gemini the master prompt in `docs/GOOGLE_AI_STUDIO_MASTER_PROMPT.md`.
6. Let Gemini build and refine the site.
7. Connect/replace the placeholder data with verified aggregate results.
8. Run production QA.
9. Sync the finished project back to GitHub.
10. Deploy from Google AI Studio to Cloud Run or use another supported host.

Google AI Studio currently supports importing a project from GitHub, two-way GitHub sync, live preview, and deployment to Cloud Run. See the official documentation:
https://ai.google.dev/gemini-api/docs/aistudio-build-mode

## Academic integrity

The final project must distinguish:
- findings calculated from the TMDB dataset
- contextual evidence from external sources
- interpretation/design framing

Do not claim that streaming caused changes unless causal evidence is actually established.
