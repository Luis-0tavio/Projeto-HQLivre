import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteGenre, setFavoriteGenre] = useState("");

  const user = session?.user ?? null;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadFavoriteGenre() {
      if (!user) {
        setFavoriteGenre("");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("genero_preferido")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        console.error("Erro ao carregar gênero favorito:", error);
        setFavoriteGenre("");
        return;
      }

      setFavoriteGenre(data?.genero_preferido?.trim() || "");
    }

    loadFavoriteGenre();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        favoriteGenre,
        setFavoriteGenre,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}