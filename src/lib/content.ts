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
  heroSub: "A student-run relief effort that carries aid to families and clinics in Sudan.",
  // TODO(Ryan): confirm public contact email and handles
  email: "hello@malaadhrelief.org",
  instagram: "https://www.instagram.com/malaadhrelief",
  instagramHandle: "@malaadhrelief",
  youtube: "https://www.youtube.com/@malaadhrelief",
  registration: "Malaadh Relief is a registered nonprofit organization in the State of Tennessee.",
};

export const nav = [
  { label: "Mission", href: "/#mission" },
  { label: "Sudan", href: "/#sudan" },
  { label: "Impact", href: "/#impact" },
  { label: "Partners", href: "/#partners" },
  { label: "Follow", href: "/#follow" },
];

export const mission = {
  heading: "Malaadh means refuge.",
  body: [
    "A lot of the aid sent to Sudan never gets where it was meant to go. Shipping into the country is close to impossible right now, and anything with resale value can disappear on the way.",
    "So we fly it in ourselves, walk it through customs, and hand it to the families and clinics we work with. There is no warehouse and nobody in between.",
  ],
};

export const trip = {
  label: "Stop 01",
  place: "Sudan",
  when: "June 2026",
  city: "Atbara, River Nile State",
  route: ["Nashville", "New York (JFK)", "Doha", "Port Sudan", "Atbara"],
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
  delivered: string[];
  video: VideoRef;
  videoLabel: string;
};

export const programs: Program[] = [
  {
    slug: "orphan-care",
    title: "Orphan Care & Essential Aid",
    short: "Food, clothing, and school essentials for orphaned children in Atbara, handed over in person.",
    intro: "Children who lost parents to the war are being raised by relatives and neighbors who are already stretched thin.",
    body: [
      "In Atbara we met families looking after children who are not their own. Most took them in with no extra income to do it, and the war has pushed prices of basics well past what they can cover.",
      "We bought food, clothing, and school supplies locally and brought them to the homes ourselves, so we could see where the aid landed and who it reached.",
      // TODO(Ryan): add how many children or families, and anything specific you remember from the visits.
    ],
    delivered: ["Food staples", "Clothing", "School essentials"],
    video: null,
    videoLabel: "Orphan care, video coming soon",
  },
  {
    slug: "essential-goods",
    title: "Essential Goods Packages",
    short: "Family packages of staples, assembled locally and handed out door to door.",
    intro: "Many households in Atbara have no steady income left. A package of staples covers the gap for a while.",
    body: [
      "We put the packages together in Atbara rather than shipping them in. Buying locally is cheaper, supports shops that are still open, and avoids customs entirely.",
      "Each package went straight to a household, delivered by hand. No distribution point and no line.",
      // TODO(Ryan): list what went in a package and how many packages went out.
    ],
    delivered: ["Household staples", "Door to door delivery", "Bought from local shops"],
    video: null,
    videoLabel: "Packages, video coming soon",
  },
  {
    slug: "medical-aid",
    title: "Medical Aid Sponsorship",
    short: "Prescriptions paid for at Al-Imtidad Al-Shamali Clinic for patients who could not afford them.",
    intro: "The clinic has doctors and a pharmacy. What many patients lack is the money for the medicine they are prescribed.",
    body: [
      "Al-Imtidad Al-Shamali Clinic in Atbara treats people regardless of what they can pay. The prescriptions are a different story, and patients often leave without filling them.",
      "We gave the clinic funds set aside for exactly that: covering prescriptions for patients who could not pay. The clinic is also where the SaveSpots naloxone kits are kept.",
      // TODO(Ryan): amount donated and roughly how many prescriptions it covers.
    ],
    delivered: ["Prescription costs covered", "Al-Imtidad Al-Shamali Clinic", "Also holds the naloxone kits"],
    video: null,
    videoLabel: "Clinic, video coming soon",
  },
];

export const partnership = {
  heading: "Twenty naloxone kits, in a country that had none.",
  partner: "SaveSpots",
  partnerUrl: "https://savespots.org",
  body: [
    "Pharmacies in Sudan do not stock naloxone, the medicine that reverses an opioid overdose. SaveSpots, a student-led harm reduction nonprofit in Chicago, gave us twenty SaveKits, each with a Narcan nasal spray and a fentanyl test strip.",
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
    "Malaadh Relief buys supplies locally in Sudan and delivers them by hand to families and clinics. Your gift pays for the aid itself and the trip that gets it there.",
  reasons: [
    { title: "Carried by hand", body: "Nothing is shipped. We fly in with the aid and hand it over ourselves." },
    { title: "Bought locally", body: "Food, clothing, and medicine are bought in Atbara, which stretches each dollar and keeps local shops open." },
    { title: "No salaries", body: "We are students and volunteers. Donations buy aid and cover the trip, not pay." },
  ],
  // TODO(Ryan): replace these with real costs from the trip so each tier is honest.
  tiers: [
    { amount: 25, label: "Prescription sponsorship", note: "Goes toward medicine at the clinic" },
    { amount: 50, label: "Essential goods", note: "Goes toward a family package" },
    { amount: 100, label: "Orphan care", note: "Food, clothing, and school supplies" },
    { amount: 250, label: "A full suitcase", note: "Aid we carry in on the next trip" },
    { amount: 500, label: "Sponsor a stop", note: "A large share of one city visit" },
  ],
  status: "Online payments are not live yet. Pick an amount and leave your email, and we will send you the link the day it opens.",
  modalTitle: "Donations open soon",
};
