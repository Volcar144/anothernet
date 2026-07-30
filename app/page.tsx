"use client"

import SubmitUrl from "@/components/submitUrl";
import {useEffect} from "react";

export default function Home() {
    let sitesCreated = 100;

    useEffect(() => {
        async function getPostHogSiteCount() {
            const response = await fetch(
                "https://eu.posthog.com/api/projects/236462/endpoints/site_count/run",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`PostHog request failed: ${response.status}`);
            }

            const data = await response.json();
            sitesCreated = data.results?.[0]?.[0] ?? 0;
        }
        getPostHogSiteCount();
    }, [])

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-10 items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
          <div className="gap-2">
              <h1 className="text-5xl dark:text-white">Welcome to <b className="font-bold text-5xl dark:text-white">AnotherNet</b></h1>
              <h3 className="text-lg italic dark:text-white">AnotherNet, Another World</h3>
          </div>
          <div className="flex flex-col gap-2 w-screen h-3">
              <SubmitUrl />
          </div>
          <div>
              <p className="font-bold text-3xl">{sitesCreated}</p>
              <p className="text-xl">Sites existing on anothernet</p>
          </div>
      </main>
    </div>
  );
}
