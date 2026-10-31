"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

export default function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await api.post("/auth/logout");
    } finally {
      queryClient.clear(); // never leave one admin's data in memory for the next login
      router.replace("/login");
    }
  }

  return { signOut, pending };
}
