/**
 * ─────────────────────────────────────────────────────────────
 *  SKILLS — rendered as an interactive "technology constellation".
 *  EDIT: add/remove domains and nodes freely; UI adapts.
 *  `note` appears on hover — say HOW you've used it, not a rating.
 * ─────────────────────────────────────────────────────────────
 */

export type SkillNode = {
  name: string;
  note?: string; // shown on hover — context beats progress bars
  core?: boolean; // core skills render larger & brighter
};

export type SkillDomain = {
  id: string;
  label: string;
  blurb: string;
  nodes: SkillNode[];
};

export const skillDomains: SkillDomain[] = [
  {
    id: "llm",
    label: "LLMs & NLP",
    blurb: "Retrieval, generation and everything that makes language compute.",
    nodes: [
      { name: "RAG", core: true, note: "Production pipeline in Chat-With-Documents" },
      { name: "LangChain", core: true, note: "Orchestration, memory, agent tooling" },
      { name: "Hugging Face", core: true, note: "Transformer embeddings & fine-tuning" },
      { name: "Prompt Engineering", note: "Query routing across Summarize / Q&A modes" },
      { name: "Agentic AI", note: "Tool-using agent experiments" },
      { name: "NLTK", note: "Tokenisation & preprocessing" },
      { name: "spaCy", note: "NER & dependency parsing" },

      { name: "Fine-tuning", note: "Task adaptation of pretrained models" },
    ],
  },
  {
    id: "dl",
    label: "Deep Learning",
    blurb: "Architectures I've trained, ablated and benchmarked from scratch.",
    nodes: [
      { name: "PyTorch", core: true, note: "Primary research framework" },
      { name: "TensorFlow", core: true, note: "Trained CNN/RNN classifiers & autoencoders" },
      {name: "Pytorch Lightning", note: "Experiment tracking & reproducibility"},
      {name: "neural networks", note: "CNNs, RNNs, Transformers, Autoencoders"},
      {name: "LSTMs", note: "Sequence modelling for NLP & time series"},
      { name: "GANs", note: "Generative modelling study" },
      { name: "Autoencoders", note: "Lab-space image colorization" },
    ],
  },
  {
    id: "ml",
    label: "ML & Data",
    blurb: "Classical foundations and the data work underneath everything.",
    nodes: [
      { name: "Supervised Learning", core: true, note: "Classification, regression, ranking" },
      { name: "Unsupervised Learning", note: "Clustering, dimensionality reduction" },
      { name: "Scikit-Learn", core: true, note: "Baselines, metrics, model selection" },
      { name: "Pandas", note: "Every dataset starts here" },
      { name: "NumPy", note: "Vectorised pipelines" },
      { name: "Matplotlib", note: "Visualising data & model behaviour" },
      { name: "MLOps", note: "Experiment tracking & reproducibility" },
      { name: "MLflow", note: "Run tracking for ablations" },
    ],
  },
  {
    id: "vector",
    label: "Vector & Databases",
    blurb: "Where embeddings live and queries get answered.",
    nodes: [
      { name: "FAISS", core: true, note: "Semantic index for multilingual document Q&A" },
      { name: "ChromaDB", note: "Lightweight RAG experiments" },
      { name: "MySQL", note: "Relational modelling" },
      { name: "MongoDB", note: "Document stores for app backends" },
    ],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    blurb: "How models become products.",
    nodes: [
      { name: "FastAPI", core: true, note: "Typed inference APIs" },
      { name: "Flask", core: true, note: "RAG backend with query routing" },
      { name: "Django", note: "Full-stack apps" },
      { name: "REST APIs", note: "Design & versioning" },
      { name: "Streamlit", note: "Data-audit dashboard at Edu-net" },
      { name: "Gradio", note: "Rapid prototyping of ML demos" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Tooling",
    blurb: "Reproducible, shippable, versioned.",
    nodes: [
      { name: "Docker", core: true, note: "Containerised training & serving" },
      { name: "Git", note: "Daily driver" },
      { name: "DVC", note: "Data & model versioning" },
      { name: "CI/CD", note: "Automated checks on every push" },
    ],
  },
  {
    id: "lang",
    label: "Languages & CS",
    blurb: "The bedrock.",
    nodes: [
      { name: "Python", core: true, note: "Fluent: ML, backends, tooling" },
      { name: "C++", note: "DSA & performance-critical code" },
      { name: "DSA", note: "Problem-solving foundation" },
      { name: "DBMS", note: "Schema design, normalization" },
      { name: "Software Engineering", note: "Patterns, testing, architecture" },
    ],
  },
];
