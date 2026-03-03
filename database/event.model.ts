import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * TypeScript interface representing an Event document in MongoDB.
 * Extends Document to include Mongoose document methods and properties.
 */
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Converts a title into a URL-friendly slug.
 * e.g. "React Conf 2026!" → "react-conf-2026"
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")   // Remove non-word characters (except hyphens)
        .replace(/[\s_]+/g, "-")    // Replace spaces and underscores with a hyphen
        .replace(/--+/g, "-");      // Collapse consecutive hyphens
}

/**
 * Normalises a date string to ISO 8601 format (YYYY-MM-DD).
 * Throws if the value cannot be parsed into a valid date.
 */
function normaliseDate(raw: string): string {
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) {
        throw new Error(`Invalid date value: "${raw}"`);
    }
    // Return only the date portion (YYYY-MM-DD) in UTC to avoid timezone drift.
    return parsed.toISOString().split("T")[0];
}

/**
 * Normalises a time string to 12-hour format with AM/PM, e.g. "10:00 AM PST".
 * Accepts both "HH:mm" (24-hour) and already-formatted strings; leaves
 * already-formatted strings unchanged.
 */
function normaliseTime(raw: string): string {
    // If the string already contains AM/PM, treat it as already normalised.
    if (/[ap]m/i.test(raw)) return raw.trim();

    // Attempt to parse a bare "HH:mm" value.
    const match = raw.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
        throw new Error(`Invalid time value: "${raw}". Expected HH:mm or "HH:mm AM/PM [TZ]".`);
    }

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;

    return `${hours}:${minutes} ${period}`;
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        // Slug is auto-generated from the title in the pre-save hook below.
        slug: {
            type: String,
            unique: true,
            index: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        overview: {
            type: String,
            required: [true, "Overview is required"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "Image is required"],
            trim: true,
        },
        venue: {
            type: String,
            required: [true, "Venue is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        date: {
            type: String,
            required: [true, "Date is required"],
        },
        time: {
            type: String,
            required: [true, "Time is required"],
        },
        mode: {
            type: String,
            required: [true, "Mode is required"],
            enum: {
                values: ["online", "offline", "hybrid"],
                message: 'Mode must be "online", "offline", or "hybrid"',
            },
        },
        audience: {
            type: String,
            required: [true, "Audience is required"],
            trim: true,
        },
        agenda: {
            type: [String],
            required: [true, "Agenda is required"],
            validate: {
                validator: (v: string[]) => Array.isArray(v) && v.length > 0,
                message: "Agenda must contain at least one item",
            },
        },
        organizer: {
            type: String,
            required: [true, "Organizer is required"],
            trim: true,
        },
        tags: {
            type: [String],
            required: [true, "Tags are required"],
            validate: {
                validator: (v: string[]) => Array.isArray(v) && v.length > 0,
                message: "Tags must contain at least one item",
            },
        },
    },
    {
        // Automatically manage createdAt and updatedAt fields.
        timestamps: true,
    }
);

/**
 * Pre-save hook (Mongoose 9+: promise-based, no `next` callback):
 * 1. Regenerates the slug when the title is new or has changed.
 * 2. Normalises the date to ISO 8601 (YYYY-MM-DD).
 * 3. Normalises the time to a consistent 12-hour AM/PM format.
 */
EventSchema.pre("save", function () {
    // Only regenerate slug when title has been modified (or is new).
    if (this.isModified("title")) {
        this.slug = generateSlug(this.title);
    }

    // Normalise date and time on every save to enforce consistent formats.
    if (this.isModified("date")) {
        this.date = normaliseDate(this.date);
    }

    if (this.isModified("time")) {
        this.time = normaliseTime(this.time);
    }
});

/**
 * Use the cached model if it already exists (important for Next.js hot-reloads)
 * to avoid the "Cannot overwrite model once compiled" error.
 */
const Event: Model<IEvent> =
    mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);

export default Event;
