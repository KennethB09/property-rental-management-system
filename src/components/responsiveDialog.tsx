import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ResponsiveDialogProps = {
  setState: React.Dispatch<React.SetStateAction<boolean>>
  state: boolean;
}

export default function ResponsiveDialog({ setState, state }: ResponsiveDialogProps) {
  const [open, setOpen] = React.useState(false);
  const width = window.screen.width;

  if (width >= 768) {
    return (
      <Dialog open={state} onOpenChange={setState}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account Set-up</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={state} onOpenChange={setState}>
      {/* <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger> */}
      <DrawerContent className="bg-white">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-roboto text-gray-900 font-semibold text-start">Account Set-up</DrawerTitle>
          <DrawerDescription hidden>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="font-roboto">Maybe later</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <Label htmlFor="address" className="text-gray-900 font-roboto font-semibold">Address</Label>
        <Input type="address" id="address" defaultValue="" className="border-gray-900"/>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="business" className="text-gray-900 font-roboto font-semibold">Business Name</Label>
        <Input id="business" defaultValue="" className="border-gray-900"/>
      </div>
        <div className="grid gap-3">
        <Label htmlFor="number" className="text-gray-900 font-roboto font-semibold">Phone Number</Label>
        <Input id="number" defaultValue="" className="border-gray-900"/>
      </div>
      <Button type="submit" className="bg-green-700 hover:bg-green-900 font-roboto">Save changes</Button>
    </form>
  );
}
