'use server';

import connectDB from "../mongodb";
import Event from "@/database/event.model";
import Booking from "@/database/booking.model";

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string }) => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean();

        if (!event) return { success: false, e: 'Event not found' };

        await Booking.create({ eventId, slug, email });

        return { success: true };
    } catch (e) {
        console.error('[createBooking] Error:', e);
        return { success: false };
    }
}