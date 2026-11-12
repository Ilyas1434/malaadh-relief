// All site copy lives here so Ryan can edit text without touching components.
// Video slots: set `video` to a YouTube ID, an Instagram reel URL, or a direct .mp4 path in /public.

export type VideoRef =
  | { kind: "youtube"; id: string }
  | { kind: "instagram"; url: string }
  | { kind: "file"; src: string; poster?: string }
  | null;

export const site = {
  name: "Malaadh Relief",
  arabic: "ملاذ",
  meaning: "Malaadh (ملاذ) is Arabic for refuge.",
  tagline: "Refuge, delivered by hand.",
  heroSub: "A student-run relief organization getting food, medicine, and basic supplies to families and clinics in places that are hard to reach.",
  // TODO(Ryan): confirm public contact email and handles
  email: "hello@malaadhrelief.org",
  instagram: "https://www.instagram.com/malaadhrelief",
  instagramHandle: "@malaadhrelief",
  youtube: "https://www.youtube.com/@malaadhrelief",
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
    summary: "Orphan care, essential goods, medical aid, and naloxone kits for a local clinic.",
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
    "We stayed in Atbara, a more stable city, instead of Khartoum or Darfur.",
  ],
  video: { kind: "youtube", id: "4hY1U3Pj29o" } as VideoRef,
  videoCaption: "The journey, part 1",
};

export type Program = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  body: string[];
  example: { label: string; href: string; body: string[]; delivered: string[] };
  video: VideoRef;
  videoLabel: string;
};

export const programs: Program[] = [
  {
    slug: "orphan-care",
    title: "Orphan Care",
    short: "Food, clothing, and school supplies for children who have lost their parents.",
    intro: "Many children orphaned by war are taken in by relatives who are already struggling.",
    body: [
      "Local partners connect us with families caring for orphaned children.",
      "We cover food, clothing, and school supplies, bought locally and delivered to the family.",
    ],
    example: {
      label: "Sudan, June 2026",
      href: "/work/sudan",
      body: [
        "In Atbara we delivered food, clothing, and school supplies to families caring for orphaned children.",
        // TODO(Ryan): add how many children or families, and anything specific you remember from the visits.
      ],
      delivered: ["Food staples", "Clothing", "School supplies"],
    },
    video: null,
    videoLabel: "Video coming soon",
  },
  {
    slug: "essential-goods",
    title: "Essential Goods",
    short: "Packages of household staples, bought in local shops and handed out door to door.",
    intro: "A package of staples helps a family get through the month.",
    body: [
      "We buy the contents locally. It is cheaper and supports local shops.",
      "Each package is delivered directly to a family.",
    ],
    example: {
      label: "Sudan, June 2026",
      href: "/work/sudan",
      body: [
        "Packages of essential goods were put together in Atbara and delivered to families in need.",
        // TODO(Ryan): list what went in a package and how many packages went out.
      ],
      delivered: ["Household staples", "Door to door", "Bought from local shops"],
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
    "Naloxone, which reverses opioid overdoses, is not available in Sudan. SaveSpots provided twenty SaveKits, each with a Narcan nasal spray and a fentanyl test strip.",
    "We translated the instruction cards into Arabic and delivered the kits to Al-Imtidad Al-Shamali Clinic, which distributes them to patients.",
  ],
  facts: [
    { value: "20", label: "SaveKits delivered" },
    { value: "1", label: "Partner clinic" },
    { value: "0", label: "Naloxone available locally" },
  ],
  video: null as VideoRef,
};

export const follow = {
  heading: "Follow along",
  body: "We film and animate the work as it happens. Follow along on Instagram and YouTube.",
};

export const reels = [
  { title: "Part 1: We're flying to Sudan", video: { kind: "youtube", id: "4hY1U3Pj29o" } as VideoRef },
  { title: "Part 2: On to New York", video: { kind: "youtube", id: "-ZgZ9vqiAg0" } as VideoRef },
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
    { amount: 50, label: "Essential goods", note: "A family package of staples" },
    { amount: 100, label: "Orphan care", note: "Food, clothing, school supplies" },
    { amount: 250, label: "Medical supplies", note: "Medicine not available locally" },
    { amount: 500, label: "Sponsor a delivery", note: "A major share of one round of aid" },
  ],
  status: "Online payments are not live yet. Leave your email and we will let you know when they open.",
  modalTitle: "Donations open soon",
};
