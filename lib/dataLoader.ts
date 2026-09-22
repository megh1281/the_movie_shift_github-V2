import Papa from "papaparse";

export interface AnnualCount {
  year: number;
  movie_count: number;
}

export interface GenreYear {
  year: number;
  genre: string;
  movie_count: number;
  all_genre_assignments: number;
  genre_share: number;
}

export interface GenreSummary {
  genre: string;
  years_present: number;
  peak_year: number;
  peak_count: number;
  mean_share: number;
  min_share: number;
  max_share: number;
}

export interface RuntimeYear {
  year: number;
  movie_count: number;
  median: number;
  q25: number;
  q75: number;
  mean: number;
  iqr: number;
}

export interface GenreRuntimeYear {
  year: number;
  genre: string;
  movie_count: number;
  median_runtime: number;
  q25_runtime: number;
  q75_runtime: number;
  iqr_runtime: number;
}

export interface FinancialYear {
  year: number;
  movies: number;
  revenue_known: number;
  budget_known: number;
  median_revenue: number;
  median_budget: number;
  revenue_coverage: number;
  budget_coverage: number;
}

export interface SpearmanPair {
  variable_a: string;
  variable_b: string;
  n_pairwise: number;
  spearman_rho: number;
}

export interface PeriodComparison {
  period: string;
  movies: number;
  median_runtime: number;
  median_revenue: number;
  median_budget: number;
  median_popularity: number;
}

export interface DataQuality {
  raw_rows: number;
  raw_columns: number;
  analysis_rows_2000_2025: number;
  rows_with_release_year: number;
  rows_with_any_genre: number;
  rows_with_valid_runtime_30_300: number;
  rows_with_positive_revenue: number;
  rows_with_positive_budget: number;
  rows_with_popularity: number;
}

export interface MovieScatterPoint {
  title: string;
  year: number;
  genres: string;
  runtime: number;
  popularity: number;
  revenue: number | null;
  budget: number | null;
  vote_average: number;
  vote_count: number;
  poster_path?: string | null;
}

export interface CuratedFilm {
  id: number;
  title: string;
  year: number;
  release_date: string;
  genres: string[];
  runtime: number | null;
  popularity: number;
  revenue: number | null;
  budget: number | null;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface MovieShiftData {
  annualCounts: AnnualCount[];
  genreYears: GenreYear[];
  genreSummaries: GenreSummary[];
  runtimeYears: RuntimeYear[];
  genreRuntimeYears: GenreRuntimeYear[];
  financialYears: FinancialYear[];
  spearmanPairs: SpearmanPair[];
  periodComparisons: PeriodComparison[];
  dataQuality: DataQuality | null;
  scatterSample: MovieScatterPoint[];
  curatedFilms: CuratedFilm[];
  loadedFiles: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
}

async function fetchCsv<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    const text = await res.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data as T[]),
        error: (err: Error) => reject(err),
      });
    });
  } catch (err) {
    console.warn(`Could not load ${url}:`, err);
    return [];
  }
}

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Could not load JSON ${url}:`, err);
    return [];
  }
}

export async function loadAllMovieShiftData(): Promise<MovieShiftData> {
  const loadedFiles: Record<string, boolean> = {
    annual_movie_count: false,
    genre_year: false,
    genre_summary: false,
    runtime_year: false,
    genre_runtime_year: false,
    financial_year: false,
    spearman_pairs: false,
    period_comparison: false,
    data_quality: false,
    scatter_sample: false,
    cinema_archive_manifest: false,
  };

  try {
    const [
      annualCountsRaw,
      genreYearsRaw,
      genreSummariesRaw,
      runtimeYearsRaw,
      genreRuntimeYearsRaw,
      financialYearsRaw,
      spearmanPairsRaw,
      periodComparisonsRaw,
      dataQualityRaw,
      scatterSampleRaw,
      curatedFilmsRaw,
    ] = await Promise.all([
      fetchCsv<AnnualCount>("/data/annual_movie_count.csv"),
      fetchCsv<GenreYear>("/data/genre_year.csv"),
      fetchCsv<GenreSummary>("/data/genre_summary.csv"),
      fetchCsv<RuntimeYear>("/data/runtime_year.csv"),
      fetchCsv<GenreRuntimeYear>("/data/genre_runtime_year.csv"),
      fetchCsv<FinancialYear>("/data/financial_year.csv"),
      fetchCsv<SpearmanPair>("/data/spearman_pairs.csv"),
      fetchCsv<PeriodComparison>("/data/period_comparison.csv"),
      fetchCsv<DataQuality>("/data/data_quality.csv"),
      fetchCsv<MovieScatterPoint>("/data/scatter_sample.csv"),
      fetchJson<CuratedFilm>("/data/cinema_archive_manifest.json"),
    ]);

    if (annualCountsRaw.length > 0) loadedFiles.annual_movie_count = true;
    if (genreYearsRaw.length > 0) loadedFiles.genre_year = true;
    if (genreSummariesRaw.length > 0) loadedFiles.genre_summary = true;
    if (runtimeYearsRaw.length > 0) loadedFiles.runtime_year = true;
    if (genreRuntimeYearsRaw.length > 0) loadedFiles.genre_runtime_year = true;
    if (financialYearsRaw.length > 0) loadedFiles.financial_year = true;
    if (spearmanPairsRaw.length > 0) loadedFiles.spearman_pairs = true;
    if (periodComparisonsRaw.length > 0) loadedFiles.period_comparison = true;
    if (dataQualityRaw.length > 0) loadedFiles.data_quality = true;
    if (scatterSampleRaw.length > 0) loadedFiles.scatter_sample = true;
    if (curatedFilmsRaw.length > 0) loadedFiles.cinema_archive_manifest = true;

    // Attach curated poster_paths to scatter points if titles match
    const titlePosterMap = new Map<string, string>();
    curatedFilmsRaw.forEach((f) => {
      if (f.poster_path) {
        titlePosterMap.set(f.title.toLowerCase(), f.poster_path);
      }
    });

    const enhancedScatter = scatterSampleRaw.map((s) => ({
      ...s,
      poster_path: titlePosterMap.get(s.title.toLowerCase()) || null,
    }));

    return {
      annualCounts: annualCountsRaw,
      genreYears: genreYearsRaw,
      genreSummaries: genreSummariesRaw,
      runtimeYears: runtimeYearsRaw,
      genreRuntimeYears: genreRuntimeYearsRaw,
      financialYears: financialYearsRaw,
      spearmanPairs: spearmanPairsRaw,
      periodComparisons: periodComparisonsRaw,
      dataQuality: dataQualityRaw[0] || null,
      scatterSample: enhancedScatter,
      curatedFilms: curatedFilmsRaw,
      loadedFiles,
      isLoading: false,
      error: null,
    };
  } catch (err: unknown) {
    return {
      annualCounts: [],
      genreYears: [],
      genreSummaries: [],
      runtimeYears: [],
      genreRuntimeYears: [],
      financialYears: [],
      spearmanPairs: [],
      periodComparisons: [],
      dataQuality: null,
      scatterSample: [],
      curatedFilms: [],
      loadedFiles,
      isLoading: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
