import {
  ArrowLeft,
  Heart,
  PhilippinePeso,
  House,
  MapPin,
  User,
  Map as MapIcon,
  X
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
import { useState, useRef, useEffect } from "react";
import StartConvoModal from "./startConvoModal";
import ReviewItem from "../review/reviewItem";
import { format } from "date-fns";

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
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
      if (viewerOpen && viewerContainerRef.current) {
        const container = viewerContainerRef.current;
        container.scrollLeft = selectedIndex * container.clientWidth;
      }
    }, [viewerOpen, selectedIndex]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {openMessageLandlord && (
        <StartConvoModal
          open={openMessageLandlord}
          setOpen={setOpenLandlord}
          property={details}
        />
      )}

      <DialogContent className="[&>button]:hidden p-0 border-0 min-w-full h-screen rounded-none overflow-y-scroll lg:min-w-[800px] lg:h-3/4 lg:rounded-2xl lg:flex lg:flex-col no-scrollbar dark:bg-gray-900">
        <DialogHeader className="absolute z-10 flex-row justify-between bg-black/80 w-full text-white p-3 lg:w-1/2">
          <DialogClose className="w-fit">
            <ArrowLeft size={30} />
          </DialogClose>
          <DialogTitle className="text-2xl text-slate-100">Details</DialogTitle>
          <button onClick={handleSave}>
            {isSave ? (
              <Heart
                size={25}
                fill="oklch(52.7% 0.154 150.069)"
                className="font-semibold"
              />
            ) : (
              <Heart size={25} />
            )}
          </button>
          <DialogDescription hidden>
            Details of listed property
          </DialogDescription>
        </DialogHeader>

        {viewerOpen && (
          <div className="fixed inset-0 z-50 bg-gray-950/95">
            <button
              type="button"
              className="absolute top-4 right-4 z-60 px-3 py-1"
              onClick={() => setViewerOpen(false)}
            >
              <X className="text-white" size={25} />
            </button>

            <div
              ref={viewerContainerRef}
              className="h-full w-full flex overflow-x-auto snap-x snap-mandatory"
            >
              {details.images.map((image, index) => (
                <div
                  key={index}
                  className="relative snap-center snap-always min-w-full h-full flex  justify-center"
                >
                  <img
                    src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${image}`}
                    alt={`Full size property image ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col overflow-y-auto lg:justify-between lg:flex-row h-full">
          <div className="w-full bg-gray-950 overflow-x-auto snap-x snap-mandatory flex lg:w-1/2 items-center">
            {details.images && details.images.length !== 0 ? (
              details.images.map((image, index) => (
                <div key={index} className="snap-start shrink-0 w-full h-96">
                  <button
                    type="button"
                    className="w-full h-full p-0 block"
                    onClick={() => {
                      setSelectedIndex(index);
                      setViewerOpen(true);
                    }}
                    aria-label={`Open image ${index + 1} in viewer`}
                  >
                    <img
                      className="w-full h-full object-cover bg-gray-900"
                      src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${image}`}
                      alt={`Property image ${index + 1}`}
                    />
                  </button>
                </div>
              ))
            ) : (
              <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-gray-500">
                No Images Available
              </div>
            )}
          </div>

          <div className="lg:w-1/2 lg:h-full lg:overflow-y-auto no-scrollbar max-sm:h-1/2">
            <div className="m-4">
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-slate-100">
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
                <h1 className="font-bold text-lg text-slate-100">
                  {details.landlord_ID.first_name}{" "}
                  {details.landlord_ID.last_name}
                </h1>
                <span className="capitalize font-semibold text-gray-500">
                  Landlord
                </span>
              </div>
            </div>

            <div className="mx-4 py-3 space-y-3 text-gray-900 dark:text-gray-100 text-base font-medium">
              <div className="flex gap-2 items-center">
                <PhilippinePeso size={30} />{" "}
                <span>{details.rent} per month</span>
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
              <span className="text-gray-500 dark:text-slate-500">{format(new Date(details.created_at), "MMM dd, yyyy h:mm aa")}</span>
            </div>

            <div className="space-y-3 mx-4 border-y-2 py-3 border-gray-300">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">
                About this property
              </h1>
              <p className="text-gray-700 dark:text-slate-400 text-base font-medium">
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
                gestureHandling="cooperative"
                disableDefaultUI
              >
                <Marker
                  position={{ lat: details.latitude, lng: details.longitude }}
                />
              </Map>
            </div>
            <div className="px-4 flex flex-col gap-3 pb-16">
              <h1 className="text-base font-semibold text-gray-900 dark:text-slate-100">Reviews</h1>
              <div className="flex flex-col-reverse gap-2">
                {details.reviews.map((review) => (
                  <ReviewItem key={review.id} data={review} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky lg:absolute bottom-0 w-full bg-white dark:bg-gray-800 p-3 lg:w-1/2 lg:right-0">
          <Button
            className="w-full bg-green-700 hover:bg-green-900 text-slate-100"
            onClick={() => setOpenLandlord(true)}
          >
            Message Landlord
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
