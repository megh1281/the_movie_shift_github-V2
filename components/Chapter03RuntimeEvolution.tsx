"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { RuntimeYear, GenreRuntimeYear, CuratedFilm } from "@/lib/dataLoader";
import ArchivePoster from "./ArchivePoster";
import { Clock, Sliders, ShieldCheck, Film } from "lucide-react";

interface Chapter03Props {
  runtimeYears: RuntimeYear[];
  genreRuntimeYears: GenreRuntimeYear[];
  curatedFilms?: CuratedFilm[];
}

export default function Chapter03RuntimeEvolution({
  runtimeYears,
  genreRuntimeYears,
  curatedFilms = [],
}: Chapter03Props) {
  const [selectedYear, setSelectedYear] = useState<number>(2019);

  // Runtime band data: [q25, q75] band with median line
  const bandData = useMemo(() => {
    return runtimeYears.map((d) => ({
      year: d.year,
      movie_count: d.movie_count,
      median: d.median,
      q25: d.q25,
      q75: d.q75,
      ribbonBase: d.q25,
      ribbonHeight: Number((d.q75 - d.q25).toFixed(1)),
      mean: d.mean,
      iqr: d.iqr,
    }));
  }, [runtimeYears]);

  const currentYearData = useMemo(() => {
    return runtimeYears.find((d) => d.year === selectedYear) || runtimeYears[0];
  }, [runtimeYears, selectedYear]);

  // Find films across runtime tiers for the selected year (or close nearby years)
  const runtimeTiers = useMemo(() => {
    // Collect films from selectedYear +/- 1
    const pool = curatedFilms.filter((f) => Math.abs(f.year - selectedYear) <= 1 && f.runtime);
    
    // Sort by runtime
    pool.sort((a, b) => (a.runtime || 0) - (b.runtime || 0));

    const lean = pool.find((f) => (f.runtime || 0) <= 100) || pool[0];
    const standard = pool.find((f) => (f.runtime || 0) >= 105 && (f.runtime || 0) <= 135) || pool[Math.floor(pool.length / 2)];
    const epic = pool.slice().reverse().find((f) => (f.runtime || 0) >= 140) || pool[pool.length - 1];

    return { lean, standard, epic };
  }, [curatedFilms, selectedYear]);

  return (
    <article className="chapter-block" id="chapter-03" aria-labelledby="heading-ch-03">
      <header className="chapter-header">
        <div className="chapter-meta">
          <span>CHAPTER 03</span>
          <span aria-hidden="true">/</span>
          <span>THE TEMPORAL CONTAINER</span>
          <span style={{ color: "var(--accent-gold)" }}>[ REEL 03 ]</span>
        </div>
        <h3 className="chapter-title" id="heading-ch-03">
          HOW LONG IS A MOVIE?
        </h3>
        <p className="chapter-question">
          Did the typical movie get longer, shorter, or more variable as screens evolved?
        </p>
      </header>

      <div className="chapter-narrative">
        <p>
          A pervasive cultural narrative claims that modern cinema has become dramatically longer,
          bloated by franchise IP and auteur indulgences. Yet when examining the median of all
          verified global feature films across twenty-five years, a surprising empirical fact emerges:
          <strong> the central tendency of feature cinema has remained remarkably stable between 95 and 98 minutes</strong>.
        </p>
        <p>
          What truly evolved was not the median film, but <em>the dispersion of lengths</em> (the
          interquartile range and extreme percentiles). The commercial standard of ~90 minutes persisted
          as an efficient theatrical exhibition compromise, while marquee spectacles pushed past 150 minutes,
          and streaming opened non-standard containers.
        </p>
      </div>

      <div className="editorial-note">
        <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={14} style={{ color: "#2d6a4f" }} />
          DATA INTEGRITY &amp; RUNTIME FILTER PROTOCOL
        </strong>
        In TMDB, uncurated user submissions contain trailer clips (1–3 min) and accidental video loops
        (up to 1,000+ min). For this defensible feature-film analysis, runtimes are strictly restricted
        to <strong>30 to 300 minutes</strong>. Values outside this boundary are documented as non-feature
        artefacts and omitted from statistical calculations.
      </div>

      {/* Year Scrubber Console */}
      <div className="scrubber-container" id="scrubber-runtime">
        <div className="scrubber-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sliders size={16} style={{ color: "var(--accent-cinema)" }} />
            <span className="scrubber-title">SCRUB HISTORICAL YEAR:</span>
          </div>
          <span className="scrubber-year">{selectedYear}</span>
        </div>

        <input
          type="range"
          min={2000}
          max={2025}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="scrubber-slider"
          aria-label="Select year to inspect runtime percentiles"
          id="range-runtime-year"
        />

        {currentYearData && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "16px",
              marginTop: "8px",
              paddingTop: "12px",
              borderTop: "1px dashed var(--border-subtle)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
            }}
          >
            <div>
              <span style={{ color: "var(--text-dim)", fontSize: "10px", display: "block" }}>
                MEDIAN RUNTIME
              </span>
              <strong style={{ fontSize: "18px", color: "var(--accent-cinema)" }}>
                {currentYearData.median} MIN
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", fontSize: "10px", display: "block" }}>
                25TH PERCENTILE (Q1)
              </span>
              <strong>{currentYearData.q25} MIN</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", fontSize: "10px", display: "block" }}>
                75TH PERCENTILE (Q3)
              </span>
              <strong>{currentYearData.q75} MIN</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", fontSize: "10px", display: "block" }}>
                MIDDLE 50% SPREAD (IQR)
              </span>
              <strong>{currentYearData.iqr} MIN</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-dim)", fontSize: "10px", display: "block" }}>
                FEATURE SAMPLES (N)
              </span>
              <strong>{currentYearData.movie_count.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="chart-box" id="chart-runtime-ribbon">
        <div className="chart-header">
          <div className="chart-title-area">
            <h4>Runtime Quantile Ribbon &amp; Median Trend (2000–2025)</h4>
            <p className="chart-subtitle">
              Shaded band captures the central 50% of cinema (25th to 75th percentile); red line shows median
            </p>
          </div>
          <span className="chart-units">UNIT: MINUTES</span>
        </div>

        <div style={{ width: "100%", height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={bandData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <XAxis
                dataKey="year"
                stroke="#5e594f"
                tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
              />
              <YAxis
                domain={[70, 130]}
                stroke="#5e594f"
                tick={{ fill: "#5e594f", fontSize: 11, fontFamily: "var(--font-mono)" }}
                tickFormatter={(val) => `${val}m`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div
                        style={{
                          background: "#191817",
                          color: "#f4f1ea",
                          padding: "12px 16px",
                          border: "1px solid #3d3935",
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                        }}
                      >
                        <div style={{ color: "#a07828", fontWeight: 700, marginBottom: "6px" }}>
                          YEAR {label}
                        </div>
                        <div>Median: <strong>{row.median} min</strong></div>
                        <div style={{ color: "#bbb" }}>25th Percentile: {row.q25} min</div>
                        <div style={{ color: "#bbb" }}>75th Percentile: {row.q75} min</div>
                        <div style={{ color: "#ff8c7a", fontSize: "11px", marginTop: "4px" }}>
                          IQR Spread: {row.iqr} min (N={row.movie_count.toLocaleString()})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="ribbonBase"
                stackId="ribbon"
                stroke="none"
                fill="transparent"
              />
              <Area
                type="monotone"
                dataKey="ribbonHeight"
                stackId="ribbon"
                stroke="#d6cfc0"
                fill="#8e3124"
                fillOpacity={0.18}
                name="25th-75th Percentile Band"
              />
              <Line
                type="monotone"
                dataKey="median"
                stroke="#8e3124"
                strokeWidth={2.8}
                dot={false}
                name="Median Runtime"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* VISUAL ARCHIVE: THE THREE RUNTIME TIERS OF THAT ERA */}
        <div
          style={{
            marginTop: "28px",
            padding: "24px",
            backgroundColor: "var(--bg-paper)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ marginBottom: "18px" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--accent-cinema)",
                fontWeight: 700,
                display: "block",
              }}
            >
              THE CHANGING SHAPE OF THE MOVIE · RUNTIME ANCHORS AROUND {selectedYear}
            </span>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
              Witnessing how narrative containers split into compact, standard, and epic durations in actual films.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            {/* Tier 1: Lean */}
            {runtimeTiers.lean && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                  <span style={{ color: "var(--text-dim)" }}>COMPACT / LEAN</span>
                  <span style={{ color: "var(--accent-cinema)", fontWeight: 700 }}>
                    {runtimeTiers.lean.runtime} MIN
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                  <ArchivePoster
                    title={runtimeTiers.lean.title}
                    year={runtimeTiers.lean.year}
                    posterPath={runtimeTiers.lean.poster_path}
                    runtime={runtimeTiers.lean.runtime}
                    genre={runtimeTiers.lean.genres}
                    size="md"
                    highlight={false}
                  />
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "auto", paddingTop: "8px", borderTop: "1px dashed var(--border-subtle)" }}>
                  Efficient genre containment (Horror / Indie / Comedy).
                </div>
              </div>
            )}

            {/* Tier 2: Standard */}
            {runtimeTiers.standard && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                  <span style={{ color: "var(--text-dim)" }}>STANDARD / THEATRICAL</span>
                  <span style={{ color: "var(--accent-cinema)", fontWeight: 700 }}>
                    {runtimeTiers.standard.runtime} MIN
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                  <ArchivePoster
                    title={runtimeTiers.standard.title}
                    year={runtimeTiers.standard.year}
                    posterPath={runtimeTiers.standard.poster_path}
                    runtime={runtimeTiers.standard.runtime}
                    genre={runtimeTiers.standard.genres}
                    size="md"
                    highlight={true}
                  />
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "auto", paddingTop: "8px", borderTop: "1px dashed var(--border-subtle)" }}>
                  The 100–120 minute classical theatrical sweet spot.
                </div>
              </div>
            )}

            {/* Tier 3: Extended / Epic */}
            {runtimeTiers.epic && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontFamily: "var(--font-mono)", fontSize: "10px" }}>
                  <span style={{ color: "var(--text-dim)" }}>EXPANDED / EPIC CANVAS</span>
                  <span style={{ color: "var(--accent-cinema)", fontWeight: 700 }}>
                    {runtimeTiers.epic.runtime} MIN
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                  <ArchivePoster
                    title={runtimeTiers.epic.title}
                    year={runtimeTiers.epic.year}
                    posterPath={runtimeTiers.epic.poster_path}
                    runtime={runtimeTiers.epic.runtime}
                    genre={runtimeTiers.epic.genres}
                    size="md"
                    highlight={false}
                  />
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "auto", paddingTop: "8px", borderTop: "1px dashed var(--border-subtle)" }}>
                  Prestige drama or event spectacle pushing past 2.5 hours.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="chart-footer">
          <span>SOURCE: TMDB RUNTIME RECORDS (STRICT FEATURE FILTER: 30–300 MIN)</span>
          <span>AGGREGATE: runtime_year.csv &amp; cinema_archive_manifest.json</span>
        </div>
      </div>
    </article>
  );
}
