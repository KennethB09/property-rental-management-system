import ItemHome from "@/components/landlordUi/home/itemHome";
import { usePropertyContext } from "@/hooks/usePropertyContext";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useGetLandlordProperty } from "@/hooks/useFetchData";

export default function LandlordHome() {
  const { data } = useGetLandlordProperty();
  const { properties } = usePropertyContext();

  return (
    <div className="flex flex-col font-roboto p-4 h-full gap-4 lg:w-[91%]">
      <header className="">
        <h1 className="font-bold text-3xl text-gray-900">Home</h1>
      </header>

      <div className="flex justify-between items-center gap-3">
        <div className="h-32 border border-gray-300 w-full rounded-2xl p-3 flex flex-col items-center justify-start gap-3">
          <div className="font-bold text-gray-700 w-full"><h1>Listed</h1></div>
          <span className="text-4xl text-center text-gray-800">{data?.available}</span>
        </div>

        <div className="h-32 border border-gray-300 w-full rounded-2xl p-3 flex flex-col items-center justify-start gap-3">
          <div className="font-bold text-gray-700 w-full"><h1>Occupied</h1></div>
          <span className="text-4xl text-center text-green-700">{data?.occupied}</span>
        </div>

        <div className="h-32 border border-gray-300 w-full rounded-2xl p-3 flex flex-col items-center justify-start gap-3">
          <div className="font-bold text-gray-700 w-full"><h1>Unlisted</h1></div>
          <span className="text-4xl text-center text-gray-600">{data?.unlisted}</span>
        </div>
      </div>

      <div className="flex flex-col border border-gray-300 rounded-[10px] h-full p-3 overflow-y-hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-lg text-gray-900 font-semibold">Properties</h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2 flex h-full overflow-y-scroll max-sm:pb-24">
          {properties.length !== 0 ? (
            <div className="flex flex-col gap-1 h-full w-full overflow-x-hidden">
              {properties.map((property) => (
                <ItemHome key={property.id} property={property} />
              ))}

            </div>
          ) : (
            <div className="h-full flex justify-center items-center">
              <h1 className="text-xl font-semibold text-gray-700">No Properties</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
