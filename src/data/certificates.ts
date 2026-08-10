/**
 * ─────────────────────────────────────────────────────────────
 *  CERTIFICATES — gallery with expand / verify / download.
 *  EDIT: `image` is optional (a typographic card renders without it).
 *  Put certificate images in /public/certificates/.
 * ─────────────────────────────────────────────────────────────
 */

export type Certificate = {
  title: string;
  issuer: string;
  platform: string;
  verifyUrl: string;
  image?: string; // e.g. "/certificates/ml-for-all.png"
  year: string;
};

export const certificates: Certificate[] = [
  {
    title: "Machine Learning for All",
    issuer: "University of London",
    platform: "Coursera",
    verifyUrl:
      "https://www.coursera.org/account/accomplishments/verify/7M3QSQA20BYA",
    year: "2024",
  },
  {
    title: "PyTorch: Fundamentals",
    issuer: "DeepLearning.AI",
    platform: "Coursera",
    verifyUrl:
      "https://www.coursera.org/account/accomplishments/verify/GBJYL057X0DM",
    year: "2026",
  },
  {
    title: "Retrieval Augmented Generation (RAG)",
    issuer: "DeepLearning.AI",
    platform: "Coursera",
    verifyUrl:
      "https://www.coursera.org/account/accomplishments/verify/12D7LEH9V41D",
    year: "2026",
  },
  {
    title: "Database Management Essentials",
    issuer: "University of Colorado System",
    platform: "Coursera",
    verifyUrl:
      "https://www.coursera.org/account/accomplishments/verify/3R2JUXY35LM2",
    year: "2024",
  },
  {
    title: "Fundamentals of Network Communication",
    issuer: "University of Colorado System",
    platform: "Coursera",
    verifyUrl:
      "https://www.coursera.org/account/accomplishments/verify/GC65HXERXZ0O",
    year: "2025",
  },
  {
    title: "Automated Software Testing with Python",
    platform: "Udemy",
    issuer: "Udemy",
    verifyUrl:
      "https://www.udemy.com/certificate/UC-239c72c0-ff0c-4941-a0db-e3db1210a705/",
    year: "2026",
  },
];
