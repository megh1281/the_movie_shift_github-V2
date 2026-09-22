"use client";

import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GenreYear, GenreSummary, CuratedFilm } from "@/lib/dataLoader";
import ArchivePoster from "./ArchivePoster";
import { AlertCircle, Film, Sparkles } from "lucide-react";

interface Chapter02Props {
  genreYears: GenreYear[];
  genreSummaries: GenreSummary[];
  curatedFilms?: CuratedFilm[];
}

const GENRE_COLORS: Record<string, string> = {
  Drama: "#191817",
  Comedy: "#a07828",
  Thriller: "#8e3124",
  Action: "#34495e",
  Horror: "#78281f",
  Documentary: "#5e594f",
  Romance: "#b05d76",
  Adventure: "#2e7d32",
  "Science Fiction": "#1565c0",
  Animation: "#e65100",
  Crime: "#455a64",
  Mystery: "#6a1b9a",
};

export default function Chapter02GenreCycle({
  genreYears,
  genreSummaries,
  curatedFilms = [],
}: Chapter02Props) {
  // Default selected genres
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "Drama",
    "Comedy",
    "Action",
    "Horror",
    "Documentary",
  ]);

  // Focused genre for the visual film strip
  const [focusedGenre, setFocusedGenre] = useState<string>("Drama");

  const allAvailableGenres = useMemo(() => {
    return Array.from(new Set(genreYears.map((d) => d.genre)))
      .filter((g) => GENRE_COLORS[g] !== undefined)
      .sort();
  }, [genreYears]);

  const toggleGenre = (genre: string) => {
    setFocusedGenre(genre);
    if (selectedGenres.includes(genre)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      }
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Reshape genreYears into pivot: { year: 2000, Drama: 0.22, Comedy: 0.15, ... }
  const chartData = useMemo(() => {
    const yearMap: Record<number, Record<string, number>> = {};
    genreYears.forEach((row) => {
      if (!yearMap[row.year]) {
        yearMap[row.year] = { year: row.year };
      }
      yearMap[row.year][row.genre] = Number((row.genre_share * 100).toFixed(2));
    });

    return Object.values(yearMap).sort((a, b) => a.year - b.year);
  }, [genreYears]);

  // Selected genre summaries
  const activeSummaries = useMemo(() => {
    return genreSummaries.filter((s) => selectedGenres.includes(s.genre));
  }, [genreSummaries, selectedGenres]);

  // Representative films for focused genre sorted chronologically
  const focusedFilms = useMemo(() => {
    return curatedFilms
      .filter((f) => f.genres.includes(focusedGenre))
      .sort((a, b) => a.year - b.year);
  }, [curatedFilms, focusedGenre]);

  return (
    <article className="chapter-block" id="chapter-02" aria-labelledby="heading-ch-02">
      <header className="chapter-header">
        <div className="chapter-meta">
          <span>CHAPTER 02</span>
          <span aria-hidden="true">/</span>
          <span>TAXONOMY & ATTENTION</span>
          <span style={{ color: "var(--accent-gold)" }}>[ REEL 02 ]</span>
        </div>
        <h3 className="chapter-title" id="heading-ch-02">
          THE GENRE CYCLE
        </h3>
        <p className="chapter-question">
          Do genres rise and fall in the collective cinematic consciousness?
        </p>
      </header>

      <div className="chapter-narrative">
        <p>
          Genres are not fixed aesthetic boxes; they function as living contracts between filmmakers,
          financiers, and viewers. When looking across twenty-five years of catalogued releases, we
          observe cyclical waves of genre prominence: the steady ubiquity of Drama and Comedy, the
          rapid expansion of Documentary production after digital video lower barriers, and the
          resilient rise of Horror as a high-margin theatrical experience.
        </p>
      </div>

      <div className="editorial-note">
        <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AlertCircle size={14} style={{ color: "var(--accent-cinema)" }} />
          METHODOLOGICAL NOTICE: MULTI-LABEL GENRE STRUCTURE
        </strong>
        In the TMDB schema, a single movie routinely carries multiple genre tags (e.g., an
        action-thriller comedy like <em>Inception</em> has 3+ genres). The metric displayed below
        is the <strong>relative share of all genre assignments</strong> in that release year,
        <em> not a mutually exclusive market share of unique titles</em>.
      </div>

      <div className="chart-box" id="chart-genre-cycle">
        <div className="chart-header">
          <div className="chart-title-area">
            <h4>Relative Genre Assignment Share Over Time (2000–2025)</h4>
            <p className="chart-subtitle">
              Interactive timeline of genre assignment percentage across all registered feature films
            </p>
          </div>
          <span className="chart-units">UNIT: % OF ANNUAL GENRE TAGS</span>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              display: "block",
              marginBottom: "8px",
            }}
          >
            SELECT GENRES TO COMPARE (CLICK TO TOGGLE FOCUS):
          </span>
          <div className="chart-controls">
            {allAvailableGenres.map((g) => {
              const isSelected = selectedGenres.includes(g);
              const isFocused = focusedGenre === g;
              const color = GENRE_COLORS[g] || "#333";
              return (
                <button
                  key={g}
                  type="button"
                  className={`control-pill ${isSelected ? "active" : ""}`}
                  onClick={() => toggleGenre(g)}
                  style={{
                    borderLeft: `4px solid ${color}`,
                    fontWeight: isFocused ? 800 : isSelected ? 600 : 400,
                    outline: isFocused ? "1px dashed var(--accent-cinema)" : "none",
                  }}
                  id={`btn-genre-${g.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {g} {isFocused && "●"}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <XAxis
                dataKey="year"
                stroke="#5e594f"
                tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
              />
              <YAxis
                stroke="#5e594f"
                tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(val) => `${val}%`}
                domain={[0, "auto"]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div
                        style={{
                          background: "#191817",
                          color: "#f4f1ea",
                          padding: "12px 16px",
                          border: "1px solid #3d3935",
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                          minWidth: "160px",
                        }}
                      >
                        <div style={{ color: "#a07828", marginBottom: "8px", fontWeight: 700 }}>
                          YEAR {label}
                        </div>
                        {payload.map((item) => (
                          <div
                            key={item.dataKey}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "12px",
                              color: item.color,
                              margin: "3px 0",
                            }}
                          >
                            <span>{item.name}:</span>
                            <span style={{ fontWeight: 700 }}>{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  paddingTop: "14px",
                }}
              />
              {selectedGenres.map((genre) => (
                <Line
                  key={genre}
                  type="monotone"
                  dataKey={genre}
                  stroke={GENRE_COLORS[genre] || "#8e3124"}
                  strokeWidth={genre === focusedGenre ? 3.5 : 1.6}
                  strokeOpacity={genre === focusedGenre ? 1 : 0.65}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Genre Summary Stats */}
        {activeSummaries.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginTop: "20px",
              paddingTop: "18px",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            {activeSummaries.map((s) => (
              <div
                key={s.genre}
                style={{
                  fontSize: "12px",
                  lineHeight: 1.5,
                  cursor: "pointer",
                  padding: "6px",
                  backgroundColor: s.genre === focusedGenre ? "var(--bg-surface)" : "transparent",
                  borderLeft: s.genre === focusedGenre ? "3px solid var(--accent-cinema)" : "none",
                }}
                onClick={() => setFocusedGenre(s.genre)}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: GENRE_COLORS[s.genre] || "var(--text-main)",
                    display: "block",
                  }}
                >
                  {s.genre.toUpperCase()} {s.genre === focusedGenre && "← ACTIVE"}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                  Peak: <strong>{s.peak_year}</strong> ({s.peak_count.toLocaleString()} films)
                  <br />
                  Avg: {(Number(s.mean_share) * 100).toFixed(1)}% (Range:{" "}
                  {(Number(s.min_share) * 100).toFixed(1)}%–{(Number(s.max_share) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ARCHIVAL FILM TIMELINE STRIP FOR FOCUSED GENRE */}
        <div
          style={{
            marginTop: "28px",
            padding: "24px",
            backgroundColor: "var(--bg-paper)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--accent-cinema)",
                  display: "block",
                }}
              >
                ARCHIVE TIMELINE · THE SHAPE OF {focusedGenre.toUpperCase()}
              </span>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
                The data shows the genre curve. These films show the aesthetic reality across the timeline.
              </p>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                background: "var(--bg-surface)",
                padding: "4px 8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {focusedFilms.length} ARCHIVE EXAMPLES
            </span>
          </div>

          {focusedFilms.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: "20px",
                overflowX: "auto",
                padding: "8px 4px 16px",
              }}
            >
              {focusedFilms.map((film) => (
                <div key={film.id} style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
                  <ArchivePoster
                    title={film.title}
                    year={film.year}
                    posterPath={film.poster_path}
                    runtime={film.runtime}
                    genre={film.genres}
                    size="md"
                    caption={
                      film.revenue
                        ? `$${(film.revenue / 1e6).toFixed(0)}M Gross`
                        : film.vote_average
                        ? `Rating: ${film.vote_average}/10`
                        : undefined
                    }
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      color: "var(--text-dim)",
                      textAlign: "center",
                      marginTop: "6px",
                      borderTop: "1px dashed var(--border-subtle)",
                      paddingTop: "4px",
                    }}
                  >
                    ERA {film.year < 2010 ? "2000s" : film.year < 2020 ? "2010s" : "2020s"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "12px", color: "var(--text-dim)", fontStyle: "italic", margin: 0 }}>
              Select genres above to inspect curated archival films.
            </p>
          )}
        </div>

        <div className="chart-footer">
          <span>SOURCE: TMDB EXPLODED GENRE LISTS (2000–2025)</span>
          <span>AGGREGATE: genre_year.csv & genre_summary.csv</span>
        </div>
      </div>
    </article>
  );
}
