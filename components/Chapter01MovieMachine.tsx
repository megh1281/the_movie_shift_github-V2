"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { AnnualCount, GenreYear, CuratedFilm } from "@/lib/dataLoader";
import ArchivePoster from "./ArchivePoster";
import { Info, Film, Sliders, AlertCircle } from "lucide-react";

interface Chapter01Props {
  annualCounts: AnnualCount[];
  genreYears: GenreYear[];
  curatedFilms?: CuratedFilm[];
}

export default function Chapter01MovieMachine({
  annualCounts,
  genreYears,
  curatedFilms = [],
}: Chapter01Props) {
  const [viewMode, setViewMode] = useState<"annual" | "composition">("annual");
  const [scrubYear, setScrubYear] = useState<number>(2019);

  // Top 6 genres for stacked composition
  const topGenres = ["Drama", "Comedy", "Thriller", "Action", "Horror", "Documentary"];
  const compositionMap: Record<number, Record<string, number>> = {};
  genreYears.forEach((item) => {
    if (!compositionMap[item.year]) {
      compositionMap[item.year] = { year: item.year };
    }
    if (topGenres.includes(item.genre)) {
      compositionMap[item.year][item.genre] = item.movie_count;
    }
  });
  const compositionData = Object.values(compositionMap).sort(
    (a, b) => (a.year as number) - (b.year as number)
  );

  const totalModernFilms = annualCounts.reduce((acc, curr) => acc + curr.movie_count, 0);
  const peakYear = annualCounts.slice().sort((a, b) => b.movie_count - a.movie_count)[0];
  const activeYearData = annualCounts.find((d) => d.year === scrubYear) || annualCounts[0];

  // Representative films for the scrubbed year (or close range if exact year has <2)
  const periodFilms = useMemo(() => {
    let matches = curatedFilms.filter((f) => f.year === scrubYear);
    if (matches.length < 2) {
      // expand window by +/- 1 year
      matches = curatedFilms.filter((f) => Math.abs(f.year - scrubYear) <= 1);
    }
    return matches.slice(0, 4);
  }, [curatedFilms, scrubYear]);

  return (
    <article className="chapter-block" id="chapter-01" aria-labelledby="heading-ch-01">
      <header className="chapter-header">
        <div className="chapter-meta">
          <span>CHAPTER 01</span>
          <span aria-hidden="true">/</span>
          <span>THE INDUSTRIAL SCALE</span>
          <span style={{ color: "var(--accent-gold)" }}>[ REEL 01 ]</span>
        </div>
        <h3 className="chapter-title" id="heading-ch-01">
          THE MOVIE MACHINE
        </h3>
        <p className="chapter-question">
          How many movies were being made, and what did that industrial expansion look like on screen?
        </p>
      </header>

      <div className="chapter-narrative">
        <p>
          Between 2000 and 2025, the volume of films documented annually across global cinema
          expanded dramatically. The transition from physical 35mm film stock to high-resolution
          digital camera sensors (such as the RED One in 2007 and ARRI Alexa in 2010), non-linear
          editing, and international distribution pipelines unleashed an unprecedented acceleration in
          throughput.
        </p>
        <p>
          Cinema is not a static artistic canon; it is an industrial machine whose annual output surged
          from approximately 1,000 documented feature releases at the turn of the millennium to several
          thousand titles before suffering a stark, visible rupture during the 2020–2021 COVID-19 pandemic shutdown.
        </p>
      </div>

      <div className="editorial-note">
        <strong>Historical Finding &amp; Production Shock</strong>
        In our verified modern analysis window (2000–2025), TMDB captures{" "}
        <span style={{ color: "var(--text-main)", fontWeight: 700 }}>
          {totalModernFilms.toLocaleString()} feature films
        </span>
        . Production peaked in {peakYear?.year || 2019} with {peakYear?.movie_count.toLocaleString()} registered titles,
        before dropping sharply in 2020 to {annualCounts.find((d) => d.year === 2020)?.movie_count.toLocaleString()} films
        (a 34% contracted supply shock).
      </div>

      {/* Primary Chart Box */}
      <div className="chart-box" id="chart-movie-machine">
        <div className="chart-header">
          <div className="chart-title-area">
            <h4>Global Annual Feature Film Production (2000–2025)</h4>
            <p className="chart-subtitle">
              Verified release counts meeting feature-film parameters (≥30 min) in TMDB
            </p>
          </div>
          <span className="chart-units">UNIT: VERIFIED TITLES / YEAR</span>
        </div>

        <div className="chart-controls">
          <button
            type="button"
            className={`control-pill ${viewMode === "annual" ? "active" : ""}`}
            onClick={() => setViewMode("annual")}
            id="btn-machine-total"
          >
            Total Annual Output
          </button>
          <button
            type="button"
            className={`control-pill ${viewMode === "composition" ? "active" : ""}`}
            onClick={() => setViewMode("composition")}
            id="btn-machine-comp"
          >
            Top Genre Volume Stack
          </button>
        </div>

        <div style={{ width: "100%", height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "annual" ? (
              <AreaChart
                data={annualCounts}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                onMouseMove={(e) => {
                  if (e && e.activeLabel) {
                    setScrubYear(Number(e.activeLabel));
                  }
                }}
              >
                <defs>
                  <linearGradient id="movieCountGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8e3124" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#8e3124" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="year"
                  stroke="#5e594f"
                  tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
                  tickLine={{ stroke: "#d6cfc0" }}
                />
                <YAxis
                  stroke="#5e594f"
                  tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
                  tickLine={{ stroke: "#d6cfc0" }}
                  tickFormatter={(val) => `${val.toLocaleString()}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            background: "#191817",
                            color: "#f4f1ea",
                            padding: "10px 14px",
                            border: "1px solid #3d3935",
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                          }}
                        >
                          <div style={{ color: "#a07828", marginBottom: "4px" }}>YEAR {label}</div>
                          <div style={{ fontWeight: 700, fontSize: "14px" }}>
                            {Number(payload[0].value).toLocaleString()} Titles
                          </div>
                          {label === 2020 && (
                            <div style={{ color: "#ff8c7a", fontSize: "10px", marginTop: "4px" }}>
                              * COVID-19 production shutdown
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="movie_count"
                  stroke="#8e3124"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#movieCountGrad)"
                  name="Movie Count"
                />
              </AreaChart>
            ) : (
              <BarChart data={compositionData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <XAxis
                  dataKey="year"
                  stroke="#5e594f"
                  tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
                />
                <YAxis
                  stroke="#5e594f"
                  tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#191817",
                    border: "1px solid #3d3935",
                    color: "#f4f1ea",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    paddingTop: "12px",
                  }}
                />
                <Bar dataKey="Drama" stackId="a" fill="#191817" />
                <Bar dataKey="Comedy" stackId="a" fill="#a07828" />
                <Bar dataKey="Thriller" stackId="a" fill="#8e3124" />
                <Bar dataKey="Action" stackId="a" fill="#5e594f" />
                <Bar dataKey="Horror" stackId="a" fill="#3b5a75" />
                <Bar dataKey="Documentary" stackId="a" fill="#7d7465" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Cinematic Timeline Scrubber & Film Contact Sheet */}
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            backgroundColor: "var(--bg-paper)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sliders size={14} style={{ color: "var(--accent-cinema)" }} />
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
                SCRUB ARCHIVE YEAR: {scrubYear}
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--accent-cinema)",
                fontWeight: 700,
              }}
            >
              {activeYearData ? activeYearData.movie_count.toLocaleString() : 0} TITLES PRODUCED
            </span>
          </div>

          <input
            type="range"
            min={2000}
            max={2025}
            value={scrubYear}
            onChange={(e) => setScrubYear(Number(e.target.value))}
            className="scrubber-slider"
            id="scrubber-ch1-year"
            aria-label="Scrub production year"
          />

          {/* Visual Poster Anchors for the selected year */}
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Film size={12} />
              <span>REPRESENTATIVE PRODUCTIONS FROM {scrubYear} (ARCHIVE SAMPLE):</span>
            </div>

            {periodFilms.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                }}
              >
                {periodFilms.map((film) => (
                  <ArchivePoster
                    key={film.id}
                    title={film.title}
                    year={film.year}
                    posterPath={film.poster_path}
                    runtime={film.runtime}
                    genre={film.genres}
                    size="md"
                    caption={film.genres.slice(0, 2).join(" · ")}
                  />
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "12px", color: "var(--text-dim)", fontStyle: "italic", margin: 0 }}>
                Scrub years to inspect documented releases across the historical window.
              </p>
            )}
          </div>
        </div>

        <div className="chart-footer">
          <span>SOURCE: TMDB MOVIES DATASET V11 (FILTERED 2000–2025, RUNTIME 30–300 MIN)</span>
          <span>AGGREGATE: annual_movie_count.csv / cinema_archive_manifest.json</span>
        </div>
      </div>

      <div style={{ marginTop: "40px", borderLeft: "2px solid var(--border-strong)", paddingLeft: "20px" }}>
        <p style={{ fontStyle: "italic", fontFamily: "var(--font-serif)", fontSize: "19px", color: "var(--accent-cinema)" }}>
          &ldquo;If the machine changed so radically in its throughput, did the kinds of movies it produced change too?&rdquo;
        </p>
      </div>
    </article>
  );
}
