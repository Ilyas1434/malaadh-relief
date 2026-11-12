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
  heroSub:
    "A student-run relief effort carrying aid directly to families and clinics in Sudan.",
  // TODO(Ryan): confirm public contact email and handles
  email: "hello@malaadhrelief.org",
  instagram: "https://www.instagram.com/malaadhrelief",
  instagramHandle: "@malaadhrelief",
  youtube: "https://www.youtube.com/@malaadhrelief",
  registration:
    "Malaadh Relief is a registered nonprofit organization in the State of Tennessee.",
};

export const nav = [
  { label: "Mission", href: "#mission" },
  { label: "Sudan", href: "#sudan" },
  { label: "Impact", href: "#impact" },
  { label: "Partners", href: "#partners" },
  { label: "Follow", href: "#follow" },
];

export const mission = {
  heading: "Malaadh means refuge.",
  body: [
    "Most aid never reaches the places it was meant for. Shipping into Sudan is close to impossible right now, and anything of value can disappear before it arrives.",
    "So we carry it ourselves. We fly in, walk it through customs, and hand it to the families and clinics who need it. No warehouses, no middlemen. A bag, a flight, and a promise.",
  ],
};

export const trip = {
  label: "Stop 01",
  place: "Sudan",
  when: "June 2026",
  city: "Atbara, River Nile State",
  route: ["Nashville", "New York (JFK)", "Doha", "Port Sudan", "Atbara"],
  story: [
    "Sudan is under a Level 4 travel advisory, and the airline agents at every airport told us we could not board. Three airports, three arguments, three overrides. We got on every flight.",
    "Instead of Khartoum or Darfur, we based ourselves in Atbara, a city that is more stable right now, and worked from there.",
  ],
  video: { kind: "youtube", id: "4hY1U3Pj29o" } as VideoRef,
  videoCaption: "The journey, part 1",
};

export const programs = [
  {
    key: "orphans",
    title: "Orphan Care & Essential Aid",
    body:
      "Direct support for orphaned children in Atbara: food, clothing, and school essentials, delivered in person.",
    video: null as VideoRef,
  },
  {
    key: "goods",
    title: "Essential Goods Packages",
    body:
      "Family packages of staples, put together locally and handed out door to door to households with nothing to fall back on.",
    video: null as VideoRef,
  },
  {
    key: "medical",
    title: "Medical Aid Sponsorship",
    body:
      "We covered the cost of prescriptions at Al-Imtidad Al-Shamali Clinic for patients who could not afford their medicine.",
    clinic: "Al-Imtidad Al-Shamali Clinic",
    video: null as VideoRef,
  },
];

export const partnership = {
  heading: "Twenty kits, zero naloxone in the country.",
  partner: "SaveSpots",
  partnerUrl: "https://savespots.org",
  body: [
    "Sudan's pharmacies have no naloxone, the medicine that reverses an opioid overdose. SaveSpots, a student-led harm reduction nonprofit in Chicago, supplied twenty SaveKits, each with a Narcan nasal spray and a fentanyl test strip.",
    "We translated the instruction cards into Arabic, carried the kits through customs, and placed them with Al-Imtidad Al-Shamali Clinic, where they are kept safe and handed to patients who need them.",
  ],
  facts: [
    { value: "20", label: "SaveKits delivered" },
    { value: "1", label: "Partner clinic" },
    { value: "0", label: "Naloxone available locally before" },
  ],
  video: null as VideoRef,
};

export const reels = [
  { title: "Part 1: We're flying to Sudan", video: { kind: "youtube", id: "4hY1U3Pj29o" } as VideoRef },
  { title: "Part 2: On to New York", video: { kind: "youtube", id: "-ZgZ9vqiAg0" } as VideoRef },
  // TODO(Ryan): paste the Instagram reel URL or YouTube ID for Part 3
  { title: "Part 3: JFK to Doha", video: null as VideoRef },
];

export const donate = {
  heading: "Give a family refuge.",
  body:
    "Every dollar goes straight into aid we carry in ourselves. Donations open as soon as our nonprofit bank account is live.",
  modalTitle: "Donations open soon",
  modalBody:
    "We are finishing the bank setup so every dollar is tracked from your hands to theirs. Leave your email and we will tell you the moment giving opens.",
};
