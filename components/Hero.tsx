"use client";

import React from "react";
import Image from "next/image";
import { ArrowDown, Film, Clapperboard, Layers } from "lucide-react";
import { DataQuality, CuratedFilm } from "@/lib/dataLoader";

interface HeroProps {
  dataQuality: DataQuality | null;
  curatedFilms?: CuratedFilm[];
}

export default function Hero({ dataQuality, curatedFilms = [] }: HeroProps) {
  const analysisCount = dataQuality?.analysis_rows_2000_2025?.toLocaleString() || "49,907";

  // Select 6 landmark films spanning the 25-year modern window
  const heroPosters = curatedFilms.length > 0
    ? [
        curatedFilms.find((f) => f.title === "In the Mood for Love") || curatedFilms[0],
        curatedFilms.find((f) => f.title === "There Will Be Blood") || curatedFilms[1],
        curatedFilms.find((f) => f.title === "Inception") || curatedFilms[2],
        curatedFilms.find((f) => f.title === "Moonlight") || curatedFilms[3],
        curatedFilms.find((f) => f.title === "Parasite") || curatedFilms[4],
        curatedFilms.find((f) => f.title === "Oppenheimer") || curatedFilms[5],
      ].filter(Boolean)
    : [];

  return (
    <header className="hero" id="hero">
      {/* Cinematic Film Strip Background Composition in the margins */}
      <div
        className="hero-archive-strip"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "8%",
          right: "4%",
          display: "flex",
          gap: "14px",
          opacity: 0.82,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {heroPosters.slice(0, 4).map((film, idx) => (
          <div
            key={film.id || idx}
            style={{
              width: "115px",
              height: "170px",
              position: "relative",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
              transform: `rotate(${idx % 2 === 0 ? -2 : 3}deg) translateY(${idx * 16}px)`,
              backgroundColor: "#22201d",
              overflow: "hidden",
            }}
          >
            {film.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w300${film.poster_path}`}
                alt=""
                fill
                sizes="115px"
                style={{ objectFit: "cover", opacity: 0.9 }}
                priority={idx < 2}
                referrerPolicy="no-referrer"
              />
            )}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(24, 23, 22, 0.85)",
                color: "#f4f1ea",
                fontSize: "8px",
                fontFamily: "var(--font-mono)",
                padding: "3px 5px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {film.year} · {film.title}
            </div>
          </div>
        ))}
      </div>

      <div className="hero-sprocket" aria-hidden="true">
        <div className="sprocket-hole"></div>
        <div className="sprocket-hole"></div>
        <div className="sprocket-hole"></div>
        <div className="sprocket-hole"></div>
      </div>

      <div className="hero-meta-strip" style={{ position: "relative", zIndex: 2 }}>
        <Film size={14} />
        <span>AN INTERACTIVE CINEMA DATA ESSAY · 2000–2025</span>
        <span style={{ color: "var(--accent-gold)", fontSize: "9px" }}>[ ARCHIVE EDITION ]</span>
      </div>

      <h1 style={{ position: "relative", zIndex: 2 }}>
        THE<br />
        <em>MOVIE</em><br />
        SHIFT
      </h1>

      <p className="hero-dek" style={{ position: "relative", zIndex: 2 }}>
        How genres, screens, and audiences transformed the physical and digital architecture of cinema.
      </p>

      <div className="hero-indicators" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-indicator-item">
          <span className="hero-indicator-val">{analysisCount}</span>
          <span className="hero-indicator-lbl">Verified Modern Films</span>
        </div>
        <div className="hero-indicator-item">
          <span className="hero-indicator-val">2000–2025</span>
          <span className="hero-indicator-lbl">Quarter-Century Window</span>
        </div>
        <div className="hero-indicator-item">
          <span className="hero-indicator-val">30–300 MIN</span>
          <span className="hero-indicator-lbl">Feature Runtime Protocol</span>
        </div>
        <div className="hero-indicator-item">
          <span className="hero-indicator-val">7 CHAPTERS</span>
          <span className="hero-indicator-lbl">Editorial Inquiry</span>
        </div>
      </div>

      <a
        href="#thesis"
        className="scroll-prompt"
        id="btn-hero-scroll"
        style={{ textDecoration: "none", position: "relative", zIndex: 2 }}
      >
        <ArrowDown size={14} />
        <span>ENTER THE ARCHIVE</span>
      </a>
    </header>
  );
}
