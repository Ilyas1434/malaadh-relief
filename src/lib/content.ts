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
  heroSub: "A student-run relief organization getting food, medicine, and basic supplies to families and clinics in places that are hard to reach.",
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
  video: { kind: "file", src: "/videos/part-1-flying.mp4", poster: "/videos/part-1-flying.jpg" } as VideoRef,
  videoCaption: "The journey, part 1",
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

export const reels = [
  {
    title: "Part 1: We're flying to Sudan",
    video: { kind: "file", src: "/videos/part-1-flying.mp4", poster: "/videos/part-1-flying.jpg" } as VideoRef,
  },
  {
    title: "Part 2: On to New York",
    video: { kind: "file", src: "/videos/part-2-new-york.mp4", poster: "/videos/part-2-new-york.jpg" } as VideoRef,
  },
  {
    title: "Part 3: JFK to Doha",
    video: { kind: "file", src: "/videos/part-3-jfk.mp4", poster: "/videos/part-3-jfk.jpg" } as VideoRef,
  },
];

export const donate = {
  heading: "Give a family refuge.",
  body: "Donations go directly to aid. Online giving opens soon.",
  pageHeading: "Your donation goes directly to aid.",
  pageBody:
    "Malaadh Relief gets food, medicine, and basic supplies to families and clinics in places that are hard to reach.",
  reasons: [
    { title: "Delivered directly", body: "Aid goes straight to families and clinics." },
    { title: "Bought locally", body: "Supplies are bought locally when possible." },
    { title: "No salaries", body: "We are students and volunteers. Donations go to aid and delivery." },
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
