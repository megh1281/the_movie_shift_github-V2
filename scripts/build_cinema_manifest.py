import urllib.request
import csv
import io
import json
import os

MIRROR_URL = "https://huggingface.co/datasets/ada-datadruids/full_tmdb_movies_dataset/resolve/main/TMDB_movie_dataset_v11.csv"
OUT_FILE = "public/data/cinema_archive_manifest.json"

target_titles = [
    # 2000-2005
    "Gladiator", "Memento", "In the Mood for Love", "The Lord of the Rings: The Fellowship of the Ring",
    "Spirited Away", "Mulholland Drive", "City of God", "The Matrix Reloaded", "Finding Nemo",
    "Lost in Translation", "Eternal Sunshine of the Spotless Mind", "Kill Bill: Vol. 1", "The Incredibles",
    "Brokeback Mountain", "Batman Begins", "Pride & Prejudice", "Shaun of the Dead", "Before Sunset",
    # 2006-2010
    "Pan's Labyrinth", "The Departed", "Children of Men", "No Country for Old Men", "There Will Be Blood",
    "The Dark Knight", "WALL·E", "Iron Man", "Slumdog Millionaire", "Avatar", "Inglourious Basterds",
    "Up", "Inception", "The Social Network", "Black Swan", "Superbad",
    # 2011-2015
    "The Artist", "Drive", "The Avengers", "Django Unchained", "The Master", "Gravity",
    "Her", "The Wolf of Wall Street", "Interstellar", "Whiplash", "Birdman", "The Grand Budapest Hotel",
    "Mad Max: Fury Road", "Sicario", "Spotlight", "Inside Out", "The Revenant", "Ex Machina",
    # 2016-2019
    "Arrival", "La La Land", "Moonlight", "Get Out", "Dunkirk", "Blade Runner 2049",
    "Lady Bird", "Spider-Man: Into the Spider-Verse", "Black Panther", "Roma", "Hereditary",
    "Parasite", "Avengers: Endgame", "The Irishman", "Joker", "1917", "Knives Out",
    "Portrait of a Lady on Fire", "Midsommar", "Marriage Story", "Uncut Gems",
    # 2020-2021 (Pandemic / Streaming disruption)
    "Tenet", "Soul", "Nomadland", "Dune", "Spider-Man: No Way Home", "CODA", "The Power of the Dog",
    "Don't Look Up", "Drive My Car", "Zack Snyder's Justice League", "Tick, Tick... Boom!",
    # 2022-2025 (Post-pandemic / Modern)
    "Everything Everywhere All at Once", "Top Gun: Maverick", "The Batman", "Aftersun", "TÁR",
    "Oppenheimer", "Barbie", "Poor Things", "Past Lives", "Killers of the Flower Moon",
    "The Zone of Interest", "Spider-Man: Across the Spider-Verse", "Godzilla Minus One",
    "Dune: Part Two", "Furiosa: A Mad Max Saga", "Challengers", "Inside Out 2", "Anora", "The Substance",
    "Alien: Romulus"
]

target_lower = {t.lower(): t for t in target_titles}

found_movies = {}

print("Connecting to TMDB dataset mirror...")
req = urllib.request.Request(MIRROR_URL, headers={"User-Agent": "MovieShiftDataPipeline/1.0"})
with urllib.request.urlopen(req, timeout=120) as resp:
    stream = io.TextIOWrapper(resp, encoding="utf-8", errors="replace")
    reader = csv.reader(stream)
    header = next(reader)
    col = {name.strip(): idx for idx, name in enumerate(header)}

    count = 0
    for r in reader:
        count += 1
        if len(r) <= max(col.values()):
            continue
        title = r[col["title"]].strip()
        t_low = title.lower()

        if t_low in target_lower:
            rel = r[col["release_date"]].strip()
            y = int(rel[:4]) if rel and len(rel) >= 4 and rel[:4].isdigit() else 0
            if 1999 <= y <= 2025:
                # Check if poster_path exists
                poster = r[col.get("poster_path", -1)].strip() if "poster_path" in col else ""
                backdrop = r[col.get("backdrop_path", -1)].strip() if "backdrop_path" in col else ""
                
                # Check vote_count to avoid obscure remakes/fan films with same name
                vc = float(r[col["vote_count"]].strip() or 0)
                
                canon_title = target_lower[t_low]
                if canon_title not in found_movies or vc > found_movies[canon_title]["vote_count"]:
                    genres_str = r[col["genres"]].strip()
                    genres = [g.strip() for g in genres_str.split(",") if g.strip()]
                    rt = float(r[col["runtime"]].strip() or 0)
                    pop = float(r[col["popularity"]].strip() or 0)
                    rev = float(r[col["revenue"]].strip() or 0)
                    bud = float(r[col["budget"]].strip() or 0)
                    va = float(r[col["vote_average"]].strip() or 0)

                    found_movies[canon_title] = {
                        "id": int(r[col["id"]].strip() or 0),
                        "title": title,
                        "year": y,
                        "release_date": rel,
                        "genres": genres,
                        "runtime": int(rt) if rt > 0 else None,
                        "popularity": round(pop, 2),
                        "revenue": int(rev) if rev > 0 else None,
                        "budget": int(bud) if bud > 0 else None,
                        "vote_average": round(va, 1),
                        "vote_count": int(vc),
                        "poster_path": poster if poster else None,
                        "backdrop_path": backdrop if backdrop else None
                    }

        if len(found_movies) >= len(target_titles) or count >= 180000:
            print(f"Reached condition at raw row {count}. Found {len(found_movies)} target films.")
            break

print(f"Total matched targets: {len(found_movies)} of {len(target_titles)}")

# Add specific storytelling roles / tags to each film for easy chapter filtering
manifest_list = list(found_movies.values())

# Sort by release year then title
manifest_list.sort(key=lambda m: (m["year"], m["title"]))

os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(manifest_list, f, indent=2)

print(f"Saved {len(manifest_list)} films to {OUT_FILE}")
