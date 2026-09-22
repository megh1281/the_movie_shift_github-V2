# THE MOVIE SHIFT — MASTER GOOGLE AI STUDIO PROMPT

You are taking over an existing GitHub repository for a Master's-level data storytelling project.

PROJECT TITLE:
THE MOVIE SHIFT

SUBTITLE:
How genres, screens and audiences changed.

CORE QUESTION:
As the way movies were made, released and watched changed, how did the movie itself change?

YOUR JOB:
Turn this repository into a polished, functional, responsive, publicly deployable interactive data story. You are responsible for implementing the site, not merely suggesting code.

IMPORTANT DATA INTEGRITY RULE:
Do NOT invent statistics. Do NOT use placeholder numbers in the final experience.
The repository intentionally contains a placeholder data state because the 500+ MB raw TMDB CSV should never be shipped to the browser.

DATA SOURCE:
Primary dataset:
Full TMDB Movies Dataset 2024 / TMDB_movie_dataset_v11.csv
Kaggle:
https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies

A public mirror is available at:
https://huggingface.co/datasets/ada-datadruids/full_tmdb_movies_dataset

The repository includes scripts and documentation defining the exact cleaning/analysis logic.

ANALYTICAL PILLARS:
1. Genre evolution: release year × genre share.
2. Runtime evolution: release year × runtime distribution.
3. Genre × runtime: how different genres' typical runtime changes over time.
4. Genre × revenue/popularity: secondary analysis with explicit data-quality caveats.
5. COVID disruption: descriptive comparison, treated as a separate disruption rather than evidence of streaming causation.
6. Screen/streaming transition: contextual chapter using external historical evidence. Do NOT claim TMDB proves streaming caused changes.
7. Franchise fatigue is NOT a core quantitative chapter because the primary schema lacks a clean franchise/collection field.

NARRATIVE:
01 THE MOVIE MACHINE
How many movies were being made, and what changed?

02 THE GENRE CYCLE
Which genres expanded, contracted or changed their share?

03 HOW LONG IS A MOVIE?
Did the typical movie get longer, shorter or more variable?

04 WHAT DID AUDIENCES RESPOND TO?
Explore genre × runtime × TMDB popularity/revenue, clearly labeling metrics and limitations.

05 THE SCREEN MOVED
Cinema, home video, digital and streaming changed how movies reached audiences. Use external industry evidence, not TMDB alone.

06 SUCCESS GOT A NEW MEASUREMENT
Explain the transition from theatrical metrics to platform engagement metrics. Netflix can be used as one documented platform example, never as a proxy for the entire streaming industry.

07 DID THE MOVIE CHANGE?
Synthesize the evidence. Be nuanced. Do not state that streaming caused every observed change.

VISUAL LANGUAGE:
- Editorial modernism with restrained early-cinema references.
- Warm paper/off-white background, near-black typography, muted film-grain texture.
- Typography: bold grotesk/sans for data and navigation; elegant serif/italic for narrative emphasis.
- Nostalgia is punctuation, not costume.
- Generous whitespace.
- One screen = one question.
- Charts should feel like editorial figures rather than dashboard widgets.

INTERACTION:
- Chapter navigation.
- Scroll-driven narrative transitions.
- Hover/tap tooltips.
- Year scrubber where useful.
- Genre selector.
- Metric selector where useful.
- Progressive disclosure.
- A final exploratory mode.
- Keyboard accessible controls.
- Reduced-motion support.
- Never make motion essential for understanding.

CHARTS:
Use D3/Recharts/Observable Plot as appropriate.
Prefer:
- line/area chart for genre share
- ribbon/quantile or distribution chart for runtime
- small multiples for genre runtime
- scatterplot for runtime vs popularity/revenue with clear caveats
- timeline/context band for theatrical/digital/streaming transition
- annotation-led charts rather than chart galleries

EVERY DATA VISUALIZATION MUST HAVE:
- title
- units
- source
- accessible text summary
- tooltip
- responsive behavior
- non-color encoding where needed

DATA RULES:
- Missing revenue is NOT zero.
- Missing budget is NOT zero.
- Runtime <= 0 is invalid.
- Do not blindly trust extreme runtime values.
- TMDB popularity is not audience size.
- Genre shares are not mutually exclusive because films can have multiple genres.
- Correlation is not causation.
- COVID 2020–2021 must be treated separately.
- Current streaming availability cannot be interpreted as historical availability.
- Netflix data must be described as Netflix data.

IMPLEMENTATION:
- Use the existing Next.js/React/TypeScript structure.
- Keep the raw 500+ MB CSV out of the browser.
- Use compact pre-aggregated JSON/CSV data.
- If the aggregate data files are absent, do not fabricate them. Instead, create a clearly marked data-loading state and tell the developer exactly which aggregate files are required.
- Keep all source metadata in a dedicated sources/methodology section.
- Add a methodology page/section explaining cleaning, transformations, limitations and dataset provenance.
- Add an AI/process documentation section suitable for an academic jury.

QUALITY BAR:
This is a Master's design project, not a generic dashboard.
It should feel like a coherent editorial story with data embedded into the narrative.
Avoid card grids, excessive rounded rectangles, generic SaaS styling, stock-dashboard aesthetics, and decorative charts without a narrative purpose.

FINAL QA:
Before declaring the project finished:
1. Run the production build.
2. Check all routes.
3. Check desktop/tablet/mobile.
4. Check keyboard navigation.
5. Check reduced motion.
6. Check chart labels and units.
7. Check source attribution.
8. Search the codebase for invented numeric claims.
9. Ensure no API keys are committed.
10. Ensure the raw TMDB CSV is not bundled.
