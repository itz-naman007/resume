/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS — each entry renders as a full case-study panel.
 *  EDIT: add a new object to `projects` and it appears automatically.
 *
 *  media.src supports: /public images, GIFs, .mp4 videos and
 *  YouTube URLs (kind: "youtube"). Leave media undefined to render
 *  the generative pipeline visual instead.
 * ─────────────────────────────────────────────────────────────
 */

export type ProjectMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string }
  | { kind: "youtube"; id: string };

export type ProjectLink = {
  label: "GitHub" | "Live Demo" | "Docs" | "Paper";
  url: string;
};

export type Project = {
  slug: string;
  index: string; // display index, e.g. "01"
  title: string;
  tagline: string;
  date: string;
  stack: string[];
  /** Pipeline stages — rendered as the animated architecture diagram. */
  architecture: string[];
  challenge: string;
  solution: string;
  impact: { value: string; label: string }[];
  description: string; // supports plain markdown-ish text
  media?: ProjectMedia;
  links: ProjectLink[];
  accentHue: number; // 0-360 — tints the panel's glow
};

export const projects: Project[] = [
  {
    slug: "chat-with-documents",
    index: "01",
    title: "Chat-With-Documents",
    tagline: "A production-grade RAG pipeline for multilingual document intelligence.",
    date: "Mar 2026",
    stack: ["Python", "Flask", "FAISS", "Hugging Face"],
    architecture: [
      "Ingest 2+ formats",
      "Chunk & clean",
      "HF embeddings",
      "FAISS index",
      "Query router",
      "Grounded answer",
      "Memory support",
    ],
    challenge:
      "Documents arrive in many formats and languages; naive retrieval returns noise, and multi-turn questions lose context without memory.",
    solution:
      "A custom preprocessing system (chunking, embedding, indexing across 2+ formats) feeding a FAISS semantic index, with a Flask backend that routes queries across Summarize and Q&A modes and carries conversation memory for coherent multi-turn dialogue. Made this without using LAngchain or other frameworks.",
    impact: [
      { value: "2+", label: "document formats supported" },
      { value: "Multi", label: "lingual semantic Q&A" },
      { value: "↓", label: "average query latency" },
    ],
    description:
      "Built end-to-end: document loaders, a custom chunking strategy tuned for retrieval quality, Hugging Face transformer embeddings, FAISS similarity search, and conversation memory all served through a mode-routing Flask API.",
    links: [{ label: "GitHub", url: "https://github.com/itz-naman007/ChatWithDoc" }],
    accentHue: 74,
  },
  {
    slug: "fake-news-detection",
    index: "02",
    title: "Fake News Detection",
    tagline: "Four deep architectures, one honest benchmark on 72K articles.",
    date: "Dec 2025",
    stack: ["Python", "TensorFlow", "NLTK", "GloVe", "Scikit-Learn"],
    architecture: [
      "WELFake ~72K articles",
      "Tokenise + pad",
      "GloVe embeddings",
      "GRU / BiGRU / LSTM / CNN-LSTM",
      "Ablation study",
      "98%+ accuracy",
    ],
    challenge:
      "Headline accuracy numbers hide trade-offs  which architecture actually minimises false positives on misinformation at scale?",
    solution:
      "Designed and benchmarked four deep classifiers with a full NLP preprocessing pipeline, then ran a systematic ablation across architectures and hyperparameters, documenting precision/recall trade-offs for each.",
    impact: [
      { value: "98%+", label: "classification accuracy" },
      { value: "4", label: "architectures benchmarked" },
      { value: "BiGRU", label: "best F1, fewest false positives" },
    ],
    description:
      "A study in doing evaluation properly: identical preprocessing across models, controlled hyperparameter sweeps, and per-class error analysis. BiGRU won on F1 with the fewest false positives.",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/itz-naman007/NLP-stuff/tree/main/Fake%20News%20Detection",
      },
    ],
    // media: {
    //   size: "small",
    //   kind: "image",
    //   src: "/public/images/fake-news-detection.png",
    //   alt: "Fake News Detection",
    // },
    accentHue: 12,
  },
  {
    slug: "text-to-sql-command",
    index: "03",
    title: "Text-to-SQL Chatbot",
    tagline: "Ask questions about a MySQL database in plain English.",
    date: "2026",
    stack: ["Python", "Gemini", "LangGraph", "LangChain", "MySQL", "Gradio"],
    architecture: [
      "Natural-language question",
      "Schema inspection",
      "Gemini reasoning",
      "SQL generation",
      "MySQL execution",
      "Answer rendering",
    ],
    challenge:
      "Database questions usually require SQL knowledge and manual schema inspection.",
    solution:
      "Built a Gradio interface backed by a cached LangGraph ReAct agent. The agent uses LangChain's SQL toolkit to inspect a configured MySQL schema, generate SQL, execute the query, and return a natural-language answer.",
    impact: [
      { value: "1", label: "database engine supported" },
      { value: "NL", label: "database querying interface" },
      { value: "Cached", label: "agent initialization" },
    ],
    description:
      "A lightweight natural-language database interface with environment-based credentials and cached agent and database initialization. The current version is a working prototype focused on turning plain-English questions into database answers.",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/itz-naman007/txt-to-sql-command",
      },
    ],
    accentHue: 215,
  },
];
