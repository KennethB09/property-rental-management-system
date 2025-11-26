import ImageUploading from "react-images-uploading";
import Cropper from "react-easy-crop";
import type { ImageListType } from "react-images-uploading";
import type { Point, Area } from "react-easy-crop";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { getCroppedImg } from "@/lib/cropImage";
import { Pen, User } from "lucide-react";

type ProfileUploadProps = {
  setProfile: React.Dispatch<React.SetStateAction<string | null>>
}

export default function ProfileUpload({ setProfile }: ProfileUploadProps) {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [userCropping, setUserCropping] = useState(false);

  const [image, setImage] = useState<ImageListType | null>(null);
  const maxNumber = 69;

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image![0].dataURL!,
        croppedAreaPixels
      );

      setProfile(croppedImage);
      setImage([{ dataURL: croppedImage }]);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const cancelCrop = () => {
    setImage(null);
    setUserCropping(false);
  };

  const onChange = (
    imageList: ImageListType,
    _addUpdatedIndex?: Array<number>
  ) => {
    setImage(imageList);
    setUserCropping(true);
  };

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <div>
      <ImageUploading
        multiple={false}
        value={[]}
        acceptType={["png", "jpeg", "webp", "jpg"]}
        onChange={onChange}
        maxNumber={maxNumber}
      >
        {({ onImageUpload }) => (
          // write your building UI
          <div className="flex justify-center items-center">
            <div className="relative flex justify-center items-center rounded-full border-1 border-gray-900 text-green-700 w-28 aspect-square">
              {!image ? (
                <>
                  <User size={70} />
                  <span
                    className="flex justify-center items-center bg-white p-1 absolute bottom-0 right-0 rounded-full border-1 border-gray-900 w-10 aspect-square"
                    onClick={onImageUpload}
                  >
                    <Pen />
                  </span>
                </>
              ) : (
                <>
                  <div className="flex overflow-hidden rounded-full justify-center items-center w-full">
                    <img
                      src={image[0].dataURL}
                      className="object-cover aspect-square w-full"
                    />
                  </div>
                  <span
                    className="flex justify-center items-center bg-white p-1 absolute bottom-0 right-0 rounded-full border-1 border-gray-900 w-10 aspect-square"
                    onClick={onImageUpload}
                  >
                    <Pen />
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </ImageUploading>

      <Dialog open={userCropping} onOpenChange={setUserCropping}>
        <DialogContent className="max-w-full h-full rounded-none p-0 border-0 md:max-w-96 md:max-h-4/5 md:rounded-[10px] md:border-1 overflow-hidden">
          <DialogHeader className="z-10 bg-black h-12 justify-center px-4">
            <DialogTitle className="text-white">Crop Image</DialogTitle>
            <DialogDescription hidden>Crop the image you selected.</DialogDescription>
          </DialogHeader>
          {image !== null && (
            <Cropper
              image={image[0].dataURL}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
          <div className="z-10 flex gap-2 justify-end items-center mt-auto bg-black h-16 px-4">
            <DialogClose asChild>
              <Button
                onClick={cancelCrop}
                variant={"secondary"}
                className="w-20 text-gray-900"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={showCroppedImage}
                className="w-20 bg-green-700 hover:bg-green-900"
              >
                Save
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
