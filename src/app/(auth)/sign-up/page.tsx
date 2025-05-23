import { Metadata } from "next";

import Image from "next/image";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { APP_NAME } from "@/lib/constants";

import { auth } from "@/auth";

import { redirect } from "next/navigation";

//logo
import logo from "@/assets/images/logo.svg";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

interface SignUpProps {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}

export default async function SignUp(props: SignUpProps) {
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
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {" "}
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
