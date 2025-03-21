"use server";

import { db } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { createClient } from "@/utils/supabase/server";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function checkInviteCode(code: string) {
  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.inviteCode, code),
    columns: {
      id: true,
    },
  });

  return {
    exists: !!profile,
    inviter: profile,
  };
}

export async function checkUserHasInviter(userId: string) {
  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.id, userId),
    columns: {
      id: true,
      inviterId: true,
      inviterSkipped: true,
    },
  });

  return profile;
}

export async function updateInviter(inviteCode: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return {
      error: "No active session",
    };
  }

  // First check if the current user has no inviter
  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.id, user.id),
    columns: {
      id: true,
      inviterId: true,
      inviterSkipped: true,
    },
  });

  if (!profile) {
    console.error("Profile not found");
    return {
      error: "Profile not found",
    };
  }

  if (profile.inviterId) {
    return {
      error: "User already has an inviter",
    };
  }

  // skip if the user has skipped the invite code
  if (inviteCode === "") {
    await db
      .update(profiles)
      .set({ inviterSkipped: true })
      .where(eq(profiles.id, user.id));
  } else {
    // Then check if the invite code exists
    const { exists, inviter } = await checkInviteCode(inviteCode);
    if (!exists || inviter?.id === user.id) {
      // Only update if the inviter is not the same as the current user
      return {
        error: "Invalid invite code",
      };
    }

    // Update the profile with the inviter
    await db
      .update(profiles)
      .set({ inviterId: inviter?.id })
      .where(and(eq(profiles.id, user.id), isNull(profiles.inviterId)));
  }
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.id, user.id),
  });

  return {
    id: user.id,
    username: profile?.username,
    email: user.email,
    avatarUrl: profile?.avatarUrl,
    membershipExpiredAt: profile?.membershipExpiredAt,
    inviteCode: profile?.inviteCode,
    enableNotification: profile?.enableNotification,
    notificationSound: profile?.notificationSound,
  };
}
