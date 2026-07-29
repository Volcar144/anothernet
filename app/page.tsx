"use client"



import SubmitUrl from "@/components/submitUrl";

export default function Home() {
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
      </main>
    </div>
  );
}
