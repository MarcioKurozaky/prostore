"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordAction } from "@/lib/actions/user.actions";

const schema = z.object({
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export default function ResetPasswordPage() {
  const { token } = useParams();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-full max-w-md shadow">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Redefinir Senha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              action={async (formData) => {
                formData.append("token", token as string);
                await resetPasswordAction(formData);
              }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Nova senha</Label>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Redefinir Senha
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
