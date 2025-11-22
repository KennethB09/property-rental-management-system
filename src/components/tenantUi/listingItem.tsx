import type { listing, ratingAndReviews, review } from "@/types/interface";
import { Heart } from "lucide-react";
import { useApi } from "@/context/ApiContext";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";

type ListingItemProps = {
  property: listing;
  onClick: (param: listing & ratingAndReviews) => void;
};

export default function ListingItem({ property, onClick }: ListingItemProps) {
  const { session } = useAuthContext();
  const { tenantSave, tenantRemoveSave } = useApi();
  const { dispatch, saves } = useAppContext();
  const [reviews, setReviews] = useState<ratingAndReviews | undefined>(undefined);

  const isSave = saves.map((item) => item.listing_ID.id).includes(property.id);

  useEffect(() => {
    async function getRating() {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/get-rating/${
          property.id
        }`,
        {
          method: "GET",
        }
      );

      const json = await response.json();

      if (!response.ok) {
        return;
      }

      setReviews(json);
    }

    getRating();
  }, []);

  async function handleSave() {
    if (isSave) {
      const unsave = await tenantRemoveSave(property.id);

      if (unsave.error) {
        return toast.error(unsave.error);
      }

      dispatch({ type: "REMOVE_SAVE", payload: property.id });
      return toast.success("Listing removed.");
    }

    const save = await tenantSave(property.id, session.user.id);

    if (save.error) {
      return toast.error(save.error);
    }

    dispatch({ type: "ADD_NEW_SAVE", payload: save.data });
    toast.success("Listing Saved.");
  }

  return (
    <div
      className="overflow-clip relative w-screen aspect-square items-center justify-center bg-gray-900 flex flex-col rounded-2xl border-1 border-gray-400"
      onClick={() => onClick({...property, ...reviews!})}
      aria-disabled={!reviews}
    >
      <button
        className="z-10 absolute rounded-full p-2 bg-white top-0 right-0 m-3"
        onClick={handleSave}
      >
        {isSave ? (
          <Heart size={25} fill="oklch(52.7% 0.154 150.069)" stroke="0" />
        ) : (
          <Heart size={25} />
        )}
      </button>
      <div className="flex justify-center items-center w-full h-full object-fill">
        <img
          className="w-full h-full object-cover"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${property.thumbnail}`}
        />
      </div>

      <div className="absolute bg-black/60 backdrop-blur-sm w-full bottom-0 h-12 bg-opacity-25 flex justify-between items-center p-3 gap-10">
        <h1 className="text-lg text-white truncate">{property.name}</h1>
        <span className="text-lg text-white truncate">
          Rating: {reviews?.rating}
        </span>
      </div>
    </div>
  );
}
