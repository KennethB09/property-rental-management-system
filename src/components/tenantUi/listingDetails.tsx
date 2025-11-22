import {
  ArrowLeft,
  Heart,
  PhilippinePeso,
  House,
  MapPin,
  User,
  Map as MapIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import type { listing, ratingAndReviews } from "@/types/interface";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { Button } from "../ui/button";
import { useApi } from "@/context/ApiContext";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { useAppContext } from "@/hooks/useAppContext";
import { useState } from "react";
import StartConvoModal from "./startConvoModal";
import ReviewItem from "../review/reviewItem";

type ListingDetailsProps = {
  details: listing & ratingAndReviews;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ListingDetails({
  details,
  open,
  setOpen,
}: ListingDetailsProps) {
  const { session } = useAuthContext();
  const { tenantSave, tenantRemoveSave } = useApi();
  const { dispatch, saves } = useAppContext();
  const [openMessageLandlord, setOpenLandlord] = useState(false);
  const isSave = saves.map((item) => item.listing_ID.id).includes(details.id);
  // console.log(details)

  async function handleSave() {
    if (isSave) {
      const unsave = await tenantRemoveSave(details.id);

      if (unsave.error) {
        return toast.error(unsave.error);
      }

      dispatch({ type: "REMOVE_SAVE", payload: details.id });
      return toast.success("Listing removed.");
    }

    const save = await tenantSave(details.id, session.user.id);

    if (save.error) {
      return toast.error(save.error);
    }

    dispatch({ type: "ADD_NEW_SAVE", payload: save.data });
    toast.success("Listing Saved.");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {openMessageLandlord && (
        <StartConvoModal
          open={openMessageLandlord}
          setOpen={setOpenLandlord}
          property={details}
        />
      )}

      <DialogContent className="[&>button]:hidden p-0 border-0 min-w-full h-screen rounded-none overflow-y-scroll">
        <DialogHeader className="absolute flex-row justify-between bg-black/30 w-full text-white p-3">
          <DialogClose className="w-fit">
            <ArrowLeft size={30} />
          </DialogClose>
          <DialogTitle className="text-2xl">Details</DialogTitle>
          <button onClick={handleSave}>
            {isSave ? (
              <Heart size={25} fill="oklch(52.7% 0.154 150.069)" stroke="0" />
            ) : (
              <Heart size={25} />
            )}
          </button>
          <DialogDescription hidden>
            Details of listed property
          </DialogDescription>
        </DialogHeader>
        <div className="h-full flex flex-col">
          <div className="w-screen h-64 overflow-x-auto snap-x snap-mandatory flex">
            {details.images.map((image, index) => (
              <div key={index} className="snap-start shrink-0 w-screen h-full">
                <img
                  src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${image}`}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="m-4">
            <h1 className="text-3xl font-bold text-center text-gray-900">
              {details.name}
            </h1>
            <div className="flex justify-center gap-7 font-semibold text-gray-500 my-3">
              <span>Reviews {details.reviewLength}</span>
              <span>Ratings {details.rating}</span>
            </div>
          </div>

          <div className="flex gap-3 items-center mx-4 border-y-2 py-3 border-gray-300">
            <div className="w-16 aspect-square">
              <img
                className="aspect-square rounded-full w-full"
                src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/${details.landlord_ID.profile_pic}`}
              />
            </div>
            <div className="">
              <h1 className="font-bold text-lg">
                {details.landlord_ID.first_name} {details.landlord_ID.last_name}
              </h1>
              <span className="capitalize font-semibold text-gray-700">
                Landlord
              </span>
            </div>
          </div>

          <div className="mx-4 py-3 space-y-3 text-gray-900 text-base font-medium">
            <div className="flex gap-2 items-center">
              <PhilippinePeso size={30} /> <span>{details.rent} per month</span>
            </div>
            <div className="flex gap-2 items-center">
              <House size={30} />{" "}
              <span className="capitalize">{details.property_type.name}</span>
            </div>
            <div className="flex gap-2">
              <MapPin size={30} />{" "}
              <span className="w-4/5">{details.address}</span>
            </div>
            <div className="flex gap-2 items-center">
              <User size={30} /> <span>{details.occupant} tenant</span>
            </div>
            <span className="text-gray-500">{details.created_at}</span>
          </div>

          <div className="space-y-3 mx-4 border-y-2 py-3 border-gray-300">
            <h1 className="text-2xl font-semibold text-gray-900">
              About this property
            </h1>
            <p className="text-gray-700 text-base font-medium">
              {details.description}
            </p>
          </div>
          <div className="mx-4 py-3 space-y-4">
            <div className="flex gap-2 items-center text-gray-900">
              <MapIcon size={30} />{" "}
              <span className="text-base font-medium">Location</span>
            </div>
            <Map
              style={{
                width: "100%",
                height: "500px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
              defaultCenter={{
                lat: details.latitude,
                lng: details.longitude,
              }}
              defaultZoom={20}
              gestureHandling="greedy"
              disableDefaultUI
            >
              <Marker
                position={{ lat: details.latitude, lng: details.longitude }}
              />
            </Map>
          </div>
          <div className="px-4 flex flex-col gap-3">
            <h1 className="text-base font-semibold text-gray-900">Reviews</h1>
            <div>
              {details.reviews.map((review) => (
                <ReviewItem data={review} />
              ))}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 w-full bg-white p-3">
          <Button
            className="w-full bg-green-700"
            onClick={() => setOpenLandlord(true)}
          >
            Message Landlord
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
