import { db } from "@/lib/prisma/db"
import {NextRequest, NextResponse} from "next/server";
import {streamToString} from "@/lib/utils";
import {getPostHogClient} from "@/lib/posthog-server";

export async function POST(req: NextRequest){

    interface getPageRequestBody{
        url: string;
    }

    const body = await streamToString(req.body)
    let parsed: getPageRequestBody = {url: ""}

    try {
        parsed = JSON.parse(`${body}`)
    } catch (Error){
        return NextResponse.json({error: "Error occurred while parsing JSON"}, {status: 400})
    }

    if(parsed.url === ""){
        return NextResponse.json({error: "URL cannot be empty"}, {status: 400})
    }

    try {
        const site = await db.orm.public.url.where({address: parsed.url}).first()
        if(site == null){
            return NextResponse.json({body: "Site does not exist in the database"}, {status: 404})
        } else {
            const posthog = getPostHogClient()
            if (posthog) {
                posthog.capture({event: "site_page_loaded"})
                await posthog.flush()
            }

            return NextResponse.json({body: site.html}, {status: 200})
        }
    } catch(err){
        return NextResponse.json({error: err}, {status: 500})
    }

}