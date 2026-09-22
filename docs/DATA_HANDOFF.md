# DATA HANDOFF

The final website needs compact aggregate data rather than the raw CSV.

Expected files:
- annual_movie_count.csv
- genre_year.csv
- genre_summary.csv
- runtime_year.csv
- genre_runtime_year.csv
- financial_year.csv
- spearman_pairs.csv
- period_comparison.csv
- data_quality.csv

The included `scripts/movie_shift_tmdb_analysis.py` generates these from the exact TMDB CSV.

Because the raw dataset is too large to commit to GitHub or ship to the browser, the intended workflow is:
raw dataset -> analysis -> small aggregate tables -> website.

Do not put the raw 500+ MB CSV into the repository.
