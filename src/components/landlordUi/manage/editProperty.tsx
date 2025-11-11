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
import { useState, useEffect } from "react";
import type { ImageListType, ImageType } from "react-images-uploading";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { TpropertyType } from "@/types/enums";
import type { TProperty } from "@/types/appData";
import UpdatePropertyImages from "./updatePropertyImages";

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

type EditPropertyProps = {
  property: TProperty;
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
};

type TsetImage = {
    newImages: ImageListType;
    deleteImages: string[];
    currentImages: string[];
}

export default function EditProperty({ setClose, property }: EditPropertyProps) {
  const { session } = useAuthContext();

  const width = window.screen.width;

  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<ImageType | string>();
  const [images, setImages] = useState<TsetImage>();
  const [latLang, setLatLang] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [propertyType, setPropertyType] = useState<TpropertyType[]>([]);

  function listItemImages(payload: {
    newImages: ImageListType;
    deleteImages: string[];
    currentImages: string[];
  }) {
    // console.log(payload)
    setImages(payload)
  }

  function listItemThumbnail(thumb: ImageType | string | undefined) {
    // console.log(thumb)
    setThumbnail(thumb)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: property.name,
      description: property.description,
      address: property.address,
      propertyType: property.property_type.id.toString(),
      occupant: property.occupant.toString(),
      status: property.status,
      rent: +property.rent,
    },
  });

  useEffect(() => {
    async function getPropertyType() {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/property-type`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        return toast.error(json.message);
      }

      setPropertyType(json);
    }

    getPropertyType();
  }, []);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    let thumb;
    setLoading(true);

    if (images?.currentImages.length === images?.deleteImages.length) {
      toast.warning("Please select some property images.");
      return setLoading(false);
    }

    if (typeof thumbnail === "string" || typeof thumbnail === "undefined") {
      thumb = {
        type: "route",
        thumbnail: thumbnail
      }
    } else {
      thumb = {
        type: "file",
        thumbnail: thumbnail
      }
    }

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/landlord-update-property/${property.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          thumbnail: thumb,
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

    console.log(json);
    setLoading(false);
    toast.success(json.message);
    form.reset();
    setClose(prev => !prev)
  }

  return (
    <div className="flex flex-col font-roboto max-h-dvh w-full overflow-y-scroll top-0 left-0 bg-white fixed z-10">
      <div className="flex justify-between p-4">
        <h1 className="text-3xl text-gray-900 font-bold">Edit Property</h1>
        <button onClick={() => setClose((prev) => !prev)}>
          <X size={30} />
        </button>
      </div>
      <div className="mb-3">
        <h1 className="text-gray-900 font-semibold text-lg px-4">Edit Images</h1>
        <p className="px-4 mb-2 text-gray-900 text-base">
          The first image that selected will be the default thumbnail if not
          set.
        </p>
        <div>
          <UpdatePropertyImages listItemImages={listItemImages} listItemThumbnail={listItemThumbnail} propertyImages={property.images} propertyThumbnail={property.thumbnail}/>
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
                        required
                      >
                        <SelectTrigger className="border-gray-400">
                          <SelectValue placeholder="Property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyType.map((i) => (
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
                        required
                      >
                        <SelectTrigger className="border-gray-400">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unlisted">
                            Unlist for now
                          </SelectItem>
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
                  latLang ? latLang : { lat: property.latitude, lng: property.longitude }
                }
                defaultZoom={20}
                gestureHandling="greedy"
                disableDefaultUI
                onClick={(e) => setLatLang(e.detail.latLng)}
              >
                <Marker position={latLang ? latLang : { lat: property.latitude, lng: property.longitude }} />
              </Map>
            </div>
            <div className="flex justify-end gap-3 my-4">
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
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
