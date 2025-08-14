import svg from "@/assets/svgs/undraw_page-not-found_6wni.svg";

export default function PageNotFound() {
    return (
        <div className="h-screen flex flex-col justify-center content-center">
            <div className="flex flex-col justify-center items-center gap-3">
                <img src={svg} className="w-1/3 min-w-1/2"/>
                <p className="text-gray-900 font-semibold text-center">Ops, Page not found.</p>
            </div>
        </div>
    )
}