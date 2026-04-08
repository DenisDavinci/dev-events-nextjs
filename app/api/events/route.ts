import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const event: Record<string, unknown> = {};

        try {
            for (const [key, value] of Array.from(formData.entries())) {
                if (key === 'image') continue;

                if ((key === 'agenda' || key === 'tags') && typeof value === 'string') {
                    try {
                        event[key] = JSON.parse(value);
                    } catch {
                        event[key] = [value];
                    }
                } else {
                    event[key] = value;
                }
            }
        } catch {
            return NextResponse.json({ message: "Invalid JSON data format" }, { status: 400 });
        }

        const file = formData.get("image") as File;

        if (!file) return NextResponse.json({ message: "Image file is required" }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, result) => {
                if (error) reject(error);
                resolve(result);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create(event);

        return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error("API Error Response:", e);
        return NextResponse.json({
            message: "Event Creation failed",
            error: e instanceof Error ? e.message : (typeof e === 'object' ? JSON.stringify(e) : String(e)),
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
    } catch (e) {
        console.error("API Error Response:", e);
        return NextResponse.json({ message: "Events fetching failed", error: e }, { status: 500 });
    }
}