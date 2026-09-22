"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PeriodComparison, CuratedFilm } from "@/lib/dataLoader";
import ArchivePoster from "./ArchivePoster";
import { Tv, Monitor, Smartphone, Film, AlertCircle, Maximize2 } from "lucide-react";

interface Chapter05Props {
  periodComparisons: PeriodComparison[];
  curatedFilms?: CuratedFilm[];
}

interface ScreenFormat {
  id: string;
  name: string;
  era: string;
  aspectRatio: string;
  deviceTitle: string;
  resolution: string;
  viewingCondition: string;
  audioStandard: string;
  filmTitle: string;
  filmYear: number;
  filmQuote: string;
  description: string;
}

const SCREEN_FORMATS: ScreenFormat[] = [
  {
    id: "theatre",
    name: "Theatrical Projection",
    era: "2000–2005",
    aspectRatio: "2.39:1 Anamorphic Scope",
    deviceTitle: "35mm Carbon-Arc / Xenon Auditorium",
    resolution: "Photochemical Grain (equiv. ~4K)",
    viewingCondition: "Communal, dark hall, 40-foot illuminated canvas",
    audioStandard: "Dolby Digital 5.1 / DTS Photochemical Soundtracks",
    filmTitle: "Gladiator",
    filmYear: 2000,
    filmQuote: "Designed for collective silence, grand scale, and mandatory duration.",
    description:
      "Theatrical release was the singular gateway. The physical geography of the auditorium demanded uninterrupted immersion.",
  },
  {
    id: "dvd",
    name: "The Living Room Disc",
    era: "2006–2010",
    aspectRatio: "16:9 Anamorphic Widescreen",
    deviceTitle: "Cathode Ray / Early Flat-Panel TV & DVD",
    resolution: "480p / 576i Standard Definition MPEG-2",
    viewingCondition: "Domestic sofa, ambient light, pause button accessible",
    audioStandard: "Stereo Downmix or Consumer Optical 5.1",
    filmTitle: "The Dark Knight",
    filmYear: 2008,
    filmQuote: "The DVD boom funded mid-budget adult cinema through massive physical disc sell-through.",
    description:
      "Physical media sales exploded. Studios earned more from retail DVD sales than box office, encouraging rich home video editions and commentary tracks.",
  },
  {
    id: "digital",
    name: "The Laptop Canvas",
    era: "2011–2015",
    aspectRatio: "16:10 Retina Display",
    deviceTitle: "Personal Computer / iTunes VOD",
    resolution: "1080p H.264 Web Streaming",
    viewingCondition: "Intimate desktop distance, headphone monitoring, multitask windows",
    audioStandard: "Headphone Stereo / Virtual Spatial Audio",
    filmTitle: "Inception",
    filmYear: 2010,
    filmQuote: "Cinema became personal, portable, and susceptible to windowed distraction.",
    description:
      "Broadband unlocked digital downloads. The shared cinema experience began splintering into individualized viewing on laptops in bedrooms.",
  },
  {
    id: "streaming",
    name: "The Subscription Feed",
    era: "2016–2019",
    aspectRatio: "16:9 / 2.00:1 Univisium",
    deviceTitle: "Connected Smart TV & Living Room App",
    resolution: "4K HDR Dolby Vision HEVC",
    viewingCondition: "Algorithmic feed, zero marginal cost per title, endless choice",
    audioStandard: "Dolby Atmos Bitstream",
    filmTitle: "Roma",
    filmYear: 2018,
    filmQuote: "Prestige auteur cinema funded by tech balance sheets seeking subscriber retention.",
    description:
      "Subscription video-on-demand transformed films from transactional tickets into churn-reduction assets on infinite digital carousels.",
  },
  {
    id: "mobile",
    name: "The Pocket Device & Pandemic Rupture",
    era: "2020–2025",
    aspectRatio: "19.5:9 Vertical / Horizontal OLED",
    deviceTitle: "Smartphone / Tablet / Dual Theatrical-Day-and-Date",
    resolution: "Mobile HDR10+ / Variable Bitrate",
    viewingCondition: "Transit, intermittent attention, fragmented session lengths",
    audioStandard: "Spatial Earbuds / Phone Micro-speakers",
    filmTitle: "Everything Everywhere All at Once",
    filmYear: 2022,
    filmQuote: "A maximalist grammar shaped by sensory overload, multi-screen culture, and post-lockdown theatrical defiance.",
    description:
      "The 2020 theater closures accelerated simultaneous streaming premieres. Post-pandemic audiences returned primarily for high-spectacle events.",
  },
];

export default function Chapter05ScreenMoved({
  periodComparisons,
  curatedFilms = [],
}: Chapter05Props) {
  const [activeScreen, setActiveScreen] = useState<ScreenFormat>(SCREEN_FORMATS[0]);

  // Find film matching the current format
  const activeFilm =
    curatedFilms.find((f) => f.title === activeScreen.filmTitle) ||
    curatedFilms.find((f) => f.year === activeScreen.filmYear) ||
    curatedFilms[0];

  return (
    <article className="chapter-block" id="chapter-05" aria-labelledby="heading-ch-05">
      <header className="chapter-header">
        <div className="chapter-meta">
          <span>CHAPTER 05</span>
          <span aria-hidden="true">/</span>
          <span>THE PHYSICAL APPARATUS</span>
          <span style={{ color: "var(--accent-gold)" }}>[ REEL 05 ]</span>
        </div>
        <h3 className="chapter-title" id="heading-ch-05">
          THE SCREEN MOVED
        </h3>
        <p className="chapter-question">
          As the cinema screen shrank, multiplied, and migrated into living rooms and pockets, what happened to the film?
        </p>
      </header>

      <div className="chapter-narrative">
        <p>
          For over a century, a film was inextricably linked to an architectural space: a dark hall,
          a shared audience, an illuminated cloth screen. Between 2000 and 2025, that physical apparatus
          underwent a tectonic migration. The movie moved from the communal cathedral of the movie theater
          to the living room cathode tube, then to the glowing optical disc, the private laptop, and finally
          the pocket smartphone.
        </p>
        <p>
          The movie did not merely evolve in its writing or editing—<strong>the physical screen around it changed shape, scale, and social intimacy</strong>.
        </p>
      </div>

      <div className="editorial-note">
        <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AlertCircle size={14} style={{ color: "var(--accent-cinema)" }} />
          PANDEMIC PROTOCOL: 2020–2021 AS A DISTINCT RUPTURE
        </strong>
        The period between March 2020 and late 2021 represents an unprecedented exogenous shock.
        Thousands of movie theaters closed worldwide, supply chains broke, and studio theatrical windows
        temporarily collapsed from 90 days to 0 days. In our data architecture, 2020–2021 is classified
        as an acute disruption era rather than an organic continuation of previous linear trends.
      </div>

      {/* INTERACTIVE APPARATUS EXPLORER */}
      <div
        className="chart-box"
        id="apparatus-simulator"
        style={{ padding: "28px" }}
      >
        <div className="chart-header" style={{ marginBottom: "20px" }}>
          <div className="chart-title-area">
            <h4>The Migration of the Physical Canvas (2000–2025)</h4>
            <p className="chart-subtitle">
              Select an era to examine how the screen apparatus altered viewing geometry, sound, and cinematic form
            </p>
          </div>
          <span className="chart-units">5 HISTORICAL APPARATUSES</span>
        </div>

        {/* Apparatus Selector Tabs */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "12px",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "24px",
          }}
        >
          {SCREEN_FORMATS.map((screen) => {
            const isSelected = activeScreen.id === screen.id;
            return (
              <button
                key={screen.id}
                type="button"
                className={`control-pill ${isSelected ? "active" : ""}`}
                onClick={() => setActiveScreen(screen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  fontSize: "11px",
                  whiteSpace: "nowrap",
                }}
              >
                {screen.id === "theatre" && <Film size={14} />}
                {screen.id === "dvd" && <Tv size={14} />}
                {screen.id === "digital" && <Monitor size={14} />}
                {screen.id === "streaming" && <Tv size={14} />}
                {screen.id === "mobile" && <Smartphone size={14} />}
                <span>{screen.era}: {screen.name}</span>
              </button>
            );
          })}
        </div>

        {/* The Screen Canvas Stage */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px",
            alignItems: "center",
            background: "#161513",
            color: "#f4f1ea",
            padding: "28px",
            border: "1px solid #333",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Simulated Screen Geometry Preview */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "var(--accent-gold)",
                letterSpacing: "0.14em",
                marginBottom: "12px",
              }}
            >
              [ APPARATUS FRAME: {activeScreen.aspectRatio.toUpperCase()} ]
            </div>

            {/* Screen Bezel Container */}
            <div
              style={{
                width: "100%",
                maxWidth: "340px",
                height: "230px",
                background: "#0a0a09",
                border: "4px solid #2a2825",
                borderRadius: activeScreen.id === "mobile" ? "20px" : activeScreen.id === "dvd" ? "10px" : "2px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.6)",
                position: "relative",
              }}
            >
              {activeFilm && activeFilm.poster_path ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${activeFilm.backdrop_path || activeFilm.poster_path}`}
                    alt={`${activeFilm.title} displayed on ${activeScreen.name}`}
                    fill
                    style={{ objectFit: "cover", opacity: 0.85 }}
                    sizes="340px"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      background: "rgba(0, 0, 0, 0.75)",
                      padding: "4px 8px",
                      fontSize: "10px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {activeFilm.title} ({activeFilm.year})
                  </div>
                </div>
              ) : (
                <div style={{ color: "#777", fontSize: "11px", fontFamily: "var(--font-mono)" }}>
                  [ ARCHIVE VISUAL ]
                </div>
              )}
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "#888",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {activeScreen.deviceTitle}
            </div>
          </div>

          {/* Editorial Apparatus Analysis */}
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.6 }}>
            <div style={{ color: "var(--accent-gold)", fontSize: "11px", marginBottom: "4px" }}>
              {activeScreen.era} · {activeScreen.name.toUpperCase()}
            </div>
            <h4
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "24px",
                margin: "0 0 12px",
                color: "#ffffff",
                lineHeight: 1.2,
              }}
            >
              {activeScreen.deviceTitle}
            </h4>

            <p style={{ color: "#d6cfc0", margin: "0 0 16px", fontFamily: "sans-serif", fontSize: "14px" }}>
              {activeScreen.description}
            </p>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                padding: "14px",
                borderLeft: "2px solid var(--accent-gold)",
                marginBottom: "16px",
              }}
            >
              <div style={{ color: "#888", fontSize: "10px", marginBottom: "4px" }}>
                ARCHIVE EVIDENCE:
              </div>
              <div style={{ fontStyle: "italic", fontFamily: "var(--font-serif)", fontSize: "14px", color: "#f4f1ea" }}>
                &ldquo;{activeScreen.filmQuote}&rdquo;
              </div>
              <div style={{ color: "var(--accent-gold)", fontSize: "11px", marginTop: "4px" }}>
                — Examined through: <strong>{activeFilm?.title} ({activeFilm?.year})</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "10px", color: "#aaa" }}>
              <div>
                <span style={{ color: "#666", display: "block" }}>GEOMETRY:</span>
                <strong>{activeScreen.aspectRatio}</strong>
              </div>
              <div>
                <span style={{ color: "#666", display: "block" }}>RESOLUTION:</span>
                <strong>{activeScreen.resolution}</strong>
              </div>
              <div>
                <span style={{ color: "#666", display: "block" }}>ACOUSTICS:</span>
                <strong>{activeScreen.audioStandard}</strong>
              </div>
              <div>
                <span style={{ color: "#666", display: "block" }}>ENVIRONMENT:</span>
                <strong>{activeScreen.viewingCondition}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Empirical Period Comparison Data Table */}
        <div style={{ marginTop: "24px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-main)",
              fontWeight: 700,
              display: "block",
              marginBottom: "10px",
            }}
          >
            EMPIRICAL PERIOD METRICS (VERIFIED TMDB DATA BY ERA)
          </span>

          <div style={{ overflowX: "auto" }}>
            <table className="methodology-table" style={{ width: "100%", fontSize: "12px" }}>
              <thead>
                <tr>
                  <th>ERA / SCREEN PERIOD</th>
                  <th>VERIFIED FILMS</th>
                  <th>MEDIAN RUNTIME</th>
                  <th>MEDIAN BUDGET ($M)</th>
                  <th>MEDIAN REVENUE ($M)</th>
                  <th>POPULARITY SCORE</th>
                </tr>
              </thead>
              <tbody>
                {periodComparisons.map((p) => {
                  const isCurrentEra = p.period.includes(activeScreen.era.slice(0, 4));
                  return (
                    <tr
                      key={p.period}
                      style={{
                        backgroundColor: isCurrentEra ? "rgba(142, 49, 36, 0.08)" : "transparent",
                        fontWeight: isCurrentEra ? 700 : 400,
                      }}
                    >
                      <td>{p.period}</td>
                      <td>{p.movies.toLocaleString()}</td>
                      <td>{p.median_runtime}m</td>
                      <td>{p.median_budget ? `$${(p.median_budget / 1e6).toFixed(1)}M` : "N/A"}</td>
                      <td>{p.median_revenue ? `$${(p.median_revenue / 1e6).toFixed(1)}M` : "N/A"}</td>
                      <td>{p.median_popularity.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-footer">
          <span>SOURCE: TMDB HISTORICAL WINDOW BY FIVE SCREEN ERAS</span>
          <span>AGGREGATE: period_comparison.csv &amp; cinema_archive_manifest.json</span>
        </div>
      </div>
    </article>
  );
}
