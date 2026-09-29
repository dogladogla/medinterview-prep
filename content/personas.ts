import type { Persona } from "./schema";

// Metadata only. The system prompts themselves live in /lib/ai/prompts/interviewer
// (added in M6) and are looked up by `promptKey`.

export const personas: Persona[] = [
  {
    slug: "dr-warm",
    name: "Dr Warm",
    style: "warm",
    description:
      "Friendly and encouraging. Puts you at ease and gives gentle, supportive reactions — a good place to start and build confidence.",
    followUpStyle:
      "Open, encouraging follow-ups that invite you to expand ('Tell me more about that — what did you notice?').",
    promptKey: "warm-v1",
  },
  {
    slug: "dr-neutral",
    name: "Dr Neutral",
    style: "neutral",
    description:
      "Professional and impassive, like a real MMI assessor. Gives no feedback during the interview, so you practise performing without reassurance.",
    followUpStyle: "Brief, scripted follow-ups that probe depth without signalling whether you are right.",
    promptKey: "neutral-v1",
    affinityUniversity: "imperial",
  },
  {
    slug: "dr-probing",
    name: "Dr Probing",
    style: "probing",
    description:
      "Challenges every answer, Oxbridge-style. Pushes your assumptions and asks 'why?' repeatedly to test how you reason under pressure — never unkind, always rigorous.",
    followUpStyle:
      "Persistent 'why?', 'what if?' and 'are you sure?' questions; offers counter-examples and hints to see if you can adapt.",
    promptKey: "probing-v1",
    affinityUniversity: "oxford",
  },
  {
    slug: "dr-clinical",
    name: "Dr Clinical",
    style: "clinical",
    description:
      "Science-heavy. Focuses on applying biology and chemistry to the body and to clinical problems, following up on the reasoning behind each step.",
    followUpStyle: "Follow-ups that drill into mechanisms: 'What's happening at the cellular level?', 'How would you test that?'",
    promptKey: "clinical-v1",
    affinityUniversity: "cambridge",
  },
];
