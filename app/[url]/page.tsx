import { Suspense } from "react";
import { makeRequest } from "@/lib/ai";

export default async function Page({
    params,
                                   }: {
    params: Promise<{ url: string }>
}){
    const { url } = await params



    return (
        <Suspense fallback={<div></div>}>
            <div>
                <p>Welcome to {url}, the model says  </p>
            </div>
        </Suspense>
    )
}