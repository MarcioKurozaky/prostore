import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
  title: "Customer Profile",
};

export default async function Profile() {
  const session = await auth();

  if (!session?.user?.id) return <p>Unauthorized</p>;

  const user = await getUserById(session.user.id);

  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold">Profile</h2>
        <ProfileForm user={user} />
      </div>
    </SessionProvider>
  );
}
