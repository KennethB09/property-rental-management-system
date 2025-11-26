import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import type { tenancies } from "@/types/interface";

type ReviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, reviewText: string) => void;
  isLoading?: boolean;
  data: tenancies;
};

export default function ReviewDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  data,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const width = window.screen.width;

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    onSubmit(rating, reviewText);
    // Reset form
    setRating(0);
    setReviewText("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setRating(0);
      setReviewText("");
    }
    onOpenChange(newOpen);
  };

  const content = (
    <div className="space-y-6 py-4">
      <div className="flex gap-2 overflow-hidden items-center">
        <img
          className="object-cover aspect-square rounded-2xl w-16 h-16"
          src={`https://bdmyzcymcqiuqanmbmrn.supabase.co/storage/v1/object/public/listings_image/${data.property_id.thumbnail}`}
        />

        <h1 className="truncate text-lg font-semibold text-gray-900 dark:text-slate-100">
          {data.property_id.name}
        </h1>
      </div>
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-semibold mb-3">
          Rate your experience
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Write your review
        </label>
        <Textarea
          placeholder="Share your experience..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="min-h-32 resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-green-700 hover:bg-green-800 text-slate-100"
      >
        {isLoading ? "Posting..." : "Post"}
      </Button>
    </div>
  );

  if (width >= 768) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="dark:bg-gray-900">
        <DrawerHeader>
          <DrawerTitle>Write a Review</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
