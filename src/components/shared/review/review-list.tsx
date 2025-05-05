"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

//Review types
import { Review } from "@/types";

//Review Form
import ReviewForm from "./review-form";

//action methods
import { getReviews } from "@/lib/actions/review.actions";

//ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Calendar, User } from "lucide-react";

//format date
import { formatDateTime } from "@/lib/utils";

// Toast
import { toast } from "sonner";

import Rating from "../product/rating";

interface ReviewListProps {
  userId: string;
  productId: string;
  productSlug: string;
}

export default function ReviewList({
  userId,
  productId,
  productSlug,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    /// Load reviews from the database
    const loadReviews = async () => {
      const res = await getReviews({ productId });
      setReviews(res.data);
    };

    loadReviews();
  }, [productId]);

  // Reload reviews when a review is submitted
  const reload = async () => {
    try {
      const res = await getReviews({ productId });
      setReviews([...res.data]);
    } catch (err) {
      console.log(err);

      toast.success(
        <div className="flex items-center justify-between gap-4">
          <span className="text-red-600 font-medium">
            Error in fetching reviews
          </span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          Please
          <Link
            className="text-primary px-2"
            href={`/api/auth/signin?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />

                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />

                  {review.user ? review.user.name : "Deleted User"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
