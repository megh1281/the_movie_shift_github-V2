# BUILD ORDER

Use this order in Google AI Studio.

1. Import the GitHub repository.
2. Paste GOOGLE_AI_STUDIO_MASTER_PROMPT.md as the first major instruction.
3. Ask Gemini to inspect the entire repository before changing architecture.
4. Have it build the visual system and narrative shell first.
5. Then integrate verified aggregate data.
6. Then add interactions.
7. Then perform accessibility/performance QA.
8. Only after the data is verified should the project be deployed publicly.

Suggested follow-up prompts:
- "Audit the current implementation against the project brief and fix the highest-impact issues."
- "Make the storytelling more editorial and less like a dashboard. Preserve data accuracy."
- "Audit every chart for accessibility, units, source attribution and mobile behavior."
- "Run a production build and fix every error."
- "Do a final content audit: identify every numerical claim and trace it to a source file."
