import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

//metadata
import { Metadata } from "next";

//nextauth config
import { auth } from "@/auth";

//app name
import { APP_NAME } from "@/lib/constants";

//logo
import logo from "@/assets/images/logo.svg";

//ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

//form sign
import CredentialsSignInForm from "./credentials-signin-form";

export const metadata: Metadata = {
  title: "Sign In",
};

interface SignInProps {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}

export default async function SignIn(props: SignInProps) {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              priority={true}
              src={logo}
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
            />
          </Link>

          <CardTitle className="text-center">Sign In</CardTitle>

          <CardDescription className="text-center">
            Select a method to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
