import EventDetails from "@/components/EventDetails";
import { Suspense } from "react";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {

    // const request = await fetch(`${BASE_URL}/api/events/${slug}`);
    // onst { event: { description, image, overview, date, time, location, mode, agenda, tags, audience, category, title, organizer, _id } } = await request.json();

    // if (!description) return notFound();
    const slug = params.then((p) => p.slug);
    return (
        <main>
            <Suspense fallback={<div>Loading ...</div>}>
                <EventDetails params={slug} />
            </Suspense>
        </main>
    )
}

export default EventDetailsPage