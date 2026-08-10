/**
 * ─────────────────────────────────────────────────────────────
 *  RESEARCH — papers, ongoing work, experiments and ideas.
 *  EDIT: change `status` to "published" | "ongoing" | "experiment" | "idea".
 * ─────────────────────────────────────────────────────────────
 */

export type ResearchItem = {
  title: string;
  status: "published" | "ongoing" | "experiment" | "idea";
  area: string;
  summary: string;
  link?: string; // paper / preprint / repo
};

export const research: ResearchItem[] = [
  // {
  //   title: "Architecture ablations for misinformation detection",
  //   status: "experiment",
  //   area: "NLP · Evaluation",
  //   summary:
  //     "Systematic ablation of GRU, BiGRU, LSTM and CNN-LSTM classifiers on WELFake (~72K articles), documenting precision/recall trade-offs. BiGRU delivers the best F1 with the fewest false positives.",
  //   link: "https://github.com/itz-naman007/NLP-stuff/tree/main/Fake%20News%20Detection",
  // },
  // {
  //   title: "Chunking strategies for multilingual retrieval",
  //   status: "ongoing",
  //   area: "RAG · Information Retrieval",
  //   summary:
  //     "Studying how chunk size, overlap and structure-aware splitting affect retrieval quality and answer grounding across languages in FAISS-backed pipelines.",
  // },
  // {
  //   title: "Perceptual objectives for Lab-space colorization",
  //   status: "experiment",
  //   area: "Computer Vision · Generative",
  //   summary:
  //     "Comparing pixel-wise MSE against perceptual losses for a*b* channel prediction, quantifying the gap between numeric loss and human-judged colour quality.",
  //   link: "https://github.com/itz-naman007/CNN/tree/main/Image%20Colorization",
  // },
  // {
  //   title: "Grounded agentic workflows over private corpora",
  //   status: "idea",
  //   area: "Agents · LLM Tooling",
  //   summary:
  //     "Designing evaluation harnesses for tool-using agents that must cite retrieved evidence, measuring hallucination rates against retrieval confidence.",
  // },
];
