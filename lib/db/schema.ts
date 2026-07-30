import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

export const adminUsers = pgTable("admin_users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  role: text("role").notNull().default("staff"), // "admin" | "staff"
  failedLoginCount: integer("failed_login_count").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sermons = pgTable("sermons", {
  id: text("id").primaryKey(), // slug
  title: text("title").notNull(),
  date: date("date").notNull(),
  preacher: text("preacher").notNull(),
  scripture: text("scripture"),
  category: text("category").notNull(), // "Sermon" | "Thought for the Week" | "Bible Teachings"
  excerpt: text("excerpt"),
  body: text("body").array().notNull(),
  hasVideo: boolean("has_video").notNull().default(false),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  createdBy: text("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const comments = pgTable(
  "comments",
  {
    id: id(),
    sermonId: text("sermon_id")
      .notNull()
      .references(() => sermons.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email"),
    text: text("text").notNull(),
    status: text("status").notNull().default("pending"), // "pending" | "approved" | "rejected"
    reviewerId: text("reviewer_id").references(() => adminUsers.id),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (t) => [index("comments_sermon_status_idx").on(t.sermonId, t.status)],
);

export const reactions = pgTable(
  "reactions",
  {
    id: id(),
    sermonId: text("sermon_id")
      .notNull()
      .references(() => sermons.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(), // "heart" | "pray" | "amen"
    visitorId: text("visitor_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("reactions_sermon_visitor_unique").on(t.sermonId, t.visitorId)],
);

export const events = pgTable("events", {
  id: text("id").primaryKey(), // slug
  title: text("title").notNull(),
  eventDate: date("event_date").notNull(), // start date; drives sorting + past/future
  dateLabel: text("date_label"), // optional display override, e.g. "August 14-16, 2026" for multi-day events
  eventTime: text("event_time").notNull(),
  // Exact UTC instant of the start time, only when eventTime is a parseable clock
  // time (null for "All day"/"Evenings" etc.) — lets the UI show it converted to
  // each visitor's own timezone alongside Brussels time. See lib/timezone.ts.
  eventDateTime: timestamp("event_date_time", { withTimezone: true }),
  description: text("description"),
  location: text("location"),
  imageUrl: text("image_url"),
  createdBy: text("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const albums = pgTable("albums", {
  id: text("id").primaryKey(), // slug
  title: text("title").notNull(),
  albumDate: date("album_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const photos = pgTable("photos", {
  id: id(),
  albumId: text("album_id")
    .notNull()
    .references(() => albums.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(), // e.g. "livestream"
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // "new" | "read" | "archived"
  emailSent: boolean("email_sent").notNull().default(false),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rateLimitHits = pgTable(
  "rate_limit_hits",
  {
    id: serial("id").primaryKey(),
    bucketKey: text("bucket_key").notNull(), // `${action}:${ipHash}`
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("rate_limit_bucket_idx").on(t.bucketKey, t.createdAt)],
);
