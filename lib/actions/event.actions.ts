'use server';
import Event from "@/database/event.model";
import connectDB from "../mongodb";

export const getEventBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug }).lean();
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
  } catch (e) {
    console.error('[getEventBySlug] Error:', e);
    return null;
  }
};

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug }).lean();

    if (!event) return [];

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();

    // Serialize to plain JSON to avoid Next.js "cannot serialize ObjectId" errors
    return JSON.parse(JSON.stringify(similarEvents));
  } catch (e) {
    console.error('[getSimilarEventsBySlug] Error:', e);
    return [];
  }
}