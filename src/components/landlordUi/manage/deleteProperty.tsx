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
        return toast.error(json.message)
    }

    setLoading(false);
    dispatch({ type: "DELETE_PROPERTY", payload: id })
    toast.success(json.message)
    setIsOpen(false);
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
          <Button onClick={handleDelete} disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : "Delete"}</Button>
          <DrawerClose>
            <Button variant={"secondary"} className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
