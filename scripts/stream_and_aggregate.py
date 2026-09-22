#!/usr/bin/env python3
"""
Stream and aggregate TMDB_movie_dataset_v11.csv from the Hugging Face mirror
directly into the 9 compact aggregate CSVs required by THE MOVIE SHIFT project.
Uses only Python 3 standard library (no pandas or external dependencies needed).
"""

import sys
import os
import csv
import io
import re
import urllib.request
import math
from collections import defaultdict

MIRROR_URL = "https://huggingface.co/datasets/ada-datadruids/full_tmdb_movies_dataset/resolve/main/TMDB_movie_dataset_v11.csv"
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "data")
os.makedirs(OUT_DIR, exist_ok=True)

def split_genres(x):
    if not x:
        return []
    s = str(x).strip()
    if not s:
        return []
    s = re.sub(r"[\[\]{}'\"]", "", s)
    parts = re.split(r"\s*,\s*|\s*\|\s*|;", s)
    return [p.strip() for p in parts if p.strip() and p.strip().lower() not in {"nan", "none"}]

def quantile(sorted_list, q):
    if not sorted_list:
        return 0.0
    n = len(sorted_list)
    if n == 1:
        return float(sorted_list[0])
    pos = q * (n - 1)
    base = int(math.floor(pos))
    rest = pos - base
    if base + 1 < n:
        return sorted_list[base] + rest * (sorted_list[base + 1] - sorted_list[base])
    return float(sorted_list[base])

def median(sorted_list):
    return quantile(sorted_list, 0.5)

def spearman_rho(x_list, y_list):
    n = len(x_list)
    if n < 20:
        return 0.0
    # rank x
    def get_ranks(vals):
        sorted_indices = sorted(range(len(vals)), key=lambda i: vals[i])
        ranks = [0.0] * len(vals)
        i = 0
        while i < len(vals):
            j = i
            while j + 1 < len(vals) and vals[sorted_indices[j + 1]] == vals[sorted_indices[i]]:
                j += 1
            avg_rank = (i + 1 + j + 1) / 2.0
            for k in range(i, j + 1):
                ranks[sorted_indices[k]] = avg_rank
            i = j + 1
        return ranks
    
    rx = get_ranks(x_list)
    ry = get_ranks(y_list)
    d_sq = sum((rx[i] - ry[i]) ** 2 for i in range(n))
    return 1.0 - (6.0 * d_sq) / (n * (n * n - 1))

def main():
    print(f"Connecting to {MIRROR_URL}...")
    req = urllib.request.Request(
        MIRROR_URL,
        headers={"User-Agent": "MovieShiftDataPipeline/1.0"}
    )
    
    # Accumulators
    raw_rows = 0
    raw_columns = 0
    analysis_rows = 0
    rows_with_release_year = 0
    rows_with_any_genre = 0
    rows_with_valid_runtime = 0
    rows_with_positive_revenue = 0
    rows_with_positive_budget = 0
    rows_with_popularity = 0

    annual_counts = defaultdict(int)
    # (year, genre) -> count
    genre_year_counts = defaultdict(int)
    year_all_genre_assignments = defaultdict(int)
    
    # year -> list of runtimes
    runtime_by_year = defaultdict(list)
    # (year, genre) -> list of runtimes
    genre_runtime_by_year = defaultdict(list)
    
    # Financial: year -> stats
    fin_movies = defaultdict(int)
    fin_rev_known = defaultdict(int)
    fin_bud_known = defaultdict(int)
    fin_rev_vals = defaultdict(list)
    fin_bud_vals = defaultdict(list)
    
    # Pairs for correlation (sample up to 50000 for pairwise spearman to save RAM)
    corr_samples = {
        "runtime_raw": [],
        "revenue_num": [],
        "budget_num": [],
        "popularity_num": [],
        "vote_average": [],
        "vote_count": []
    }
    pair_values = defaultdict(lambda: ([], []))
    
    # Period comparison (2015-2019, 2020-2021, 2022-2025)
    periods = {
        "2015-2019": {"movies": 0, "runtimes": [], "revenues": [], "budgets": [], "popularities": []},
        "2020-2021": {"movies": 0, "runtimes": [], "revenues": [], "budgets": [], "popularities": []},
        "2022-2025": {"movies": 0, "runtimes": [], "revenues": [], "budgets": [], "popularities": []},
    }

    max_limit = None
    if "--max-rows" in sys.argv:
        try:
            max_limit = int(sys.argv[sys.argv.index("--max-rows") + 1])
            print(f"Limiting to first {max_limit} raw rows.")
        except Exception:
            pass

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            # We can stream line by line using an io.TextIOWrapper
            text_stream = io.TextIOWrapper(resp, encoding="utf-8", errors="replace")
            reader = csv.reader(text_stream)
            
            header = next(reader)
            raw_columns = len(header)
            col_map = {name.strip(): idx for idx, name in enumerate(header)}
            
            idx_id = col_map.get("id")
            idx_title = col_map.get("title")
            idx_rel = col_map.get("release_date")
            idx_runtime = col_map.get("runtime")
            idx_revenue = col_map.get("revenue")
            idx_budget = col_map.get("budget")
            idx_popularity = col_map.get("popularity")
            idx_vote_avg = col_map.get("vote_average")
            idx_vote_cnt = col_map.get("vote_count")
            idx_genres = col_map.get("genres")
            
            for row in reader:
                raw_rows += 1
                if max_limit and raw_rows >= max_limit:
                    print(f"Reached max limit of {max_limit} rows.")
                    break
                if raw_rows % 25000 == 0:
                    print(f"Processed {raw_rows} raw movies, {analysis_rows} in modern window...")
                
                if len(row) <= max(col_map.values()):
                    continue
                
                title = row[idx_title].strip() if idx_title is not None else ""
                if not title:
                    continue
                
                rel_date = row[idx_rel].strip() if idx_rel is not None else ""
                year = None
                if rel_date and len(rel_date) >= 4:
                    try:
                        y = int(rel_date[:4])
                        if 1900 <= y <= 2030:
                            year = y
                    except ValueError:
                        pass
                
                if year is None or year < 2000 or year > 2025:
                    continue
                
                analysis_rows += 1
                rows_with_release_year += 1
                annual_counts[year] += 1
                fin_movies[year] += 1
                
                # Runtime
                rt_val = None
                if idx_runtime is not None and row[idx_runtime].strip():
                    try:
                        rt_num = float(row[idx_runtime].strip())
                        if 30 <= rt_num <= 300:
                            rt_val = rt_num
                            rows_with_valid_runtime += 1
                            runtime_by_year[year].append(rt_num)
                    except ValueError:
                        pass
                
                # Revenue & Budget (<= 0 is missing)
                rev_val = None
                if idx_revenue is not None and row[idx_revenue].strip():
                    try:
                        r_num = float(row[idx_revenue].strip())
                        if r_num > 0:
                            rev_val = r_num
                            rows_with_positive_revenue += 1
                            fin_rev_known[year] += 1
                            fin_rev_vals[year].append(r_num)
                    except ValueError:
                        pass
                
                bud_val = None
                if idx_budget is not None and row[idx_budget].strip():
                    try:
                        b_num = float(row[idx_budget].strip())
                        if b_num > 0:
                            bud_val = b_num
                            rows_with_positive_budget += 1
                            fin_bud_known[year] += 1
                            fin_bud_vals[year].append(b_num)
                    except ValueError:
                        pass
                
                # Popularity
                pop_val = None
                if idx_popularity is not None and row[idx_popularity].strip():
                    try:
                        p_num = float(row[idx_popularity].strip())
                        pop_val = p_num
                        rows_with_popularity += 1
                    except ValueError:
                        pass
                
                # Votes
                va_val = None
                if idx_vote_avg is not None and row[idx_vote_avg].strip():
                    try:
                        va_val = float(row[idx_vote_avg].strip())
                    except ValueError:
                        pass
                vc_val = None
                if idx_vote_cnt is not None and row[idx_vote_cnt].strip():
                    try:
                        vc_val = float(row[idx_vote_cnt].strip())
                    except ValueError:
                        pass
                
                # Genres
                raw_g = row[idx_genres].strip() if idx_genres is not None else ""
                g_list = split_genres(raw_g)
                if g_list:
                    rows_with_any_genre += 1
                    for g in g_list:
                        genre_year_counts[(year, g)] += 1
                        year_all_genre_assignments[year] += 1
                        if rt_val is not None:
                            genre_runtime_by_year[(year, g)].append(rt_val)
                
                # Period comparison
                period_key = None
                if 2015 <= year <= 2019:
                    period_key = "2015-2019"
                elif 2020 <= year <= 2021:
                    period_key = "2020-2021"
                elif 2022 <= year <= 2025:
                    period_key = "2022-2025"
                
                if period_key:
                    periods[period_key]["movies"] += 1
                    if rt_val is not None:
                        periods[period_key]["runtimes"].append(rt_val)
                    if rev_val is not None:
                        periods[period_key]["revenues"].append(rev_val)
                    if bud_val is not None:
                        periods[period_key]["budgets"].append(bud_val)
                    if pop_val is not None:
                        periods[period_key]["popularities"].append(pop_val)
                
                # Subsample pairwise variables for Spearman
                if analysis_rows % 5 == 0:
                    metrics = {
                        "runtime_raw": rt_val,
                        "revenue_num": rev_val,
                        "budget_num": bud_val,
                        "popularity_num": pop_val,
                        "vote_average": va_val,
                        "vote_count": vc_val
                    }
                    metric_keys = list(metrics.keys())
                    for i in range(len(metric_keys)):
                        for j in range(i + 1, len(metric_keys)):
                            k1, k2 = metric_keys[i], metric_keys[j]
                            v1, v2 = metrics[k1], metrics[k2]
                            if v1 is not None and v2 is not None:
                                p_list = pair_values[(k1, k2)]
                                if len(p_list[0]) < 10000:
                                    p_list[0].append(v1)
                                    p_list[1].append(v2)

    except Exception as e:
        print(f"Stream stopped or finished: {e}")

    print(f"Finished ingestion. Total raw: {raw_rows}, Modern (2000-2025): {analysis_rows}")
    
    # 1. annual_movie_count.csv
    with open(os.path.join(OUT_DIR, "annual_movie_count.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["year", "movie_count"])
        for y in sorted(annual_counts.keys()):
            w.writerow([y, annual_counts[y]])
    print("Wrote annual_movie_count.csv")

    # 2. genre_year.csv
    genre_year_rows = []
    with open(os.path.join(OUT_DIR, "genre_year.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["year", "genre", "movie_count", "all_genre_assignments", "genre_share"])
        for (y, g), count in sorted(genre_year_counts.items()):
            tot = year_all_genre_assignments[y]
            share = count / tot if tot > 0 else 0.0
            w.writerow([y, g, count, tot, f"{share:.6f}"])
            genre_year_rows.append({"year": y, "genre": g, "count": count, "share": share})
    print("Wrote genre_year.csv")

    # 3. genre_summary.csv
    genres_all = sorted(set(g for (_, g) in genre_year_counts.keys()))
    with open(os.path.join(OUT_DIR, "genre_summary.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["genre", "years_present", "peak_year", "peak_count", "mean_share", "min_share", "max_share"])
        for g in genres_all:
            g_rows = [r for r in genre_year_rows if r["genre"] == g]
            if not g_rows:
                continue
            years_present = len(g_rows)
            peak_row = max(g_rows, key=lambda r: r["count"])
            shares = [r["share"] for r in g_rows]
            mean_share = sum(shares) / len(shares)
            min_share = min(shares)
            max_share = max(shares)
            w.writerow([g, years_present, peak_row["year"], peak_row["count"], f"{mean_share:.6f}", f"{min_share:.6f}", f"{max_share:.6f}"])
    print("Wrote genre_summary.csv")

    # 4. runtime_year.csv
    with open(os.path.join(OUT_DIR, "runtime_year.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["year", "movie_count", "median", "q25", "q75", "mean", "iqr"])
        for y in sorted(runtime_by_year.keys()):
            rts = sorted(runtime_by_year[y])
            if not rts:
                continue
            q25_val = quantile(rts, 0.25)
            q75_val = quantile(rts, 0.75)
            med_val = median(rts)
            mean_val = sum(rts) / len(rts)
            iqr_val = q75_val - q25_val
            w.writerow([y, len(rts), f"{med_val:.1f}", f"{q25_val:.1f}", f"{q75_val:.1f}", f"{mean_val:.2f}", f"{iqr_val:.1f}"])
    print("Wrote runtime_year.csv")

    # 5. genre_runtime_year.csv
    with open(os.path.join(OUT_DIR, "genre_runtime_year.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["year", "genre", "movie_count", "median_runtime", "q25_runtime", "q75_runtime", "iqr_runtime"])
        for (y, g) in sorted(genre_runtime_by_year.keys()):
            rts = sorted(genre_runtime_by_year[(y, g)])
            if len(rts) < 5:
                continue
            q25_val = quantile(rts, 0.25)
            q75_val = quantile(rts, 0.75)
            med_val = median(rts)
            iqr_val = q75_val - q25_val
            w.writerow([y, g, len(rts), f"{med_val:.1f}", f"{q25_val:.1f}", f"{q75_val:.1f}", f"{iqr_val:.1f}"])
    print("Wrote genre_runtime_year.csv")

    # 6. financial_year.csv
    with open(os.path.join(OUT_DIR, "financial_year.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["year", "movies", "revenue_known", "budget_known", "median_revenue", "median_budget", "revenue_coverage", "budget_coverage"])
        for y in sorted(fin_movies.keys()):
            m = fin_movies[y]
            rk = fin_rev_known[y]
            bk = fin_bud_known[y]
            med_rev = median(sorted(fin_rev_vals[y])) if fin_rev_vals[y] else 0.0
            med_bud = median(sorted(fin_bud_vals[y])) if fin_bud_vals[y] else 0.0
            rc = rk / m if m > 0 else 0.0
            bc = bk / m if m > 0 else 0.0
            w.writerow([y, m, rk, bk, f"{med_rev:.0f}", f"{med_bud:.0f}", f"{rc:.6f}", f"{bc:.6f}"])
    print("Wrote financial_year.csv")

    # 7. spearman_pairs.csv
    with open(os.path.join(OUT_DIR, "spearman_pairs.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["variable_a", "variable_b", "n_pairwise", "spearman_rho"])
        for (va, vb), (v1s, v2s) in pair_values.items():
            n = len(v1s)
            rho = spearman_rho(v1s, v2s) if n >= 50 else 0.0
            w.writerow([va, vb, n, f"{rho:.4f}"])
    print("Wrote spearman_pairs.csv")

    # 8. period_comparison.csv
    with open(os.path.join(OUT_DIR, "period_comparison.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["period", "movies", "median_runtime", "median_revenue", "median_budget", "median_popularity"])
        for p_name in ["2015-2019", "2020-2021", "2022-2025"]:
            d = periods[p_name]
            med_rt = median(sorted(d["runtimes"])) if d["runtimes"] else 0.0
            med_rev = median(sorted(d["revenues"])) if d["revenues"] else 0.0
            med_bud = median(sorted(d["budgets"])) if d["budgets"] else 0.0
            med_pop = median(sorted(d["popularities"])) if d["popularities"] else 0.0
            w.writerow([p_name, d["movies"], f"{med_rt:.1f}", f"{med_rev:.0f}", f"{med_bud:.0f}", f"{med_pop:.2f}"])
    print("Wrote period_comparison.csv")

    # 9. data_quality.csv
    with open(os.path.join(OUT_DIR, "data_quality.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "raw_rows", "raw_columns", "analysis_rows_2000_2025",
            "rows_with_release_year", "rows_with_any_genre", "rows_with_valid_runtime_30_300",
            "rows_with_positive_revenue", "rows_with_positive_budget", "rows_with_popularity"
        ])
        w.writerow([
            raw_rows, raw_columns, analysis_rows,
            rows_with_release_year, rows_with_any_genre, rows_with_valid_runtime,
            rows_with_positive_revenue, rows_with_positive_budget, rows_with_popularity
        ])
    print("Wrote data_quality.csv")
    print("All 9 aggregate CSV files successfully generated in public/data/")

if __name__ == "__main__":
    main()
