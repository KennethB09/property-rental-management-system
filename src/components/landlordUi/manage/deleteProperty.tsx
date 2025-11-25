import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerDescription,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { usePropertyContext } from "@/hooks/usePropertyContext";

type DeletePropertyProps = {
  id: string;
};

export default function DeleteProperty({ id }: DeletePropertyProps) {
  const { session } = useAuthContext();
  const { dispatch } = usePropertyContext();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const viewWith = window.innerWidth;

  async function handleDelete() {
    setLoading(true);

    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/rent-ease/api/landlord-delete-property/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      console.log(json.message);
      setLoading(false);
      return toast.error(json.message);
    }

    setLoading(false);
    dispatch({ type: "DELETE_PROPERTY", payload: id });
    toast.success(json.message);
    setIsOpen(false);
  }

  if (viewWith >= 768) {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger>
          <button>
            <Trash2 />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleDelete} disabled={loading} className="bg-green-700">
              {loading ? <Loader2 className="animate-spin" /> : "Delete"}
            </Button>
            <AlertDialogCancel className="">
                Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <button>
          <Trash2 />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Delete Property</DrawerTitle>
          <DrawerDescription>
            Are you sure you want to delete this property?
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Delete"}
          </Button>
          <DrawerClose>
            <Button variant={"secondary"} className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
