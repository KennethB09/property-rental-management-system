import { ArrowRight, Search } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import ListingItem from "@/components/tenantUi/listingItem";
import type { listing, ratingAndReviews } from "@/types/interface";
import ListingDetails from "@/components/tenantUi/listingDetails";
import { useState } from "react";
import { Link } from "react-router";

export default function TenantExplore() {
  const { listings } = useAppContext();
  const [selected, setSelected] = useState<listing & ratingAndReviews>();
  const [openModal, setOpenModal] = useState(false);

  function handleSelectedListing(param: listing & ratingAndReviews) {
    setSelected(param);
    setOpenModal(true)
  }

  return (
    <div className="py-4 flex flex-col gap-4">

        {openModal && selected && <ListingDetails details={selected} open={openModal} setOpen={setOpenModal}/>}

      <Link to={"/tenant/search"} className="flex items-center mx-4 p-4 gap-4 border-1 border-gray-300 rounded-3xl">
        <div>
          <Search size={25} className="text-green-700" />
        </div>
        <span className="font-light text-lg text-gray-400">Search</span>
      </Link>

      <div className="">
        <div className="flex w-full justify-between px-4">
          <h1 className="text-2xl font-semibold text-gray-900">Listings</h1>
          <button>
            <ArrowRight size={30} className="text-gray-900" />
          </button>
        </div>

        <div className="px-4 w-full overflow-y-scroll flex gap-2 py-2">
          {listings.map((item) => (
            <ListingItem key={item.id} property={item} onClick={handleSelectedListing} />
          ))}
        </div>
      </div>

      {/* <div>
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
            </div> */}
    </div>
  );
}
