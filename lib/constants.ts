export type EventItem = {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

export const events: EventItem[] = [
    {
        title: "Google I/O 2026",
        image: "/images/event1.png",
        slug: "google-io-2026",
        location: "Mountain View, CA",
        date: "May 14, 2026",
        time: "10:00 AM PST",
    },
    {
        title: "WWDC 2026",
        image: "/images/event2.png",
        slug: "wwdc-2026",
        location: "Cupertino, CA",
        date: "June 8, 2026",
        time: "10:00 AM PDT",
    },
    {
        title: "AWS re:Invent",
        image: "/images/event3.png",
        slug: "aws-reinvent-2026",
        location: "Las Vegas, NV",
        date: "December 1, 2026",
        time: "8:00 AM PST",
    },
    {
        title: "React Conf 2026",
        image: "/images/event4.png",
        slug: "react-conf-2026",
        location: "Henderson, NV",
        date: "May 20, 2026",
        time: "9:00 AM PDT",
    },
    {
        title: "Next.js Conf",
        image: "/images/event5.png",
        slug: "nextjs-conf-2026",
        location: "San Francisco, CA",
        date: "October 26, 2026",
        time: "9:00 AM PST",
    },
    {
        title: "DEF CON 34",
        image: "/images/event6.png",
        slug: "def-con-34",
        location: "Las Vegas, NV",
        date: "August 6, 2026",
        time: "10:00 AM PDT",
    }
];
