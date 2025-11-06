import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useState, useRef, useEffect, type SetStateAction } from "react";
import ImageUploading from "react-images-uploading";
import type { ImageListType, ImageType } from "react-images-uploading";

type UploadPropertyImagesProps = {
  listItemThumbnail: React.Dispatch<SetStateAction<ImageType | undefined>>;
  listItemImages: React.Dispatch<SetStateAction<ImageListType>>;
}

export default function UploadPropertyImages({ listItemThumbnail, listItemImages }: UploadPropertyImagesProps) {
  const maxImages = 10;
  const [images, setImages] = useState<ImageListType>([]);
  const [thumbnail, setThumbnail] = useState<ImageType>();

  const onChange = (
    imageList: ImageListType,
    addUpdatedIndex?: Array<number>
  ) => {
    setImages(imageList);
    setThumbnail(imageList[0]);
  };

  function handleSetThumbnail(image: ImageType) {
    if (image.file?.name === thumbnail?.file?.name) {
      return setThumbnail(undefined);
    }
    setThumbnail(image);
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
    listItemThumbnail(thumbnail);
    listItemImages(images);
  }, [images, thumbnail]);

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
          // write your building UI
          <div className="w-full flex px-4 flex-col gap-2">
            {imageList.length === 0 && (
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
              {imageList.map((image, index) => (
                <div
                  key={index}
                  className="overflow-clip relative h-52 aspect-square items-center justify-center bg-gray-900 flex flex-col rounded-2xl border-1 border-gray-400"
                  style={thumbnail?.file?.name === image.file?.name ? {
                    border: "3px solid oklch(52.7% 0.154 150.069)"
                  } : undefined}
                >
                  <button
                    type="button"
                    className="w-full h-full p-0"
                    onClick={() => {
                      setSelectedIndex(index);
                      setViewerOpen(true);
                    }}
                    aria-label={`Open image ${index + 1} in viewer`}
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
            {/* Fullscreen viewer: fixed to viewport so it sticks on screen */}
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
                  {images.map((image, index) => (
                    <div
                      key={(image as any).data_url ?? index}
                      className="relative snap-center snap-always min-w-full h-full flex flex-col items-center justify-center"
                    >
                      <img
                        src={(image as any)["data_url"]}
                        className="max-w-full max-h-full"
                      />

                      <div className="w-full flex justify-between items-center p-3 absolute bottom-0 left-0">
                        <Button onClick={() => onImageUpdate(index)}>
                          Replace
                        </Button>
                        <Button
                          variant={"secondary"}
                          onClick={() => onImageRemove(index)}
                        >
                          Remove
                        </Button>
                        <Button
                          className="bg-green-700 w-1/2"
                          size={"lg"}
                          onClick={() => handleSetThumbnail(image)}
                        >
                          {thumbnail?.file?.name === image.file?.name ? "Selected thumbnail" : "Set as thumbnail"}
                        </Button>
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
