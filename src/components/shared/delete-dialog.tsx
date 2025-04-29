"use client";

import { useState } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface DeleteDialogProps {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}

export default function DeleteDialog({ id, action }: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await action(id);

      if (!res.success) {
        toast.error(
          <div className="flex items-center justify-between gap-4">
            <span className="text-red-600 font-semibold">{res.message}</span>
          </div>
        );
      } else {
        setOpen(false);
        toast.success(
          <div className="flex items-center justify-between gap-4">
            <span className="text-green-600 font-semibold">{res.message}</span>
          </div>
        );
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" className="ml-2 ">
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl shadow-lg p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-red-600">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            This action cannot be undone. This will permanently delete this
            item.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel className="rounded-xl border-gray-300 hover:bg-gray-100">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleDeleteClick}
            className="rounded-xl"
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
