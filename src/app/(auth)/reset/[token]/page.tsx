"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { resetPasswordAction } from "@/lib/actions/user.actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Esquema de validação
const schema = z.object({
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [isPending] = useTransition();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  // Função para lidar com o envio
  const handleReset = async (formData: FormData) => {
    formData.append("token", token as string);

    const res = await resetPasswordAction(formData);

    if (res?.success) {
      toast.success(res.message);
      router.push("/sign-in");
    } else {
      toast.error(res?.message || "Erro ao redefinir a senha.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Redefinir Senha
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form action={handleReset} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Nova senha</Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite a nova senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
