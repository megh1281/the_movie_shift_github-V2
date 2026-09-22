"use client";

import React from "react";

interface ChapterNavProps {
  activeChapter: string;
}

const CHAPTERS = [
  { id: "chapter-01", num: "01", title: "THE MOVIE MACHINE" },
  { id: "chapter-02", num: "02", title: "THE GENRE CYCLE" },
  { id: "chapter-03", num: "03", title: "HOW LONG IS A MOVIE?" },
  { id: "chapter-04", num: "04", title: "AUDIENCE RESPONSE" },
  { id: "chapter-05", num: "05", title: "THE SCREEN MOVED" },
  { id: "chapter-06", num: "06", title: "A NEW MEASUREMENT" },
  { id: "chapter-07", num: "07", title: "DID THE MOVIE CHANGE?" },
];

export default function ChapterNav({ activeChapter }: ChapterNavProps) {
  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="chapter-sidebar" aria-label="Editorial Chapters Table of Contents">
      <div className="sidebar-title">TABLE OF CONTENTS</div>
      <ul className="chapter-nav-list">
        {CHAPTERS.map((ch) => {
          const isActive = activeChapter === ch.id;
          return (
            <li key={ch.id}>
              <button
                type="button"
                className={`chapter-nav-btn ${isActive ? "active" : ""}`}
                onClick={() => scrollToChapter(ch.id)}
                aria-current={isActive ? "true" : undefined}
                id={`nav-link-${ch.id}`}
              >
                <span className="nav-num">{ch.num}</span>
                <span className="nav-label">{ch.title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer-note">
        <strong>METHOD:</strong> Descriptive statistics, quantile regression bands, and Spearman rank correlations on verified TMDB feature releases.
      </div>
    </aside>
  );
}
