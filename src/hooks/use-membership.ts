import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";

export function useMembership() {
  const { user } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [isExpired, setIsExpired] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMembership = async () => {
      try {
        if (!user) {
          setIsMember(false);
          return;
        }

        // 检查用户的会员过期时间
        const membershipExpiredAt = user.user_metadata?.membershipExpiredAt;
        if (!membershipExpiredAt) {
          setIsMember(false);
          return;
        }

        // 检查是否过期
        const expiredAt = new Date(membershipExpiredAt);
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
  }, [user]);

  return { isMember, isExpired, isLoading };
}
