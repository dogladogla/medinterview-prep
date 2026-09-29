import type { Framework } from "./schema";

export const frameworks: Framework[] = [
  // ---------------------------------------------------------------- ETHICS
  {
    slug: "four-pillars",
    name: "The Four Pillars of Medical Ethics",
    category: "ethics",
    summary:
      "Four principles — autonomy, beneficence, non-maleficence and justice — that give you a shared vocabulary for weighing up any ethical scenario. They are lenses, not a checklist: the skill is spotting where they pull against each other and explaining which should carry more weight here, and why.",
    whenToUse:
      "Any ethics station or panel question: consent and refusal, confidentiality, resource allocation, end-of-life care, public-health measures. Use the pillars to organise your thinking, then move quickly to the specifics of the case — interviewers want applied reasoning, not definitions.",
    steps: [
      {
        title: "Autonomy",
        detail:
          "Respect a capable person's right to make informed decisions about their own body and care — including decisions others think unwise. Ask: does this person have capacity for this decision? Have they been given the information that matters to them? Are they free from pressure?",
      },
      {
        title: "Beneficence",
        detail:
          "Act in the patient's best interests. 'Best interests' is wider than the medically optimal option: it includes the person's values, wishes and quality of life as they see it.",
      },
      {
        title: "Non-maleficence",
        detail:
          "Avoid causing harm, or harm that is disproportionate to the benefit. Almost every intervention carries risk, so the real question is whether the balance of benefit to harm is acceptable — and acceptable to whom.",
      },
      {
        title: "Justice",
        detail:
          "Treat people fairly and distribute limited resources equitably. Consider fairness to other patients, to society (e.g. infection risk, public money) and whether the decision would be consistent if applied to everyone in the same situation.",
      },
      {
        title: "Weigh the tension and conclude",
        detail:
          "Name which pillars conflict (e.g. autonomy vs beneficence), say which you think should carry more weight in this case and why, and reach a reasoned, provisional conclusion. Acknowledge what would change your mind.",
      },
    ],
    workedExample:
      "An adult Jehovah's Witness with capacity refuses a blood transfusion after a haemorrhage. Autonomy is central: a capable adult may refuse any treatment, even life-saving treatment, so long as the decision is informed and voluntary. Beneficence pulls the other way — transfusion would likely save their life — and non-maleficence reminds us that forcing treatment on a capable adult is itself a serious harm (and assault). Justice is less central, though we should offer every acceptable alternative (cell salvage, iron, erythropoietin) as we would for anyone. The balance favours respecting the refusal, after confirming capacity, checking the decision is their own and free from pressure, and making sure they understand the consequences.",
    workedExampleQuestion: "jehovahs-witness-refuses-blood",
    commonMistakes: [
      "Reciting the four definitions and stopping — the marks are in applying them to the case.",
      "Treating the pillars as equal votes to count up rather than weighing them.",
      "Forgetting capacity: autonomy only carries full weight if the person has capacity for that decision.",
      "Ignoring the law and GMC guidance, which usually settle the question in UK practice.",
    ],
  },
  {
    slug: "ethical-dilemma-structure",
    name: "Ethical Dilemma Structure (IPSOJ)",
    category: "ethics",
    summary:
      "A five-step route through any ethical scenario: Identify the dilemma, apply Principles, consider Stakeholders, lay out Options, then Justify a decision. It turns a sprawling scenario into a calm, structured answer that sounds like a doctor thinking, not a student panicking.",
    whenToUse:
      "MMI ethics stations and 'what would you do?' scenarios — especially practical ones where you, as a student or junior doctor, must act (a colleague smelling of alcohol, a patient still driving against advice). Pairs naturally with the Four Pillars in the Principles step.",
    steps: [
      {
        title: "Identify",
        detail:
          "State the core conflict in one sentence and clarify facts you would want to know. 'The dilemma is between respecting this patient's confidentiality and protecting other road users.' Asking a clarifying question here is a strength, not a weakness.",
      },
      {
        title: "Principles",
        detail:
          "Apply the relevant pillars plus law and professional guidance (GMC, Mental Capacity Act, safeguarding duties). Name the tension explicitly.",
      },
      {
        title: "Stakeholders",
        detail:
          "Who is affected? The patient, family, colleagues, other patients, the public, the wider trust in the profession. Consider each person's perspective, including the one you disagree with.",
      },
      {
        title: "Options",
        detail:
          "Lay out a range from least to most interventionist. Usually the first step is to talk to the person, explore their reasons and seek senior advice — escalation is rarely the opening move, but it must be on the list.",
      },
      {
        title: "Justify",
        detail:
          "Choose a course of action, explain why it best balances the principles, say what you would do if the first step failed, and note that you would document and seek senior support.",
      },
    ],
    workedExample:
      "A patient with newly diagnosed epilepsy tells you he is still driving to work. Identify: confidentiality versus the safety of the public. Principles: autonomy and confidentiality matter, but confidentiality is not absolute — GMC guidance allows disclosure in the public interest where there is a risk of death or serious harm. Stakeholders: the patient (his job, independence), other road users, his family, trust in doctors. Options: explain the risk and his legal duty to inform the DVLA; explore why he is still driving and help with alternatives; involve family if he agrees; if he continues, tell him you intend to inform the DVLA, then do so, and document. Justify: persuasion first respects his autonomy and preserves trust; disclosure is a proportionate last resort because the potential harm to others is serious.",
    workedExampleQuestion: "epilepsy-patient-still-driving",
    commonMistakes: [
      "Jumping straight to the most drastic option ('I'd report them') without first talking to the person.",
      "Staying on the fence — you must reach a decision, even if provisional.",
      "Forgetting to mention escalation to a senior and documentation.",
      "Presenting options without saying which one you would choose and why.",
    ],
  },
  // ---------------------------------------------------------------- STRUCTURE
  {
    slug: "why-medicine-meif",
    name: "Why Medicine: Motivation → Evidence → Insight → Fit",
    category: "structure",
    summary:
      "A four-part structure for 'Why medicine?' and 'Why this school?' that moves you beyond 'I want to help people' by grounding motivation in specific experience, showing a realistic understanding of the job, and linking it to who you are.",
    whenToUse:
      "Motivation questions: why medicine, why not nursing or research, why this university, what you would bring, where you see yourself. Keep it to about 90 seconds unless invited to go deeper.",
    steps: [
      {
        title: "Motivation",
        detail:
          "One or two genuine drivers, stated specifically: the combination of science and people, the responsibility of decision-making under uncertainty, the long-term relationship with patients. Avoid clichés unless you immediately make them concrete.",
      },
      {
        title: "Evidence",
        detail:
          "A specific moment that tested or confirmed that motivation — something you saw, did or read. One vivid example beats a list of placements.",
      },
      {
        title: "Insight",
        detail:
          "Show you understand the reality: the demands, uncertainty, emotional load, and what distinguishes the doctor's role from others in the team. Mentioning the downsides — and why you still want it — is what makes an answer credible.",
      },
      {
        title: "Fit",
        detail:
          "Connect it to you: qualities you have shown that suit the work, and (for 'why this school') specific features of the course that suit how you learn. End on a forward-looking line.",
      },
    ],
    workedExample:
      "Motivation: 'I'm drawn to medicine because it combines scientific problem-solving with responsibility for real people.' Evidence: 'Shadowing on a stroke ward, I watched a registrar explain to a family why their father could not safely swallow — the science was the easy part; the conversation was the skill.' Insight: 'I also saw the pressure: a busy list, an unsettled family, a decision made with incomplete information. That didn't put me off, but it made clear the job is about judgement under uncertainty, not just knowing things.' Fit: 'Running a weekly homework club taught me I enjoy explaining things patiently and adapting to the person in front of me, which is why this path suits me.'",
    workedExampleQuestion: "why-medicine",
    commonMistakes: [
      "Opening with 'I've always wanted to be a doctor' or a family story with no reflection.",
      "Listing work experience instead of drawing one insight from it.",
      "Describing reasons that apply equally to nursing, physiotherapy or pharmacy without saying why doctor specifically.",
      "Sounding rehearsed — memorise the structure and examples, not the sentences.",
    ],
  },
  {
    slug: "star",
    name: "STAR (Situation, Task, Action, Result) + Reflection",
    category: "structure",
    summary:
      "The standard structure for 'Tell me about a time when…' questions. Set the scene briefly, focus most of your time on what you personally did, give the outcome, then add the step most candidates forget — what you learned and how it will shape you as a doctor.",
    whenToUse:
      "Any question asking for an example of a personal quality: teamwork, leadership, resilience, conflict, making a mistake, managing time, showing empathy. Aim for roughly 20% situation and task, 50% action, 30% result and reflection.",
    steps: [
      {
        title: "Situation",
        detail: "Two sentences of context: where, when, who. Enough for the interviewer to picture it, no more.",
      },
      {
        title: "Task",
        detail: "What needed to happen and what your specific responsibility was. Make the challenge clear.",
      },
      {
        title: "Action",
        detail:
          "What you did, in the first person, step by step, including why you chose that approach. This is where the quality they asked about must be visible.",
      },
      {
        title: "Result",
        detail: "What happened — ideally with something concrete. Honest partial successes are fine and often more convincing.",
      },
      {
        title: "Reflection (the +R)",
        detail:
          "What you learned, what you would do differently, and how it applies to medicine. This turns an anecdote into evidence of insight.",
      },
    ],
    workedExample:
      "Situation: 'Our Young Enterprise team had three weeks to launch a product, and two members had stopped coming to meetings.' Task: 'As finance lead, I needed a costed plan, but I also cared that the team didn't fracture.' Action: 'Rather than complaining to our teacher, I messaged each of them separately and found one was overwhelmed with coursework and the other felt her ideas were ignored. I suggested we split tasks by preference and set a short weekly check-in.' Result: 'Both re-engaged, and we launched on time and made a small profit.' Reflection: 'I learned that disengagement often has a reason worth asking about — something I expect to matter in multidisciplinary teams, where assuming the worst about a colleague rarely helps a patient.'",
    workedExampleQuestion: "teamwork-example",
    commonMistakes: [
      "Spending most of the answer on the situation and little on your actions.",
      "Saying 'we' throughout so your own contribution is invisible.",
      "Choosing an example where everything went perfectly and nothing was learned.",
      "Omitting the reflection — the part that shows insight.",
    ],
  },
  {
    slug: "data-interpretation-dqec",
    name: "Data Stations: Describe → Quantify → Explain → Caveat",
    category: "structure",
    summary:
      "A calm four-step approach for any graph, table or study you are handed. Read it accurately before interpreting it, put numbers on the trend, suggest explanations, then show scientific maturity by naming the limitations.",
    whenToUse:
      "Data interpretation stations, Oxbridge interviews with a graph, 'what does this study show?' questions and critical-appraisal prompts.",
    steps: [
      {
        title: "Describe",
        detail:
          "Say what the figure shows: axes, units, groups, time period, source. 'This graph shows the percentage of two-year-olds vaccinated in England each year from 2010 to 2024.' This alone prevents most errors.",
      },
      {
        title: "Quantify",
        detail:
          "State the main trend with numbers: peaks, falls, differences, rates of change. Do simple arithmetic aloud and round sensibly.",
      },
      {
        title: "Explain",
        detail:
          "Offer two or three plausible explanations, flagged as hypotheses. Think across biology, behaviour, services and measurement.",
      },
      {
        title: "Caveat",
        detail:
          "Name limitations: correlation vs causation, confounders, sample size, missing data, how the variable was measured, whether the scale is misleading. Say what further data you would want.",
      },
    ],
    workedExample:
      "'The graph shows uptake of a childhood vaccine falling from about 93% to 89% over ten years (Describe/Quantify). That four-point drop matters because herd immunity for measles needs roughly 95%. Possible explanations include vaccine hesitancy after misinformation, reduced access to primary care, or changes in how uptake is recorded (Explain). But the graph shows national averages, which can hide much lower uptake in particular areas, and it can't tell us why people didn't vaccinate — I'd want regional breakdowns and survey data (Caveat).'",
    workedExampleQuestion: "vaccination-uptake-graph",
    commonMistakes: [
      "Interpreting before reading the axes — misreading the units or scale.",
      "Stating a cause as fact from correlational data.",
      "Freezing on arithmetic instead of estimating aloud and refining.",
      "Forgetting to say what additional information would help.",
    ],
  },
  {
    slug: "balanced-argument",
    name: "Balanced Argument: Position → For → Against → Weigh → Conclude",
    category: "structure",
    summary:
      "A structure for opinion and current-affairs questions ('Should…?', 'Is it ever right to…?'). It shows you can see more than one side, weigh evidence and still commit to a view — the core of professional judgement.",
    whenToUse:
      "Policy and debate questions: doctors striking, sugar taxes, opt-out organ donation, assisted dying, AI in the NHS, treating self-inflicted illness.",
    steps: [
      {
        title: "Position (provisional)",
        detail: "Frame the question and signal you will consider both sides. Define any loaded terms.",
      },
      {
        title: "For",
        detail: "The strongest arguments in favour, with evidence or examples where you have them.",
      },
      {
        title: "Against",
        detail: "The strongest arguments against — steelman them. Interviewers are testing fairness to views you do not hold.",
      },
      {
        title: "Weigh",
        detail: "Which considerations matter most and why? What evidence would change the balance?",
      },
      {
        title: "Conclude",
        detail:
          "Commit to a nuanced view, acknowledging the strongest counter-argument. On contested moral questions it is fine to say where you lean while respecting that reasonable people disagree.",
      },
    ],
    workedExample:
      "'Should doctors be allowed to strike?' — For: doctors are employees with the same rights as others; industrial action can be the only lever when pay and conditions threaten recruitment and, ultimately, patient safety. Against: patients may be harmed by cancelled care, trust may suffer, and the duty of care is unusual. Weigh: much depends on safeguards — emergency cover maintained, notice given so care can be re-planned. Conclude: 'I think a right to strike is justifiable if patient safety is protected through agreed emergency cover, but it should be a last resort, and doctors must be honest about the harms of disruption.'",
    workedExampleQuestion: "should-doctors-strike",
    commonMistakes: [
      "Arguing only one side.",
      "Refusing to conclude ('it's complicated').",
      "Presenting contested statistics with false precision.",
      "Letting personal politics colour the answer — stay evidence-led and respectful.",
    ],
  },
  {
    slug: "thinking-aloud",
    name: "Thinking Aloud (Oxbridge): Clarify → Assume → Reason → Check → Conclude",
    category: "structure",
    summary:
      "For unfamiliar science problems, estimation questions and tutorial-style interviews. The interviewer cares far more about how you reason than whether you reach the 'right' answer, so make every step audible and welcome hints.",
    whenToUse:
      "Oxford and Cambridge interviews, 'why?' science questions, estimation problems and any question you have not seen before.",
    steps: [
      {
        title: "Clarify",
        detail:
          "Restate the problem in your own words and ask what is allowed. 'So we're asking why this happens, not just what happens?'",
      },
      {
        title: "Assume",
        detail: "State simplifying assumptions and starting facts you are confident of. Round numbers for estimates.",
      },
      {
        title: "Reason",
        detail:
          "Work step by step, linking to principles you know (surface area to volume, diffusion, feedback loops, evolution). Say what you are unsure of.",
      },
      {
        title: "Check",
        detail:
          "Sanity-check the result: is the order of magnitude plausible? Does it agree with something you know? Test it against an edge case.",
      },
      {
        title: "Conclude and extend",
        detail:
          "Give an answer, name the weakest assumption, and suggest how you would test or refine it. If the interviewer challenges you, engage with the hint rather than defending the first idea.",
      },
    ],
    workedExample:
      "'How many times does your heart beat in a lifetime?' — Clarify: an average person, resting and active. Assume: about 70 beats per minute on average, and a lifespan of about 80 years. Reason: 70 × 60 = 4,200 per hour; × 24 ≈ 100,000 per day; × 365 ≈ 37 million per year; × 80 ≈ 3 billion. Check: heart rate is faster in infancy and during exercise and slower in sleep, which roughly cancel, so 'a few billion' is the right order of magnitude. Conclude: about 3 billion — and I could refine it using age-specific average heart rates.",
    workedExampleQuestion: "estimate-heartbeats-lifetime",
    commonMistakes: [
      "Silence while you think — say what you are considering, even if tentative.",
      "Clinging to your first answer when the interviewer offers a hint.",
      "False precision: 2,943,360,000 sounds less thoughtful than 'about 3 billion'.",
      "Saying 'I haven't studied that' instead of reasoning from what you do know.",
    ],
  },
  // ---------------------------------------------------------------- REFLECTION
  {
    slug: "what-so-what-now-what",
    name: "Reflection: What? → So what? → Now what?",
    category: "reflection",
    summary:
      "A simple three-question reflective model (associated with Rolfe and colleagues) that turns an experience into learning. Describe briefly what happened, analyse why it mattered, and say what you will do differently. Medical schools value it because reflection is a lifelong professional requirement.",
    whenToUse:
      "Work experience, volunteering, observed events and 'what did you learn?' questions. Faster than Gibbs and ideal for a two-minute answer.",
    steps: [
      {
        title: "What?",
        detail: "What happened, briefly and specifically. What did you see, hear or do? Keep patient details anonymous.",
      },
      {
        title: "So what?",
        detail:
          "Why did it matter? What did it show you about patients, doctors, teams or yourself? Link to values (dignity, communication, teamwork) and, if relevant, to the realities of healthcare.",
      },
      {
        title: "Now what?",
        detail:
          "What will you do differently or carry forward? How will it shape how you practise, study or behave? Make it concrete.",
      },
    ],
    workedExample:
      "What: 'In a care home, I saw a carer take ten minutes to help a resident with dementia choose her own clothes, even though it would have been faster to choose for her.' So what: 'It showed me that dignity is protected in small choices, and that efficiency and good care can pull in different directions.' Now what: 'When I'm under time pressure, I want to keep asking which small decisions I can leave with the patient — and I've started doing that in my volunteering.'",
    workedExampleQuestion: "work-experience-what-did-you-learn",
    commonMistakes: [
      "Spending the whole answer on 'What?' — describing, not reflecting.",
      "Generic lessons ('communication is important') with no specific link to what you saw.",
      "Breaching confidentiality with identifiable details.",
      "Claiming clinical insight beyond what a student could observe.",
    ],
  },
  {
    slug: "gibbs-reflective-cycle",
    name: "Gibbs' Reflective Cycle",
    category: "reflection",
    summary:
      "A six-stage cycle (Gibbs, 1988): Description, Feelings, Evaluation, Analysis, Conclusion, Action plan. Longer than What/So what/Now what, it is especially good for mistakes and emotionally significant events because it makes you name feelings and judge what went well and badly.",
    whenToUse:
      "'Tell me about a mistake you made', 'a time you failed', 'something that upset you on work experience', or any question where acknowledging emotion strengthens the answer.",
    steps: [
      { title: "Description", detail: "What happened? Keep it short and factual." },
      {
        title: "Feelings",
        detail: "What were you thinking and feeling at the time? Honesty here signals maturity and self-awareness.",
      },
      { title: "Evaluation", detail: "What went well and what went badly? Be balanced." },
      {
        title: "Analysis",
        detail: "Why did it happen? What factors — yours, others', the system's — contributed?",
      },
      { title: "Conclusion", detail: "What else could you have done? What have you learned?" },
      {
        title: "Action plan",
        detail: "What will you do next time, and what have you already changed? Evidence of change is powerful.",
      },
    ],
    workedExample:
      "Description: 'I missed the deadline for a chemistry coursework draft because I'd agreed to cover extra shifts at work.' Feelings: 'I felt embarrassed, and at first defensive.' Evaluation: 'I did tell my teacher before the deadline, which helped, but I'd said yes to too much.' Analysis: 'I struggle to say no, and I hadn't mapped out my commitments.' Conclusion: 'Saying yes to everything isn't reliability — it risks letting people down.' Action plan: 'I now plan my week on Sunday and check new commitments against it. Since then I haven't missed a deadline, and I've learned to say \"not this week\".'",
    workedExampleQuestion: "tell-me-about-a-mistake",
    commonMistakes: [
      "Choosing a 'mistake' that is really a strength ('I work too hard').",
      "Blaming others entirely in the Analysis stage.",
      "Skipping Feelings — it is where insight often comes from.",
      "An action plan with no evidence it has been put into practice.",
    ],
  },
  // ---------------------------------------------------------------- COMMUNICATION
  {
    slug: "spikes",
    name: "SPIKES: Breaking Bad News",
    category: "communication",
    summary:
      "A six-step protocol (Baile and colleagues, 2000) for delivering difficult news: Setting, Perception, Invitation, Knowledge, Emotions (with Empathy), Strategy and Summary. In MMI role-plays the 'bad news' is usually non-clinical — a lost item, a cancelled event, a pet — but the skills are the same.",
    whenToUse:
      "Any role-play where you must share upsetting information, admit a mistake to someone, or deliver a disappointing decision.",
    steps: [
      {
        title: "Setting",
        detail:
          "Create privacy, sit down, make eye contact, check it's a good time and minimise interruptions. Introduce yourself.",
      },
      {
        title: "Perception",
        detail:
          "Find out what they already know or suspect. 'What have you heard so far?' This lets you start where they are.",
      },
      {
        title: "Invitation",
        detail: "Ask how much they want to know and signal that difficult news is coming: 'I'm afraid I have some bad news.'",
      },
      {
        title: "Knowledge",
        detail:
          "Give the information in small, plain-language chunks. Pause. Avoid jargon and euphemism. Check understanding.",
      },
      {
        title: "Emotions and Empathy",
        detail:
          "Notice and name the emotion, allow silence, and respond empathically: 'I can see this is a real shock.' Don't rush to fix or reassure falsely.",
      },
      {
        title: "Strategy and Summary",
        detail:
          "Agree next steps together, offer support, summarise, and check what else they need. If you were at fault, apologise sincerely and say what you will do to put it right.",
      },
    ],
    workedExample:
      "In a station where you must tell a friend that you lost the laptop they lent you: Setting — 'Have you got a minute to sit down? I need to talk to you about something.' Perception — 'You know I borrowed your laptop for the weekend…' Invitation — 'I'm really sorry, but I've got bad news about it.' Knowledge — 'I left it on the train on Saturday. I've reported it to lost property, but it hasn't been handed in.' Emotions — pause; 'I can see you're angry, and you have every right to be.' Strategy — 'I want to make this right. I'll pay for a replacement, and let's work out what you need for your coursework this week.'",
    workedExampleQuestion: "role-play-lost-laptop",
    commonMistakes: [
      "Blurting the news in the first sentence with no warning shot.",
      "Filling every silence — the other person needs time to react.",
      "False reassurance ('it'll be fine') or defensive excuses.",
      "Not agreeing a concrete next step before the station ends.",
    ],
  },
  {
    slug: "ice",
    name: "ICE: Ideas, Concerns, Expectations",
    category: "communication",
    summary:
      "Three questions at the heart of patient-centred consultations: what does the person think is going on (Ideas), what are they worried about (Concerns), and what do they hope will happen (Expectations)? Exploring ICE turns a stand-off into shared decision-making.",
    whenToUse:
      "Role-plays involving someone reluctant, refusing, confused or demanding — a patient who won't take medication, a parent wanting antibiotics, a friend who won't seek help. Also useful in any consultation-style station.",
    steps: [
      {
        title: "Open and listen",
        detail: "Start with an open question and let them talk without interrupting for the first minute.",
      },
      {
        title: "Ideas",
        detail: "'What do you think might be causing this?' / 'What have you heard about this medicine?'",
      },
      {
        title: "Concerns",
        detail: "'Is there anything in particular that's worrying you about it?' — often the real barrier is here.",
      },
      {
        title: "Expectations",
        detail: "'What were you hoping would happen today?' Clarify what is realistic.",
      },
      {
        title: "Respond and share the decision",
        detail:
          "Address the specific concern with honest information, offer options, respect their choice if they have capacity, and agree a plan including a safety net.",
      },
    ],
    workedExample:
      "A patient has stopped taking blood-pressure tablets. Ideas: 'What made you decide to stop them?' — 'I feel fine, so I don't think I need them.' Concerns: 'Is anything worrying you about the tablets?' — 'My friend said they damage your kidneys.' Expectations: 'What would you like to happen?' — 'I'd rather manage it with diet.' Response: explain that high blood pressure usually has no symptoms, address the kidney worry honestly, welcome the diet plan as part of treatment, and agree a trial with a follow-up blood pressure check.",
    workedExampleQuestion: "role-play-patient-stopped-medication",
    commonMistakes: [
      "Lecturing before listening.",
      "Asking ICE questions as a checklist without responding to the answers.",
      "Treating a capable person's disagreement as something to overcome rather than understand.",
      "Forgetting to agree a plan and safety net.",
    ],
  },
  {
    slug: "chunk-and-check",
    name: "Explaining Clearly: Chunk and Check",
    category: "communication",
    summary:
      "A method for explaining anything — a condition, a procedure, a task — to someone without your background: find out what they know, give one small chunk in plain language, check understanding, then build. Analogies and 'teach-back' do the heavy lifting.",
    whenToUse:
      "Explaining stations ('Explain to a patient what asthma is', 'Explain how to tie a shoelace'), talking to children, and any time an interviewer asks you to explain a concept simply.",
    steps: [
      {
        title: "Start where they are",
        detail: "'What do you already know about…?' Adjust your level and avoid repeating what they know.",
      },
      {
        title: "Signpost",
        detail: "'I'll explain what's happening in the lungs, then how the inhaler helps.'",
      },
      {
        title: "Chunk",
        detail: "One idea at a time, in plain words, with a relatable analogy. Short sentences.",
      },
      {
        title: "Check (teach-back)",
        detail:
          "'Just so I know I've explained it well, could you tell me in your own words…?' This checks your explanation, not their intelligence.",
      },
      {
        title: "Summarise and invite questions",
        detail: "Recap the two or three key points and ask what else they would like to know. Offer written information.",
      },
    ],
    workedExample:
      "'Asthma affects the tubes that carry air into your lungs. In asthma they're more sensitive, so things like pollen or cold air can make them tighten and swell — a bit like breathing through a narrow straw. [Check] Does that make sense so far? The blue inhaler relaxes the muscles around the tubes quickly, so it's for when you feel tight. The brown one calms the swelling over time, so it only works if you take it every day, even when you feel well. [Teach-back] Could you tell me which one you'd use if you felt wheezy at football?'",
    workedExampleQuestion: "explain-asthma-inhaler",
    commonMistakes: [
      "Jargon ('bronchoconstriction', 'inflammation') without translation.",
      "Asking 'Does that make sense?' and moving on — use teach-back instead.",
      "Delivering everything in one monologue.",
      "Talking down to the person.",
    ],
  },
  {
    slug: "de-escalation",
    name: "De-escalation: Listen → Acknowledge → Apologise → Explain → Agree",
    category: "communication",
    summary:
      "A calm sequence for someone who is angry or upset. Anger usually sits on top of fear, feeling ignored or powerlessness, so the first job is to let them be heard. Only then can you explain, and together agree what happens next.",
    whenToUse:
      "Role-plays with an angry relative, frustrated patient, upset colleague or complaining customer; also questions about handling conflict.",
    steps: [
      {
        title: "Listen",
        detail: "Let them speak without interrupting. Keep an open posture and a calm, low voice. Stay safe.",
      },
      {
        title: "Acknowledge",
        detail: "Name the emotion and its reason: 'You've been waiting four hours with your mum in pain — I can see why you're angry.'",
      },
      {
        title: "Apologise",
        detail:
          "Apologise for their experience without blaming colleagues or admitting to facts you don't know: 'I'm sorry it's been this difficult.'",
      },
      {
        title: "Explain",
        detail: "Give honest information about what is happening and why, in plain language. Don't make promises you can't keep.",
      },
      {
        title: "Agree next steps",
        detail:
          "Offer something concrete you can do now, involve a senior if needed, and let them know how to raise a formal complaint if they wish.",
      },
    ],
    workedExample:
      "Relative: 'This is a joke — nobody has even looked at him!' — Listen fully. Acknowledge: 'You've been here since the morning and you're worried nobody's taking your dad's pain seriously.' Apologise: 'I'm really sorry the wait has been so long.' Explain: 'The department is very busy and patients are seen in order of urgency, which I know is frustrating when it's your dad.' Agree: 'Let me ask the nurse in charge to reassess his pain now and find out roughly how long it will be. I'll come back to you within fifteen minutes either way.'",
    workedExampleQuestion: "role-play-angry-relative",
    commonMistakes: [
      "Defending the system before acknowledging the emotion.",
      "Blaming colleagues ('the nurses are useless today').",
      "Mirroring raised volume or crossing arms.",
      "Promising outcomes you cannot control ('he'll be seen in five minutes').",
    ],
  },
];
