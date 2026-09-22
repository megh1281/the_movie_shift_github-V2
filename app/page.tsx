"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Thesis from "@/components/Thesis";
import ChapterNav from "@/components/ChapterNav";
import Chapter01MovieMachine from "@/components/Chapter01MovieMachine";
import Chapter02GenreCycle from "@/components/Chapter02GenreCycle";
import Chapter03RuntimeEvolution from "@/components/Chapter03RuntimeEvolution";
import Chapter04AudienceResponse from "@/components/Chapter04AudienceResponse";
import Chapter05ScreenMoved from "@/components/Chapter05ScreenMoved";
import Chapter06SuccessMetrics from "@/components/Chapter06SuccessMetrics";
import Chapter07Synthesis from "@/components/Chapter07Synthesis";
import MethodologyModal from "@/components/MethodologyModal";
import Footer from "@/components/Footer";
import { MovieShiftData, loadAllMovieShiftData } from "@/lib/dataLoader";

export default function Home() {
  const [data, setData] = useState<MovieShiftData | null>(null);
  const [activeChapter, setActiveChapter] = useState<string>("chapter-01");
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  useEffect(() => {
    loadAllMovieShiftData().then((res) => {
      setData(res);
    });
  }, []);

  // Track active chapter with IntersectionObserver
  useEffect(() => {
    const chapterIds = [
      "chapter-01",
      "chapter-02",
      "chapter-03",
      "chapter-04",
      "chapter-05",
      "chapter-06",
      "chapter-07",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveChapter(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
      }
    );

    chapterIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data]);

  const verifiedDatasetsCount = data
    ? Object.values(data.loadedFiles).filter(Boolean).length
    : 0;

  return (
    <main id="main-content">
      <Navbar
        activeChapter={activeChapter}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        dataLoadedCount={verifiedDatasetsCount}
      />

      <Hero
        dataQuality={data?.dataQuality || null}
        curatedFilms={data?.curatedFilms || []}
      />

      <Thesis />

      <div className="chapters-container">
        <ChapterNav activeChapter={activeChapter} />

        <div className="chapter-content">
          <Chapter01MovieMachine
            annualCounts={data?.annualCounts || []}
            genreYears={data?.genreYears || []}
            curatedFilms={data?.curatedFilms || []}
          />

          <Chapter02GenreCycle
            genreYears={data?.genreYears || []}
            genreSummaries={data?.genreSummaries || []}
            curatedFilms={data?.curatedFilms || []}
          />

          <Chapter03RuntimeEvolution
            runtimeYears={data?.runtimeYears || []}
            genreRuntimeYears={data?.genreRuntimeYears || []}
            curatedFilms={data?.curatedFilms || []}
          />

          <Chapter04AudienceResponse
            scatterSample={data?.scatterSample || []}
            spearmanPairs={data?.spearmanPairs || []}
            curatedFilms={data?.curatedFilms || []}
          />

          <Chapter05ScreenMoved
            periodComparisons={data?.periodComparisons || []}
            curatedFilms={data?.curatedFilms || []}
          />

          <Chapter06SuccessMetrics
            financialYears={data?.financialYears || []}
            curatedFilms={data?.curatedFilms || []}
          />

          <Chapter07Synthesis
            curatedFilms={data?.curatedFilms || []}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        </div>
      </div>

      <Footer />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        dataQuality={data?.dataQuality || null}
        loadedFiles={data?.loadedFiles || {}}
      />
    </main>
  );
}
