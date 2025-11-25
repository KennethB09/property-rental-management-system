import {
  PhilippinePeso,
  House,
  MapPin,
  User,
  Map as MapIcon,
  Pen,
  ArrowLeft,
  X
} from "lucide-react";
import type { TProperty } from "@/types/appData";
import { useAuthContext } from "@/context/AuthContext";
import { useState, useRef, useEffect, type SetStateAction } from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";
import EditProperty from "./editProperty";
import DeleteProperty from "./deleteProperty";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type PropertyInfoProps = {
  property: TProperty;
  open: boolean;
  setClose: React.Dispatch<SetStateAction<boolean>>;
};

export default function PropertyInfo({
  property,
  open,
  setClose,
}: PropertyInfoProps) {
  const { session } = useAuthContext();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewerOpen && viewerContainerRef.current) {
      const container = viewerContainerRef.current;
      container.scrollLeft = selectedIndex * container.clientWidth;
    }
  }, [viewerOpen, selectedIndex]);

  return (
    <Dialog open={open} onOpenChange={setClose}>
      <DialogContent className="[&>button]:hidden flex flex-col overflow-clip font-roboto min-w-screen h-screen p-0 rounded-none lg:h-3/4 lg:min-w-2/3 lg:border lg:border-gray-300 lg:rounded-2xl gap-0">
        {editFormOpen && (
          <EditProperty property={property} setClose={setEditFormOpen} />
        )}

        {!editFormOpen && (
          <>
            <DialogHeader className="lg:border-b lg:border-gray-300">
              <div className="flex px-4 text-gray-900 h-16 justify-between items-center">
                <button
                  className="w-full"
                  onClick={() => setClose((prev) => !prev)}
                >
                  <ArrowLeft size={30} />
                </button>
                <DialogTitle className="w-fit text-2xl text-gray-900 font-bold ">
                  Property
                </DialogTitle>
                <div className="flex gap-4 justify-end w-full">
                  <button onClick={() => setEditFormOpen((prev) => !prev)}>
                    <Pen />
                  </button>
                  <DeleteProperty id={property.id} />
                </div>
              </div>
              <DialogDescription hidden>Property information</DialogDescription>
            </DialogHeader>

            {viewerOpen && (
              <div className="fixed inset-0 z-50 bg-gray-950/95">
                <button
                  type="button"
                  className="absolute top-4 right-4 z-60 px-3 py-1"
                  onClick={() => setViewerOpen(false)}
                >
                  <X className="text-white" size={25}/>
                </button>

                <div
                  ref={viewerContainerRef}
                  className="h-full w-full flex overflow-x-auto snap-x snap-mandatory"
                >
                  {property.images.map((image, index) => (
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
              <div className="w-full bg-gray-800 overflow-x-auto snap-x snap-mandatory flex lg:w-1/2 items-center">
                {property.images && property.images.length !== 0 ? (
                  property.images.map((image, index) => (
                    <div
                      key={index}
                      className="snap-start shrink-0 w-full h-96"
                    >
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

              <div className="lg:w-1/2 lg:overflow-y-auto lg:h-full h-1/2">
                <div className="m-4">
                  <h1 className="text-3xl font-bold text-center text-gray-900">
                    {property.name}
                  </h1>
                  <div className="flex justify-center gap-7 font-semibold text-gray-500 my-3">
                    <span>Reviews {}</span>
                    <span>Ratings {}</span>
                    <span className="capitalize">{property.status}</span>
                  </div>
                </div>

                <div className="mx-4 border-y-2 py-3 border-gray-300">
                  <div>
                    <img />
                  </div>
                  <div className="">
                    <h1 className="font-bold text-lg">
                      {session.user.user_metadata.first_name}{" "}
                      {session.user.user_metadata.last_name}
                    </h1>
                    <span className="capitalize font-semibold text-gray-700">
                      {session.user.user_metadata.role}
                    </span>
                  </div>
                </div>

                <div className="mx-4 py-3 space-y-3 text-gray-900 text-base font-medium">
                  <div className="flex gap-2 items-center">
                    <PhilippinePeso size={30} />{" "}
                    <span>{property.rent} per month</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <House size={30} />{" "}
                    <span>{property.property_type.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <MapPin size={30} />{" "}
                    <span className="w-4/5">{property.address}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <User size={30} /> <span>{property.occupant} tenant</span>
                  </div>
                  <span className="text-gray-500">{property.created_at}</span>
                </div>

                <div className="space-y-3 mx-4 border-y-2 py-3 border-gray-300">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    About this property
                  </h1>
                  <p className="text-gray-700 text-base font-medium">
                    {property.description}
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
                      lat: property.latitude,
                      lng: property.longitude,
                    }}
                    defaultZoom={20}
                    gestureHandling="cooperative"
                    disableDefaultUI
                  >
                    <Marker
                      position={{
                        lat: property.latitude,
                        lng: property.longitude,
                      }}
                    />
                  </Map>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
