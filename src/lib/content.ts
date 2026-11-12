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
  heroSub: "A student-run relief organization that carries aid to families and clinics in places shipping cannot reach.",
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
  { label: "Trips", href: "/#trips" },
  { label: "Programs", href: "/#programs" },
  { label: "Follow", href: "/#follow" },
];

export const mission = {
  heading: "Malaadh means refuge.",
  body: [
    "Some places are hard to help. Ports close, parcels vanish, and aid with resale value gets sold before it reaches anyone. Those are the places we go.",
    "We work through family and community ties on the ground, buy supplies locally when we can, and carry the rest in ourselves. Everything is handed over in person, and we film it so donors see where their money went.",
  ],
};

export const how = {
  heading: "How a trip works",
  steps: [
    {
      title: "Find the need",
      body: "A relative, a clinic, or a local contact tells us what is missing and who is going without. We only go where someone we trust is already there.",
    },
    {
      title: "Buy it or carry it",
      body: "Food, clothing, and medicine are bought locally so the money stays in the area. Anything unavailable there, like naloxone, travels with us in a suitcase.",
    },
    {
      title: "Hand it over",
      body: "Aid goes door to door or to a clinic that keeps it secure. We stay long enough to see it used, then report back with video.",
    },
  ],
};

export type Stop = {
  slug: string;
  number: string;
  place: string;
  country: string;
  when: string;
  summary: string;
  status: "done" | "planned";
};

export const stops: Stop[] = [
  {
    slug: "sudan-2026",
    number: "01",
    place: "Atbara",
    country: "Sudan",
    when: "June 2026",
    summary: "Orphan care, essential goods packages, prescription sponsorship at a local clinic, and the first naloxone kits in the country.",
    status: "done",
  },
  {
    // TODO(Ryan): set the next destination when it is confirmed.
    slug: "next",
    number: "02",
    place: "Next stop",
    country: "In planning",
    when: "2027",
    summary: "We pick the next destination the same way as the first: where there is someone on the ground we trust and a need shipping cannot meet.",
    status: "planned",
  },
];

export const trip = {
  slug: "sudan-2026",
  label: "Stop 01",
  place: "Sudan",
  when: "June 2026",
  city: "Atbara, River Nile State",
  route: ["Nashville", "New York (JFK)", "Doha", "Port Sudan", "Atbara"],
  intro: "Our first trip. Sudan is in its third year of war, Khartoum's airport is closed, and nothing can be shipped in reliably. We flew in with a suitcase of aid.",
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
    short: "Food, clothing, and school essentials for children who lost their parents, handed to the families raising them.",
    intro: "War leaves children with relatives and neighbors who took them in without the income to do it.",
    body: [
      "Wherever we go, we ask local contacts about children being raised by someone other than their parents. Those households are usually the most stretched and the least visible to large aid programs.",
      "We cover basics the caregiver cannot: food, clothing, and whatever school requires. We buy locally and deliver to the home.",
    ],
    example: {
      label: "Sudan, June 2026",
      href: "/trips/sudan-2026",
      body: [
        "In Atbara we met families looking after children who are not their own. Prices of basics had climbed well past what they could cover.",
        "We bought food, clothing, and school supplies in town and brought them to the homes ourselves.",
        // TODO(Ryan): add how many children or families, and anything specific you remember from the visits.
      ],
      delivered: ["Food staples", "Clothing", "School essentials"],
    },
    video: null,
    videoLabel: "Orphan care, video coming soon",
  },
  {
    slug: "essential-goods",
    title: "Essential Goods",
    short: "Packages of household staples, assembled locally and handed out door to door.",
    intro: "When income stops, a package of staples buys a family time.",
    body: [
      "We put packages together in the city we are visiting instead of shipping them in. It is cheaper, it supports shops that are still open, and it avoids customs entirely.",
      "Each package goes to a specific household, delivered by hand. There is no distribution point and no line.",
    ],
    example: {
      label: "Sudan, June 2026",
      href: "/trips/sudan-2026",
      body: [
        "Packages were assembled from shops in Atbara and taken straight to households with no steady income left.",
        // TODO(Ryan): list what went in a package and how many packages went out.
      ],
      delivered: ["Household staples", "Door to door delivery", "Bought from local shops"],
    },
    video: null,
    videoLabel: "Packages, video coming soon",
  },
  {
    slug: "medical-aid",
    title: "Medical Aid",
    short: "Prescriptions paid for at local clinics, and medicine carried in when it cannot be bought there.",
    intro: "Clinics often have doctors and a pharmacy. What patients lack is money for the prescription.",
    body: [
      "We partner with one clinic per trip and leave funds set aside for prescriptions patients cannot pay for. The clinic decides who qualifies.",
      "When a medicine does not exist in the country at all, we bring it with us and leave it with the clinic, which keeps it secure and hands it out.",
    ],
    example: {
      label: "Sudan, June 2026",
      href: "/trips/sudan-2026",
      body: [
        "Al-Imtidad Al-Shamali Clinic in Atbara treats people regardless of what they can pay, but patients often left without filling prescriptions. We funded those prescriptions.",
        "The clinic also holds the twenty naloxone kits we carried in with SaveSpots, the first in the country.",
        // TODO(Ryan): amount donated and roughly how many prescriptions it covers.
      ],
      delivered: ["Prescription costs covered", "Al-Imtidad Al-Shamali Clinic", "20 naloxone kits"],
    },
    video: null,
    videoLabel: "Clinic, video coming soon",
  },
];

export const partnersIntro = {
  heading: "We carry what partners supply.",
  body: "Organizations with stock and no way to get it across a border hand it to us. We take it the last mile and report back on where it went.",
};

export const partnership = {
  heading: "Twenty naloxone kits, in a country that had none.",
  partner: "SaveSpots",
  partnerUrl: "https://savespots.org",
  partnerBlurb: "Student-led harm reduction nonprofit in Chicago",
  body: [
    "Pharmacies in Sudan do not stock naloxone, the medicine that reverses an opioid overdose. SaveSpots gave us twenty SaveKits, each with a Narcan nasal spray and a fentanyl test strip.",
    "We translated the instruction cards into Arabic, carried the kits through customs, and left them with Al-Imtidad Al-Shamali Clinic, which keeps them locked up and hands them to patients who need them.",
  ],
  facts: [
    { value: "20", label: "SaveKits delivered" },
    { value: "1", label: "Partner clinic" },
    { value: "0", label: "Naloxone sold locally before" },
  ],
  video: null as VideoRef,
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
  body: "Your donation buys aid we carry in ourselves. Online giving opens as soon as our nonprofit bank account is live.",
  pageHeading: "Aid only helps if it gets there.",
  pageBody:
    "Malaadh Relief buys supplies locally and delivers them by hand to families and clinics in places shipping cannot reach. Your gift pays for the aid itself and the trip that gets it there.",
  reasons: [
    { title: "Carried by hand", body: "Nothing is shipped. We fly in with the aid and hand it over ourselves." },
    { title: "Bought locally", body: "Food, clothing, and medicine are bought where we land, which stretches each dollar and keeps local shops open." },
    { title: "No salaries", body: "We are students and volunteers. Donations buy aid and cover the trip, not pay." },
  ],
  // TODO(Ryan): replace these with real costs from the trip so each tier is honest.
  tiers: [
    { amount: 25, label: "Prescription sponsorship", note: "Medicine at a partner clinic" },
    { amount: 50, label: "Essential goods", note: "Toward a family package" },
    { amount: 100, label: "Orphan care", note: "Food, clothing, school supplies" },
    { amount: 250, label: "A full suitcase", note: "Aid carried on the next trip" },
    { amount: 500, label: "Sponsor a stop", note: "A large share of one visit" },
  ],
  status: "Online payments are not live yet. Pick an amount and leave your email, and we will send you the link the day it opens.",
  modalTitle: "Donations open soon",
};
