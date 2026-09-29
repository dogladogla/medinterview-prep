import type { University } from "./schema";

// Facts verified against official university pages on the date shown.
// Formats change year to year: re-verify each cycle (August–September).

export const universities: University[] = [
  {
    slug: "oxford",
    name: "University of Oxford",
    interviewFormats: ["oxbridge", "online", "panel"],
    overview:
      "Oxford's standard-entry Medicine course (A100) is a six-year programme with a traditional structure: three pre-clinical years grounded in the medical sciences, leading to a BA, followed by three clinical years. Teaching combines lectures and practicals with the college tutorial system, where students meet a tutor in very small groups to discuss work, defend reasoning and be questioned closely. Shortlisting for interview uses academic record and the admissions test; shortlisted applicants are interviewed by more than one college.",
    interviewFormatDetail:
      "Interviews are held online in December. Shortlisted applicants are typically interviewed at two colleges — their preferred (or allocated) college and a second one — with a mix of academic interviewers and at least one practising clinician involved across the process. Each interview resembles a short tutorial: a scientific problem, a graph or data, an unfamiliar scenario, or an ethical question explored in depth with follow-up questions. Interviewers are not looking for memorised knowledge but for how you reason with new information.",
    interviewStyleNotes:
      "Tutorial-style academic interview. Present unfamiliar scientific problems or data, expect the candidate to reason aloud from first principles, and push back with 'why?' and 'what if?' follow-ups. Reward clear reasoning, willingness to revise in response to hints and intellectual curiosity; do not reward recitation. Include some exploration of motivation and understanding of medicine, but weight towards scientific thinking.",
    whatTheyLookFor: [
      "Ability to reason logically from first principles about unfamiliar problems.",
      "Responsiveness to new information and hints — changing your mind well.",
      "Genuine intellectual curiosity about the science underlying medicine.",
      "Clear communication of your thinking as you go.",
      "Realistic understanding of medicine and the qualities it needs.",
    ],
    keyValues: [
      "Academic rigour and independent thinking",
      "Learning through dialogue (the tutorial system)",
      "Scientific enquiry as the basis of clinical practice",
    ],
    typicalQuestionThemes: [
      "Physiology 'why' questions (e.g. why organs are the shape or size they are)",
      "Interpreting graphs and experimental data",
      "Designing an experiment or spotting confounders",
      "Estimation and quantitative reasoning",
      "Ethical reasoning explored in depth",
      "Motivation and insight into a medical career",
    ],
    preparationTips: [
      "Practise explaining scientific concepts aloud to someone else, step by step.",
      "Work through unfamiliar problems where you don't know the answer, and narrate your reasoning.",
      "Read beyond the syllabus in areas that genuinely interest you — expect to be questioned on them.",
      "Get comfortable with being challenged: treat hints as collaboration, not criticism.",
      "Test your online setup (camera, sound, a quiet room, pen and paper nearby).",
    ],
    externalLinks: [
      { label: "Oxford Medicine (A100) course page", url: "https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/medicine" },
      { label: "Oxford interviews guide", url: "https://www.ox.ac.uk/admissions/undergraduate/applying-to-oxford/guide/interviews" },
      { label: "Medical Sciences Division: shortlisting and statistics", url: "https://www.medsci.ox.ac.uk/study/medicine/pre-clinical/statistics" },
    ],
    reading: ["beauchamp-childress", "montgomery-consent", "do-no-harm", "gmc-good-medical-practice"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "cambridge",
    name: "University of Cambridge",
    interviewFormats: ["oxbridge", "panel"],
    overview:
      "Cambridge's standard Medicine course is a six-year programme with three pre-clinical years of medical sciences — the third year a specialised Part II study for a BA — followed by three clinical years. Teaching combines lectures and practicals with the college supervision system, where students discuss work in very small groups. Applications are made through a college, and interviews are arranged by colleges.",
    interviewFormatDetail:
      "Most applicants have one or two interviews, usually totalling around 35 minutes to an hour, with two or three interviewers. For 2027 entry, Medicine interviews are held in person at most colleges, with exceptions depending on the college and the applicant's location. Some colleges send material to read before the interview. Interviews are subject-focused: applying scientific knowledge to new problems, discussing personal statement topics, and exploring vocational aspects of medicine.",
    interviewStyleNotes:
      "Supervision-style academic interview. Present biological or physiological problems, data or short texts, and probe the candidate's ability to apply A-level science to new situations. Ask for justifications and push assumptions. Explore motivation and understanding of medicine alongside the science. Reward curiosity, flexibility and clear reasoning.",
    whatTheyLookFor: [
      "Understanding of your subjects and readiness to study at a high academic level.",
      "Capacity for critical and independent thinking.",
      "Intellectual flexibility and enthusiasm when faced with new ideas.",
      "Motivation for medicine and awareness of its vocational demands.",
      "Ability to engage with and build on the interviewers' prompts.",
    ],
    keyValues: [
      "Academic excellence and curiosity",
      "Small-group learning (the supervision system)",
      "Scientific foundations for clinical practice",
    ],
    typicalQuestionThemes: [
      "Applying A-level biology and chemistry to physiological problems",
      "Interpreting data or a short scientific passage",
      "Topics raised in your personal statement",
      "Recent developments in science or medicine",
      "Ethical and vocational discussion",
    ],
    preparationTips: [
      "Know your personal statement thoroughly and be ready to go deeper on anything you mention.",
      "Practise applying A-level content to questions framed in unfamiliar ways.",
      "If you receive pre-interview reading, annotate it and prepare questions about it.",
      "Check your college's interview arrangements carefully — they vary.",
      "Practise thinking aloud and welcoming correction.",
    ],
    externalLinks: [
      { label: "Cambridge Medicine course page", url: "https://www.undergraduate.study.cam.ac.uk/courses/medicine-mb-bchir" },
      { label: "What to expect at your Cambridge interview", url: "https://www.undergraduate.study.cam.ac.uk/apply/after/cambridge-interviews" },
    ],
    reading: ["beauchamp-childress", "when-breath-becomes-air", "being-mortal", "gmc-good-medical-practice"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "imperial",
    name: "Imperial College London",
    interviewFormats: ["mmi"],
    overview:
      "Imperial's MBBS/BSc Medicine (A100) is a six-year course with an integrated BSc, reflecting the school's strong emphasis on research and science. Clinical placements are based across a large network of London hospitals and community settings, giving exposure to a diverse urban population. Interview performance carries considerable weight in offer decisions.",
    interviewFormatDetail:
      "For 2026 entry Imperial used a six-station multiple mini-interview (MMI), held in person. Stations assessed teamwork and leadership, motivation to study medicine, understanding of the role of a doctor, empathy and breaking bad news, ethics scenarios, and data interpretation. Each station was scored for content (out of 6) and communication (out of 4), and combined scores were compared against thresholds to decide offers.",
    interviewStyleNotes:
      "Structured MMI station. Keep to the station brief, one scenario at a time, with a neutral, professional manner. Assess both content and communication — structure, clarity, empathy and responsiveness. Include realistic data or scenario details and one or two focused follow-up questions. Do not give feedback during the station.",
    whatTheyLookFor: [
      "Insight into the doctor's role and the realities of a medical career.",
      "Teamwork and leadership shown through reflective examples.",
      "Empathy and skilled communication, including delivering bad news.",
      "Sound ethical reasoning.",
      "Accurate, calm interpretation of data.",
    ],
    keyValues: [
      "Science and research-led medicine",
      "Teamwork and leadership",
      "Communication and empathy",
    ],
    typicalQuestionThemes: [
      "Why medicine and understanding of the doctor's role",
      "Teamwork and leadership examples",
      "Breaking bad news role-play",
      "Ethics scenarios",
      "Data interpretation (graphs, tables, simple statistics)",
    ],
    preparationTips: [
      "Practise each station type under timed conditions.",
      "Prepare two or three flexible teamwork and leadership examples you can adapt.",
      "Rehearse breaking bad news with a friend playing the actor.",
      "Practise reading graphs aloud: describe, quantify, explain, caveat.",
      "Remember communication is scored separately — structure and clarity count.",
    ],
    externalLinks: [
      { label: "Imperial Medicine MBBS/BSc", url: "https://www.imperial.ac.uk/study/courses/undergraduate/medicine/" },
      { label: "Imperial A100 admissions FAQs (2026)", url: "https://www.imperial.ac.uk/media/imperial-college/medicine/study/undergraduate/A100-FOI-FAQs-2026--v2.pdf" },
    ],
    reading: ["gmc-good-medical-practice", "nhs-constitution", "gmc-decision-making-consent", "marmot-review"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "manchester",
    name: "University of Manchester",
    interviewFormats: ["mmi", "online"],
    overview:
      "Manchester's MBChB is one of the largest medical programmes in the UK. Learning is organised around clinical cases in small groups from early in the course, with clinical placements across Greater Manchester and the North West, serving a diverse population with significant health inequalities. The school has a strong commitment to widening participation.",
    interviewFormatDetail:
      "Manchester uses a multiple mini-interview of five stations, each eight minutes long with a two-minute gap between stations. Candidates choose to attend in person or online via Zoom; both are assessed in exactly the same way. Topics may include communication skills, motivation for medicine, caring experience, contemporary issues in medicine and ethical reasoning. For the 2026–27 cycle, Manchester has said it may replace one station with a group task, and applicants will be told if this applies.",
    interviewStyleNotes:
      "Structured MMI station, eight minutes. Warm but neutral. Focus on communication, motivation, caring experience, contemporary medical issues and ethics. Encourage the candidate to speak naturally rather than deliver a rehearsed monologue; ask follow-ups that test genuine understanding. Reflect Manchester's emphasis on patient-centred care and awareness of health inequalities.",
    whatTheyLookFor: [
      "Natural, clear communication rather than rehearsed answers.",
      "Genuine motivation grounded in experience.",
      "Reflection on caring or volunteering experience.",
      "Awareness of contemporary issues in medicine.",
      "Balanced ethical reasoning.",
    ],
    keyValues: [
      "Patient-centred care",
      "Learning through clinical cases and small groups",
      "Widening participation and tackling health inequalities",
    ],
    typicalQuestionThemes: [
      "Motivation and understanding of a medical career",
      "Caring and volunteering experience",
      "Communication and role-play",
      "Current issues in the NHS",
      "Ethical scenarios",
    ],
    preparationTips: [
      "Manchester advises being yourself and avoiding over-rehearsed, coached answers.",
      "Prepare talking points rather than scripts.",
      "Reflect on what caring experience taught you about patients and yourself.",
      "Keep up with current NHS issues and be ready to discuss them fairly.",
      "If online: charged device, quiet private room, and tested connection.",
    ],
    externalLinks: [
      { label: "Manchester MBChB interviews", url: "https://www.bmh.manchester.ac.uk/study/medicine/apply/interviews/" },
      { label: "Manchester interview day structure", url: "https://www.bmh.manchester.ac.uk/study/medicine/interviews/structure/" },
      { label: "Medical Schools Council: resources for applicants", url: "https://www.medschools.ac.uk/for-students/further-support-with-your-application/resources-for-teachers-and-students/" },
    ],
    reading: ["marmot-review", "nhs-constitution", "gmc-good-medical-practice", "being-mortal"],
    lastVerified: "2026-09-29",
  },
];
