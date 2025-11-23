import ListingItem from "@/components/tenantUi/listingItem";
import ListingDetails from "@/components/tenantUi/listingDetails";
import TenantHeader from "@/components/tenantUi/tenantHeader";
import { useAppContext } from "@/hooks/useAppContext";
import { useState } from "react";
import type { listing, ratingAndReviews } from "@/types/interface";

export default function TenantSaved() {
  const { saves } = useAppContext();
  const [selected, setSelected] = useState<listing & ratingAndReviews>();
  const [openModal, setOpenModal] = useState(false);

  function handleSelectedListing(param: listing & ratingAndReviews) {
    setSelected(param);
    setOpenModal(true);
  }

  return (
    <div className="flex flex-col h-full lg:w-[91%]">
      {openModal && selected && (
        <ListingDetails
          details={selected}
          open={openModal}
          setOpen={setOpenModal}
        />
      )}

      <TenantHeader title="Saved" />

      <div className="flex flex-wrap gap-2 px-4 overflow-y-scroll h-full">
        {saves.length !== 0 ? (
          saves.map((item) => (
            <ListingItem
              key={item.id}
              property={item.listing_ID}
              onClick={handleSelectedListing}
            />
          ))
        ) : (
          <div className="h-full">No Save</div>
        )}
      </div>
    </div>
  );
}
