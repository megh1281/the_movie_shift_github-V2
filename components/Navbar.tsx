"use client";

import React from "react";
import { Database, BookOpen, Layers } from "lucide-react";

interface NavbarProps {
  activeChapter: string;
  onOpenMethodology: () => void;
  dataLoadedCount: number;
}

export default function Navbar({
  activeChapter,
  onOpenMethodology,
  dataLoadedCount,
}: NavbarProps) {
  return (
    <nav className="topbar" id="editorial-nav" aria-label="Main Editorial Navigation">
      <div className="topbar-left">
        <a href="#hero" className="topbar-brand" style={{ textDecoration: "none", color: "inherit" }}>
          THE MOVIE SHIFT
        </a>
        <span className="topbar-meta" aria-hidden="true">
          TMDB · RESEARCH EDITION (2000–2025)
        </span>
      </div>

      <div className="topbar-actions">
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "10px",
            color: dataLoadedCount === 9 ? "#2d6a4f" : "#a07828",
            marginRight: "8px",
          }}
          title={`${dataLoadedCount}/9 verified aggregate tables verified`}
        >
          <Database size={13} />
          <span>{dataLoadedCount}/9 DATASETS VERIFIED</span>
        </div>

        <button
          type="button"
          className="topbar-btn"
          id="btn-nav-methodology"
          onClick={onOpenMethodology}
          aria-label="Open Methodology, Sources, and Data Inspector"
        >
          <BookOpen size={13} />
          <span>METHODOLOGY & DATA</span>
        </button>
      </div>
    </nav>
  );
}
