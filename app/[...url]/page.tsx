import { Suspense } from "react";
import SiteViewer from "@/components/SiteViewer";

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
        <Suspense fallback={<div><p>Loading...</p></div>}>
            <SiteViewer url={url} referrerURL={ref} />
        </Suspense>
    );
}