export type Sermon = {
  id: string;
  title: string;
  date: string;
  preacher: string;
  scripture: string;
  category: "Sermon" | "Thought for the Week" | "Bible Teachings";
  excerpt: string;
  body: string[];
  hasVideo: boolean;
  videoUrl?: string;
};

export type Comment = {
  name: string;
  date: string;
  text: string;
};

export type ChurchEvent = {
  id: string;
  title: string;
  day: string;
  month: string;
  date: string;
  time: string;
  desc: string;
  location: string;
  past: boolean;
};

export type Photo = {
  id: string;
  caption: string;
};

export type Album = {
  id: string;
  title: string;
  date: string;
  photos: Photo[];
};

export type SocialLink = {
  key: "youtube" | "facebook" | "instagram" | "whatsapp";
  label: string;
  handle: string;
  note: string;
  url: string;
};

export const location = {
  place: "Shalom Center",
  preacher: "Bro. Joseph Acheampong",
  address: "Rue Madyol 5, 1200 Brussels, Belgium",
  phone: "+32 2 123 45 67",
  hours: "Monday – Friday, 9:00am – 5:00pm (GMT+1)",
  times: [
    { day: "Friday", time: "20:00 – 21:30" },
    { day: "Sunday", time: "12:30 – 15:00" },
  ],
  zoomLink: "https://zoom.us/j/1234567890",
  zoomNote: "Same as worship time",
};

export const navLinks = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "sermons", label: "Resources", href: "/sermons" },
  { key: "events", label: "Events", href: "/events" },
  { key: "gallery", label: "Gallery", href: "/gallery" },
] as const;

export const categories = ["All", "Sermon", "Thought for the Week", "Bible Teachings"] as const;

export const sermons: Sermon[] = [
  {
    id: "walking-by-faith",
    title: "Walking by Faith, Not by Sight",
    date: "July 20, 2026",
    preacher: "Bro. Joseph Acheampong",
    scripture: "2 Corinthians 5:7",
    category: "Sermon",
    excerpt: "What it means to trust God's promises when the path ahead is unclear.",
    body: [
      "Paul's words to the church in Corinth remind us that the Christian life is not governed by what we can see, measure, or predict — it is governed by trust in a God who has already proven Himself faithful.",
      "When circumstances are uncertain, faith is not a denial of reality; it is a decision to see reality through the lens of God's promises rather than our present troubles.",
      "This morning we looked at three anchors for a faith that holds steady: God's character, God's Word, and God's track record in our own lives.",
    ],
    hasVideo: true,
  },
  {
    id: "living-in-hope",
    title: "Living in Hope Through Trials",
    date: "July 13, 2026",
    preacher: "Bro. Joseph Acheampong",
    scripture: "Romans 5:3-5",
    category: "Sermon",
    excerpt: "Why suffering, rightly understood, produces a hope that does not disappoint.",
    body: [
      "Hope in Scripture is never wishful thinking — it is confident expectation grounded in what God has already done.",
      "Romans 5 traces a line from suffering to endurance to character to hope, showing that trials are not obstacles to a hopeful life but often the very road that leads to it.",
      "We closed by considering practical ways to hold onto hope during a difficult season, and how the church community carries one another through it.",
    ],
    hasVideo: true,
  },
  {
    id: "the-good-shepherd",
    title: "The Good Shepherd",
    date: "July 6, 2026",
    preacher: "Bro. Joseph Acheampong",
    scripture: "John 10:11-16",
    category: "Sermon",
    excerpt: "Jesus' claim to be the Good Shepherd and what it means for how we follow Him.",
    body: [
      "Unlike a hired hand, the Good Shepherd lays down His life for the sheep — a picture of sacrificial love that defines the entire ministry of Christ.",
      "We considered what it means to recognize the Shepherd's voice amid the noise of competing voices in our lives, and the security that comes from being known by name.",
    ],
    hasVideo: false,
  },
  {
    id: "grace-abounding",
    title: "Grace Abounding",
    date: "June 29, 2026",
    preacher: "Bro. Joseph Acheampong",
    scripture: "Romans 5:20-21",
    category: "Sermon",
    excerpt: "Where sin increased, grace increased all the more.",
    body: [
      "Grace is not merely God's tolerance of our failures — it is His active, abundant provision that outpaces even our deepest need.",
      "We explored how grace transforms not just our standing before God but our daily posture toward others, replacing judgment with mercy.",
    ],
    hasVideo: true,
  },
  {
    id: "the-narrow-path",
    title: "The Narrow Path",
    date: "June 22, 2026",
    preacher: "Bro. Joseph Acheampong",
    scripture: "Matthew 7:13-14",
    category: "Sermon",
    excerpt: "Counting the cost of following Christ on a road few choose to walk.",
    body: [
      "Jesus was honest about the cost of discipleship — the narrow path is less traveled precisely because it demands everything.",
      "We discussed practical disciplines that keep us on this path: prayer, Scripture, fellowship, and accountability within the body of Christ.",
    ],
    hasVideo: false,
  },
  {
    id: "be-still-and-know",
    title: "Be Still and Know",
    date: "July 22, 2026",
    preacher: "Bro. Joseph Acheampong",
    scripture: "Psalm 46:10",
    category: "Thought for the Week",
    excerpt: "A short reflection on resting in God's sovereignty during a busy week.",
    body: [
      "In the middle of a demanding week, the Psalmist's call to “be still” is not passivity but trust — a deliberate pause to remember who God is.",
      "Take a few minutes today to sit quietly and let this truth settle before you move into the rest of your week.",
    ],
    hasVideo: false,
  },
  {
    id: "a-thankful-heart",
    title: "A Thankful Heart",
    date: "July 15, 2026",
    preacher: "Bro. Joseph Acheampong",
    scripture: "1 Thessalonians 5:18",
    category: "Thought for the Week",
    excerpt: "Gratitude as a daily discipline, not just a Sunday feeling.",
    body: [
      "Paul's instruction to give thanks “in all circumstances” is a challenge to make gratitude a habit rather than a reaction to good news.",
      "This week, try naming three things you're thankful for each morning before anything else competes for your attention.",
    ],
    hasVideo: false,
  },
  {
    id: "covenant-and-promise",
    title: "Covenant and Promise in Genesis",
    date: "July 18, 2026",
    preacher: "Bro. Joseph Acheampong",
    scripture: "Genesis 12:1-3",
    category: "Bible Teachings",
    excerpt: "A study on God's covenant with Abraham and its foundation for the whole Bible story.",
    body: [
      "God's call to Abraham establishes a pattern of promise and blessing that runs through the rest of Scripture.",
      "We traced how this covenant points forward to Christ, in whom all nations are blessed.",
    ],
    hasVideo: true,
  },
  {
    id: "understanding-the-parables",
    title: "Understanding the Parables",
    date: "July 11, 2026",
    preacher: "Bro. Joseph Acheampong",
    scripture: "Matthew 13:1-23",
    category: "Bible Teachings",
    excerpt: "Why Jesus taught in parables and how to read them well.",
    body: [
      "Parables reveal truth to those who seek it and conceal it from those who don't — they reward careful, humble reading.",
      "We walked through the Parable of the Sower as a model for interpreting the rest.",
    ],
    hasVideo: false,
  },
];

export const mockComments: Record<string, Comment[]> = {
  "walking-by-faith": [
    {
      name: "Amara K.",
      date: "July 21, 2026",
      text: "This spoke straight to what I've been going through this month. Thank you for this word.",
    },
    {
      name: "Daniel M.",
      date: "July 20, 2026",
      text: "Powerful reminder that faith isn't about having all the answers. Blessed by this.",
    },
  ],
  "living-in-hope": [
    {
      name: "Grace O.",
      date: "July 14, 2026",
      text: "Needed this today. Praying this hope over my family.",
    },
  ],
  "the-good-shepherd": [],
  "grace-abounding": [
    {
      name: "Peter N.",
      date: "June 30, 2026",
      text: "Grace abounding indeed — thank you, Brother Joseph.",
    },
  ],
  "the-narrow-path": [],
};

export const events: ChurchEvent[] = [
  {
    id: "youth-bible-camp",
    title: "Youth Bible Camp 2026",
    day: "14",
    month: "AUG",
    date: "August 14–16, 2026",
    time: "All day",
    desc: "Three days of worship, teaching, and fellowship for our youth, held at a retreat centre outside Brussels.",
    location: "Domaine de Chevetogne, Belgium",
    past: false,
  },
  {
    id: "baptism-sunday",
    title: "Baptism Sunday",
    day: "2",
    month: "AUG",
    date: "August 2, 2026",
    time: "12:30 PM",
    desc: "Join us as we celebrate new believers publicly professing their faith through baptism.",
    location: "",
    past: false,
  },
  {
    id: "ladies-fellowship",
    title: "Ladies' Fellowship Brunch",
    day: "9",
    month: "AUG",
    date: "August 9, 2026",
    time: "11:00 AM",
    desc: "A morning of food, fellowship, and encouragement for the women of our congregation.",
    location: "",
    past: false,
  },
  {
    id: "communion-night",
    title: "Communion & Fellowship Night",
    day: "22",
    month: "AUG",
    date: "August 22, 2026",
    time: "7:00 PM",
    desc: "An evening of communion, testimony, and worship together as one body.",
    location: "",
    past: false,
  },
  {
    id: "easter-convention",
    title: "Easter Convention",
    day: "5",
    month: "APR",
    date: "April 5, 2026",
    time: "All day",
    desc: "Our annual Easter gathering with guest preachers from across Belgium.",
    location: "",
    past: true,
  },
  {
    id: "spring-revival",
    title: "Spring Revival Week",
    day: "9",
    month: "MAR",
    date: "March 9–13, 2026",
    time: "Evenings",
    desc: "A week of nightly revival services focused on renewal and rededication.",
    location: "",
    past: true,
  },
];

function buildAlbumPhotos(prefix: string, count: number, captionBase: string, perRow = 3): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i}`,
    caption: perRow ? `${captionBase} — Day ${Math.floor(i / perRow) + 1}` : captionBase,
  }));
}

export const albums: Album[] = [
  {
    id: "youth-retreat-2026",
    title: "Youth Retreat 2026",
    date: "June 2026",
    photos: buildAlbumPhotos("yr", 9, "Youth Retreat 2026"),
  },
  {
    id: "baptism-sunday-album",
    title: "Baptism Sunday",
    date: "March 2026",
    photos: buildAlbumPhotos("bs", 6, "Baptism Sunday celebration", 0),
  },
  {
    id: "christmas-2025",
    title: "Christmas Fellowship 2025",
    date: "December 2025",
    photos: buildAlbumPhotos("xm", 9, "Christmas Fellowship 2025", 0),
  },
];

export const socialLinks: SocialLink[] = [
  { key: "youtube", label: "YouTube", handle: "@cocbrussels", note: "Watch our sermons", url: "https://youtube.com" },
  {
    key: "facebook",
    label: "Facebook",
    handle: "Church of Christ Brussels",
    note: "Follow our page",
    url: "https://facebook.com",
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "@cocbrussels",
    note: "See our latest moments",
    url: "https://instagram.com",
  },
  { key: "whatsapp", label: "WhatsApp", handle: "+32 2 123 45 67", note: "Chat with us", url: "https://wa.me/3221234567" },
];

export const heroSlides = [
  {
    headline: "You Are Welcome Here",
    sub: "A family of faith in the heart of Brussels.",
    gradient: "linear-gradient(135deg,#2C4A3D,#1B2E25)",
  },
  {
    headline: "Grow in the Word",
    sub: "Teaching and fellowship rooted in Scripture.",
    gradient: "linear-gradient(135deg,#3a5a4a,#8f6f2c)",
  },
  {
    headline: "Come As You Are",
    sub: "Join us this Friday and Sunday for worship.",
    gradient: "linear-gradient(135deg,#1B2E25,#C79A46)",
  },
];

export const gradients = [
  "linear-gradient(135deg,#2C4A3D,#1B2E25)",
  "linear-gradient(135deg,#C79A46,#8f6f2c)",
  "linear-gradient(135deg,#6b7f6e,#2C4A3D)",
  "linear-gradient(135deg,#8f6f2c,#4a3c1a)",
  "linear-gradient(135deg,#3a5a4a,#C79A46)",
];

export const worshipItems = ["Prayer", "Singing", "Preaching & Teaching", "The Lord's Supper", "Contributing"].map(
  (label, i) => ({ num: String(i + 1).padStart(2, "0"), label })
);

export const thoughtForTheWeek = {
  quote:
    "“Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God — and the peace of God, which transcends all understanding, will guard your hearts and minds in Christ Jesus.”",
  ref: "Philippians 4:6-7",
};

export function sermonImage(id: string, size = "600/400") {
  return `https://picsum.photos/seed/sermon-${id}/${size}`;
}

export function albumImage(id: string, size = "600/400") {
  return `https://picsum.photos/seed/album-${id}/${size}`;
}

export function photoImage(albumId: string, photoId: string, size = "700/560") {
  return `https://picsum.photos/seed/${albumId}-${photoId}/${size}`;
}

export function eventImage(id: string, size = "1200/700") {
  return `https://picsum.photos/seed/event-${id}/${size}`;
}

export function mapHref() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
}

export function buildIcs(event: ChurchEvent) {
  const uid = `${event.id}@cocbrussels`;
  const loc = event.location || location.address;
  const text = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.desc}`,
    `LOCATION:${loc}`,
    "DTSTAMP:20260101T000000Z",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  return `data:text/calendar;charset=utf8,${encodeURIComponent(text)}`;
}

export function typeColor(category: Sermon["category"]) {
  if (category === "Sermon") return "#2C4A3D";
  if (category === "Thought for the Week") return "#C79A46";
  return "#6B4F9E";
}

export function ctaLabel(category: Sermon["category"]) {
  if (category === "Sermon") return "Watch / Read";
  if (category === "Bible Teachings") return "Read the study";
  return "Read the reflection";
}

export type SearchItem = {
  type: "Blog" | "Events" | "Pages";
  title: string;
  snippet: string;
  href: string;
};

export const searchIndex: SearchItem[] = [
  ...sermons.map((s) => ({ type: "Blog" as const, title: s.title, snippet: s.excerpt, href: `/sermons/${s.id}` })),
  ...events.map((e) => ({ type: "Events" as const, title: e.title, snippet: e.desc, href: `/events/${e.id}` })),
  { type: "Pages" as const, title: "About Us", snippet: "Our statement of faith and church leadership.", href: "/about" },
  { type: "Pages" as const, title: "Join Us", snippet: "What our worship consists of and how to visit.", href: "/join" },
  { type: "Pages" as const, title: "Contact", snippet: "Reach out, visit, or call the church office.", href: "/contact" },
];
