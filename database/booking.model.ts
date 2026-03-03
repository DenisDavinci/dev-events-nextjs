import mongoose, { Document, Model, Schema, Types } from "mongoose";

/**
 * TypeScript interface representing a Booking document in MongoDB.
 * `eventId` is an ObjectId reference to an Event document.
 */
export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

/** Simple RFC-5322-inspired email regex for server-side validation. */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
    {
        // Reference to the Event collection; indexed for faster lookup queries.
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: [true, "eventId is required"],
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            validate: {
                validator: (v: string) => EMAIL_REGEX.test(v),
                message: (props: { value: string }) =>
                    `"${props.value}" is not a valid email address`,
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
 * Verifies that the referenced Event document actually exists in the database
 * before persisting the booking. Throws an error if the event is not found,
 * preventing orphaned booking records.
 */
BookingSchema.pre("save", async function () {
    // Only run the existence check when eventId is new or has changed.
    if (this.isModified("eventId")) {
        const eventExists = await mongoose
            .model("Event")
            .exists({ _id: this.eventId });

        if (!eventExists) {
            throw new Error(`Event with id "${this.eventId}" does not exist`);
        }
    }
});

/**
 * Use the cached model if it already exists (important for Next.js hot-reloads)
 * to avoid the "Cannot overwrite model once compiled" error.
 */
const Booking: Model<IBooking> =
    mongoose.models.Booking ??
    mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
