"use client";

//import Image from "next/image";
import { useRouter } from "next/navigation";

// Toast
import { toast } from "sonner";

// Default Values
import { USER_ROLES } from "@/lib/constants";

// Validators
import { updateUserSchema } from "@/lib/validators";

// Types
import { User } from "@/types";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Actions methods
import { updateUser } from "@/lib/actions/user.actions";

// Type Product Form Values
type UserFormSchemaProps = z.infer<typeof updateUserSchema>;

interface UpdateUserFormProps {
  user: User;
}

export default function UpdateUserForm({ user }: UpdateUserFormProps) {
  const router = useRouter();

  const form = useForm<UserFormSchemaProps>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit: SubmitHandler<UserFormSchemaProps> = async (values) => {
    try {
      const res = await updateUser({
        ...values,
        id: user?.id,
      });

      if (!res.success) {
        return toast.error(
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
      }

      form.reset();
      router.push("/admin/users");
    } catch (error) {
      toast.success(
        <div className="flex items-center justify-between gap-4">
          <span className="text-red-600 font-medium">
            {(error as Error).message}
          </span>
        </div>
      );
    }
  };

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
        </div>

        {/* email */}
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold">Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Email"
                    type="email"
                    className="rounded-xl focus:ring-2 focus:ring-primary transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* role  */}
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          {form.formState.isSubmitting ? "Submitting..." : "Update User"}
        </Button>
      </form>
    </Form>
  );
}
