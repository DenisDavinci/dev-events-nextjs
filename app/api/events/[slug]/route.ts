import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

/** Shape of the dynamic route context provided by Next.js App Router. */
interface RouteParams {
    params: Promise<{ slug: string }>;
}

/**
 * GET /api/events/[slug]
 * Returns a single event document that matches the given slug.
 */
export async function GET(
    _req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse> {
    try {
        // ── Database query ───────────────────────────────────────────────────
        await connectDB();

        // Await params — required in Next.js 15+ App Router
        const { slug } = await params;

        // ── Validation ──────────────────────────────────────────────────────
        if (!slug || typeof slug !== "string" || slug.trim() === "") {
            return NextResponse.json(
                { message: "Invalid or missing slug parameter." },
                { status: 400 }
            );
        }

        // Slugs are lowercase alphanumeric with hyphens (matches event.model.ts generation logic)
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(slug)) {
            return NextResponse.json(
                { message: `Slug "${slug}" contains invalid characters.` },
                { status: 400 }
            );
        }

        // Query event by slug
        const event: IEvent | null = await Event.findOne({ slug }).lean<IEvent>();

        if (!event) {
            return NextResponse.json(
                { message: `No event found with slug "${slug}".` },
                { status: 404 }
            );
        }

        // ── Success ──────────────────────────────────────────────────────────
        return NextResponse.json(
            { message: "Event fetched successfully.", event },
            { status: 200 }
        );
    } catch (error) {
        console.error("[GET /api/events/[slug]] Unexpected error:", error);

        return NextResponse.json(
            {
                message: "An unexpected error occurred while fetching the event.",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
