/**
 * ─────────────────────────────────────────────────────────────
 *  EXPERIENCE — rendered as an immersive vertical journey.
 *  EDIT: add entries chronologically (newest first).
 * ─────────────────────────────────────────────────────────────
 */

export type Experience = {
  role: string;
  org: string;
  mode?: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    role: "AI/ML Intern",
    org: "Edu-net Foundation",
    mode: "Virtual Internship",
    period: "Jun 2024 to Jul 2024",
    summary:
      "Built data-quality tooling and studied the end-to-end ML lifecycle with IBM AI tools.",
    highlights: [
      "Built an automated data validation & auditing tool that scans uploaded datasets for missing values, duplicates, outliers and schema inconsistencies, generating structured quality reports with actionable fix recommendations via a Streamlit dashboard.",
      "Reduced manual data-review effort and ensured accuracy before downstream analysis.",
      "Documented model experiments and results to understand performance trade-offs across architectures.",
      "Explored the full ML lifecycle, preprocessing, training, evaluation and deployment, using IBM AI tools.",
    ],
    stack: ["Python", "Streamlit", "Pandas", "IBM AI Tools"],
  },
  // EDIT: add your next role here — the journey line extends automatically.
];
