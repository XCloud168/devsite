import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export function useMembership() {
  const { profile } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [isExpired, setIsExpired] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMembership = async () => {
      try {
        if (!profile?.membershipExpiredAt) {
          setIsMember(false);
          return;
        }

        const expiredAt = new Date(profile.membershipExpiredAt);
        const now = new Date();
        setIsExpired(expiredAt < now);
        setIsMember(expiredAt > now);
      } catch (error) {
        console.error("Error checking membership:", error);
        setIsMember(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMembership();
  }, [profile]);

  return { isMember, isExpired, isLoading };
}
