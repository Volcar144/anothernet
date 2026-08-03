"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import {useEffect, useState} from "react";

const LOADING_MESSAGES = [
    "Heating the oven...",
    "Pondering life the universe and everything...",
    "Thinking...",
    "Going back to assigned task...",
    "Generating site...",
    "Almost there...",
    "Just a little longer...",
    "Come on, you can wait another couple seconds...",
    "Taking a while huh?",
    "I wonder why it's taking this long...",
    "Heating the oven...",
    "HAH, gotcha, bet you thought it was going to restart!"
]

export default function LoadingCard(){
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2500); // swap every 2s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center ">
            <Card className="w-1/5 h-1/4">
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