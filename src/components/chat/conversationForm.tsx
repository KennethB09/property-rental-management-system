import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { UserRoundPlus, Send, Loader2, HousePlus } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import type { Ttenancies } from "@/types/appData";
import type { tenanciesInitiatedBy } from "@/types/enums";
import { useTenanciesContext } from "@/hooks/useTenanciesContext";

type ConversationFormProps = {
  landlordId: string;
  tenantId: string;
  propertyId: string;
  conversationId: string;
  addAsTenant?: () => void;
  rent?: () => void;
};

export default function ConversationForm({
  conversationId,
  landlordId,
  tenantId,
  propertyId,
}: ConversationFormProps) {
  const { session } = useAuthContext();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch, tenancies } = useTenanciesContext();
  const [checkTenancy, setCheckTenancy] = useState(false);

  useEffect(() => {
    const isInTenancies = tenancies
      .map((tenancy) => tenancy.property_id.id)
      .includes(propertyId);
    setCheckTenancy(isInTenancies);
  }, [tenancies]);

  async function createTenancy(param: tenanciesInitiatedBy) {
    const tenancy: Ttenancies = {
      landlord_id: landlordId,
      tenant_id: tenantId,
      property_id: propertyId,
      status: "pending",
      initiated_by: param,
    };

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/tenancy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(tenancy),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      return toast.error(json.message);
    }

    toast.success("Tenant request Sent.");
    dispatch({ type: "ADD_REQUEST", payload: json });
    // TODO: Create message after request.
  }

  async function sendMessage() {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/rent-ease/api/send-message/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            senderId: session.user.id,
            message: message,
            replyingTo: replyingTo,
          }),
        }
      );

      if (!response.ok) {
        const json = await response.json();
        toast.error(json.message || "Failed to send message");
        setIsLoading(false);
        return;
      }

      setMessage("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-3 p-4">
      {!checkTenancy &&
        (session.user.user_metadata.role === "landlord" ? (
          <Button
            className="bg-green-700"
            onClick={() => createTenancy("landlord")}
          >
            <UserRoundPlus />
            Add as tenant
          </Button>
        ) : (
          <Button
            className="bg-green-700"
            onClick={() => createTenancy("tenant")}
          >
            <HousePlus />
            Rent
          </Button>
        ))}
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
        disabled={isLoading}
      />
      <Button
        onClick={sendMessage}
        disabled={isLoading}
        className="bg-green-700"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
      </Button>
    </div>
  );
}
