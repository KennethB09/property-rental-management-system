import { ArrowRight, Search } from "lucide-react";


export default function TenantExplore() {
    return (
        <div className="p-4 space-y-4">
            <button className="flex items-center w-full p-4 gap-4 border-1 border-gray-300 rounded-3xl">
                <div>
                    <Search size={25} className="text-green-700"/>
                </div>
                <span className="font-light text-lg text-gray-400">Search</span>
            </button>

            <div>
                <div className="flex w-full justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Nearest to you</h1>
                    <button><ArrowRight size={30} className="text-gray-900"/></button>
                </div>

                <div>
                    
                </div>
            </div>

            <div>
                <div className="flex w-full justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Recent Listings</h1>
                    <button><ArrowRight size={30} className="text-gray-900"/></button>
                </div>

                <div>

                </div>
            </div>
        </div>
    )
}