import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ImageUploading from "react-images-uploading";
import type { ImageListType, ImageType } from "react-images-uploading";

type UploadPropertyImagesProps = {
  // callback that receives either an ImageType (new upload) or a string (existing route) or undefined
  listItemThumbnail: (thumb: ImageType | string | undefined) => void;
  // callback to receive current state: new images to upload, images to delete, and remaining existing images
  listItemImages: (payload: {
    newImages: ImageListType;
    deleteImages: string[];
    currentImages: string[];
  }) => void;
  propertyImages: string[];
  propertyThumbnail: string;
};

export default function UpdatePropertyImages({ listItemThumbnail, listItemImages, propertyImages, propertyThumbnail }: UploadPropertyImagesProps) {
  const maxImages = 10;
  // images already stored in DB (routes)
  const [currentImages, setCurrentImages] = useState<string[]>(propertyImages || []);
  const [deleteImages, setDeleteImages] = useState<string[] | []>([]);
  const [images, setImages] = useState<ImageListType>([]);
  // thumbnail can be either an existing route string or a new ImageType
  const [thumbnail, setThumbnail] = useState<ImageType | string | undefined>(propertyThumbnail || undefined);

  const onChange = (
    imageList: ImageListType
  ) => {
    setImages(imageList);
    // if user uploads new images and no thumbnail selected from existing, default to first new image
    if (!thumbnail) setThumbnail(imageList[0]);
  };

  function handleSetThumbnail(image: ImageType) {
    // set thumbnail to a new uploaded image (ImageType)
    // if already selected, toggle off
    if (typeof thumbnail !== "string" && image.file?.name === (thumbnail as ImageType | undefined)?.file?.name) {
      setThumbnail(undefined);
      return;
    }
    setThumbnail(image);
  }

  function handleSetExistingThumbnail(route: string) {
    if (thumbnail === route) {
      setThumbnail(undefined);
      return;
    }
    setThumbnail(route);
  }

  function removeExistingImage(route: string) {
    // mark for deletion and remove from currentImages
    setDeleteImages((prev) => [...prev, route]);
    setCurrentImages((prev) => prev.filter((r) => r !== route));
    // if this was selected as thumbnail, unset
    if (thumbnail === route) setThumbnail(undefined);
  }

  // viewer state: whether fullscreen viewer is open and which index to show first
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const viewerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewerOpen && viewerContainerRef.current) {
      const container = viewerContainerRef.current;
      // snap to the selected slide by setting scrollLeft
      container.scrollLeft = selectedIndex * container.clientWidth;
    }
  }, [viewerOpen, selectedIndex]);

  useEffect(() => {
    // expose current states to parent: new images to upload, existing images to delete, and remaining existing images
    listItemThumbnail(thumbnail);
    listItemImages({ newImages: images, deleteImages: deleteImages as string[], currentImages });
  }, [images, thumbnail, deleteImages, currentImages]);

  return (
    <div className="w-full font-roboto">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxImages}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="w-full flex px-4 flex-col gap-2">
            {imageList.length === 0 && currentImages.length === 0 && (
              <div className="w-full h-60 flex justify-center items-center rounded-2xl bg-gray-300">
                <button
                  type="button"
                  style={isDragging ? { color: "red" } : undefined}
                  onClick={onImageUpload}
                  className="flex flex-col justify-center items-center gap-2 text-gray-900"
                  {...dragProps}
                >
                  <ImagePlus size={40} />
                  Click or Drop here
                </button>
              </div>
            )}

            <div className="w-full overflow-y-scroll flex gap-2">
              {/* render existing images first (routes) */}
              {currentImages.map((route, idx) => (
                <div
                  key={`existing-${route}-${idx}`}
                  className="overflow-clip relative h-52 aspect-square items-center justify-center bg-gray-900 flex flex-col rounded-2xl border-1 border-gray-400"
                  style={ typeof thumbnail === 'string' && thumbnail === route ? { border: "3px solid oklch(52.7% 0.154 150.069)" } : undefined }
                >
                  <button
                    type="button"
                    className="w-full h-full p-0"
                    onClick={() => {
                      setSelectedIndex(idx);
                      setViewerOpen(true);
                    }}
                    aria-label={`Open image ${idx + 1} in viewer`}
                  >
                    <img
                      src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${route}`}
                      alt={`existing image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {/* <div className="absolute bottom-2 left-2 flex gap-2">
                    <button type="button" className="px-2 py-1 bg-white text-black rounded" onClick={() => handleSetExistingThumbnail(route)}>
                      {thumbnail === route ? "Selected" : "Set as thumbnail"}
                    </button>
                    <button type="button" className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => removeExistingImage(route)}>
                      Remove
                    </button>
                  </div> */}
                </div>
              ))}

              {/* render newly uploaded images */}
              {imageList.map((image, index) => (
                <div
                  key={`new-${index}`}
                  className="overflow-clip relative h-52 aspect-square items-center justify-center bg-gray-900 flex flex-col rounded-2xl border-1 border-gray-400"
                  style={ typeof thumbnail !== 'string' && (thumbnail as ImageType | undefined)?.file?.name === image.file?.name ? { border: "3px solid oklch(52.7% 0.154 150.069)" } : undefined }
                >
                  <button
                    type="button"
                    className="w-full h-full p-0"
                    onClick={() => {
                      // new images are after existing ones in the viewer
                      setSelectedIndex(currentImages.length + index);
                      setViewerOpen(true);
                    }}
                    aria-label={`Open image ${currentImages.length + index + 1} in viewer`}
                  >
                    <img
                      src={image["data_url"]}
                      alt={`selected image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              ))}
            </div>

            {currentImages.length !== 0 && <Button onClick={onImageUpload}>Add Image</Button>}

            {imageList.length !== 0 && (
              <Button
                variant={"outline"}
                type="button"
                onClick={onImageRemoveAll}
                className=" text-gray-900"
              >
                Remove all images
              </Button>
            )}
            
            {/* Image viewer */}
            {viewerOpen && (
              <div className="fixed inset-0 z-50 bg-gray-950/95">
                <button
                  type="button"
                  className="absolute top-4 right-4 z-60 px-3 py-1 bg-white text-black rounded"
                  onClick={() => setViewerOpen(false)}
                >
                  Close
                </button>

                <div
                  ref={viewerContainerRef}
                  className="h-full w-full flex overflow-x-auto snap-x snap-mandatory"
                >
                  {/* build combined view: existing images then new uploads */}
                  {[
                    ...currentImages.map((route) => ({ type: "existing", route })),
                    ...images.map((img) => ({ type: "new", img })),
                  ].map((item, idx) => (
                    <div
                      key={(item as any).route ?? (item as any).img?.data_url ?? idx}
                      className="relative snap-center snap-always min-w-full h-full flex items-center justify-center"
                    >
                      {item.type === "existing" ? (
                        <img
                          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${(item as any).route}`}
                          alt={`Full image ${idx + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <img
                          src={(item as any).img.data_url}
                          alt={`Full image ${idx + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      )}

                      <div className="w-full flex justify-between items-center p-3 absolute bottom-0 left-0">
                        {item.type === "new" ? (
                          <>
                            <Button onClick={() => {
                              const replaceIndex = images.findIndex(i => i.data_url === (item as any).img.data_url);
                              if (replaceIndex !== -1) onImageUpdate(replaceIndex);
                            }}>
                              Replace
                            </Button>
                            <Button
                              variant={"secondary"}
                              onClick={() => {
                                const removeIndex = images.findIndex(i => i.data_url === (item as any).img.data_url);
                                if (removeIndex !== -1) onImageRemove(removeIndex);
                              }}
                            >
                              Remove
                            </Button>
                            <Button
                              className="bg-green-700 w-1/2"
                              size={"lg"}
                              onClick={() => handleSetThumbnail((item as any).img)}
                            >
                              {typeof thumbnail !== 'string' && (thumbnail as ImageType | undefined)?.file?.name === (item as any).img.file?.name ? "Selected thumbnail" : "Set as thumbnail"}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant={"secondary"}
                              onClick={() => removeExistingImage((item as any).route)}
                            >
                              Remove
                            </Button>
                            <Button
                              className="bg-green-700 w-1/2"
                              size={"lg"}
                              onClick={() => handleSetExistingThumbnail((item as any).route)}
                            >
                              {thumbnail === (item as any).route ? "Selected thumbnail" : "Set as thumbnail"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
