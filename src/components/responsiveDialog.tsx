import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ProfileSetupForm from "./profileSetupForm";
import svg from "@/assets/svgs/undraw_fill-forms.svg";

type ResponsiveDialogProps = {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  state: boolean;
};

export default function ResponsiveDialog({
  setState,
  state,
}: ResponsiveDialogProps) {
  const width = window.screen.width;

  if (width >= 768) {
    return (
      <Dialog open={state} onOpenChange={setState}>
        <DialogContent className="font-roboto sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Account Set-up</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save changes when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="sm:flex gap-10">
            <div className="w-3/5 text-center space-y-10 flex flex-col justify-center items-center">
              <img src={svg} className="aspect-auto w-4/5" />
              <h1 className="font-bold text-3xl text-gray-900">
                <span className="text-green-700">Almost there</span>! Let's
                finish <wbr />
                setting up your account.
              </h1>
            </div>
            <div className="w-1/2">
              <ProfileSetupForm setClose={setState} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={state} onOpenChange={setState}>
      <DrawerContent className="min-h-fit">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-roboto text-gray-900 font-semibold text-start">
            Account Set-up
          </DrawerTitle>
          <DrawerDescription hidden>
            Make changes to your profile here. Click save changes when
            you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileSetupForm setClose={setState} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="font-roboto">
              Maybe later
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
