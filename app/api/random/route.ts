import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/prisma/db";
import {randomInt} from "node:crypto";
import posthog from 'posthog-js'


export async function GET(req: NextRequest) {
    try{
        const sites = await db.orm.public.domain.all().toArray()

        const r = randomInt(0, sites.length);
        const site = sites[r]

        return NextResponse.json({body: site.domain}, {status:200})
    } catch (err){
        posthog.captureException(err);
        return NextResponse.json({body: err}, {status:500})
    }
}