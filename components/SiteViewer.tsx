import {NextResponse} from "next/server";
import {streamToString} from "@/lib/utils";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {CircleX, ShieldX} from "lucide-react"
import {Button} from "@/components/ui/button";


export default async function SiteViewer({url, referrerURL}: {url: string, referrerURL: string}) {
    let toRender:htmlResponse = {
        body: ``
    };
    let error = false;

    interface htmlResponse{
        body: string;
    }

    try {
        const cacheRes = await fetch("https://anothernet.archiem.top/api/getPage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });
        console.log("cacheRes status:", cacheRes.status);
        const token = process.env.API_TOKEN

        if (cacheRes.ok) {
            const text = await streamToString(cacheRes.body);
            console.log("cacheRes body:", text);
            toRender = JSON.parse(text);
        } else {
            if (cacheRes.status == 500) {
                error = true;
            } else {
                try {
                    const genRes = await fetch("https://anothernet.archiem.top/api/generatePage", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url, referrerURL, token}),
                    });
                    console.log("genRes status:", genRes.status);

                    if (genRes.ok) {
                        const text = await streamToString(genRes.body);
                        console.log("genRes body:", text);
                        const parsed = JSON.parse(text);
                        toRender = { body: parsed.body ?? parsed.html ?? ""}
                    } else {
                        if(genRes.status == 422) {
                            return (
                                <div className="w-screen min-h-screen flex flex-col items-center justify-center">
                                    <Card className="flex flex-col w-1/5 h-1/4">
                                        <CardHeader>
                                            <CardTitle>
                                                <ShieldX color="#ff0000" />
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <h2 className="text-2xl dark:text-white">
                                                Request Blocked
                                            </h2>
                                            <p className="text-lg text-gray-500">Request determined to be risky or unsafe by ai.</p>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                size="lg"
                                                className="w-full"
                                                variant="destructive"
                                                onClick={() => {
                                                    window.location.href = "/"
                                                }}
                                            >
                                                Go home
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            )
                        }
                        error = true;
                    }
                } catch (err) {
                    console.error("generatePage fetch failed:", err);
                    error = true;
                }
            }
        }
    } catch (err) {
        console.error("getPage fetch failed:", err);
        error = true;
    }

    if (!toRender?.body || toRender.body.trim() === "") {
        error = true;
    }

    if(error){
        return (
            <div className="w-screen min-h-screen flex flex-col items-center justify-center">
             <Card className="bg-white shadow w-1/8 h-1/6">
                 <CardHeader>
                     <CardTitle >
                         <CircleX color="#ff0000" />
                     </CardTitle>
                 </CardHeader>
                 <CardContent>
                     <h2 className="text-3xl">Whoops...</h2>
                     <h3 className="text-2xl">It appears we've had an error</h3>
                 </CardContent>
             </Card>
            </div>
        )
    }else {
        return (
            <div className="w-screen h-screen">
                <iframe
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                    srcDoc= {toRender.body}
                />
            </div>
        )
    }


}