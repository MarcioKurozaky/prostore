"use client";

import { useRouter } from "next/navigation";

// Toast
import { toast } from "sonner";

// Default Values
import { categoryDefaultValues } from "@/lib/constants";

// Validators
import { insertCategorySchema, updateCategorySchema } from "@/lib/validators";

// Types
//import { Category } from "@/types";

// React Hook Form e Zod
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// UI Components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Actions
import { createCategory, updateCategory } from "@/lib/actions/category.actions";
import { Category } from "@/types";

// Type Product Form Values
type FormValuesProps =
  | z.infer<typeof insertCategorySchema>
  | z.infer<typeof updateCategorySchema>;

interface CategoryFormProps {
  type: "Create" | "Update";
  category?: Category;
  categoryId?: string;
}

export default function CategoryForm({
  type,
  category,
  categoryId,
}: CategoryFormProps) {
  const router = useRouter();

  const form = useForm<FormValuesProps>({
    resolver: zodResolver(
      type === "Update" ? updateCategorySchema : insertCategorySchema
    ),
    defaultValues:
      category && type === "Update" ? category : categoryDefaultValues,
  });

  const onSubmit: SubmitHandler<FormValuesProps> = async (values) => {
    if (type === "Create") {
      const res = await createCategory(
        values as z.infer<typeof insertCategorySchema>
      );

      if (!res.success) {
        toast.error(
          <div className="flex items-center justify-between gap-4">
            <span className="text-red-600 font-medium">{res.message}</span>
          </div>
        );
      } else {
        toast.success(
          <div className="flex items-center justify-between gap-4">
            <span className="text-green-600 font-medium">{res.message}</span>
          </div>
        );
        router.push("/admin/category");
      }

      form.reset(categoryDefaultValues);
    }

    if (type === "Update") {
      if (!categoryId) {
        router.push("/admin/category");
        return;
      }

      const res = await updateCategory({
        ...(values as z.infer<typeof updateCategorySchema>),
        id: categoryId,
      });

      if (!res.success) {
        toast.error(
          <div className="flex items-center justify-between gap-4">
            <span className="text-red-600 font-medium">{res.message}</span>
          </div>
        );
      } else {
        toast.success(
          <div className="flex items-center justify-between gap-4">
            <span className="text-green-600 font-medium">{res.message}</span>
          </div>
        );
        router.push("/admin/category");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10"
      >
        {/* Name and Icon */}
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product name"
                    className="rounded-xl focus:ring-2 focus:ring-primary transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Icon</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Icon name"
                    className="rounded-xl focus:ring-2 focus:ring-primary transition-all"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-2xl bg-primary hover:bg-primary/90 py-3 font-bold text-lg transition-all"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Category`}
        </Button>
      </form>
    </Form>
  );
}
