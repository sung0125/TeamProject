"use client";
import AddCommuForm from "@/components/AddCommuForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AddCommu() {
  const { data: session } = useSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <AddCommuForm />
    </div>
  );
}
