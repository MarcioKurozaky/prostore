"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateProfile } from "@/lib/actions/user.actions";
import { updateProfileSchema } from "@/lib/validators";

import { UploadButton } from "@/lib/uploadthing";

import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Trash } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    username?: string | null;
    phoneNumber?: string | null;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const { data: session, update } = useSession();
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? "",
      username: user.username ?? "",
      phoneNumber: user.phoneNumber ?? "",
    },
  });

  const image = form.watch("image");

  const handleRemoveProfileImage = async () => {
    if (!image) return;
    const fileKey = image.split("/").pop();

    const res = await fetch("/api/uploadthing/remove-image-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileKey }),
    });

    const result = await res.json();
    if (result.success) {
      form.setValue("image", "");
      toast.success("Imagem removida com sucesso");
    } else {
      toast.error("Erro ao remover imagem");
    }
  };

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile({ ...values, phoneNumber });

    if (!res.success) {
      return toast.error(res.message || "Erro ao atualizar perfil.");
    }

    await update({
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    });

    toast.success("Perfil atualizado com sucesso.");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Meu Perfil</h2>
        <p className="text-muted-foreground text-sm">
          Atualize suas informações de usuário
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 group">
              {image ? (
                <>
                  <Image
                    src={image}
                    alt="Avatar"
                    fill
                    className="rounded-full object-cover border shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveProfileImage}
                    className="absolute top-1 right-1 bg-black text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remover imagem"
                  >
                    <Trash size={14} />
                  </button>
                </>
              ) : (
                <div className="flex justify-center items-center w-32 h-32 bg-muted rounded-full">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      form.setValue("image", res[0].url);
                    }}
                    onUploadError={(err) => {
                      toast.error("Erro no upload: " + err.message);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Nome</Label>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input disabled {...field} className="opacity-60" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Label>Username</Label>
                <FormControl>
                  <Input placeholder="ex: marcio.dev" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telefone */}
          <FormItem>
            <Label>Telefone</Label>
            <PhoneInput
              international
              defaultCountry="AO"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value ?? "")}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
            />
          </FormItem>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-primary hover:bg-primary/90  font-semibold py-2 rounded-lg"
          >
            {form.formState.isSubmitting
              ? "Atualizando..."
              : "Atualizar Perfil"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
