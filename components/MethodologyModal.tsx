"use client";

import React, { useState } from "react";
import {
  X,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Download,
  Upload,
} from "lucide-react";
import { DataQuality } from "@/lib/dataLoader";

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataQuality: DataQuality | null;
  loadedFiles: Record<string, boolean>;
}

export default function MethodologyModal({
  isOpen,
  onClose,
  dataQuality,
  loadedFiles,
}: MethodologyModalProps) {
  const [activeTab, setActiveTab] = useState<"provenance" | "cleaning" | "files" | "limitations">("provenance");

  if (!isOpen) return null;

  const fileRows = [
    { name: "annual_movie_count.csv", desc: "Annual movie releases (2000–2025)", key: "annual_movie_count" },
    { name: "genre_year.csv", desc: "Exploded genre counts and annual shares", key: "genre_year" },
    { name: "genre_summary.csv", desc: "Peak years and aggregate genre distribution ranges", key: "genre_summary" },
    { name: "runtime_year.csv", desc: "Median, 25th/75th percentiles, and IQR runtimes", key: "runtime_year" },
    { name: "genre_runtime_year.csv", desc: "Genre-specific annual runtime statistics", key: "genre_runtime_year" },
    { name: "financial_year.csv", desc: "Reported budget & revenue coverage and medians", key: "financial_year" },
    { name: "spearman_pairs.csv", desc: "Pairwise Spearman rank correlation coefficients", key: "spearman_pairs" },
    { name: "period_comparison.csv", desc: "Pre-pandemic vs COVID vs contemporary periods", key: "period_comparison" },
    { name: "data_quality.csv", desc: "Audited dataset ingestion metrics and counts", key: "data_quality" },
  ];

  return (
    <div
      className="modal-overlay"
      id="methodology-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-drawer">
        <div className="drawer-header">
          <div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent-cinema)",
                display: "block",
                marginBottom: "4px",
              }}
            >
              ACADEMIC RESEARCH PROTOCOL
            </span>
            <h3
              id="modal-title"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "20px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              METHODOLOGY, PROVENANCE & DATA
            </h3>
          </div>
          <button
            type="button"
            className="drawer-close"
            onClick={onClose}
            aria-label="Close modal"
            id="btn-close-methodology"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="chart-controls" style={{ marginBottom: "24px" }}>
          <button
            type="button"
            className={`control-pill ${activeTab === "provenance" ? "active" : ""}`}
            onClick={() => setActiveTab("provenance")}
          >
            Provenance
          </button>
          <button
            type="button"
            className={`control-pill ${activeTab === "cleaning" ? "active" : ""}`}
            onClick={() => setActiveTab("cleaning")}
          >
            Cleaning Rules
          </button>
          <button
            type="button"
            className={`control-pill ${activeTab === "files" ? "active" : ""}`}
            onClick={() => setActiveTab("files")}
          >
            Data Health ({Object.values(loadedFiles).filter(Boolean).length}/9)
          </button>
          <button
            type="button"
            className={`control-pill ${activeTab === "limitations" ? "active" : ""}`}
            onClick={() => setActiveTab("limitations")}
          >
            Epistemic Limits
          </button>
        </div>

        {/* Tab 1: Provenance */}
        {activeTab === "provenance" && (
          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "12px", textTransform: "uppercase", color: "var(--accent-cinema)" }}>
              Data Provenance & Source Material
            </h4>
            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--text-main)" }}>
              The empirical base of this study originates from the comprehensive{" "}
              <strong>TMDB Movies Dataset (v11, 2024 Release)</strong>, accessed through verified mirrors on
              Hugging Face (<em>ada-datadruids/full_tmdb_movies_dataset</em>) and Kaggle.
            </p>
            <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--text-muted)" }}>
              The raw archive contains over 80,000+ movie rows and 24 columns spanning a century of global cinema.
              To ensure reproducibility without bundling prohibitive 500MB+ binary payloads into browser clients,
              the Python ingestion engine (<code>scripts/stream_and_aggregate.py</code>) executes a deterministic,
              reproducible pipeline generating nine strictly normalized aggregate CSV tables.
            </p>

            {dataQuality && (
              <div
                style={{
                  background: "var(--bg-card)",
                  padding: "16px",
                  border: "1px solid var(--border-subtle)",
                  marginTop: "20px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                  DATA AUDIT SUMMARY (2000–2025 WINDOW):
                </div>
                <div>Raw Records Ingested: {dataQuality.raw_rows.toLocaleString()}</div>
                <div>Modern Window (2000–2025): {dataQuality.analysis_rows_2000_2025.toLocaleString()} films</div>
                <div>Films with Valid Genres: {dataQuality.rows_with_any_genre.toLocaleString()}</div>
                <div>Films Meeting 30–300m Runtime: {dataQuality.rows_with_valid_runtime_30_300.toLocaleString()}</div>
                <div>Films with Reported Box Office: {dataQuality.rows_with_positive_revenue.toLocaleString()} ({((dataQuality.rows_with_positive_revenue / dataQuality.analysis_rows_2000_2025) * 100).toFixed(1)}%)</div>
                <div>Films with Reported Budget: {dataQuality.rows_with_positive_budget.toLocaleString()} ({((dataQuality.rows_with_positive_budget / dataQuality.analysis_rows_2000_2025) * 100).toFixed(1)}%)</div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Cleaning Rules */}
        {activeTab === "cleaning" && (
          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "12px", textTransform: "uppercase", color: "var(--accent-cinema)" }}>
              Filtering & Cleaning Protocols
            </h4>
            <div style={{ fontSize: "13px", lineHeight: "1.65", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ borderLeft: "3px solid var(--accent-cinema)", paddingLeft: "14px" }}>
                <strong>1. Feature-Film Runtime Restriction (30 – 300 minutes):</strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)" }}>
                  Entries with runtimes &lt; 30 minutes are categorized as shorts, trailers, or experimental
                  snippets. Entries &gt; 300 minutes represent broadcast miniseries erroneously tagged as single
                  movies. Both are filtered out to protect central tendency metrics.
                </p>
              </div>

              <div style={{ borderLeft: "3px solid var(--accent-cinema)", paddingLeft: "14px" }}>
                <strong>2. Treatment of Financial Zeroes (Revenue & Budget &le; 0):</strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)" }}>
                  In TMDB, <code>revenue: 0</code> or <code>budget: 0</code> does NOT indicate that a movie was made
                  or grossed zero dollars; it indicates missing reporting. We treat non-positive financial values
                  strictly as NULL / missing rather than distorting median calculations with zeroes.
                </p>
              </div>

              <div style={{ borderLeft: "3px solid var(--accent-cinema)", paddingLeft: "14px" }}>
                <strong>3. Exploded Multi-label Genre Parsing:</strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)" }}>
                  A title with multiple genres (e.g. &ldquo;Drama, Comedy, Romance&rdquo;) is exploded such that each
                  genre receives an assignment. Annual genre shares measure each genre&apos;s frequency relative
                  to total genre tags awarded in that release year.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Data Health */}
        {activeTab === "files" && (
          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "12px", textTransform: "uppercase", color: "var(--accent-cinema)" }}>
              Verified Ingestion Health
            </h4>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Status of the nine compact aggregate CSV files loaded via <code>/public/data/</code>:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {fileRows.map((file) => {
                const isLoaded = loadedFiles[file.key];
                return (
                  <div key={file.name} className="file-status-row">
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{file.name}</div>
                      <div style={{ fontSize: "10px", color: "var(--text-dim)" }}>{file.desc}</div>
                    </div>
                    <span className={`status-badge ${isLoaded ? "ok" : "missing"}`}>
                      {isLoaded ? "VERIFIED" : "PENDING"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Limitations */}
        {activeTab === "limitations" && (
          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "12px", textTransform: "uppercase", color: "var(--accent-cinema)" }}>
              Epistemic Boundaries & Research Constraints
            </h4>
            <ul style={{ fontSize: "13px", lineHeight: "1.7", color: "var(--text-muted)", paddingLeft: "18px" }}>
              <li>
                <strong>TMDB is not a census:</strong> TMDB is an open, crowd-indexed database with strong English
                and Western coverage. Non-Western, festival, and micro-budget productions are underrepresented.
              </li>
              <li>
                <strong>Absence of Internal Streaming Logs:</strong> Private platforms (Netflix, Apple, Disney, Amazon)
                guard minute-by-minute viewing completion metrics. Any claims linking TMDB changes to streaming
                are contextual correlations, not direct causal links.
              </li>
              <li>
                <strong>COVID-19 as an Outlier:</strong> The 2020–2021 period represents a severe supply and
                exhibition shock, requiring separate evaluation from broader cultural secular trends.
              </li>
            </ul>
          </div>
        )}

        <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid var(--border-subtle)" }}>
          <button
            type="button"
            className="topbar-btn"
            style={{ width: "100%", justifyContent: "center", padding: "10px" }}
            onClick={onClose}
          >
            RETURN TO NARRATIVE
          </button>
        </div>
      </div>
    </div>
  );
}
