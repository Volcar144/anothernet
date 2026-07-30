import { Suspense } from "react";
import SiteViewer from "@/components/SiteViewer";
import SubmitUrl from "@/components/submitUrl";
import UrlBar from "@/components/UrlBar";
import LoadingCard from "@/components/LoadingCard";

export default async function Page({
    params,
    searchParams,
    }: {
    params: Promise<{ url: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { url: urlSegments } = await params;
    const url = urlSegments.join("/");

    const resolvedSearchParams = await searchParams;

    let refParam = resolvedSearchParams.ref;
    let ref: string = Array.isArray(refParam)
        ? refParam[0] ?? url
        : refParam ?? url;
    if (!ref) {
        ref = url;
    }

    return (
        <Suspense fallback={<LoadingCard/>}>
            <div className="w-full min-h-screen rounded-4xl border-10 border-white flex flex-col">
                <div className="w-full h-1/8 flex flex-col items-center justify-center bg-white">
                    <UrlBar domain={`https://${url}`}/>
                </div>
                <div>
                    <SiteViewer url={url} referrerURL={ref}/>
                </div>
            </div>

        </Suspense>
    );
}