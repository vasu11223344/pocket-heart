import { useEffect, useState } from "react";
import { pb } from "@/integrations/pocketbase/client";
import { isAdminAuthed, onAuthChange } from "@/integrations/pocketbase/services";

export interface AuthState {
  user: { id: string; email: string } | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(() => ({
    user: pb.authStore.record
      ? { id: pb.authStore.record.id, email: (pb.authStore.record as { email?: string }).email || "" }
      : null,
    isAdmin: isAdminAuthed(),
    loading: false,
  }));

  useEffect(() => {
    const unsub = onAuthChange(() => {
      const rec = pb.authStore.record;
      setState({
        user: rec ? { id: rec.id, email: (rec as { email?: string }).email || "" } : null,
        isAdmin: isAdminAuthed(),
        loading: false,
      });
    });
    return () => unsub();
  }, []);

  return state;
}
