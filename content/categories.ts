import type { Category } from "./schema";

// Order here is the display order in the app.
export const categories: Category[] = [
  {
    slug: "motivation-insight",
    name: "Motivation & Insight into Medicine",
    description:
      "Why medicine, why this school, and whether you understand what the job is really like — including its downsides.",
    icon: "compass",
  },
  {
    slug: "work-experience-reflection",
    name: "Work Experience & Reflection",
    description:
      "Turning what you saw and did into insight: what you learned about patients, teams and yourself.",
    icon: "notebook-pen",
  },
  {
    slug: "personal-qualities",
    name: "Personal Qualities",
    description: "Teamwork, leadership, resilience, empathy and handling failure — backed by real examples.",
    icon: "user-round-check",
  },
  {
    slug: "ethics-professionalism",
    name: "Ethics & Professionalism",
    description:
      "Autonomy, beneficence, non-maleficence and justice applied to consent, capacity, confidentiality and resources.",
    icon: "scale",
  },
  {
    slug: "nhs-current-affairs",
    name: "NHS, Values & Current Affairs",
    description:
      "How the NHS works, the values it runs on, and the debates shaping it now — inequality, workforce, reform and technology.",
    icon: "building-2",
  },
  {
    slug: "science-clinical-reasoning",
    name: "Science & Clinical Reasoning",
    description:
      "Applying school science to the body and to clinical problems, including Oxbridge-style tutorial questions.",
    icon: "flask-conical",
  },
  {
    slug: "role-play-communication",
    name: "Role-Play & Communication",
    description: "Breaking bad news, explaining clearly, calming someone upset, and listening before speaking.",
    icon: "messages-square",
  },
  {
    slug: "calculation-data",
    name: "Calculation & Data Interpretation",
    description: "Doses, rates, graphs, risk and test accuracy — calm, stepwise working out loud.",
    icon: "calculator",
  },
  {
    slug: "wildcard",
    name: "Wildcard & Curveball Questions",
    description: "Unexpected prompts that test composure, creativity and how you think under pressure.",
    icon: "sparkles",
  },
  {
    slug: "questions-for-them",
    name: "Questions You Ask Them",
    description: "Ending well: thoughtful questions for your interviewers, and what to avoid asking.",
    icon: "circle-help",
  },
];
