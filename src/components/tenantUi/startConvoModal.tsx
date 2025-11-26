import { useState, type SetStateAction } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import type { listing } from "@/types/interface";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { useConversationContext } from "@/hooks/useConversationContext";

type StartConvoModalProps = {
  property: listing;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function StartConvoModal({
  property,
  open,
  setOpen,
}: StartConvoModalProps) {
  const { session } = useAuthContext();
  const { dispatch } = useConversationContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function startConversation() {
    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/start-conversation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          listing_Id: property.id,
          landlord_Id: property.landlord_ID.id,
          tenant_Id: session.user.id,
          message: message
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      console.log(json.error)
      return toast.error(json.error);
    }

    dispatch({ type: "NEW_CONVERSATION", payload: json });
    navigate("/tenant/dashboard/chats", {
      state: json,
    });
    setIsLoading(false);
    localStorage.setItem("TenantActiveTab", "Chats");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Chat Landlord</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={isLoading} onClick={startConversation} className="bg-green-700 hover:bg-green-900 text-slate-100">Send Message</Button>
          <Input
            value={message}
            placeholder="Message"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startConversation()}
            disabled={isLoading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
