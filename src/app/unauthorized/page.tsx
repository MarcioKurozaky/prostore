import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized Access",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-200 to-white text-slate-800">
      <div className="text-center space-y-6 p-8 bg-white bg-opacity-40 backdrop-blur-md rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-5xl font-bold">Unauthorized Access</h1>
        <p className="text-lg text-gray-700">
          You do not have permission to access this page.
        </p>
        <Button className="bg-slate-700 hover:bg-slate-800 text-white py-3 px-6 rounded-md transition duration-200 ease-in-out">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
