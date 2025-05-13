"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: false });

    // Forçar o logout no Auth0 com redirecionamento
    window.location.href = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN_LOGOUT}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}&returnTo=${process.env.NEXT_PUBLIC_SERVER_URL}/sign-in`;
  };

  return (
    <Button
      variant="ghost"
      className="w-full flex items-center gap-2 py-2 text-left rounded-lg hover:bg-muted"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </Button>
  );
}
