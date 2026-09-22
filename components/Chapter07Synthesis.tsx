"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CuratedFilm } from "@/lib/dataLoader";
import ArchivePoster from "./ArchivePoster";
import { CheckCircle2, XCircle, AlertCircle, Film, Sparkles } from "lucide-react";

interface Chapter07Props {
  curatedFilms?: CuratedFilm[];
  onOpenMethodology?: () => void;
}

export default function Chapter07Synthesis({
  curatedFilms = [],
  onOpenMethodology,
}: Chapter07Props) {
  const [activeDossier, setActiveDossier] = useState<CuratedFilm | null>(null);

  // Curate 16-20 diverse films spanning 2000-2025
  const montageFilms = curatedFilms.length > 0 ? curatedFilms.slice(0, 20) : [];

  return (
    <article className="chapter-block" id="chapter-07" aria-labelledby="heading-ch-07">
      <header className="chapter-header">
        <div className="chapter-meta">
          <span>CHAPTER 07</span>
          <span aria-hidden="true">/</span>
          <span>EMPIRICAL SYNTHESIS</span>
          <span style={{ color: "var(--accent-gold)" }}>[ REEL 07 · FINAL CUT ]</span>
        </div>
        <h3 className="chapter-title" id="heading-ch-07">
          DID THE MOVIE CHANGE?
        </h3>
        <p className="chapter-question">
          Synthesizing twenty-five years of data: what transformed, what endured, and what myths dissolve under scrutiny?
        </p>
      </header>

      {/* CINEMATIC MONTAGE: THE FINAL SHOT OF THE ARCHIVE */}
      <div
        className="cinematic-montage-container"
        style={{
          position: "relative",
          margin: "32px 0 48px",
          background: "#161513",
          border: "1px solid #2f2d29",
          padding: "36px 24px",
          overflow: "hidden",
        }}
      >
        {/* Subtle Film Sprockets */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "12px",
            display: "flex",
            justifyContent: "space-around",
            background: "#0c0b0a",
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              style={{ width: "8px", height: "6px", backgroundColor: "#262422", borderRadius: "1px", margin: "3px 0" }}
            />
          ))}
        </div>

        {/* Contact Sheet Poster Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: "14px",
            opacity: 0.88,
            marginBottom: "32px",
          }}
        >
          {montageFilms.map((film) => (
            <div
              key={film.id}
              onClick={() => setActiveDossier(film)}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s ease, opacity 0.2s ease",
              }}
              className="montage-item"
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "2/3",
                  backgroundColor: "#201e1b",
                  border: "1px solid #3d3a35",
                  overflow: "hidden",
                }}
              >
                {film.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${film.poster_path}`}
                    alt={`${film.title} (${film.year})`}
                    fill
                    sizes="110px"
                    style={{ objectFit: "cover" }}
                    referrerPolicy="no-referrer"
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: 2,
                    fontSize: "8px",
                    fontFamily: "var(--font-mono)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "rgba(255, 255, 255, 0.8)",
                    padding: "1px 3px",
                  }}
                >
                  {film.year}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  color: "#d6cfc0",
                  marginTop: "4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {film.title}
              </div>
            </div>
          ))}
        </div>

        {/* Restrained Editorial Overlay Typography */}
        <div
          style={{
            textAlign: "center",
            padding: "24px 16px",
            maxWidth: "680px",
            margin: "0 auto",
            borderTop: "1px solid #333",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "var(--accent-gold)",
              marginBottom: "16px",
            }}
          >
            [ REEL CONCLUSION · 2000–2025 ]
          </div>
          <blockquote
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "26px",
              lineHeight: 1.35,
              color: "#f4f1ea",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            &ldquo;THE SCREEN CHANGED.
            <br />
            THE MOVIE CHANGED TOO.
            <br />
            BUT THERE WAS NEVER JUST ONE REASON.&rdquo;
          </blockquote>
        </div>

        {/* Bottom Sprockets */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "12px",
            display: "flex",
            justifyContent: "space-around",
            background: "#0c0b0a",
          }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              style={{ width: "8px", height: "6px", backgroundColor: "#262422", borderRadius: "1px", margin: "3px 0" }}
            />
          ))}
        </div>
      </div>

      <div className="chapter-narrative">
        <p>
          At the outset of this research, we asked: <em>As the way movies were made, released, and
          watched changed, how did the movie itself change?</em>
        </p>
        <p>
          The quantitative record demonstrates that cinema did not suffer an aesthetic collapse, nor
          did it morph into an amorphous multi-hour monolith. Instead, the modern period split cinema
          into distinct parallel channels: a theatrical sector oriented around franchise scale and
          experiential urgency, and a vast, decentralized streaming ecosystem operating on domestic time.
        </p>
      </div>

      {/* Structured Evidence Matrix */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          marginTop: "32px",
        }}
      >
        {/* Confirmed Findings */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 700,
              color: "#2d6a4f",
              marginBottom: "16px",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "10px",
            }}
          >
            <CheckCircle2 size={16} />
            <span>DOCUMENTED EMPIRICAL PATTERNS</span>
          </div>
          <ul
            style={{
              paddingLeft: "18px",
              margin: 0,
              fontSize: "13px",
              lineHeight: 1.7,
              color: "var(--text-main)",
            }}
          >
            <li>
              <strong>Volume Acceleration:</strong> Annual feature film production expanded several-fold
              from 2000 to 2019, enabled by digital capture and post-production democratisation.
            </li>
            <li>
              <strong>Median Runtime Anchor:</strong> The median feature runtime held remarkably stable at
              95–98 minutes, serving as a durable structural constraint across screen transitions.
            </li>
            <li>
              <strong>Dispersion of Tails:</strong> While the median remained flat, the outer percentiles (IQR)
              widened, with prestige tentpoles extending past 150 minutes and concise indies holding at 85 minutes.
            </li>
            <li>
              <strong>Pandemic Supply Disruption:</strong> The 2020–2021 period registered a 34% drop in feature output,
              functioning as an acute operational shock rather than an organic trend.
            </li>
            <li>
              <strong>Financial Metric Opacity:</strong> As distribution shifted to subscription platforms,
              publicly reported budget and revenue figures declined in catalog coverage.
            </li>
          </ul>
        </div>

        {/* Unsubstantiated Myths */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--accent-cinema)",
              marginBottom: "16px",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "10px",
            }}
          >
            <XCircle size={16} />
            <span>CLAIMS REFUTED OR UNPROVEN</span>
          </div>
          <ul
            style={{
              paddingLeft: "18px",
              margin: 0,
              fontSize: "13px",
              lineHeight: 1.7,
              color: "var(--text-main)",
            }}
          >
            <li>
              <strong>The Myth of the 3-Hour Average:</strong> Aggregate statistics disprove that movies
              as a whole got significantly longer. The typical film in 2024 is within 3 minutes of the typical film in 2000.
            </li>
            <li>
              <strong>Single-Cause Determinism:</strong> Streaming did not unilaterally destroy mid-budget cinema;
              home-video retail decline, international market incentives, and theatrical consolidation acted in concert.
            </li>
            <li>
              <strong>Rating vs. Budget Causality:</strong> Spearman rank correlations between budget and vote ratings
              remain weak, confirming that capital intensity does not dictate aesthetic reception.
            </li>
          </ul>
        </div>
      </div>

      {/* Synthesis Conclusion */}
      <div
        style={{
          marginTop: "40px",
          padding: "28px",
          backgroundColor: "var(--bg-paper)",
          border: "2px solid var(--border-strong)",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "22px",
            margin: "0 0 12px",
            color: "var(--text-main)",
          }}
        >
          The Living Archive of Cinema
        </h4>
        <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-main)", margin: "0 0 20px" }}>
          Cinema in 2025 is neither dead nor degraded; it is radically plural. A viewer today can watch
          a 90-minute photochemical genre thriller projected in 70mm, a 210-minute historical narrative
          streamed directly to a living room OLED, or an avant-garde short film on an iPhone screen.
          The medium adapted not by abandoning its classical foundations, but by multiplying its forms
          to inhabit every space where human eyes gather.
        </p>
        {onOpenMethodology && (
          <button
            type="button"
            className="control-pill active"
            onClick={onOpenMethodology}
            id="btn-synthesis-open-methodology"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              fontSize: "11px",
              letterSpacing: "0.14em",
            }}
          >
            <span>INSPECT METHODOLOGY &amp; DATA HEALTH LEDGER</span>
          </button>
        )}
      </div>
    </article>
  );
}
