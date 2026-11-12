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
  heroSub: "A student-run relief organization getting food, medicine, and basics to families and clinics where shipping fails.",
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
    "Aid sent to a war zone often never arrives. Parcels get held at the border, and anything with resale value gets sold before it reaches the person it was meant for.",
    "We work through relatives and local contacts who already live there. They buy supplies in local shops with the money we send, and whatever cannot be bought there, we bring in ourselves. Every handoff is filmed so donors can see where the money went.",
  ],
};

export const how = {
  heading: "How we work",
  steps: [
    {
      title: "Find the need",
      body: "Someone we know on the ground tells us who is going without and what they need. We do not work anywhere we lack a trusted contact.",
    },
    {
      title: "Buy it there or bring it",
      body: "Food, clothing, and medicine are bought in local shops, so the money stays in the area. Medicine that does not exist in the country, like naloxone in Sudan, travels in our luggage.",
    },
    {
      title: "Hand it over",
      body: "Aid goes door to door, or to a clinic that keeps it secure. We film the handoff and post it.",
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
    summary: "Orphan care, household staples, prescriptions at a local clinic, and the first naloxone kits in the country.",
    status: "active",
  },
  {
    // TODO(Ryan): replace with the next country once it is confirmed.
    slug: "next",
    name: "Next",
    city: "Wherever there is a trusted contact and a need",
    when: "",
    summary: "Donations now go toward the next round of aid, in Sudan or wherever a contact we trust asks for help.",
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
  intro: "Sudan is in its third year of war. Khartoum's airport is closed and nothing ships in reliably, so in June 2026 we flew in with the aid ourselves.",
  story: [
    "Sudan is under a Level 4 travel advisory, so at every airport the check-in agents told us we could not board. Each time, after a long back and forth, a supervisor overrode them and let us on.",
    "We stayed out of Khartoum and Darfur and based ourselves in Atbara, a quieter city on the Nile, and worked from there.",
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
    short: "Food, clothing, and school supplies for children who lost their parents, given to the relatives raising them.",
    intro: "Children who lose their parents in a war usually end up with relatives who took them in without the income to feed another child.",
    body: [
      "Local contacts point us to households raising children who are not their own. These families are usually the most stretched and the least likely to be on an aid agency's list.",
      "We cover the basics the caregiver cannot: food, clothing, and whatever school requires. We buy locally and deliver to the home.",
    ],
    example: {
      label: "Sudan, June 2026",
      href: "/work/sudan",
      body: [
        "In Atbara we met families looking after children who are not their own. Prices of basics had climbed well past what they could cover.",
        "We bought food, clothing, and school supplies in town and brought them to the homes ourselves.",
        // TODO(Ryan): add how many children or families, and anything specific you remember from the visits.
      ],
      delivered: ["Food staples", "Clothing", "School supplies"],
    },
    video: null,
    videoLabel: "Orphan care, video coming soon",
  },
  {
    slug: "essential-goods",
    title: "Essential Goods",
    short: "Packages of household staples, bought in local shops and handed out door to door.",
    intro: "When a family's income stops, a box of staples covers the next few weeks.",
    body: [
      "We buy the contents in the city we are helping instead of shipping them in. It is cheaper, it keeps local shops open, and nothing gets held at customs.",
      "Each package goes to a named household and is handed over at the door.",
    ],
    example: {
      label: "Sudan, June 2026",
      href: "/work/sudan",
      body: [
        "Packages were put together from shops in Atbara and taken to households with no steady income left.",
        // TODO(Ryan): list what went in a package and how many packages went out.
      ],
      delivered: ["Household staples", "Door to door", "Bought from local shops"],
    },
    video: null,
    videoLabel: "Packages, video coming soon",
  },
  {
    slug: "medical-aid",
    title: "Medical Aid",
    short: "Prescriptions paid for at local clinics, and medicine brought in when it cannot be bought there.",
    intro: "Many clinics have doctors and a pharmacy. The patient is the one who cannot pay for the prescription.",
    body: [
      "We partner with one clinic at a time and leave money set aside for prescriptions patients cannot pay for. The clinic decides who qualifies.",
      "When a medicine is not sold in the country at all, we bring it with us and leave it with the clinic, which stores it and hands it out.",
    ],
    example: {
      label: "Sudan, June 2026",
      href: "/work/sudan",
      body: [
        "Al-Imtidad Al-Shamali Clinic in Atbara treats people whether or not they can pay, but patients often left without filling their prescriptions. We funded those prescriptions.",
        "The clinic also holds the twenty naloxone kits we brought in with SaveSpots.",
        // TODO(Ryan): amount donated and roughly how many prescriptions it covers.
      ],
      delivered: ["Prescriptions covered", "Al-Imtidad Al-Shamali Clinic", "20 naloxone kits"],
    },
    video: null,
    videoLabel: "Clinic, video coming soon",
  },
];

export const partnersIntro = {
  heading: "We deliver what partners cannot ship.",
  body: "Some organizations have supplies and no way to get them across a border. They hand them to us, and we deliver them and report back on where they went.",
};

export const partnership = {
  heading: "Twenty naloxone kits for a clinic in Atbara.",
  partner: "SaveSpots",
  partnerUrl: "https://savespots.org",
  partnerBlurb: "Student-led harm reduction nonprofit in Chicago",
  body: [
    "Pharmacies in Sudan do not stock naloxone, the drug that reverses an opioid overdose. SaveSpots gave us twenty SaveKits, each with one Narcan nasal spray and one fentanyl test strip.",
    "We translated the instruction cards into Arabic, carried the kits through customs, and left them with Al-Imtidad Al-Shamali Clinic. The clinic keeps them locked up and gives them to patients who need them.",
  ],
  facts: [
    { value: "20", label: "SaveKits delivered" },
    { value: "1", label: "Partner clinic" },
    { value: "0", label: "Naloxone in local pharmacies" },
  ],
  video: null as VideoRef,
};

export const follow = {
  heading: "Come with us",
  body: "The work is filmed and animated as it happens. New parts go up on Instagram and YouTube.",
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
  body: "Donations buy food, medicine, and basics that we hand over in person. Online giving opens as soon as our nonprofit bank account is set up.",
  pageHeading: "Your gift is spent on aid and on getting it there.",
  pageBody:
    "Malaadh Relief buys supplies in local shops and hands them to families and clinics in places where shipping does not work. Your gift pays for the aid and for getting it there.",
  reasons: [
    { title: "Delivered in person", body: "Supplies go from us, or from people we know there, straight to the family or clinic. Nothing is mailed." },
    { title: "Bought locally", body: "Food, clothing, and medicine are bought in local shops, so each dollar goes further and the shops stay open." },
    { title: "No salaries", body: "We are students and volunteers. Donations buy aid and cover delivery, not pay." },
  ],
  // TODO(Ryan): replace these with real costs so each tier is honest.
  tiers: [
    { amount: 25, label: "Prescription sponsorship", note: "Medicine at a partner clinic" },
    { amount: 50, label: "Essential goods", note: "A family package of staples" },
    { amount: 100, label: "Orphan care", note: "Food, clothing, school supplies" },
    { amount: 250, label: "Carry-in medicine", note: "Drugs unavailable locally, like naloxone" },
    { amount: 500, label: "Sponsor a city", note: "A large share of one round of aid" },
  ],
  status: "Online payments are not live yet. Pick an amount and leave your email, and we will send you the link the day it opens.",
  modalTitle: "Donations open soon",
};
