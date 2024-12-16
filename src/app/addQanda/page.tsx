"use client";
import AddQandaForm from "@/components/AddQandaForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AddQanda() {
  const { data: session } = useSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <AddQandaForm />
    </div>
  );
}
