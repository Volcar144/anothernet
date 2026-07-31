import UrlBar from "@/components/UrlBar";


export default async function UrlLayout({
    children,
    params,
       }: {
    children: React.ReactNode;
    params: Promise<{ url: string[] }>;
}){

    const {url: urlSegments} = await params;
    const url = urlSegments.join("/")

    return (
        <div className="w-full min-h0screen rounded-4xl border-10 border-white flex flex-col">
            <div className="flex flex-col items-center justify-center w-full h-1/8 bg-white">
                <UrlBar domain={`https://${url}`} />
            </div>
            <div className="w-full h-full">
                {children}
            </div>
        </div>
    )

}