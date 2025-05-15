"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

//ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

//form credencials
import { signInDefaultValues } from "@/lib/constants";
import { signInWithCredentials } from "@/lib/actions/user.actions";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function CredentialsSignInForm() {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };

  return (
    <>
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <div>
            <Label htmlFor="emailOrUsernameOrPhone">
              Email, Username ou Telemóvel
            </Label>
            <Input
              id="emailOrUsernameOrPhone"
              name="emailOrUsernameOrPhone"
              type="text"
              required
              autoComplete="username"
              defaultValue={signInDefaultValues.emailOrUsernameOrPhone}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="password"
              defaultValue={signInDefaultValues.password}
            />
          </div>
          <div>
            <SignInButton />
          </div>

          {data && !data.success && (
            <div className="text-center text-destructive">{data.message}</div>
          )}

          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" target="_self" className="link">
              Sign Up
            </Link>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {/* Social buttons - FORA do <form> */}
        <Button
          className="w-full  bg-orange-600 text-white"
          variant="outline"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </Button>

        <Button
          className="w-full bg-slate-600 text-white"
          variant="outline"
          onClick={() => signIn("github")}
        >
          Continue with GitHub
        </Button>

        <Button
          className="w-full bg-blue-600 text-white"
          variant="outline"
          onClick={() => signIn("facebook")}
        >
          Continue with Facebook
        </Button>

        {/* <Button
          className="w-full bg-blue-600 text-white"
          variant="outline"
          onClick={() => signIn("auth0")}
        >
          Continue with Auth0
        </Button> */}

        <div className="text-sm text-center text-muted-foreground mt-4">
          Esqueceu sua senha?{" "}
          <Link
            href="/forgot"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline underline-offset-1"
          >
            Clique aqui
          </Link>
        </div>
      </div>
    </>
  );
}
