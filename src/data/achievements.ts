/**
 * ─────────────────────────────────────────────────────────────
 *  ACHIEVEMENTS — animated counters in the highlights strip.
 *  EDIT: value (number), suffix and label. Keep to 4-6 stats.
 * ─────────────────────────────────────────────────────────────
 */

export type Achievement = {
  value: number;
  suffix?: string;
  label: string;
  detail: string;
};

export const achievements: Achievement[] = [
  {
    value: 10,
    suffix: "+",
    label: "AI systems built",
    detail: "RAG pipelines, classifiers, autoencoders & tooling",
  },
  {
    value: 98,
    suffix: "%+",
    label: "best model accuracy",
    detail: "Deep NLP classifiers on WELFake (~72K articles)",
  },
  {
    value: 4,
    suffix: "",
    label: "architectures ablated",
    detail: "GRU · BiGRU · LSTM · CNN-LSTM, benchmarked head-to-head",
  },
  {
    value: 72,
    suffix: "K",
    label: "articles processed",
    detail: "Full NLP preprocessing at dataset scale",
  },
  {
    value: 4,
    suffix: "",
    label: "certifications",
    detail: "London · DeepLearning.AI · Colorado",
  },
  {
    value: 5,
    suffix: "+",
    label: "doc formats parsed",
    detail: "Ingestion pipeline in Chat-With-Documents",
  },
];
