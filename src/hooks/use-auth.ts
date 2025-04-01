import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { getUserProfileById } from "@/server/api/routes/profile";

export interface UserProfile {
  id: string;
  email: string | null;
  username: string;
  bio: string | null;
  membershipExpiredAt: Date | null;
  inviteCode: string | null;
  inviterId: string | null;
  inviterSkipped: boolean | null;
  enableNotification: boolean | null;
  notificationSound: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        try {
          const result = await getUserProfileById(currentUser.id);
          if (result.data) {
            setProfile(result.data as unknown as UserProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, [supabase.auth]);

  return {
    user,
    profile,
    loading,
    signOut,
  };
}
