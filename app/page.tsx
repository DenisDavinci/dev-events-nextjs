import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import Event, { IEvent } from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { cacheLife } from "next/cache";

const Page = async () => {
  'use cache';
  cacheLife('hours')
  await connectDB();
  const events: IEvent[] = await Event.find().sort({ createdAt: -1 }).lean();


  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can&apos;t Miss</h1>
      <p className="text-center mt-5">Hackathanon, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length ? events.map((event: IEvent) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          )) : <li>No events found</li>}
        </ul>
      </div>
    </section>
  )
}

export default Page