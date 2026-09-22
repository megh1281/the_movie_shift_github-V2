"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ArchivePosterProps {
  title: string;
  year?: number;
  posterPath?: string | null;
  runtime?: number | null;
  genre?: string | string[];
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  caption?: string;
  highlight?: boolean;
  onClick?: () => void;
}

const SIZE_MAP = {
  sm: { w: 100, h: 150, font: "10px" },
  md: { w: 140, h: 210, font: "11px" },
  lg: { w: 190, h: 285, font: "12px" },
  xl: { w: 260, h: 390, font: "13px" },
};

export default function ArchivePoster({
  title,
  year,
  posterPath,
  runtime,
  genre,
  size = "md",
  className = "",
  caption,
  highlight = false,
  onClick,
}: ArchivePosterProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const dim = SIZE_MAP[size] || SIZE_MAP.md;
  const genreList = Array.isArray(genre) ? genre.join(" · ") : genre;

  // TMDB w500 or w300 poster image URL
  const imageUrl =
    posterPath && !hasError
      ? posterPath.startsWith("http")
        ? posterPath
        : `https://image.tmdb.org/t/p/w500${posterPath}`
      : null;

  return (
    <figure
      className={`archive-poster-frame ${highlight ? "highlight" : ""} ${className}`}
      style={{
        width: dim.w,
        margin: 0,
        display: "inline-flex",
        flexDirection: "column",
        position: "relative",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <div
        className="poster-viewport"
        style={{
          width: dim.w,
          height: dim.h,
          position: "relative",
          backgroundColor: "#22201d",
          border: highlight ? "2px solid var(--accent-cinema)" : "1px solid var(--border-subtle)",
          overflow: "hidden",
          boxShadow: highlight
            ? "0 8px 24px rgba(142, 49, 36, 0.25)"
            : "0 4px 14px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${title} (${year || "film"}) official poster`}
            fill
            sizes={`${dim.w}px`}
            className="poster-image"
            style={{
              objectFit: "cover",
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "12px",
              background: "linear-gradient(135deg, #2a2723 0%, #181716 100%)",
              color: "#eae5d9",
              textAlign: "center",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ fontSize: "9px", letterSpacing: "0.14em", color: "var(--accent-gold)" }}>
              [ ARCHIVE REEL ]
            </span>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "13px",
                fontStyle: "italic",
                margin: "8px 0 4px",
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            {year && <span style={{ fontSize: "10px", color: "#8c8577" }}>{year}</span>}
          </div>
        )}

        {/* Subtle 35mm film stamp overlay */}
        <div
          className="film-frame-stamp"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            fontSize: "8px",
            fontFamily: "var(--font-mono)",
            color: "rgba(255, 255, 255, 0.75)",
            background: "rgba(0, 0, 0, 0.6)",
            padding: "1px 4px",
            letterSpacing: "0.08em",
            pointerEvents: "none",
          }}
        >
          {year ? `${year}` : "35MM"}
        </div>
      </div>

      <figcaption
        style={{
          marginTop: "6px",
          fontFamily: "var(--font-mono)",
          fontSize: dim.font,
          lineHeight: 1.3,
          color: "var(--text-main)",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "-0.01em",
          }}
          title={title}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "var(--text-dim)",
            marginTop: "2px",
          }}
        >
          <span>{year}</span>
          {runtime ? <span>{runtime}m</span> : null}
        </div>
        {caption && (
          <div
            style={{
              fontSize: "10px",
              color: "var(--accent-cinema)",
              marginTop: "2px",
              fontStyle: "italic",
              fontFamily: "var(--font-serif)",
            }}
          >
            {caption}
          </div>
        )}
      </figcaption>
    </figure>
  );
}
