"use client";

import { useState, useTransition } from "react";

// forgot Password Action -Methods
import { forgotPasswordAction } from "@/lib/actions/user.actions";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

//zod and react hook form
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//toast
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Digite um e-mail válido"),
});

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const formData = new FormData();
    formData.append("email", values.email);

    startTransition(async () => {
      const res = await forgotPasswordAction(formData);
      setMessage(res.message);

      if (res.success) {
        toast.success(
          <div className="flex items-center justify-between gap-4">
            <span className="text-blue-600 font-medium">{res.message}</span>
          </div>
        );

        return;
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full max-w-md shadow-lg border border-border rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Esqueci minha senha
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Informe seu e-mail para receber um link de recuperação.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="seu@email.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          </Form>

          {message && (
            <div
              className={`mt-4 text-center text-sm ${
                message.toLowerCase().includes("sucesso") ||
                message.toLowerCase().includes("enviado")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
