import type { Reading } from "./schema";

// All summaries are original paraphrase. `lastVerified` marks when facts
// (editions, legal status) were last checked; review items older than a year.

export const reading: Reading[] = [
  // ---------------------------------------------------------------- GMC / REGULATION
  {
    slug: "gmc-good-medical-practice",
    title: "Good Medical Practice (2024)",
    sourceType: "gmc",
    author: "General Medical Council",
    url: "https://www.gmc-uk.org/professional-standards/the-professional-standards/good-medical-practice",
    editionNote: "Current edition in force since 30 January 2024; replaced the 2013 version.",
    summary:
      "Good Medical Practice is the core statement of what the General Medical Council expects of every doctor registered in the UK. The 2024 edition is organised into four domains: knowledge, skills and development; patients, partnership and communication; colleagues, culture and safety; and trust and professionalism. Compared with the previous version, it places more weight on the culture doctors create around them — treating colleagues with respect, challenging and reporting bullying, harassment and discrimination, and supporting a fair and inclusive workplace. It strengthens expectations around partnership with patients, including sharing information in a way people can understand and supporting them to make decisions. It also asks doctors to be honest when things go wrong, to protect patient data, to look after their own health, and to work within the limits of their competence. The standards are written as professional duties rather than legal rules, but serious or persistent failure to follow them can put a doctor's registration at risk.",
    whyItMatters:
      "Interviewers expect applicants to know that medicine is a regulated profession with explicit standards. Referring accurately to GMP shows you understand the doctor's role goes beyond clinical knowledge.",
    keyTakeaways: [
      "Four domains: knowledge and skills; patients and partnership; colleagues, culture and safety; trust and professionalism.",
      "Doctors are responsible for the workplace culture they help create, not just their own clinical work.",
      "Honesty and openness when things go wrong is a professional duty.",
      "Patients are partners in decisions, not passive recipients of care.",
      "Doctors must recognise and work within the limits of their competence and look after their own wellbeing.",
    ],
    howToUseIt:
      "Cite a domain when discussing professionalism, teamwork, honesty or a colleague's poor behaviour — e.g. 'GMP expects doctors to act on concerns about a colleague's conduct because patient safety comes first.'",
    difficulty: 2,
    categories: ["ethics-professionalism", "motivation-insight", "nhs-current-affairs"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "gmc-decision-making-consent",
    title: "Decision Making and Consent",
    sourceType: "gmc",
    author: "General Medical Council",
    url: "https://www.gmc-uk.org/professional-standards/the-professional-standards/decision-making-and-consent",
    editionNote: "In force since 9 November 2020.",
    summary:
      "This GMC guidance sets out how doctors should support patients to make decisions about their care. It is built around seven principles, the heart of which is that decision-making is a dialogue: patients have the right to be involved, and doctors should find out what matters to each person so they can share information that is relevant to them. That includes the option of doing nothing, and the risks of harm and potential benefits of each option. Doctors must start from the presumption that adults have capacity, support people to make their own decisions wherever possible, and respect a capable patient's decision even if the doctor disagrees. The guidance reflects the Montgomery judgment: the question is not what a responsible body of doctors would disclose, but what this particular patient would want to know. It also covers consent for children and young people, patients who lack capacity, and situations where time is short.",
    whyItMatters:
      "Consent is one of the most common ethics themes at interview. Knowing that it is a two-way process — not a signature on a form — is a key marker of insight.",
    keyTakeaways: [
      "Consent is a process of shared decision-making, not a form.",
      "Doctors should find out what matters to the patient and tailor information accordingly.",
      "Material risks are judged from the patient's perspective (reflecting Montgomery, 2015).",
      "Adults are presumed to have capacity; a capable patient's refusal must be respected.",
      "The option of taking no action should always be discussed.",
    ],
    howToUseIt:
      "Use in refusal-of-treatment and information-sharing scenarios: 'GMC guidance and the Montgomery ruling mean I'd need to explain the risks that matter to her, not just those a doctor thinks are important.'",
    difficulty: 3,
    categories: ["ethics-professionalism"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "gmc-confidentiality",
    title: "Confidentiality: Good Practice in Handling Patient Information",
    sourceType: "gmc",
    author: "General Medical Council",
    url: "https://www.gmc-uk.org/professional-standards/the-professional-standards/confidentiality",
    editionNote: "Core guidance published 2017 with supplementary guidance, including on reporting concerns to the DVLA.",
    summary:
      "Trust depends on patients being confident that what they tell doctors will be kept private, and this guidance explains when confidentiality can and cannot be set aside. Confidentiality is described as important but not absolute. Doctors may disclose personal information if the patient consents, if the law requires it (for example, notifying certain infectious diseases or responding to a court order), or if disclosure is justified in the public interest — typically where failing to disclose could expose others to a risk of death or serious harm. Any disclosure should be the minimum necessary, and wherever practical the patient should be told first. Supplementary guidance applies these principles to specific situations, such as a patient who continues to drive when medically unfit: the doctor should first try to persuade them to stop and inform the DVLA themselves, and may disclose to the DVLA if they do not, after telling the patient they intend to do so.",
    whyItMatters:
      "Confidentiality dilemmas — driving, safeguarding, infectious disease, a teenager's secret — are staple interview stations. The key is showing confidentiality is a strong default with defined exceptions.",
    keyTakeaways: [
      "Confidentiality is essential to trust but is not absolute.",
      "Disclosure routes: consent, legal requirement, or public interest (risk of death or serious harm to others).",
      "Disclose the minimum necessary, to the right person, and tell the patient where practicable.",
      "For unfit drivers: persuade first; disclose to the DVLA if the patient won't, informing them first.",
    ],
    howToUseIt:
      "Frame confidentiality answers as 'strong default, defined exceptions', then walk through persuasion before disclosure.",
    difficulty: 3,
    categories: ["ethics-professionalism"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "gmc-outcomes-for-graduates",
    title: "Outcomes for Graduates (2018)",
    sourceType: "gmc",
    author: "General Medical Council",
    url: "https://www.gmc-uk.org/education/standards-guidance-and-curricula/standards-and-outcomes/outcomes-for-graduates",
    editionNote: "Replaced Tomorrow's Doctors (2009). Underpins the Medical Licensing Assessment (MLA).",
    summary:
      "Outcomes for Graduates sets out what every new UK medical graduate must know and be able to do on their first day as a doctor. It replaced the older Tomorrow's Doctors framework and is organised in three areas: professional values and behaviours; professional skills; and professional knowledge. Beyond clinical knowledge and practical procedures, it expects graduates to communicate effectively, work in teams, manage uncertainty, prescribe safely, understand health promotion and public health, apply ethical and legal principles, and show commitment to learning and improving care. All UK medical schools design their courses to meet these outcomes, and the national Medical Licensing Assessment tests whether graduates have reached them.",
    whyItMatters:
      "It explains why medical schools select for qualities like teamwork, communication and handling uncertainty — they are required outcomes, not optional extras.",
    keyTakeaways: [
      "Three areas: professional values and behaviours, professional skills, professional knowledge.",
      "Managing uncertainty, teamwork and communication are explicit graduate outcomes.",
      "It replaced Tomorrow's Doctors; the MLA checks graduates meet it.",
    ],
    howToUseIt:
      "Useful for 'What qualities does a doctor need?' and 'Why is reflection important?' — connect your answer to what the GMC expects of graduates.",
    difficulty: 2,
    categories: ["motivation-insight", "personal-qualities"],
    lastVerified: "2026-09-29",
  },
  // ---------------------------------------------------------------- NHS
  {
    slug: "nhs-constitution",
    title: "The NHS Constitution for England",
    sourceType: "nhs",
    author: "Department of Health and Social Care",
    url: "https://www.gov.uk/government/publications/the-nhs-constitution-for-england",
    editionNote: "First published 2009; periodically updated.",
    summary:
      "The NHS Constitution sets out the principles and values of the health service in England, together with the rights and responsibilities of patients, the public and staff. Its seven guiding principles include providing a comprehensive service available to all; access based on clinical need rather than ability to pay; aspiring to the highest standards of excellence; putting patients at the heart of everything; working across organisational boundaries; providing best value for taxpayers' money; and being accountable to the public. It lists six values that describe how staff should behave: working together for patients; respect and dignity; commitment to quality of care; compassion; improving lives; and everyone counts. It also sets out patient rights — for example to be treated with dignity, to be involved in decisions and to complain — and pledges the NHS aims to meet, such as timely treatment.",
    whyItMatters:
      "Many schools' interviews are built around NHS values, and 'What are the NHS values?' is a common opening. Knowing them lets you connect your experiences to the organisation you would work in.",
    keyTakeaways: [
      "Seven principles, including care free at the point of use based on clinical need.",
      "Six values: working together for patients; respect and dignity; commitment to quality of care; compassion; improving lives; everyone counts.",
      "Sets out rights and responsibilities for patients and staff.",
      "'Everyone counts' links directly to health inequalities.",
    ],
    howToUseIt:
      "Link your examples to a named value: 'That volunteering taught me what \"respect and dignity\" looks like when someone can no longer do things for themselves.'",
    difficulty: 1,
    categories: ["nhs-current-affairs", "motivation-insight"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "nhs-structure-england",
    title: "How the NHS in England Is Organised — and How It Is Changing",
    sourceType: "report",
    author: "Summary drawn from DHSC, House of Commons Library and Institute for Government",
    url: "https://commonslibrary.parliament.uk/research-briefings/cbp-11078/",
    editionNote: "Reorganisation in progress — check for updates before interview.",
    summary:
      "Health is devolved, so England, Scotland, Wales and Northern Ireland each run their own NHS. In England, the Department of Health and Social Care sets policy and funding. Since 2022, 42 integrated care systems have brought together NHS organisations, local councils and partners in each area to plan services around local population needs, with integrated care boards holding NHS budgets. Hospital trusts provide most specialist care, while GP practices — usually independent contractors working in primary care networks — are the first point of contact for most people. In March 2025 the government announced that NHS England, the body that had overseen the NHS operationally, would be abolished and its functions merged into the Department of Health and Social Care, alongside cuts to integrated care board running costs. Legislation to complete the change is going through Parliament, with abolition targeted for April 2027, though details may shift. Regulators sit alongside: the Care Quality Commission inspects services, and the GMC regulates doctors.",
    whyItMatters:
      "Applicants are often asked how the NHS is structured or what recent reforms mean. Accurate, current understanding sets you apart from answers based on out-of-date diagrams.",
    keyTakeaways: [
      "Health is devolved: four UK health systems, not one.",
      "Integrated care systems (42 in England) plan care across NHS and councils locally.",
      "NHS England is being abolished and merged into DHSC; target date April 2027, subject to legislation.",
      "CQC regulates services; GMC regulates doctors.",
    ],
    howToUseIt:
      "Mention the shift towards integration and local planning when discussing challenges such as social care or health inequalities. Present reforms neutrally — describe, then weigh.",
    difficulty: 3,
    categories: ["nhs-current-affairs"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "ten-year-health-plan",
    title: "Fit for the Future: The 10 Year Health Plan for England (2025)",
    sourceType: "report",
    author: "Department of Health and Social Care",
    url: "https://www.gov.uk/government/publications/10-year-health-plan-for-england-fit-for-the-future",
    editionNote: "Published July 2025.",
    summary:
      "The government's long-term plan for the NHS in England is organised around three 'shifts'. The first is from hospital to community: moving care closer to home through neighbourhood health services that bring GPs, nurses, pharmacists, mental health and social care together, so fewer people end up in hospital. The second is from analogue to digital: expanding the NHS App as a front door for booking, records and advice, and using technology — including AI — to reduce administrative burden and support clinicians. The third is from sickness to prevention: tackling the causes of ill health, such as obesity, smoking and poor diets, and reducing inequalities. The plan also covers workforce, productivity and how the service will be run. Delivery depends on funding, staffing and the wider reorganisation of NHS bodies, so its impact is still to be seen.",
    whyItMatters:
      "It frames most current NHS debates. Knowing the three shifts lets you place any hot topic — AI, prevention, GP access — in context.",
    keyTakeaways: [
      "Three shifts: hospital → community, analogue → digital, sickness → prevention.",
      "Neighbourhood health services are central to the community shift.",
      "The NHS App is intended to become the main digital front door.",
      "Delivery depends on workforce, funding and reorganisation.",
    ],
    howToUseIt:
      "When asked about the biggest challenge or future of the NHS, anchor your answer in one of the three shifts and weigh its feasibility.",
    difficulty: 2,
    categories: ["nhs-current-affairs"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "marmot-review",
    title: "The Marmot Reviews: Fair Society, Healthy Lives (2010) and 10 Years On (2020)",
    sourceType: "report",
    author: "Sir Michael Marmot and the Institute of Health Equity",
    url: "https://www.instituteofhealthequity.org/resources-reports/marmot-review-10-years-on",
    summary:
      "The original Marmot Review showed that health in England follows a social gradient: the more deprived the area people live in, the shorter their lives and the more years they spend in poor health — and this applies at every step of the ladder, not just between the richest and poorest. It argued that these inequalities are avoidable and driven largely by the social determinants of health: early childhood, education, employment, income, housing and communities. It proposed 'proportionate universalism' — universal action, with effort scaled to the level of disadvantage. The follow-up in 2020 found that improvements in life expectancy had stalled over the previous decade, that inequalities had widened, and that life expectancy had fallen for women in the most deprived areas. It linked this to austerity and reduced spending on the services that shape health outside the NHS.",
    whyItMatters:
      "Health inequality is one of the most frequently examined current-affairs themes. Marmot gives you the vocabulary — social gradient, social determinants, proportionate universalism — to answer with depth.",
    keyTakeaways: [
      "Health follows a social gradient across the whole population.",
      "Social determinants (education, income, housing, work) drive much of the gap.",
      "Proportionate universalism: universal action scaled to need.",
      "The 2020 update found stalled progress and widening inequalities.",
    ],
    howToUseIt:
      "When discussing obesity, smoking or 'self-inflicted' illness, use Marmot to show behaviour is shaped by circumstance — which changes the ethics of blame.",
    difficulty: 3,
    categories: ["nhs-current-affairs", "ethics-professionalism"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "leng-review",
    title: "The Leng Review of Physician and Anaesthesia Associates (2025)",
    sourceType: "report",
    author: "Professor Gillian Leng, for the Department of Health and Social Care",
    url: "https://www.gov.uk/government/publications/independent-review-of-the-physician-associate-and-anaesthesia-associate-roles-final-report",
    editionNote: "Published July 2025; implementation ongoing.",
    summary:
      "Physician associates were introduced to support medical teams, but their rapid expansion raised concerns among doctors and patients about role confusion, supervision and safety. The independent review led by Professor Gillian Leng did not find convincing evidence to abolish the roles but recommended significant changes. These included renaming physician associates 'physician assistants' (and anaesthesia associates 'physician assistants in anaesthesia') to make clear they are not doctors, ensuring each has a named supervising doctor, and stating they should not see undifferentiated patients — people with symptoms not yet diagnosed — except within clearly defined national protocols. It also recommended that newly qualified physician assistants spend time in secondary care before working in general practice or mental health, and called for clearer identification, standardised training and better evidence on outcomes. The government accepted the recommendations.",
    whyItMatters:
      "A live workforce debate that touches teamwork, patient safety, role clarity and the value of a medical degree — interviewers may ask for a balanced view.",
    keyTakeaways: [
      "Recommended renaming to 'physician assistant' to avoid confusion with doctors.",
      "No undifferentiated patients except within national protocols.",
      "Named supervising doctor for each physician assistant.",
      "The review did not recommend abolishing the roles.",
    ],
    howToUseIt:
      "Show balance: value of the wider team versus the importance of clear roles and supervision for patient safety. Avoid disparaging colleagues.",
    difficulty: 3,
    categories: ["nhs-current-affairs", "motivation-insight"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "assisted-dying-uk-debate",
    title: "Assisted Dying in the UK: Where the Debate Stands",
    sourceType: "article",
    author: "Summary drawn from House of Commons Library and parliamentary records",
    url: "https://commonslibrary.parliament.uk/terminally-ill-adults-end-of-life-bills/",
    editionNote: "Status as of September 2026 — check for later developments.",
    summary:
      "Assisting suicide remains a criminal offence in England and Wales. A private member's bill to allow terminally ill adults with capacity, expected to die within six months, to request help to end their lives passed the House of Commons in June 2025 but fell when it did not complete its stages in the House of Lords before the end of the parliamentary session. A near-identical bill was introduced in 2026 and was defeated at its Commons second reading in September 2026 by 286 votes to 270. In Scotland, a separate bill fell at its final vote in March 2026. Supporters argue for autonomy and relief of suffering, pointing to jurisdictions such as Oregon and Australian states with safeguards. Opponents raise concerns about pressure on vulnerable and disabled people, the adequacy of palliative care, safeguards, and the role of doctors. Professional bodies have moved to more neutral positions over time, but views among doctors remain divided.",
    whyItMatters:
      "One of the most likely ethics debate questions. A current, accurate picture — and fair presentation of both sides — shows maturity.",
    keyTakeaways: [
      "Assisted dying is illegal in England, Wales, Scotland and Northern Ireland as of September 2026.",
      "The 2024–26 bill passed the Commons but fell in the Lords; the 2026 bill was defeated at second reading.",
      "Key arguments: autonomy and suffering versus protection of the vulnerable and the state of palliative care.",
      "Distinguish assisted dying from withdrawing treatment and from palliative care, which are lawful.",
    ],
    howToUseIt:
      "Use the Balanced Argument framework; state facts neutrally, steelman both sides, and conclude respectfully without claiming certainty.",
    difficulty: 4,
    categories: ["ethics-professionalism", "nhs-current-affairs"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "organ-donation-opt-out",
    title: "Opt-out Organ Donation in the UK",
    sourceType: "law",
    author: "UK and devolved legislation; NHS Blood and Transplant",
    url: "https://www.organdonation.nhs.uk/uk-laws/",
    summary:
      "All four UK nations now use an opt-out, or 'deemed consent', system for organ donation after death. Wales was first, in December 2015; England followed in May 2020 under legislation known as Max and Keira's Law; Scotland in March 2021; and Northern Ireland in June 2023. Adults are considered to have agreed to donate unless they have recorded a decision not to, appointed a representative, or belong to an excluded group — such as people who lack capacity to understand the system or have not lived in the country long enough. Families are still always consulted and, in practice, donation does not usually go ahead if they object. The change aimed to increase donor numbers and make donation the default, but evidence suggests the effect depends heavily on family conversations, public awareness and specialist nurses, and consent rates vary between communities.",
    whyItMatters:
      "Tests how you weigh autonomy against the benefit to others and how defaults shape behaviour — a common MMI ethics debate.",
    keyTakeaways: [
      "All UK nations use deemed consent; Wales 2015, England 2020, Scotland 2021, Northern Ireland 2023.",
      "People can opt out or record a decision to donate; exclusions protect those who cannot understand the system.",
      "Families are always consulted.",
      "Changing the default alone has modest effects; conversations and trust matter.",
    ],
    howToUseIt:
      "Discuss autonomy (is silence consent?), beneficence for recipients, justice across communities, and the role of the family.",
    difficulty: 2,
    categories: ["ethics-professionalism", "nhs-current-affairs"],
    lastVerified: "2026-09-29",
  },
  // ---------------------------------------------------------------- LAW & LANDMARK CASES
  {
    slug: "mental-capacity-act",
    title: "Mental Capacity Act 2005 (England and Wales)",
    sourceType: "law",
    author: "UK Parliament",
    url: "https://www.legislation.gov.uk/ukpga/2005/9/contents",
    summary:
      "The Mental Capacity Act provides the legal framework for making decisions on behalf of people aged 16 and over who lack the capacity to make a particular decision themselves. It rests on five principles: assume capacity unless it is established otherwise; take all practicable steps to help the person decide; do not treat someone as lacking capacity just because their decision seems unwise; any decision made for them must be in their best interests; and choose the option that least restricts their rights and freedom. Capacity is decision-specific and time-specific. A person lacks capacity if, because of an impairment or disturbance in the functioning of the mind or brain, they cannot understand the relevant information, retain it long enough, use or weigh it, or communicate their decision. The Act also covers advance decisions to refuse treatment and lasting powers of attorney. Scotland and Northern Ireland have their own legislation.",
    whyItMatters:
      "Capacity underpins almost every consent and refusal scenario. Knowing the functional test — understand, retain, weigh, communicate — lets you reason precisely instead of guessing.",
    keyTakeaways: [
      "Five principles: presume capacity, support decision-making, unwise ≠ incapable, best interests, least restrictive.",
      "Capacity is specific to a decision at a particular time.",
      "Functional test: understand, retain, use or weigh, communicate.",
      "Applies to people aged 16+ in England and Wales.",
    ],
    howToUseIt:
      "In refusal scenarios, say explicitly: 'First I'd assess whether she has capacity for this decision using the four-part test.'",
    difficulty: 3,
    categories: ["ethics-professionalism"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "gillick-fraser",
    title: "Gillick Competence and the Fraser Guidelines",
    sourceType: "case",
    author: "Gillick v West Norfolk and Wisbech AHA [1985], House of Lords",
    url: "https://learning.nspcc.org.uk/child-protection-system/gillick-competence-fraser-guidelines",
    summary:
      "In 1985 the House of Lords considered whether doctors could give contraceptive advice to girls under 16 without parental consent. It ruled that a child under 16 can consent to their own treatment if they have enough understanding and intelligence to fully understand what is proposed — now called 'Gillick competence'. Competence depends on the individual and the decision: a young person may be competent to consent to a simple treatment but not a complex one. Lord Fraser set out specific guidelines for contraception: the young person understands the advice; cannot be persuaded to tell their parents or allow the doctor to; is likely to have sex with or without contraception; their health is likely to suffer without it; and it is in their best interests. Young people aged 16–17 are presumed able to consent to treatment. Safeguarding always applies: sexual activity involving a child under 13 must be treated as a child protection concern.",
    whyItMatters:
      "Confidentiality and consent involving teenagers is a very common MMI station. Knowing Gillick and Fraser lets you balance autonomy, safeguarding and best interests accurately.",
    keyTakeaways: [
      "Under-16s can consent if Gillick competent for that decision.",
      "Fraser guidelines apply specifically to contraception and sexual health advice.",
      "Encourage involving parents, but a competent young person's confidentiality should be respected.",
      "Safeguarding concerns (e.g. under-13s, exploitation) override confidentiality.",
    ],
    howToUseIt:
      "State the default (respect competent young person's confidentiality), the test (Gillick/Fraser), and the limits (safeguarding).",
    difficulty: 3,
    categories: ["ethics-professionalism"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "montgomery-consent",
    title: "Montgomery v Lanarkshire Health Board (2015)",
    sourceType: "case",
    author: "UK Supreme Court [2015] UKSC 11",
    url: "https://www.supremecourt.uk/cases/uksc-2013-0136",
    summary:
      "Nadine Montgomery, a woman with diabetes and of small stature, was not told about the risk of shoulder dystocia during vaginal delivery of a large baby, or offered a caesarean section as an alternative. Her son was born with serious disabilities after complications during birth. Her doctor said she had not mentioned the risk because the chance of serious harm was small and she thought the patient would opt for a caesarean. The Supreme Court ruled that doctors must take reasonable care to ensure patients are aware of any material risks and of reasonable alternatives. A risk is material if a reasonable person in the patient's position would attach significance to it, or if the doctor knows or should know that this particular patient would. This moved the legal standard for consent away from what doctors typically disclose towards what patients want to know, and cemented consent as a dialogue.",
    whyItMatters:
      "The landmark case on informed consent in the UK. Citing it accurately signals a mature understanding of patient autonomy.",
    keyTakeaways: [
      "Doctors must disclose material risks and reasonable alternatives.",
      "Materiality is judged from the patient's perspective, not the profession's.",
      "Consent requires dialogue to find out what matters to the patient.",
    ],
    howToUseIt:
      "Mention in consent scenarios alongside GMC guidance: 'Since Montgomery, the test is what matters to this patient.'",
    difficulty: 4,
    categories: ["ethics-professionalism"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "francis-report",
    title: "The Francis Report: Mid Staffordshire Public Inquiry (2013)",
    sourceType: "report",
    author: "Sir Robert Francis QC",
    url: "https://www.gov.uk/government/publications/report-of-the-mid-staffordshire-nhs-foundation-trust-public-inquiry",
    summary:
      "Between 2005 and 2009, patients at Stafford Hospital suffered appalling care: people were left in soiled bedding, without food or water within reach, and in pain, and many died in circumstances that were later judged avoidable. The public inquiry led by Robert Francis found the failures went beyond individual staff. A trust board focused on financial targets and foundation trust status had cut staff, warning signs were missed or ignored, and a culture had developed in which poor standards became normal and concerns were not heard. The report made 290 recommendations centred on putting patients first, openness, transparency and candour, fundamental standards of care, and compassionate, well-led nursing. It led to a statutory duty of candour for organisations, a tougher inspection regime from the Care Quality Commission, and much greater emphasis on culture and whistleblowing.",
    whyItMatters:
      "The defining case study of what happens when organisations lose sight of patients. It underpins questions on candour, raising concerns, culture and compassion.",
    keyTakeaways: [
      "Failures were cultural and organisational, not just individual.",
      "Targets and finances must never outrank patient care.",
      "Led to a statutory duty of candour and fundamental standards.",
      "Raising concerns is a professional duty, and organisations must listen.",
    ],
    howToUseIt:
      "Cite when discussing whistleblowing, culture, the duty of candour or 'the NHS values in action'.",
    difficulty: 3,
    categories: ["nhs-current-affairs", "ethics-professionalism"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "bawa-garba-and-candour",
    title: "The Bawa-Garba Case, Systems Failure and the Duty of Candour",
    sourceType: "case",
    author: "Court of Appeal (2018); GMC/NMC joint guidance on openness and honesty",
    url: "https://www.gmc-uk.org/professional-standards/the-professional-standards/candour---openness-and-honesty-when-things-go-wrong",
    summary:
      "In 2011, six-year-old Jack Adcock died of sepsis at a Leicester hospital. The trainee paediatrician responsible for his care, Dr Hadiza Bawa-Garba, was later convicted of gross negligence manslaughter. The medical tribunal suspended her, but the GMC appealed and the High Court ordered her erasure from the register. In 2018 the Court of Appeal restored her to the register, recognising the tribunal's finding that systemic failures — an IT failure, staff shortages, lack of senior supervision and her return from maternity leave — had contributed. The case caused deep concern among doctors about blaming individuals for system failures and about whether honest reflection could be used against them. It led to reviews of how gross negligence manslaughter is handled in healthcare. Alongside this sits the professional duty of candour: doctors must be open and honest with patients when something goes wrong, apologise, and explain what will be done.",
    whyItMatters:
      "Raises questions of individual versus system responsibility, just culture, reflection and honesty — topics interviewers use to test nuanced thinking.",
    keyTakeaways: [
      "Patient harm usually has system as well as individual causes.",
      "A 'just culture' balances accountability with learning.",
      "Doctors have a professional duty of candour when things go wrong.",
      "Honest reflection is essential to learning and must be protected.",
    ],
    howToUseIt:
      "Use for mistake and error questions: balance personal accountability with system learning, and show you would be open with the patient.",
    difficulty: 4,
    categories: ["ethics-professionalism", "nhs-current-affairs"],
    lastVerified: "2026-09-29",
  },
  // ---------------------------------------------------------------- ETHICS TEXT
  {
    slug: "beauchamp-childress",
    title: "Principles of Biomedical Ethics",
    sourceType: "book",
    author: "Tom Beauchamp and James Childress",
    url: "https://global.oup.com/ukhe/product/principles-of-biomedical-ethics-9e-9780197832639",
    editionNote: "First published 1979; now in its 9th edition.",
    summary:
      "This textbook introduced the four-principles approach that dominates medical ethics teaching: respect for autonomy, non-maleficence, beneficence and justice. The authors argue these principles are shared across many moral traditions, which makes them a practical common language for clinicians with different beliefs. None is absolute: they are 'prima facie' duties that must be specified for real cases and balanced when they conflict. The book also discusses the professional virtues and the relationships between doctors and patients, including truthfulness, privacy, confidentiality and fidelity. Critics argue that the principles can be too abstract, that they encourage box-ticking, and that they may underweight relationships, care and context. Many ethicists see them as a useful starting point rather than a complete theory.",
    whyItMatters:
      "It is the origin of the Four Pillars. Knowing that the principles must be weighed — and knowing their limitations — lets you use them intelligently.",
    keyTakeaways: [
      "Four prima facie principles, none automatically overriding.",
      "Designed as a shared framework across different moral views.",
      "Principles must be specified and balanced in real cases.",
      "Critiques: abstract, can become a checklist, may neglect care and relationships.",
    ],
    howToUseIt:
      "In Oxbridge or advanced ethics discussions, show you know the principles are a tool with limits — e.g. mention that care ethics emphasises relationships the pillars can miss.",
    difficulty: 4,
    categories: ["ethics-professionalism"],
    lastVerified: "2026-09-29",
  },
  // ---------------------------------------------------------------- BOOKS
  {
    slug: "this-is-going-to-hurt",
    title: "This Is Going to Hurt",
    sourceType: "book",
    author: "Adam Kay",
    editionNote: "Published 2017; adapted for television in 2022.",
    summary:
      "Adam Kay's diaries from his years as a junior doctor in obstetrics and gynaecology, ending with his decision to leave medicine after a traumatic delivery that went badly wrong. The book is often very funny, recording absurd situations, exhausting rotas and the strange rhythms of hospital life, but its darker thread is the toll the job takes: long hours, missed family events, the weight of responsibility early in a career and the lack of support when things go wrong. It became hugely popular and influenced public debate about junior doctors' working conditions. It has also prompted discussion about whether doctors should share patient stories publicly, even anonymised, and about how representative one person's experience is.",
    whyItMatters:
      "A widely read portrait of junior doctor life. It opens questions about burnout, wellbeing, support and the realities of the job — and about confidentiality in storytelling.",
    keyTakeaways: [
      "The emotional and physical demands on junior doctors are real and cumulative.",
      "Support after adverse events matters for doctors' wellbeing.",
      "Humour can be a coping mechanism, but it has limits.",
      "Sharing patient stories raises confidentiality and dignity questions.",
    ],
    howToUseIt:
      "Use in 'What are the downsides of medicine?' or 'How will you cope?' answers — and show you've thought critically about it, not just enjoyed it.",
    difficulty: 1,
    categories: ["motivation-insight", "personal-qualities"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "being-mortal",
    title: "Being Mortal: Medicine and What Matters in the End",
    sourceType: "book",
    author: "Atul Gawande",
    editionNote: "Published 2014.",
    summary:
      "Atul Gawande, a surgeon and writer, argues that modern medicine is very good at extending life but often poor at helping people live well as they age and approach death. He examines how care homes can prioritise safety over autonomy, leaving residents safe but unhappy, and describes alternative models that give older people more control over their lives. He shows how doctors, trained to fix problems, often offer more treatment to people who are dying without asking what they actually want. Through stories including his own father's illness, he makes the case for honest conversations about goals, fears and trade-offs — asking people what they understand, what they are worried about, and what they would be willing to go through for more time. He presents palliative care as active, skilled care rather than giving up.",
    whyItMatters:
      "A thoughtful book on end-of-life care, autonomy and the limits of medicine — ideal for ethics, communication and 'what have you read?' questions.",
    keyTakeaways: [
      "More treatment is not always better care.",
      "Ask patients what matters to them, what they fear, and what trade-offs they would accept.",
      "Safety and autonomy can conflict in care of older people.",
      "Palliative care is active care focused on quality of life.",
    ],
    howToUseIt:
      "Link to shared decision-making and the ICE model, or to assisted-dying debates about the quality of palliative care.",
    difficulty: 2,
    categories: ["motivation-insight", "ethics-professionalism", "role-play-communication"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "do-no-harm",
    title: "Do No Harm: Stories of Life, Death and Brain Surgery",
    sourceType: "book",
    author: "Henry Marsh",
    editionNote: "Published 2014.",
    summary:
      "Henry Marsh, a senior neurosurgeon, reflects candidly on decades of operating on the brain. Each chapter centres on a case, and many are about uncertainty and failure: operations that went wrong, decisions he regrets, and the difficulty of knowing when not to operate. He writes about the arrogance surgery can breed and the humility that mistakes force on him, about the emotional distance doctors create to cope, and about the difficulty of telling patients and families honest news. He is also openly critical of bureaucracy and management in the NHS as he experienced it. The book's power lies in his willingness to admit error and doubt, showing that good doctors are not those who never make mistakes but those who learn from them and are honest about them.",
    whyItMatters:
      "An honest account of error, uncertainty and responsibility — perfect for questions on mistakes, humility and the emotional side of medicine.",
    keyTakeaways: [
      "Uncertainty and error are part of medicine; honesty about them is essential.",
      "Knowing when not to intervene is a clinical skill.",
      "Doctors balance emotional detachment with compassion.",
      "Personal accounts reflect one perspective and one era.",
    ],
    howToUseIt:
      "Refer to it for 'tell me about a mistake' or duty of candour discussions: good doctors are honest about uncertainty and learn from error.",
    difficulty: 2,
    categories: ["motivation-insight", "personal-qualities", "ethics-professionalism"],
    lastVerified: "2026-09-29",
  },
  {
    slug: "when-breath-becomes-air",
    title: "When Breath Becomes Air",
    sourceType: "book",
    author: "Paul Kalanithi",
    editionNote: "Published posthumously in 2016.",
    summary:
      "Paul Kalanithi was a neurosurgical resident nearing the end of his training when he was diagnosed with advanced lung cancer in his mid-thirties. His memoir traces his path from studying literature and philosophy to medicine, driven by questions about what makes life meaningful, and then his experience of becoming a patient. He describes how illness changed his relationship with his oncologist, how he wrestled with uncertainty about how much time he had, and how he and his wife decided to have a child. The book was completed after his death, with an epilogue by his wife. It is a meditation on meaning, identity, and how doctors and patients face mortality — and on the value of being told the truth with compassion rather than numbers alone.",
    whyItMatters:
      "Offers the rare perspective of a doctor becoming a patient — powerful for questions on empathy, communicating uncertainty and why medicine matters.",
    keyTakeaways: [
      "Illness challenges identity and meaning, not just the body.",
      "Patients may want understanding more than statistics.",
      "Doctors are also vulnerable; empathy runs both ways.",
    ],
    howToUseIt:
      "Use when discussing breaking bad news, empathy or motivation — e.g. how prognosis should be communicated.",
    difficulty: 2,
    categories: ["motivation-insight", "role-play-communication"],
    lastVerified: "2026-09-29",
  },
];
