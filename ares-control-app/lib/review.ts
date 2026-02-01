export const REVIEW_ROLES = [
  "producer",
  "critic",
  "editor",
  "verifier",
  "judge",
] as const;

export type ReviewRole = (typeof REVIEW_ROLES)[number];

export const REVIEW_ROLE_LABELS: Record<ReviewRole, string> = {
  producer: "Producer",
  critic: "Critic",
  editor: "Editor",
  verifier: "Verifier",
  judge: "Judge",
};

export const REVIEW_ROLE_HINTS: Record<ReviewRole, string> = {
  producer:
    "Draft the best answer/plan. State assumptions. Define acceptance criteria.",
  critic:
    "Attack assumptions. List failure cases. Specify what would change your mind. Reject unless fixed.",
  editor:
    "Rewrite for clarity and structure. Incorporate critic feedback or explicitly decline with reason.",
  verifier:
    "Fact-check key claims. Add citations/links. Flag uncertainty + missing tests.",
  judge:
    "Ship / no-ship decision. Must address critic objections + verifier flags.",
};
