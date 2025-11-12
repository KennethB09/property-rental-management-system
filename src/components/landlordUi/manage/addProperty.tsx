import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { Map as MapIcon } from "lucide-react";
import UploadPropertyImages from "./uploadPropertyImages";
import { useState, useEffect } from "react";
import type { ImageListType, ImageType } from "react-images-uploading";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePropertyContext } from "@/hooks/usePropertyContext";
import { getFilters } from "@/hooks/useFetchData";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." })
    .max(1500, { message: "Description must not exceed 1500 characters." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters long" })
    .max(255, { message: "Address must not exceed 255 characters." }),
  propertyType: z.string().max(100),
  occupant: z.string().max(100),
  status: z.string().max(100),
  rent: z.number().max(999999999),
});

type AddPropertyProps = {
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddProperty({ setClose }: AddPropertyProps) {
  const { session } = useAuthContext();
  const { dispatch } = usePropertyContext();
  const { filters } = getFilters();

  const width = window.screen.width;

  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<ImageType>();
  const [images, setImages] = useState<ImageListType>([]);
  const [latLang, setLatLang] = useState<google.maps.LatLngLiteral | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      propertyType: "",
      occupant: "",
      status: "unlisted",
      rent: 1,
    },
  });

  useEffect(() => {
    function getUserLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          setLatLang({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
          }
        },
        {
          // Optional: Configuration options for getCurrentPosition
          enableHighAccuracy: true, // Request a more accurate position (may take longer)
          timeout: 5000, // Maximum time (in ms) to wait for a response
          maximumAge: 0, // Don't use a cached position
        }
      );
    }

    getUserLocation();
  }, []);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    if (images.length === 0) {
      toast.warning("Please select some property images.");
      return setLoading(false);
    }

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/landlord-list-property`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: session.user.id,
          thumbnail: thumbnail,
          images: JSON.stringify(images),
          lat: latLang?.lat,
          lng: latLang?.lng,
          title: values.title,
          description: values.description,
          address: values.address,
          propertyType: values.propertyType,
          occupant: values.occupant,
          status: values.status,
          rent: values.rent,
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setLoading(false);
      return toast.error(
        json.message || "Ops, something went wrong. Please try again."
      );
    }

    console.log(json.property);
    setLoading(false);
    dispatch({ type: "ADD_PROPERTY", payload: json.property })
    toast.success(json.message);
    form.reset();
    setClose(prev => !prev);
  }

  return (
    <div className="flex flex-col font-roboto max-h-full w-full overflow-y-scroll top-0 left-0 bg-white absolute">
      <div className="flex justify-between p-4">
        <h1 className="text-3xl text-gray-900 font-bold">Add Property</h1>
        <button onClick={() => setClose((prev) => !prev)}>
          <X size={30} />
        </button>
      </div>
      <div className="mb-3">
        <h1 className="text-gray-900 font-semibold text-lg px-4">Add Images</h1>
        <p className="px-4 mb-2 text-gray-900 text-base">
          The first image that selected will be the default thumbnail if not
          set.
        </p>
        <div>
          <UploadPropertyImages
            listItemThumbnail={setThumbnail}
            listItemImages={setImages}
          />
        </div>
      </div>
      <div className="px-4">
        <Form {...form}>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 text-base">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Title"
                      className="border-gray-400"
                      disabled={loading}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 text-base">
                    About this property
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description"
                      className="border-gray-400"
                      disabled={loading}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 text-base">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="address"
                      placeholder="Address"
                      className="border-gray-400"
                      disabled={loading}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-3">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-base">
                      Property type
                    </FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={loading}
                        required
                      >
                        <SelectTrigger className="border-gray-400">
                          <SelectValue placeholder="Property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filters.map((i) => (
                            <SelectItem key={i.id} value={i.id.toString()}>
                              {i.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-base">
                      Occupant
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Max occupant"
                        type="number"
                        className="border-gray-400"
                        disabled={loading}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-base">
                      Status
                    </FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={"unlisted"}
                        value={field.value}
                        disabled={loading}
                        required
                      >
                        <SelectTrigger className="border-gray-400">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unlisted">Unlist for now</SelectItem>
                          <SelectItem value="available">
                            List property
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 text-base">
                      Rent per month
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Rent"
                        type="number"
                        className="border-gray-400"
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                        disabled={loading}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2 text-gray-900">
              <div className="flex gap-2">
                <MapIcon />
                <h1 className="text-base font-semibold">Location</h1>
              </div>
              <Map
                style={{
                  width: "100%",
                  height: "500px",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
                defaultCenter={
                  latLang ? latLang : { lat: 12.881959, lng: 121.766541 }
                }
                defaultZoom={10}
                gestureHandling="greedy"
                disableDefaultUI
                onClick={(e) => setLatLang(e.detail.latLng)}
              >
                <Marker position={latLang} />
              </Map>
            </div>
            <div className="flex justify-end gap-3 mb-20 mt-4">
              <Button
                variant={"secondary"}
                onClick={() => setClose((prev) => !prev)}
                className="w-20 text-gray-900"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-28 bg-green-700">
                {loading ? (
                  <Loader2 size={25} className="animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
