/**
 * ─────────────────────────────────────────────────────────────
 *  PROFILE — the single source of truth for who you are.
 *  EDIT: every field below. Nothing here is hardcoded in the UI.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  // EDIT: your name, exactly as it should appear everywhere.
  name: "Naman Gupta",
  firstName: "Naman",

  // EDIT: rotating roles shown in the hero (keep them short & punchy).
  roles: [
    "AI developer",
    "C++ developer",
    "ML engineer",
    "Researcher",
  ],

  // EDIT: the one-line thesis of the hero. This is the first thing anyone reads.
  headline: {
    lineOne: "I teach machines to",
    // These words animate one after another and describe your work.
    verbs: ["read", "reason", "retrieve", "respond"],
    lineTwo: "so people don't have to guess.",
  },

  // EDIT: short positioning statement under the headline.
  subheadline:
  " AI devloper & coder building ML models, RAG pipelines, and agentic systems. I ship research-grade code that makes intelligence useful.",
  // EDIT: current status shown as a live badge in hero + contact.
  availability: {
    available: true,
    label: "Open to AI/ML internships & research roles",
  },

  // EDIT: location & timezone.
  location: "Greater Noida, India",
  timezone: "IST (UTC+5:30)",

  // EDIT: contact channels.
  email: "nmn.gupta.0515@gmail.com",
  phone: "+91 8630137824",

  // EDIT: path to your resume PDF placed in /public.
  resumeUrl: "/resume/naman-gupta-resume.pdf",

  // EDIT: path to your profile photo placed in /public (optional, About
  // section renders a generative portrait card if this is empty).
  photo: "/public/images/profile.jpeg",

  // EDIT: education summary used in About.
  education: {
    degree: "B.E. Computer Science, AI Specialization",
    school: "Bennett University, Greater Noida",
    graduation: "Expected July 2027",
    detail: "CGPA 7.17 / 10",
  },

  // EDIT: the "story" for the About section.
  story: [],

  // // EDIT: the "mindset" strip in About, short principles you work by.
  // principles: [
  //   "Benchmark honestly",
  //   "Ship the whole pipeline",
  //   "Grounded > clever",
  //   "Latency is a feature",
  //   "Read the paper, then the code",
  // ],
} as const;

export type Profile = typeof profile;
