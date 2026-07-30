import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import {useEffect, useState} from "react";

const LOADING_MESSAGES = [
    "Heating the oven...",
    "Pondering the life the universe and everything...",
    "Going back to assigned task...",
    "Generating site...",
    "Almost there...",
    "Just a little longer...",
]

export default function LoadingCard(){
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2000); // swap every 2s

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Card className="w-1/7 h-1/5">
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-col justify-between">
                            <Spinner />
                            <p className="text-lg">Loading...</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p key={messageIndex} className="text-lg text-gray-400 animate-in fade-in duration-300">
                        {LOADING_MESSAGES[messageIndex]}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}