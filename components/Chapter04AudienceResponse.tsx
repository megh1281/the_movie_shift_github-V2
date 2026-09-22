"use client";

import React, { useState, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { SpearmanPair, MovieScatterPoint, CuratedFilm } from "@/lib/dataLoader";
import ArchivePoster from "./ArchivePoster";
import { AlertTriangle, Info, Eye, Sliders, Film } from "lucide-react";

interface Chapter04Props {
  spearmanPairs: SpearmanPair[];
  scatterSample: MovieScatterPoint[];
  curatedFilms?: CuratedFilm[];
}

export default function Chapter04AudienceResponse({
  spearmanPairs,
  scatterSample,
  curatedFilms = [],
}: Chapter04Props) {
  const [xAxisMode, setXAxisMode] = useState<"runtime" | "budget">("runtime");
  const [yAxisMode, setYAxisMode] = useState<"popularity" | "revenue" | "vote_average">("popularity");
  
  // Selected film for the Archive Dossier
  const [selectedFilm, setSelectedFilm] = useState<CuratedFilm | MovieScatterPoint | null>(() => {
    return (
      curatedFilms.find((f) => f.title === "Parasite") ||
      curatedFilms.find((f) => f.title === "Inception") ||
      curatedFilms[0] ||
      null
    );
  });

  // Filter scatter sample to valid data points for selected axes
  const cleanScatter = useMemo(() => {
    return scatterSample
      .filter((d) => {
        const xVal = xAxisMode === "runtime" ? d.runtime : d.budget;
        const yVal =
          yAxisMode === "popularity"
            ? d.popularity
            : yAxisMode === "revenue"
            ? d.revenue
            : d.vote_average;
        return xVal !== null && xVal !== undefined && xVal > 0 && yVal !== null && yVal !== undefined && yVal > 0;
      })
      .slice(0, 160); // Keep clean density
  }, [scatterSample, xAxisMode, yAxisMode]);

  // Find relevant Spearman Rho
  const currentPair = useMemo(() => {
    const varA = xAxisMode;
    const varB = yAxisMode;
    return (
      spearmanPairs.find(
        (p) =>
          (p.variable_a === varA && p.variable_b === varB) ||
          (p.variable_a === varB && p.variable_b === varA)
      ) || null
    );
  }, [spearmanPairs, xAxisMode, yAxisMode]);

  // Curated spotlight films for quick inspection
  const spotlightFilms = useMemo(() => {
    const list = [
      curatedFilms.find((f) => f.title === "Parasite"),
      curatedFilms.find((f) => f.title === "Mad Max: Fury Road"),
      curatedFilms.find((f) => f.title === "Oppenheimer"),
      curatedFilms.find((f) => f.title === "Get Out"),
      curatedFilms.find((f) => f.title === "Avatar"),
    ].filter(Boolean) as CuratedFilm[];
    return list;
  }, [curatedFilms]);

  return (
    <article className="chapter-block" id="chapter-04" aria-labelledby="heading-ch-04">
      <header className="chapter-header">
        <div className="chapter-meta">
          <span>CHAPTER 04</span>
          <span aria-hidden="true">/</span>
          <span>RECEPTION & ATTENTION</span>
          <span style={{ color: "var(--accent-gold)" }}>[ REEL 04 ]</span>
        </div>
        <h3 className="chapter-title" id="heading-ch-04">
          WHAT DID AUDIENCES RESPOND TO?
        </h3>
        <p className="chapter-question">
          How do runtime, production budgets, platform popularity, and user ratings relate?
        </p>
      </header>

      <div className="chapter-narrative">
        <p>
          It is tempting to deduce simple formulas for cinema: do longer movies win more critical
          esteem? Does higher budget guarantee cultural engagement? When analyzing tens of thousands of
          films, pairwise rank correlations reveal subtle, non-linear realities rather than deterministic rules.
        </p>
      </div>

      <div className="editorial-note">
        <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AlertTriangle size={14} style={{ color: "#a07828" }} />
          STATISTICAL HEALTH WARNING: TMDB POPULARITY SCORE
        </strong>
        In this analysis, the metric labeled <strong>TMDB POPULARITY SCORE</strong> is a proprietary,
        decay-weighted algorithm based on daily user views, votes, and watchlist adds inside the TMDB ecosystem.
        It is <strong>not a measure of total theatrical box office admissions, TV viewership, or absolute audience size</strong>.
        Financial values (revenue and budget) equal to 0 are treated as missing data, not $0 cost.
      </div>

      <div className="chart-box" id="chart-scatter-relations">
        <div className="chart-header">
          <div className="chart-title-area">
            <h4>Bivariate Distribution &amp; Spearman Rank Correlation</h4>
            <p className="chart-subtitle">
              Inspect pairwise distributions; select points or archive presets to examine specific films
            </p>
          </div>
          <span className="chart-units">
            {currentPair
              ? `SPEARMAN RHO: ${currentPair.spearman_rho > 0 ? "+" : ""}${currentPair.spearman_rho.toFixed(
                  3
                )} (N=${currentPair.n_pairwise.toLocaleString()})`
              : "RANK CORRELATION"}
          </span>
        </div>

        {/* Axis Control Switches */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-dim)", display: "block", marginBottom: "4px" }}>
              X-AXIS VARIABLE:
            </span>
            <div className="chart-controls">
              <button
                type="button"
                className={`control-pill ${xAxisMode === "runtime" ? "active" : ""}`}
                onClick={() => setXAxisMode("runtime")}
              >
                Runtime (Min)
              </button>
              <button
                type="button"
                className={`control-pill ${xAxisMode === "budget" ? "active" : ""}`}
                onClick={() => setXAxisMode("budget")}
              >
                Budget ($USD Known)
              </button>
            </div>
          </div>

          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-dim)", display: "block", marginBottom: "4px" }}>
              Y-AXIS VARIABLE:
            </span>
            <div className="chart-controls">
              <button
                type="button"
                className={`control-pill ${yAxisMode === "popularity" ? "active" : ""}`}
                onClick={() => setYAxisMode("popularity")}
              >
                TMDB Popularity Score
              </button>
              <button
                type="button"
                className={`control-pill ${yAxisMode === "revenue" ? "active" : ""}`}
                onClick={() => setYAxisMode("revenue")}
              >
                Box Office Revenue ($)
              </button>
              <button
                type="button"
                className={`control-pill ${yAxisMode === "vote_average" ? "active" : ""}`}
                onClick={() => setYAxisMode("vote_average")}
              >
                Average Vote Rating (1–10)
              </button>
            </div>
          </div>
        </div>

        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis
                dataKey={xAxisMode}
                name={xAxisMode}
                stroke="#5e594f"
                tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(val) =>
                  xAxisMode === "budget" ? `$${(val / 1e6).toFixed(0)}M` : `${val}m`
                }
              />
              <YAxis
                dataKey={yAxisMode}
                name={yAxisMode}
                stroke="#5e594f"
                tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(val) =>
                  yAxisMode === "revenue"
                    ? `$${(val / 1e6).toFixed(0)}M`
                    : yAxisMode === "vote_average"
                    ? `${val}`
                    : `${val}`
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as MovieScatterPoint;
                    return (
                      <div
                        style={{
                          background: "#191817",
                          color: "#f4f1ea",
                          padding: "12px 16px",
                          border: "1px solid #3d3935",
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                          maxWidth: "240px",
                        }}
                      >
                        <div style={{ color: "var(--accent-gold)", fontWeight: 700 }}>
                          {data.title} ({data.year})
                        </div>
                        <div style={{ fontSize: "11px", color: "#bbb", margin: "4px 0" }}>
                          {data.genres}
                        </div>
                        <div style={{ borderTop: "1px dashed #444", paddingTop: "6px", marginTop: "6px" }}>
                          <div>Runtime: {data.runtime} min</div>
                          <div>TMDB Popularity: {data.popularity}</div>
                          {data.revenue && <div>Revenue: ${(data.revenue / 1e6).toFixed(1)}M</div>}
                          <div>Rating: {data.vote_average} / 10</div>
                        </div>
                        <div style={{ fontSize: "9px", color: "#888", marginTop: "6px", fontStyle: "italic" }}>
                          Click point to inspect archival dossier
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Representative Sample Films"
                data={cleanScatter}
                fill="#8e3124"
                fillOpacity={0.65}
                onClick={(e) => {
                  if (e) setSelectedFilm(e);
                }}
                style={{ cursor: "pointer" }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* ARCHIVAL DOSSIER: REAL FILM EVIDENCE */}
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            backgroundColor: "var(--bg-paper)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Film size={14} style={{ color: "var(--accent-cinema)" }} />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-main)",
                  fontWeight: 700,
                }}
              >
                SELECTED FILM DOSSIER (ONE FILM WITHIN THIS DISTRIBUTION)
              </span>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-dim)" }}>
              *NOT PROOF OF CAUSALITY
            </span>
          </div>

          {/* Quick Select Presets */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)" }}>
              INSPECT ARCHIVE PRESETS:
            </span>
            {spotlightFilms.map((film) => (
              <button
                key={film.id}
                type="button"
                className={`control-pill ${selectedFilm?.title === film.title ? "active" : ""}`}
                style={{ padding: "4px 10px", fontSize: "10px" }}
                onClick={() => setSelectedFilm(film)}
              >
                {film.title} ({film.year})
              </button>
            ))}
          </div>

          {selectedFilm && (
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                background: "var(--bg-card)",
                padding: "16px",
                border: "1px solid var(--border-subtle)",
                flexWrap: "wrap",
              }}
            >
              <ArchivePoster
                title={selectedFilm.title}
                year={selectedFilm.year}
                posterPath={
                  "poster_path" in selectedFilm && selectedFilm.poster_path
                    ? selectedFilm.poster_path
                    : curatedFilms.find((f) => f.title.toLowerCase() === selectedFilm.title.toLowerCase())?.poster_path
                }
                runtime={selectedFilm.runtime}
                genre={Array.isArray(selectedFilm.genres) ? selectedFilm.genres : selectedFilm.genres}
                size="md"
                highlight={true}
              />

              <div style={{ flex: 1, minWidth: "240px", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", margin: "0 0 4px", color: "var(--text-main)" }}>
                    {selectedFilm.title}
                  </h4>
                  <span style={{ color: "var(--accent-cinema)", fontWeight: 700 }}>
                    {selectedFilm.year}
                  </span>
                </div>
                <div style={{ color: "var(--text-muted)", marginBottom: "12px" }}>
                  {Array.isArray(selectedFilm.genres) ? selectedFilm.genres.join(" · ") : selectedFilm.genres}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "10px",
                    background: "var(--bg-paper)",
                    padding: "12px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--text-dim)", fontSize: "9px", display: "block" }}>
                      RUNTIME
                    </span>
                    <strong>{selectedFilm.runtime} MINUTES</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-dim)", fontSize: "9px", display: "block" }}>
                      TMDB POPULARITY SCORE
                    </span>
                    <strong>{selectedFilm.popularity}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-dim)", fontSize: "9px", display: "block" }}>
                      BOX OFFICE GROSS
                    </span>
                    <strong>
                      {selectedFilm.revenue && selectedFilm.revenue > 0
                        ? `$${(selectedFilm.revenue / 1e6).toFixed(1)}M`
                        : "NOT REPORTED"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-dim)", fontSize: "9px", display: "block" }}>
                      USER RATING
                    </span>
                    <strong>{selectedFilm.vote_average} / 10 ({selectedFilm.vote_count.toLocaleString()} votes)</strong>
                  </div>
                </div>

                <p style={{ margin: "10px 0 0", fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
                  &ldquo;Selected example from the modern catalog. Individual film performance reflects singular marketing campaigns, cultural timing, and festival reception, operating within the broad statistical cloud shown above.&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="chart-footer">
          <span>SPEARMAN CALCULATION: RANK CORRELATIONS ACROSS COMPLETE PAIRS</span>
          <span>AGGREGATE: spearman_pairs.csv &amp; scatter_sample.csv</span>
        </div>
      </div>
    </article>
  );
}
