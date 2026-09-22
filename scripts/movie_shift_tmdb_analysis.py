# THE MOVIE SHIFT — TMDB analysis pipeline
# Run in Google Colab or locally after downloading TMDB_movie_dataset_v11.csv.
# Outputs compact CSVs for the A2 data-story research phase.

import pandas as pd
import numpy as np
from pathlib import Path
import re

INPUT = "TMDB_movie_dataset_v11.csv"
OUT = Path("movie_shift_analysis")
OUT.mkdir(exist_ok=True)

# ---------- Load ----------
df = pd.read_csv(INPUT, low_memory=False)

# Keep a raw-row count for documentation.
quality = {
    "raw_rows": len(df),
    "raw_columns": len(df.columns),
}

# ---------- Basic cleaning ----------
df["release_date_parsed"] = pd.to_datetime(df["release_date"], errors="coerce")
df["year"] = df["release_date_parsed"].dt.year

# Analysis window: modern cinema where the release-date field is most useful.
# Change these if your project needs a longer historical window.
analysis = df[
    df["year"].between(2000, 2025, inclusive=True)
    & df["title"].notna()
].copy()

# Runtime: keep raw value, then define a defensible feature-film analysis range.
analysis["runtime_raw"] = pd.to_numeric(analysis["runtime"], errors="coerce")
analysis["runtime_valid"] = analysis["runtime_raw"].between(30, 300)

# Revenue/budget: zero and negative values are treated as missing for financial analysis.
analysis["revenue_num"] = pd.to_numeric(analysis["revenue"], errors="coerce")
analysis["budget_num"] = pd.to_numeric(analysis["budget"], errors="coerce")
analysis.loc[analysis["revenue_num"] <= 0, "revenue_num"] = np.nan
analysis.loc[analysis["budget_num"] <= 0, "budget_num"] = np.nan

# TMDB popularity is retained but explicitly treated as a platform-specific metric.
analysis["popularity_num"] = pd.to_numeric(analysis["popularity"], errors="coerce")

# ---------- Genre parsing ----------
def split_genres(x):
    if pd.isna(x):
        return []
    # Handles the common TMDB format "Action, Drama" and JSON-ish variants.
    s = str(x).strip()
    if not s:
        return []
    # Remove simple JSON punctuation/quotes without trying to perfectly parse every historical variant.
    s = re.sub(r"[\[\]{}'\"]", "", s)
    parts = re.split(r"\s*,\s*|\s*\|\s*|;", s)
    return [p.strip() for p in parts if p.strip() and p.strip().lower() not in {"nan", "none"}]

analysis["genre_list"] = analysis["genres"].apply(split_genres)

# ---------- Quality table ----------
quality.update({
    "analysis_rows_2000_2025": len(analysis),
    "rows_with_release_year": int(analysis["year"].notna().sum()),
    "rows_with_any_genre": int(analysis["genre_list"].map(len).gt(0).sum()),
    "rows_with_valid_runtime_30_300": int(analysis["runtime_valid"].sum()),
    "rows_with_positive_revenue": int(analysis["revenue_num"].notna().sum()),
    "rows_with_positive_budget": int(analysis["budget_num"].notna().sum()),
    "rows_with_popularity": int(analysis["popularity_num"].notna().sum()),
})

quality_df = pd.DataFrame([quality])
quality_df.to_csv(OUT / "data_quality.csv", index=False)

# ---------- Annual production volume ----------
annual = (
    analysis.groupby("year")
    .size()
    .rename("movie_count")
    .reset_index()
)
annual.to_csv(OUT / "annual_movie_count.csv", index=False)

# ---------- Genre evolution ----------
genre_long = analysis[["year", "genre_list"]].explode("genre_list").rename(columns={"genre_list": "genre"})
genre_long = genre_long[genre_long["genre"].notna() & (genre_long["genre"] != "")]

genre_year = (
    genre_long.groupby(["year", "genre"])
    .size()
    .rename("movie_count")
    .reset_index()
)
year_totals_with_genres = genre_year.groupby("year")["movie_count"].sum().rename("all_genre_assignments")
genre_year = genre_year.merge(year_totals_with_genres, on="year", how="left")
genre_year["genre_share"] = genre_year["movie_count"] / genre_year["all_genre_assignments"]
genre_year.to_csv(OUT / "genre_year.csv", index=False)

# Genre peaks and changes: useful for identifying candidate "life cycles".
genre_summary = (
    genre_year.groupby("genre")
    .agg(
        years_present=("year", "nunique"),
        peak_year=("movie_count", lambda s: int(genre_year.loc[s.idxmax(), "year"])),
        peak_count=("movie_count", "max"),
        mean_share=("genre_share", "mean"),
        min_share=("genre_share", "min"),
        max_share=("genre_share", "max"),
    )
    .reset_index()
)
genre_summary.to_csv(OUT / "genre_summary.csv", index=False)

# ---------- Runtime evolution ----------
runtime = analysis[analysis["runtime_valid"]].copy()

runtime_year = (
    runtime.groupby("year")["runtime_raw"]
    .agg(
        movie_count="count",
        median="median",
        q25=lambda s: s.quantile(.25),
        q75=lambda s: s.quantile(.75),
        mean="mean",
    )
    .reset_index()
)
runtime_year["iqr"] = runtime_year["q75"] - runtime_year["q25"]
runtime_year.to_csv(OUT / "runtime_year.csv", index=False)

# ---------- Genre × runtime ----------
gr = analysis[
    analysis["runtime_valid"] &
    analysis["genre_list"].map(len).gt(0)
][["year", "runtime_raw", "genre_list"]].explode("genre_list")
gr = gr.rename(columns={"genre_list": "genre"})

genre_runtime_year = (
    gr.groupby(["year", "genre"])["runtime_raw"]
    .agg(
        movie_count="count",
        median_runtime="median",
        q25_runtime=lambda s: s.quantile(.25),
        q75_runtime=lambda s: s.quantile(.75),
    )
    .reset_index()
)
genre_runtime_year["iqr_runtime"] = (
    genre_runtime_year["q75_runtime"] - genre_runtime_year["q25_runtime"]
)
genre_runtime_year.to_csv(OUT / "genre_runtime_year.csv", index=False)

# ---------- Revenue / budget coverage and trends ----------
financial_year = (
    analysis.groupby("year")
    .agg(
        movies=("id", "size"),
        revenue_known=("revenue_num", "count"),
        budget_known=("budget_num", "count"),
        median_revenue=("revenue_num", "median"),
        median_budget=("budget_num", "median"),
    )
    .reset_index()
)
financial_year["revenue_coverage"] = financial_year["revenue_known"] / financial_year["movies"]
financial_year["budget_coverage"] = financial_year["budget_known"] / financial_year["movies"]
financial_year.to_csv(OUT / "financial_year.csv", index=False)

# ---------- Popularity / runtime / financial relationships ----------
corr_cols = ["runtime_raw", "revenue_num", "budget_num", "popularity_num", "vote_average", "vote_count"]
corr = analysis[corr_cols].copy()
correlations = corr.corr(method="spearman", min_periods=100).reset_index().rename(columns={"index": "variable"})
correlations.to_csv(OUT / "spearman_correlations.csv", index=False)

# Pairwise sample sizes so missingness is visible.
pairs = []
for i, a in enumerate(corr_cols):
    for b in corr_cols[i+1:]:
        n = corr[[a,b]].dropna().shape[0]
        rho = corr[[a,b]].dropna().corr(method="spearman").iloc[0,1] if n >= 100 else np.nan
        pairs.append({"variable_a": a, "variable_b": b, "n_pairwise": n, "spearman_rho": rho})
pd.DataFrame(pairs).to_csv(OUT / "spearman_pairs.csv", index=False)

# ---------- Pre/post COVID comparison ----------
# Descriptive only: do not interpret as streaming causation.
covid_compare = (
    analysis.assign(period=np.select(
        [analysis["year"].between(2015, 2019), analysis["year"].between(2020, 2021), analysis["year"].between(2022, 2025)],
        ["2015-2019", "2020-2021", "2022-2025"],
        default="other"
    ))
    .query("period != 'other'")
    .groupby("period")
    .agg(
        movies=("id", "size"),
        median_runtime=("runtime_raw", "median"),
        median_revenue=("revenue_num", "median"),
        median_budget=("budget_num", "median"),
        median_popularity=("popularity_num", "median"),
    )
    .reset_index()
)
covid_compare.to_csv(OUT / "period_comparison.csv", index=False)

# ---------- Evidence checklist ----------
checklist = pd.DataFrame([
    {"story_direction": "Genre life cycles", "primary_output": "genre_year.csv + genre_summary.csv", "evidence_status": "TEST"},
    {"story_direction": "Runtime/form changed over time", "primary_output": "runtime_year.csv", "evidence_status": "TEST"},
    {"story_direction": "Genre × runtime relationship", "primary_output": "genre_runtime_year.csv", "evidence_status": "TEST"},
    {"story_direction": "Genre × revenue/popularity", "primary_output": "financial_year.csv + spearman_pairs.csv", "evidence_status": "TEST_WITH_CAVEATS"},
    {"story_direction": "Franchise fatigue", "primary_output": "Not available from core TMDB schema", "evidence_status": "NOT_TESTABLE_AS_CORE"},
    {"story_direction": "Streaming caused the shift", "primary_output": "Requires external historical streaming/release data", "evidence_status": "NOT_TESTABLE_FROM_TMDB_ALONE"},
    {"story_direction": "COVID disruption", "primary_output": "period_comparison.csv + external MPA context", "evidence_status": "TEST_DESCRIPTIVELY"},
])
checklist.to_csv(OUT / "story_evidence_checklist.csv", index=False)

# ---------- Research notes ----------
notes = """THE MOVIE SHIFT — ANALYSIS NOTES

Primary dataset: TMDB_movie_dataset_v11.csv
Analysis window: 2000–2025
Runtime feature-film filter: 30–300 minutes
Revenue/budget rule: <=0 treated as missing, never as zero earnings/spend.
Genre parsing: comma/pipe/semicolon separated values are exploded to one genre per row.
Genre shares are shares of genre assignments, not necessarily shares of unique films, because TMDB films can have multiple genres.
Popularity: TMDB's popularity metric; do not describe it as audience size.
COVID: 2020–2021 is treated as a separate disruption period.
Streaming: not inferred from TMDB alone; historical platform/release data must be linked separately.
Correlation: descriptive association only; not causation.

IMPORTANT:
Run this pipeline on the exact CSV version you use for the project and record the download date/version.
The generated outputs are aggregate research tables intended to be small enough to upload/share.
"""
(OUT / "README_analysis_notes.txt").write_text(notes, encoding="utf-8")

print("Done. Outputs written to:", OUT.resolve())
print("\nFiles:")
for p in sorted(OUT.iterdir()):
    print(" -", p.name)
