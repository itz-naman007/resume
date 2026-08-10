/**
 * ─────────────────────────────────────────────────────────────
 *  SOCIALS — links rendered in navbar, contact & footer.
 *  EDIT: urls + handles. `icon` maps to react-icons keys used
 *  in components/sections/contact.tsx.
 * ─────────────────────────────────────────────────────────────
 */

export type Social = {
  label: string;
  handle: string;
  url: string;
  icon: "github" | "linkedin" | "mail" | "x" | "kaggle" | "huggingface" | "leetcode";
};

export const socials: Social[] = [
  {
    label: "GitHub",
    handle: "itz-naman007", // EDIT
    url: "https://github.com/itz-naman007", // EDIT
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "gupta-naman69", // EDIT
    url: "https://www.linkedin.com/in/gupta-naman69", // EDIT
    icon: "linkedin",
  },
  {
    label: "Email",
    handle: "nmn.gupta.0515@gmail.com", // EDIT
    url: "mailto:nmn.gupta.0515@gmail.com", // EDIT
    icon: "mail",
  },
  {
    label: "kaggle",
    handle: "Nmngup", // EDIT
    url: "https://www.kaggle.com/nmngup", // EDIT
    icon: "kaggle",
  },
  {
    label: "LeetCode",
    handle: "pZDE2amUpZ",
    url: "https://leetcode.com/u/pZDE2amUpZ/",
    icon: "leetcode",
  },
];
