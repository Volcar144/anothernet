"use client"

import SubmitUrl from "@/components/submitUrl";
import {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {streamToString} from "@/lib/utils";
import {error} from "next/dist/build/output/log";

export default function Home() {
    let sitesCreated = 100;
    let buttonDisabled = false;
    let randomSite= "jjk.net"

    interface randomResponse{
        body: string;
    }

    useEffect(() => {
        async function getRandom(){
            try{
                const req = await fetch("https://anothernet.archiem.top/api/random", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                });

                const body:randomResponse = JSON.parse(await streamToString(req.body))
                if(req.status == 200){
                    randomSite = body.body
                } else {
                    throw error(body.body);
                }
            } catch(err){
                buttonDisabled = true;
            }
        }
    }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-10 items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
          <div className="gap-2">
              <h1 className="text-5xl dark:text-white">Welcome to <b className="font-bold text-5xl dark:text-white">AnotherNet</b></h1>
              <h3 className="text-lg italic dark:text-white">AnotherNet, Another World</h3>
          </div>
          <div className="flex flex-row gap-2 w-screen h-3">
              <SubmitUrl />
              <Button onClick={() => {window.location.href == `/${randomSite}`}} disabled={buttonDisabled} variant="default" size="default">Go somewhere random?</Button>
          </div>

      </main>
    </div>
  );
}
