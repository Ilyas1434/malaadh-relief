// All site copy lives here so Ryan can edit text without touching components.
// Video slots: set `video` to a .mp4 in /public/videos (with an optional poster image), or an Instagram reel URL.

export type VideoRef =
  | { kind: "instagram"; url: string }
  | { kind: "file"; src: string; poster?: string }
  | null;

export const site = {
  name: "Malaadh Relief",
  arabic: "ملاذ",
  meaning: "Malaadh (ملاذ) is Arabic for refuge.",
  tagline: "Refuge, delivered by hand.",
  base: "Nashville, Tennessee",
  heroSub: "A Nashville-based, student-run relief organization getting food, medicine, and basic supplies to families and clinics in places that are hard to reach.",
  // TODO(Ryan): confirm social handles
  email: "contact@malaadh.org",
  instagram: "https://www.instagram.com/malaadhrelief",
  instagramHandle: "@malaadhrelief",
  registration: "Malaadh Relief is a registered nonprofit organization in the State of Tennessee.",
};

export const nav = [
  { label: "Mission", href: "/#mission" },
  { label: "How", href: "/#how" },
  { label: "Programs", href: "/#programs" },
  { label: "Where", href: "/#where" },
  { label: "Follow", href: "/#follow" },
];

// Extra pages linked from the footer.
export const more = [
  { label: "About", href: "/about" },
  { label: "Naloxone in Sudan", href: "/naloxone-in-sudan" },
  { label: "Watch", href: "/watch" },
  { label: "Donate", href: "/donate" },
];

// The mission statement, in Ryan's words. The last sentence of it is shown as the headline.
export const statement = {
  eyebrow: "Our mission",
  belief: "Aid should never come at the expense of dignity.",
  body: [
    "Malaadh Relief is a student-led organization delivering humanitarian aid, including essential food, medical supplies, hygiene items, and other necessities, to individuals and families affected by conflict, displacement, and humanitarian crises around the world.",
    "We work alongside local partners and affected communities to identify their needs and provide assistance that reflects their priorities.",
  ],
};

export const mission = {
  heading: "Malaadh means refuge.",
  body: [
    "Aid sent to conflict zones often never arrives. Shipments get held at borders or sold before they reach anyone.",
    "We work through family and local partners who already live there. Supplies are bought locally when possible, and we bring the rest ourselves. The work is filmed so donors can see where their money went.",
  ],
};

export const how = {
  heading: "How we work",
  steps: [
    {
      title: "Find the need",
      body: "We work with family, friends, and local partners on the ground who tell us what people need.",
    },
    {
      title: "Source the aid",
      body: "Food, clothing, and medicine are bought locally when possible. What is not available locally, we bring with us.",
    },
    {
      title: "Deliver it",
      body: "Aid goes directly to the people who need it.",
    },
  ],
};

export type Place = {
  slug: string;
  name: string;
  city: string;
  when: string;
  summary: string;
  status: "active" | "next";
};

export const places: Place[] = [
  {
    slug: "sudan",
    name: "Sudan",
    city: "Atbara",
    when: "Since June 2026",
    summary: "Orphan care, essential food supplies, medical aid, and naloxone kits for a local clinic.",
    status: "active",
  },
  {
    // TODO(Ryan): replace with the next country once it is confirmed.
    slug: "next",
    name: "Next",
    city: "Coming soon",
    when: "",
    summary: "Donations go toward the next round of aid.",
    status: "next",
  },
];

// "Why" callouts: one sourced figure that explains why a program or place matters.
export type Why = { eyebrow: string; figure?: string; body: string; source: { name: string; url: string } };

const WHO_PHSA = {
  name: "WHO, Sudan Public Health Situation Analysis, Jan 2026",
  url: "https://cdn.who.int/media/docs/default-source/documents/emergency-care/phsa-sudan-conflict-and-complex-emergency.pdf?sfvrsn=ffbbd08_1&download=true",
};
const SUDAN_EML = {
  name: "Sudan Essential Medicines List (WHO)",
  url: "https://cdn.who.int/media/docs/default-source/essential-medicines/national-essential-medicines-lists-(neml)/emro_neml/sudan-eml-2019-final-final.pdf?sfvrsn=456a0992_1&download=true",
};

export const sudan = {
  slug: "sudan",
  label: "Where we work",
  place: "Sudan",
  when: "June 2026",
  city: "Atbara, River Nile State",
  route: ["Nashville", "New York (JFK)", "Doha", "Port Sudan", "Atbara"],
  intro: "Sudan has been at war since 2023. In June 2026 we flew in to deliver aid in person.",
  story: [
    "Sudan is under a Level 4 travel advisory. At every airport, the check-in agents said we could not board. Each time a supervisor eventually let us through.",
  ],
  // The videos shown under "Getting there", in playing order (file paths from videos.json).
  journey: ["/videos/part-2-new-york.mp4", "/videos/part-3-jfk.mp4", "/videos/part-4-we-made-it-to.mp4"],
  why: {
    eyebrow: "INFORM Global Risk Ranking · 2025",
    figure: "1st of 191",
    body: "According to a WHO report, Sudan's humanitarian risk ranks #1 out of 191 countries on the INFORM Risk Index (2025).",
    source: WHO_PHSA,
  } as Why,
};

export type Stat = { value: number; decimals?: number; suffix?: string; label: string; source: { name: string; url: string; date: string } };

// Figures from UN agencies. Each one links to the release it came from.
export const sudanStats: Stat[] = [
  {
    value: 9.33, decimals: 1, suffix: "M", label: "people displaced inside Sudan",
    source: { name: "IOM", url: "https://www.iom.int/news/one-third-sudan-displaced-1000-days-conflict-iom-urges-urgent-and-sustained-action", date: "January 2026" },
  },
  {
    value: 15, suffix: "M+", label: "forced from their homes since April 2023",
    source: { name: "IOM", url: "https://www.iom.int/news/one-third-sudan-displaced-1000-days-conflict-iom-urges-urgent-and-sustained-action", date: "January 2026" },
  },
  {
    value: 37, suffix: "%", label: "of health facilities not functioning",
    source: { name: "WHO", url: "https://www.who.int/news/item/14-04-2026-after-three-years-of-conflict--sudan-faces-a-deeper-health-crisis", date: "April 2026" },
  },
  {
    value: 21, suffix: "M", label: "people without access to health services",
    source: { name: "WHO", url: "https://www.who.int/news/item/14-04-2026-after-three-years-of-conflict--sudan-faces-a-deeper-health-crisis", date: "April 2026" },
  },
  {
    value: 19.5, decimals: 1, suffix: "M", label: "people facing acute food insecurity",
    source: { name: "WFP, FAO, UNICEF", url: "https://www.unicef.org/press-releases/risk-famine-persists-nearly-195-million-people-face-acute-food-insecurity-sudan", date: "May 2026" },
  },
  {
    value: 825, suffix: "K", label: "children under five expected to suffer severe acute malnutrition in 2026",
    source: { name: "UNICEF", url: "https://www.unicef.org/press-releases/risk-famine-persists-nearly-195-million-people-face-acute-food-insecurity-sudan", date: "May 2026" },
  },
  {
    value: 217, label: "verified attacks on health care since the war began",
    source: { name: "WHO", url: "https://www.who.int/news/item/14-04-2026-after-three-years-of-conflict--sudan-faces-a-deeper-health-crisis", date: "April 2026" },
  },
  {
    value: 34, suffix: "M", label: "people who need humanitarian aid",
    source: { name: "WHO", url: "https://www.who.int/news/item/14-04-2026-after-three-years-of-conflict--sudan-faces-a-deeper-health-crisis", date: "April 2026" },
  },
];

export type Program = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  body: string[];
  example: { label: string; href: string; body: string[]; delivered: string[] };
  why?: Why;
  // Shown as "What's in each package" when filled in.
  packageContents?: string[];
  video: VideoRef;
  videoLabel: string;
};

export const programs: Program[] = [
  {
    slug: "orphan-care",
    title: "Orphan Care",
    short: "Medicine, cleaning supplies, and baby formula for orphanages.",
    intro: "Many children at the orphanage were left there by parents who could no longer afford to care for them once the war began.",
    body: [
      "Others lost their parents in the conflict. Some have special needs or were born out of wedlock. These are often the children who get overlooked.",
      "We supply over-the-counter medicines, cleaning supplies to keep the orphanage clean and healthy, and baby formula for infants in the nursery.",
    ],
    why: {
      eyebrow: "Child malnutrition · Global ranking",
      figure: "3rd highest",
      body: "Sudan has the world's third-highest child wasting rate, according to a WHO report.",
      source: WHO_PHSA,
    },
    example: {
      label: "Sudan, June 2026",
      href: "/work/sudan",
      body: [
        "We supplied an orphanage with over-the-counter medicines, cleaning supplies, and baby formula for the infants in its nursery.",
        // TODO(Ryan): add the orphanage's city, how many children it cares for, and anything specific from the visit.
      ],
      delivered: ["Over-the-counter medicines", "Cleaning supplies", "Baby formula"],
    },
    video: null,
    videoLabel: "Video coming soon",
  },
  {
    slug: "essential-goods",
    title: "Essential Food Supplies",
    short: "Locally sourced staples for families in need and hardworking community members.",
    intro: "Locally sourced staples, distributed to families in need and hardworking community members.",
    body: ["We buy the staples locally. It is cheaper and supports local shops."],
    // TODO(Ryan): list what goes in each package.
    packageContents: [],
    example: {
      label: "Sudan, June 2026",
      href: "/work/sudan",
      body: [
        "Locally sourced staples distributed to families in need and hardworking community members along the Khartoum–Port Sudan route, providing essential support where it was needed most.",
        // TODO(Ryan): how many packages went out.
      ],
      delivered: ["Locally sourced staples", "Khartoum–Port Sudan route", "Families and community members"],
    },
    video: null,
    videoLabel: "Video coming soon",
  },
  {
    slug: "medical-aid",
    title: "Medical Aid",
    short: "Prescriptions paid for at local clinics, and medicine brought in when it cannot be bought there.",
    intro: "Many clinics have the medicine. Patients often cannot afford it.",
    body: [
      "We partner with local clinics to cover prescriptions for patients who cannot pay.",
      "Medicine that is not available in the country, we bring with us and leave with the clinic.",
    ],
    example: {
      label: "Sudan, June 2026",
      href: "/work/sudan",
      body: [
        "We donated to Al-Imtidad Al-Shamali Clinic in Atbara to cover prescriptions for patients who could not afford them.",
        "The clinic also received twenty naloxone kits through our partnership with SaveSpots.",
        // TODO(Ryan): amount donated and roughly how many prescriptions it covers.
      ],
      delivered: ["Prescriptions covered", "Al-Imtidad Al-Shamali Clinic", "20 naloxone kits"],
    },
    why: {
      eyebrow: "Why naloxone",
      body: "Naloxone is on Sudan's Essential Medicines List, but it is not readily available in the country.",
      source: SUDAN_EML,
    },
    video: null,
    videoLabel: "Video coming soon",
  },
];

export const partnersIntro = {
  heading: "Partners",
  body: "Organizations with supplies but no way to deliver them can work with us.",
};

export const partnership = {
  heading: "Twenty naloxone kits for a clinic in Atbara.",
  partner: "SaveSpots",
  partnerUrl: "https://savespots.org",
  partnerBlurb: "Student-led harm reduction nonprofit in Chicago",
  body: [
    "Naloxone reverses opioid overdoses. SaveSpots provided twenty SaveKits, each with a Narcan nasal spray.",
    "We translated the instruction cards into Arabic and delivered the kits to Al-Imtidad Al-Shamali Clinic, which distributes them to patients.",
  ],
  facts: [
    { value: "20", label: "SaveKits delivered" },
    { value: "1", label: "Partner clinic" },
  ],
  why: {
    eyebrow: "Why naloxone",
    body: "Naloxone is on Sudan's Essential Medicines List, but it is not readily available in the country.",
    source: SUDAN_EML,
  } as Why,
  video: null as VideoRef,
};

export const follow = {
  heading: "Follow along",
  body: "We film and animate the work as it happens. Follow along on Instagram.",
};

export const donate = {
  heading: "Give a family refuge.",
  body: "Donations go directly to aid. Online giving opens soon.",
  pageHeading: "Your donation goes directly to aid.",
  pageBody:
    "Malaadh Relief gets food, medicine, and basic supplies to families and clinics in places that are hard to reach.",
  reasons: [
    { title: "Delivered directly", body: "Aid goes straight to families and clinics." },
    { title: "Bought locally", body: "Supplies are bought locally when possible." },
    { title: "Run by volunteers", body: "100% of public donations fund relief programs. Nobody at Malaadh Relief is paid." },
  ],
  // TODO(Ryan): replace these with real costs so each tier is honest.
  tiers: [
    { amount: 25, label: "Prescription sponsorship", note: "Medicine at a partner clinic" },
    { amount: 50, label: "Essential food supplies", note: "Locally sourced staples" },
    { amount: 100, label: "Orphan care", note: "Medicine, cleaning supplies, formula" },
    { amount: 250, label: "Medical supplies", note: "Medicine not available locally" },
    { amount: 500, label: "Sponsor a delivery", note: "A major share of one round of aid" },
  ],
  status: "Online payments are not live yet. Leave your email and we will let you know when they open.",
  modalTitle: "Donations open soon",
};

// Search titles and descriptions. Titles get " | Malaadh Relief" added automatically
// (except the home title). Keep descriptions under about 160 characters.
export const seo = {
  home: {
    title: "Malaadh Relief | Nashville-Based, Student-Run Sudan Relief",
    description:
      "Malaadh Relief is a Nashville-based, student-run nonprofit carrying food, medicine, and orphan care supplies by hand to families and clinics in Sudan.",
  },
  about: {
    title: "About Malaadh Relief: Nashville-Based, Student-Run Sudan Aid",
    description:
      "Who runs Malaadh Relief, what Malaadh means, and how a student-run nonprofit in Nashville, Tennessee gets aid to families and clinics in Sudan.",
  },
  naloxone: {
    title: "Naloxone in Sudan: 20 Kits Delivered to a Clinic in Atbara",
    description:
      "Naloxone is on Sudan's Essential Medicines List but hard to find there. Malaadh Relief and SaveSpots delivered 20 kits with Arabic instructions to Atbara.",
  },
  donate: {
    title: "Donate to Sudan Relief",
    description:
      "Give to Malaadh Relief, a volunteer-run Tennessee nonprofit. Donations buy food, medicine, and orphan care supplies delivered by hand in Sudan.",
  },
  watch: {
    title: "Watch: Carrying Aid Into Sudan, Part by Part",
    description:
      "Every video from Malaadh Relief's June 2026 trip to Sudan, in order, from Nashville to Atbara.",
  },
  work: {
    sudan: {
      title: "Sudan Relief Trip, June 2026: Aid Delivered in Atbara",
      description:
        "In June 2026 Malaadh Relief flew from Nashville to Atbara, Sudan to deliver orphan care, food, medical aid, and naloxone kits in person. See what arrived.",
    },
  } as Record<string, { title: string; description: string }>,
  programs: {
    "orphan-care": {
      title: "Orphan Care in Sudan",
      description:
        "Malaadh Relief supplies orphanages in Sudan with medicine, cleaning supplies, and baby formula, delivered in person. See what arrived in June 2026.",
    },
    "essential-goods": {
      title: "Food Aid for Families in Sudan",
      description:
        "Staple foods bought from local shops in Sudan and handed directly to families along the Khartoum–Port Sudan route.",
    },
    "medical-aid": {
      title: "Medical Aid and Naloxone for Clinics in Sudan",
      description:
        "We pay for prescriptions at Al-Imtidad Al-Shamali Clinic in Atbara and bring medicine Sudan lacks, including 20 naloxone kits from SaveSpots.",
    },
  } as Record<string, { title: string; description: string }>,
};

// The About page. Every answer here should match what the rest of the site says.
export const about = {
  eyebrow: "About",
  heading: "Nashville-based. Student-run. Supporting vulnerable communities across borders.",
  intro:
    "Malaadh Relief is a student-run relief organization based in Nashville, Tennessee. We deliver food, medical supplies, hygiene items, and other necessities to families affected by conflict and displacement. Our first work is in Sudan.",
  sections: [
    {
      title: "Our mission",
      body: [...statement.body, "We believe aid should never come at the expense of dignity."],
    },
    {
      title: "Who we are",
      body: [
        "We are students and volunteers. Nobody at Malaadh Relief is paid, and 100% of public donations fund relief programs.",
        "Malaadh Relief is a registered nonprofit organization in the State of Tennessee. Our trips start in Nashville.",
      ],
    },
    {
      title: "What Malaadh means",
      body: [
        "Malaadh (ملاذ) is the Arabic word for refuge. It is what we want each delivery to be for the family or clinic that receives it.",
      ],
    },
    {
      title: "How the aid gets there",
      body: [
        "Aid sent to conflict zones often never arrives. Shipments get held at borders or sold before they reach anyone.",
        "We work through family and local partners who already live where the aid is going. Food, clothing, and medicine are bought locally when possible, and we carry in what cannot be bought there. The work is filmed so donors can see where their money went.",
      ],
    },
    {
      title: "Where we work",
      body: [
        "We started in Sudan, and we plan to work in other countries as we grow. Sudan has been at war since 2023. In June 2026 we flew from Nashville to Atbara, in River Nile State, by way of New York, Doha, and Port Sudan.",
        "On that trip we supplied an orphanage, handed out staple foods along the Khartoum–Port Sudan route, covered prescriptions at Al-Imtidad Al-Shamali Clinic, and delivered twenty naloxone kits.",
      ],
    },
  ],
  faqHeading: "Questions people ask",
  faq: [
    {
      q: "What is Malaadh Relief?",
      a: "Malaadh Relief is a Nashville-based, student-run relief organization. It delivers food, medical supplies, hygiene items, and other necessities to families affected by conflict and displacement, starting in Sudan.",
    },
    {
      q: "What does Malaadh mean?",
      a: "Malaadh (ملاذ) is Arabic for refuge.",
    },
    {
      q: "Where is Malaadh Relief based?",
      a: "Nashville, Tennessee. It is a registered nonprofit organization in the State of Tennessee.",
    },
    {
      q: "Who runs Malaadh Relief?",
      a: "Students and volunteers. Nobody is paid, and 100% of public donations fund relief programs.",
    },
    {
      q: "Where does Malaadh Relief work?",
      a: "Sudan is where we started, and we plan to work in other countries. The first trip, in June 2026, delivered aid in Atbara, River Nile State, and along the Khartoum–Port Sudan route.",
    },
    {
      q: "How does the aid reach people in Sudan?",
      a: "Family and local partners in Sudan tell us what is needed. Supplies are bought locally when possible, the rest is carried in, and it is handed directly to families, an orphanage, and a clinic.",
    },
    {
      q: "What has Malaadh Relief delivered so far?",
      a: "Medicine, cleaning supplies, and baby formula for an orphanage; staple foods for families; prescriptions covered at Al-Imtidad Al-Shamali Clinic in Atbara; and twenty naloxone kits from SaveSpots.",
    },
    {
      q: "How can I donate?",
      a: "Online giving opens soon. Leave your email on the donate page and we will tell you when it is live, or write to contact@malaadh.org.",
    },
    {
      q: "How can I see the work?",
      a: "Every trip is filmed. Watch the videos on this site or follow @malaadhrelief on Instagram.",
    },
  ],
};

// The naloxone page. Facts come from the SaveSpots partnership above.
export const naloxone = {
  eyebrow: "Medical aid · Atbara, June 2026",
  heading: "Naloxone in Sudan",
  intro:
    "Naloxone reverses opioid overdoses. It is on Sudan's Essential Medicines List, but it is not readily available in the country. In June 2026 we carried twenty kits to a clinic in Atbara.",
  sections: [
    {
      title: "What we delivered",
      body: [
        "SaveSpots, a student-led harm reduction nonprofit in Chicago, provided twenty SaveKits. Each one holds a Narcan nasal spray.",
        "We translated the instruction cards into Arabic and delivered the kits to Al-Imtidad Al-Shamali Clinic in Atbara, River Nile State. The clinic distributes them to patients.",
      ],
    },
    {
      title: "Why carry it in",
      body: [
        "Medicine that can be bought in Sudan, we buy in Sudan. Naloxone is one of the medicines that cannot reliably be bought there, so it came with us from the United States.",
      ],
    },
  ],
  delivered: ["20 SaveKits", "Narcan nasal spray in each", "Arabic instruction cards", "Al-Imtidad Al-Shamali Clinic"],
};
