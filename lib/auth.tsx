import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  xp: number;
  gold: number;
  energy: number;
  rank_title: string;
  city: string | null;
  streak_days: number;
  is_premium: boolean;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, needsEmailConfirmation: false }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from DB
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data && !error) {
      setProfile(data as Profile);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    let mounted = true;
    const loadingFallbackTimeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.log("[auth] Oturum yukleme zaman asimi. loading zorla kapatildi.");
          return false;
        }
        return prev;
      });
    }, 8000);

    // Get initial session
    (async () => {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        setSession(s);
        if (s?.user) {
          await fetchProfile(s.user.id);
        }
      } catch (error) {
        console.log("[auth] Oturum yuklenemedi:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        try {
          setSession(s);
          if (s?.user) {
            await fetchProfile(s.user.id);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.log("[auth] Oturum degisimi islenemedi:", error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(loadingFallbackTimeout);
      subscription.unsubscribe();
    };
  }, []);

  // Session degisince socket baglantisini guncelle.
  useEffect(() => {
    try {
      if (session?.user?.id) {
        connectSocket(session.user.id);
        return;
      }

      disconnectSocket();
    } catch (error) {
      console.log("[auth] Socket baglantisi guncellenemedi:", error);
    }
  }, [session?.user?.id]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUp = async (email: string, password: string, username?: string) => {
    const normalizedUsername = username?.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: normalizedUsername ? { data: { username: normalizedUsername } } : undefined,
    });

    if (error) {
      return { error: error.message, needsEmailConfirmation: false };
    }

    return {
      error: null,
      needsEmailConfirmation: !data.session,
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    disconnectSocket();
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
