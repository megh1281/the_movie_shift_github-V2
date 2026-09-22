"use client";

import React from "react";
import { Eye, ShieldAlert, GitCommit } from "lucide-react";

export default function Thesis() {
  return (
    <section className="thesis-section" id="thesis" aria-label="Core Research Question and Methodology">
      <span className="section-label">THE CENTRAL INQUIRY</span>
      <h2 className="thesis-statement">
        As the way movies were made, released, and watched changed,{" "}
        <em>how did the movie itself change?</em>
      </h2>

      <div className="thesis-grid">
        <div className="thesis-column">
          <h4>
            <Eye size={14} style={{ color: "var(--accent-cinema)" }} />
            EMPIRICAL DATA
          </h4>
          <p>
            What TMDB’s catalog reveals with statistical certainty: documented release dates,
            feature runtimes, multi-label genre tags, vote volumes, and platform engagement
            distributions from 2000 through 2025.
          </p>
        </div>

        <div className="thesis-column">
          <h4>
            <GitCommit size={14} style={{ color: "var(--accent-gold)" }} />
            HISTORICAL TRANSITIONS
          </h4>
          <p>
            External industrial shifts—from 35mm celluloid and multiplexes to home video, VOD,
            and algorithmic subscription streaming—provide the essential socio-technological
            context for how audiences accessed moving images.
          </p>
        </div>

        <div className="thesis-column">
          <h4>
            <ShieldAlert size={14} style={{ color: "var(--accent-cinema)" }} />
            EPISTEMOLOGICAL INTEGRITY
          </h4>
          <p>
            Correlation is not causation. TMDB contains catalog metadata, not historical streaming
            viewership logs. We explicitly distinguish observable changes in cinema from the
            unsubstantiated claim that streaming caused every transformation.
          </p>
        </div>
      </div>
    </section>
  );
}
