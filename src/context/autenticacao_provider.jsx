import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user ?? null;
const [isNewUser, setIsNewUser] = useState(false);

useEffect(() => {
  const createdAt = user?.created_at ? Date.parse(user.created_at) : NaN;

  if (!Number.isFinite(createdAt)) {
    setIsNewUser(false);
    return;
  }

  const expiresAt = createdAt + 2 * 24 * 60 * 60 * 1000;
  const remainingTime = expiresAt - Date.now();

  setIsNewUser(remainingTime > 0);

  if (remainingTime <= 0) return;

  const timer = window.setTimeout(() => {
    setIsNewUser(false);
  }, remainingTime);

  return () => window.clearTimeout(timer);
}, [user?.created_at]);

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

const [favoriteGenre, setFavoriteGenre] = useState("Sem gênero preferido");

useEffect(() => {
  let active = true;

  async function loadFavoriteGenre() {
    if (!user) {
      setFavoriteGenre("Sem gênero preferido");
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
      setFavoriteGenre("Sem gênero preferido");
      return;
    }

    setFavoriteGenre(
      data?.genero_preferido?.trim() || "Sem gênero preferido"
    );
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
        user: session?.user ?? null,
        isNewUser,
        favoriteGenre,
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