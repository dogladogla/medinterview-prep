import { categories } from "./categories";
import { frameworks } from "./frameworks";
import { personas } from "./personas";
import { reading } from "./reading";
import { universities } from "./universities";
import type { Question } from "./schema";
import { calculationQuestions } from "./questions/calculation";
import { communicationQuestions } from "./questions/communication";
import { ethicsQuestions } from "./questions/ethics";
import { motivationQuestions } from "./questions/motivation";
import { nhsQuestions } from "./questions/nhs";
import { personalQualitiesQuestions } from "./questions/personal-qualities";
import { scienceQuestions } from "./questions/science";
import { questionsForThemQuestions, wildcardQuestions } from "./questions/wildcard-and-closing";
import { workExperienceQuestions } from "./questions/work-experience";

/** Grouped so the seed can be applied in manageable chunks. */
export const questionGroups: Record<string, Question[]> = {
  motivation: motivationQuestions,
  "work-experience": workExperienceQuestions,
  "personal-qualities": personalQualitiesQuestions,
  ethics: ethicsQuestions,
  nhs: nhsQuestions,
  science: scienceQuestions,
  communication: communicationQuestions,
  calculation: calculationQuestions,
  "wildcard-and-closing": [...wildcardQuestions, ...questionsForThemQuestions],
};

export { categories, frameworks, personas, reading, universities };
