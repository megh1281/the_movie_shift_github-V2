"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FinancialYear, CuratedFilm } from "@/lib/dataLoader";
import ArchivePoster from "./ArchivePoster";
import { Ticket, Clock, Layers, AlertCircle, BarChart3, Film } from "lucide-react";

interface Chapter06Props {
  financialYears: FinancialYear[];
  curatedFilms?: CuratedFilm[];
}

export default function Chapter06SuccessMetrics({
  financialYears,
  curatedFilms = [],
}: Chapter06Props) {
  const [activeTab, setActiveTab] = useState<"dual" | "coverage">("dual");

  // Representative films for the dual paradigm
  const theatricalFilm =
    curatedFilms.find((f) => f.title === "Top Gun: Maverick") ||
    curatedFilms.find((f) => f.title === "Avatar") ||
    curatedFilms[0];

  const streamingFilm =
    curatedFilms.find((f) => f.title === "The Irishman") ||
    curatedFilms.find((f) => f.title === "Roma") ||
    curatedFilms[1];

  return (
    <article className="chapter-block" id="chapter-06" aria-labelledby="heading-ch-06">
      <header className="chapter-header">
        <div className="chapter-meta">
          <span>CHAPTER 06</span>
          <span aria-hidden="true">/</span>
          <span>THE CURRENCY OF ATTENTION</span>
          <span style={{ color: "var(--accent-gold)" }}>[ REEL 06 ]</span>
        </div>
        <h3 className="chapter-title" id="heading-ch-06">
          SUCCESS GOT A NEW MEASUREMENT
        </h3>
        <p className="chapter-question">
          When box office receipts stopped being the universal yardstick, how was a movie deemed a success?
        </p>
      </header>

      <div className="chapter-narrative">
        <p>
          Throughout twentieth-century Hollywood, cinematic success was mathematically simple:
          <strong> ticket admissions multiplied by ticket prices equals box office revenue</strong>.
          The Monday morning trades published opening weekend numbers as a transparent, public ledger
          of cultural triumph.
        </p>
        <p>
          In the subscription streaming era, that ledger dissolved. When a consumer pays $15/month for
          a library of ten thousand titles, individual films have no standalone price. Success mutated
          into proprietary algorithmic metrics: &ldquo;Hours Watched,&rdquo; &ldquo;First 28-Day Completions,&rdquo;
          and customer churn prevention.
        </p>
      </div>

      <div className="editorial-note">
        <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AlertCircle size={14} style={{ color: "var(--accent-cinema)" }} />
          DATA TRANSPARENCY NOTICE: PROPRIETARY STREAMING METRICS
        </strong>
        Unlike box office grosses—which are tracked by third-party exhibitors and public reporting—streaming
        viewership figures are self-reported by platform operators. Any streaming statistics cited below
        represent a <strong>Netflix Platform Example</strong> (the first major streamer to publish bi-annual
        engagement reports) and <strong>must not be assumed to represent the entire streaming industry</strong>.
      </div>

      <div className="chart-box" id="chart-success-dual">
        <div className="chart-header">
          <div className="chart-title-area">
            <h4>The Great Metric Divergence: Theatrical Ledger vs. Streaming Engagement</h4>
            <p className="chart-subtitle">
              Visualizing the transition from transactional admissions to subscription attention time
            </p>
          </div>
          <div className="chart-controls">
            <button
              type="button"
              className={`control-pill ${activeTab === "dual" ? "active" : ""}`}
              onClick={() => setActiveTab("dual")}
            >
              Paradigms in Cinema
            </button>
            <button
              type="button"
              className={`control-pill ${activeTab === "coverage" ? "active" : ""}`}
              onClick={() => setActiveTab("coverage")}
            >
              Public Financial Coverage Rate
            </button>
          </div>
        </div>

        {activeTab === "dual" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
              marginTop: "16px",
            }}
          >
            {/* Theatrical Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "2px solid var(--border-subtle)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Ticket size={18} style={{ color: "var(--accent-cinema)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "var(--accent-cinema)",
                  }}
                >
                  THEATRICAL PARADIGM (1905–PRESENT)
                </span>
              </div>

              {theatricalFilm && (
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "center" }}>
                  <ArchivePoster
                    title={theatricalFilm.title}
                    year={theatricalFilm.year}
                    posterPath={theatricalFilm.poster_path}
                    runtime={theatricalFilm.runtime}
                    size="sm"
                  />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
                      {theatricalFilm.title} ({theatricalFilm.year})
                    </div>
                    <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                      Worldwide Gross:{" "}
                      <strong style={{ color: "var(--text-main)" }}>
                        {theatricalFilm.revenue ? `$${(theatricalFilm.revenue / 1e6).toFixed(0)}M` : "N/A"}
                      </strong>
                    </div>
                    <div style={{ color: "var(--text-dim)", fontSize: "10px", marginTop: "4px" }}>
                      Production Budget: ${theatricalFilm.budget ? (theatricalFilm.budget / 1e6).toFixed(0) : "N/A"}M
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  lineHeight: 1.6,
                  color: "var(--text-main)",
                  marginTop: "auto",
                }}
              >
                <div style={{ borderBottom: "1px dashed var(--border-subtle)", padding: "8px 0" }}>
                  <span style={{ color: "var(--text-dim)", display: "block", fontSize: "10px" }}>PRIMARY METRIC</span>
                  <strong>Opening Weekend &amp; Cumulative Box Office ($USD)</strong>
                </div>
                <div style={{ borderBottom: "1px dashed var(--border-subtle)", padding: "8px 0" }}>
                  <span style={{ color: "var(--text-dim)", display: "block", fontSize: "10px" }}>TRANSACTION UNIT</span>
                  <strong>Individual Ticket Purchase ($11–$25 per seat)</strong>
                </div>
                <div style={{ borderBottom: "1px dashed var(--border-subtle)", padding: "8px 0" }}>
                  <span style={{ color: "var(--text-dim)", display: "block", fontSize: "10px" }}>EXCLUSIVITY WINDOW</span>
                  <strong>Traditional 90-Day Theatrical Exclusivity</strong>
                </div>
                <div style={{ padding: "8px 0" }}>
                  <span style={{ color: "var(--text-dim)", display: "block", fontSize: "10px" }}>DATA VERIFIABILITY</span>
                  <strong>Public Third-Party Tracking (Comscore / Rentrak)</strong>
                </div>
              </div>
            </div>

            {/* Streaming Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "2px solid var(--accent-gold)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Clock size={18} style={{ color: "var(--accent-gold)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "var(--accent-gold)",
                  }}
                >
                  STREAMING ENGAGEMENT (2015–PRESENT)
                </span>
              </div>

              {streamingFilm && (
                <div style={{ display: "flex", gap: "16px", marginBottom: "16px", alignItems: "center" }}>
                  <ArchivePoster
                    title={streamingFilm.title}
                    year={streamingFilm.year}
                    posterPath={streamingFilm.poster_path}
                    runtime={streamingFilm.runtime}
                    size="sm"
                  />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
                      {streamingFilm.title} ({streamingFilm.year})
                    </div>
                    <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                      Reported Engagement:{" "}
                      <strong style={{ color: "var(--text-main)" }}>215M+ Hours Viewed</strong>
                    </div>
                    <div style={{ color: "var(--accent-cinema)", fontSize: "10px", marginTop: "4px" }}>
                      *Netflix Platform Example (209 min epic)
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  lineHeight: 1.6,
                  color: "var(--text-main)",
                  marginTop: "auto",
                }}
              >
                <div style={{ borderBottom: "1px dashed var(--border-subtle)", padding: "8px 0" }}>
                  <span style={{ color: "var(--text-dim)", display: "block", fontSize: "10px" }}>PRIMARY METRIC</span>
                  <strong>Hours Viewed / Views (Total Hours ÷ Runtime)</strong>
                </div>
                <div style={{ borderBottom: "1px dashed var(--border-subtle)", padding: "8px 0" }}>
                  <span style={{ color: "var(--text-dim)", display: "block", fontSize: "10px" }}>TRANSACTION UNIT</span>
                  <strong>Zero Marginal Cost within Monthly Subscription ($15.99)</strong>
                </div>
                <div style={{ borderBottom: "1px dashed var(--border-subtle)", padding: "8px 0" }}>
                  <span style={{ color: "var(--text-dim)", display: "block", fontSize: "10px" }}>EXCLUSIVITY WINDOW</span>
                  <strong>Day-and-Date Global Home Release (or 0–14 days)</strong>
                </div>
                <div style={{ padding: "8px 0" }}>
                  <span style={{ color: "var(--text-dim)", display: "block", fontSize: "10px" }}>DATA VERIFIABILITY</span>
                  <strong>Proprietary Self-Reported Platform Disclosures</strong>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "16px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
              The opacity of modern film economics is directly reflected in catalog data: revenue and budget
              reporting has plummeted across the 2010–2025 era as direct-to-consumer platforms treat
              film expenditures as internal subscription balance sheet items.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table className="methodology-table" style={{ width: "100%", fontSize: "12px" }}>
                <thead>
                  <tr>
                    <th>YEAR</th>
                    <th>DOCUMENTED RELEASES</th>
                    <th>REVENUE KNOWN</th>
                    <th>REVENUE COVERAGE %</th>
                    <th>BUDGET KNOWN</th>
                    <th>BUDGET COVERAGE %</th>
                  </tr>
                </thead>
                <tbody>
                  {financialYears.slice(0, 12).map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{row.movies.toLocaleString()}</td>
                      <td>{row.revenue_known.toLocaleString()}</td>
                      <td>
                        <strong>{(row.revenue_coverage * 100).toFixed(1)}%</strong>
                      </td>
                      <td>{row.budget_known.toLocaleString()}</td>
                      <td>{(row.budget_coverage * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="chart-footer">
          <span>SOURCE: TMDB FINANCIAL RECORDS &amp; INDUSTRY REPORTING STANDARDS</span>
          <span>AGGREGATE: financial_year.csv &amp; cinema_archive_manifest.json</span>
        </div>
      </div>
    </article>
  );
}
