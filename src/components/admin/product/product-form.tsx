"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

// Toast
import { toast } from "sonner";

// Default Values
import { productDefaultValues } from "@/lib/constants";

// Validators
import { insertProductSchema, updateProductSchema } from "@/lib/validators";

// Types
import { Product, Category } from "@/types";

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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Actions
import { createProduct, updateProduct } from "@/lib/actions/product.actions";

// Utils
import slugify from "slugify";
import { UploadButton } from "@/lib/uploadthing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type Product Form Values
type ProductFormValues =
  | z.infer<typeof insertProductSchema>
  | z.infer<typeof updateProductSchema>;

interface ProductFormProps {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
  categories?: Category[];
}

export default function ProductForm({
  type,
  product,
  productId,
  categories,
}: ProductFormProps) {
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(
      type === "Update" ? updateProductSchema : insertProductSchema
    ),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    if (type === "Create") {
      const res = await createProduct(
        values as z.infer<typeof insertProductSchema>
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
        router.push("/admin/products");
      }
    }

    if (type === "Update") {
      if (!productId) {
        router.push("/admin/products");
        return;
      }

      const res = await updateProduct({
        ...(values as z.infer<typeof updateProductSchema>),
        id: productId,
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
        router.push("/admin/products");
      }
    }
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10"
      >
        {/* Name and Slug */}
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

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Slug</FormLabel>
                <FormControl>
                  <div className="relative flex items-center gap-2">
                    <Input
                      placeholder="Enter slug"
                      className="rounded-xl focus:ring-2 focus:ring-primary transition-all"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="ml-2 rounded-xl hover:bg-primary hover:text-white transition-all"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name") || "", { lower: true })
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Category and Brand */}{" "}
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full rounded-xl focus:ring-2 focus:ring-primary transition-all">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Brand</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter brand"
                    className=" rounded-xl focus:ring-2 focus:ring-primary transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Price and Stock */}
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter price"
                    type="number"
                    className="rounded-xl focus:ring-2 focus:ring-primary transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Stock</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter stock quantity"
                    type="number"
                    className="rounded-xl focus:ring-2 focus:ring-primary transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Images Upload */}
        {/* Images Upload - Modernized Visual Template */}
        <Card className="bg-muted border rounded-2xl shadow-sm">
          <CardContent className="space-y-6 p-6">
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel className="font-bold text-lg text-primary">
                    Product Images
                  </FormLabel>

                  {/* Image Preview Section */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                    {images.length > 0 ? (
                      images.map((image: string, index: number) => (
                        <div
                          key={index}
                          className="relative group border rounded-xl overflow-hidden shadow-sm"
                        >
                          {/* Image */}
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            width={300}
                            height={300}
                            className="object-cover aspect-square w-full h-full transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages = images.filter(
                                (img, i) => i !== index
                              );
                              form.setValue("images", updatedImages);
                            }}
                            className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Image"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-muted-foreground">
                        No images uploaded yet.
                      </div>
                    )}
                  </div>

                  {/* Upload Area */}
                  <FormControl>
                    <div className="flex justify-center mt-8">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: { url: string }[]) => {
                          form.setValue("images", [...images, res[0].url]);
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-red-600 font-medium">
                                {error.message}
                              </span>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        {/* Featured Checkbox + Banner - Modernized */}
        <Card className="bg-muted border rounded-2xl shadow-sm">
          <CardContent className="space-y-6 p-6">
            {/* Featured Checkbox */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="rounded-md border-gray-300 focus:ring-primary"
                    />
                  </FormControl>
                  <FormLabel className="font-semibold text-primary text-lg">
                    Featured Product?
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Banner Upload / Preview */}
            {isFeatured && (
              <>
                {banner ? (
                  <div className="relative w-full rounded-2xl overflow-hidden group shadow-md border">
                    {/* Banner Image */}
                    <Image
                      src={banner}
                      alt="Banner image"
                      className="object-cover w-full h-56 sm:h-72 md:h-96 transition-transform duration-300 group-hover:scale-105"
                      width={1920}
                      height={680}
                    />
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => form.setValue("banner", "")}
                      className="absolute top-4 right-4 bg-black bg-opacity-60 text-white rounded-full p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove banner"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("banner", res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-red-600 font-medium">
                              {error.message}
                            </span>
                          </div>
                        );
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  className="resize-none rounded-xl focus:ring-2 focus:ring-primary transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full rounded-2xl bg-primary hover:bg-primary/90 py-3 font-bold text-lg transition-all"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Product`}
        </Button>
      </form>
    </Form>
  );
}
