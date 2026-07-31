import Spinner from "@/components/Spinner";

export default function loading(){
    return (
        <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center dark:bg-gray-700">
            <Spinner/>
        </div>
    )
}