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
import type { listing, message } from "@/types/interface";
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

  async function startConversation() {

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
      return toast.error(json.error);
    }

    dispatch({ type: "NEW_CONVERSATION", payload: json });
    navigate("/tenant/dashboard/chats", {
      state: json,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat Landlord</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={startConversation}>Send</Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startConversation()}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
