import {NextRequest, NextResponse} from "next/server";
import {extractStyleScheme, getDomain, parseBoolean, streamToString, stripProtocol} from "@/lib/utils";
import {db} from "@/lib/prisma/db";
import {defaultModel, defaultSystemPrompt, makeRequest, modModel, modSystemPrompt} from "@/lib/ai";
import {getPostHogClient} from "@/lib/posthog-server";

export const maxDuration = 150;

export async function POST(req: NextRequest) {

    const isPaused = false;

    interface generatePageRequestBody{
        url: string;
        referredFrom?:string;
        token: string;
    }

    // Get the request body and format it
    const body = await streamToString(req.body)
    let parsed: generatePageRequestBody = {url: "", token: ""}

    if(isPaused){
        return NextResponse.json({body: "System is paused"}, {status: 401, statusText: "System paused temporarily"})
    }

    try {
        // Parse it into a typed object
        parsed = JSON.parse(`${body}`)
    } catch (Error){
        return NextResponse.json({error: "Error occurred while parsing JSON"}, {status: 400})
    }

    if(parsed.token != process.env.API_TOKEN){
        return NextResponse.json({error: "Token is invalid"}, {status:401})
    }

    if(parsed.url === ""){
        return NextResponse.json({error: "URL cannot be empty"}, {status: 400})
    }

    //Check if they were referred from another anothernet page
    let isreferred = false;
    if (parsed.referredFrom != null) {
        if(parsed.referredFrom != parsed.url){
            isreferred = true;
        }
    }


    //Get the domain for the site
    const domain = getDomain(parsed.url);
    let recordExists = false;
    let style = ""

    try{
        const domainRecord = await db.orm.public.domain.where({ domain: domain }).first()
        if(domainRecord){
            recordExists = true;
            style = domainRecord.style;
        }
    } catch (err){
        return NextResponse.json( {error: `DB fetching failed:${err}`}, {status: 500})
    }

    let input = parsed.url;
    if(isreferred){
        if(recordExists){
            input = `${parsed.url} redirected from ${parsed.referredFrom} styled as ${style}`
        } else {
            input = `${parsed.url} redirected from ${parsed.referredFrom}, external website is not referrer of current website. No style dictation`
        }
    }

    const blockedReq = await makeRequest({
        system: modSystemPrompt,
        model:modModel,
        user: `Domain for you to process: ${parsed.url}`
    })

    try {
        const isBlocked:boolean = parseBoolean( blockedReq)

        console.log(blockedReq + " " + isBlocked)
        if(isBlocked){
            return NextResponse.json({body: "Query blocked"}, {status: 422, statusText: "Request body unprocessable"})
        }
    } catch {
        return NextResponse.json({body: "Failed to parse ai blocked response"}, {status:500})
    }



    const aiResponse = await makeRequest({
        system: defaultSystemPrompt,
        model: defaultModel,
        user: input
    })

    const newSiteStyle = extractStyleScheme(aiResponse)
    if(!recordExists){
        try{
            const newDomain = await db.orm.public.domain.create({
                domain: domain,
                style: newSiteStyle.styleScheme,
            })
        } catch(err){
            return NextResponse.json({error:"DB error occurred while creating domain record: " + err}, {status:500})
        }
    }
    try {
        const newSite = await db.orm.public.url.create({
            address: stripProtocol(parsed.url),
            prompt: input,
            html: aiResponse,
        })
    } catch(err){
        return NextResponse.json({error: `DB error occurred while creating site record ${err}`}, {status:500})
    }

    const posthog = getPostHogClient()
    if (posthog) {
        posthog.capture({
            event: "site_generation_completed",
            properties: {referred_from_anothernet_page: isreferred},
        })
        await posthog.flush()
    }

    return NextResponse.json({html: aiResponse}, {status: 200})

}