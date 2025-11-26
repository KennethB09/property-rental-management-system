import { useTenanciesContext } from "@/hooks/useTenanciesContext";
import PastRentalItem from "./pastRentalItem";
import { useState } from "react";
import ReviewDialog from "@/components/review/reviewDialog";
import type { tenancies } from "@/types/interface";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

export default function TenantPastRentals() {
  const { tenancies } = useTenanciesContext();
  const filterRenting = tenancies.filter((item) => item.status === "ended");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [toReview, setToReview] = useState<tenancies | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuthContext();

  const handleSubmitReview = async (rating: number, reviewText: string) => {
    setIsLoading(true);

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/rent-ease/api/post-review/${toReview?.property_id.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        tenant: session.user.id,
        content: reviewText,
        rating: rating
      })
    })

    const json = await response.json();

    if (!response.ok) {
      console.log(json.message)
      setReviewOpen(false);
      setIsLoading(false);
      return toast.error("Ops, something went wrong. Please try again.")
    }

    setIsLoading(false);
    setReviewOpen(false);
    toast.success("Review posted successfully.")
  };

  function handleClick(data: tenancies) {
    setToReview(data)
    setReviewOpen(prev => !prev);
  }

  return (
    <div className="flex flex-col-reverse gap-2">
      {toReview && <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onSubmit={handleSubmitReview}
        isLoading={isLoading}
        data={toReview}
      />}
      {filterRenting.map((item) => (
        <PastRentalItem key={item.id} pastRental={item} handleClick={handleClick}/>
      ))}
    </div>
  );
}
