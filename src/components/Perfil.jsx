import { useEffect, useState } from "react";
import { useAuth } from "../context/autenticacao_provider.jsx";
import { supabase } from "../lib/supabase.js";

function Perfil() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aba, setAba] = useState("perfil");
  const [form, setForm] = useState({
    nome: "",
    bio: "",
    idade: "",
    genero_preferido: "",
    avatar_url: "",
  });

  useEffect(() => {
    async function carregarPerfil() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      if (!data) {
        // cria registro vazio do perfil
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              nome: user.email?.split("@")[0] || "Usuário",
              bio: "",
            },
          ]);

        if (insertError) {
          console.error(insertError);
        } else {
          const novoPerfil = {
            id: user.id,
            nome: user.email?.split("@")[0] || "Usuário",
            bio: "",
          };
          setPerfil(novoPerfil);
          setForm({
            nome: novoPerfil.nome,
            bio: novoPerfil.bio,
            idade: "",
            genero_preferido: "",
            avatar_url: "",
          });
        }
      } else {
        setPerfil(data);
        setForm({
          nome: data.nome || "",
          bio: data.bio || "",
          idade: data.idade || "",
          genero_preferido: data.genero_preferido || "",
          avatar_url: data.avatar_url || "",
        });
      }

      setLoading(false);
    }

    carregarPerfil();
  }, [user]);

  const avatarUrl =
    perfil?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.avatar_url ||
    "https://as2.ftcdn.net/jpg/05/86/91/55/220_F_586915596_gPqgxPdgdJ4OXjv6GCcDWNxTjKDWZ3JD.jpg";

  const generoPreferido =
    perfil?.genero_preferido ||
    user?.user_metadata?.genero_preferido ||
    user?.genero_preferido ||
    "Sem gênero preferido";

  const handleChange = (campo) => (event) => {
    setForm((prev) => ({
      ...prev,
      [campo]: event.target.value,
    }));
  };

  const salvarPerfil = async (event) => {
    event.preventDefault();

    if (!user) return;

    const payload = {
      id: user.id,
      nome: form.nome || user.email?.split("@")[0] || "Usuário",
      bio: form.bio || "",
      idade: form.idade || null,
      genero_preferido: form.genero_preferido || null,
      avatar_url: form.avatar_url || null,
    };

    const { error } = await supabase.from("profiles").upsert(payload, {
      onConflict: "id",
    });

    if (error) {
      console.error(error);
      return;
    }

    setPerfil((prev) => ({ ...(prev || {}), ...payload }));
    setAba("perfil");
  };

  if (!user) return <p>Você precisa estar logado.</p>;

  if (loading) return <p>Carregando perfil...</p>;

  return (
    <main>
      <h1 className="title-profile">Perfil</h1>

      <div className="perfil-tabs">
        <button
          type="button"
          className={aba === "perfil" ? "perfil-tab active" : "perfil-tab"}
          onClick={() => setAba("perfil")}
        >
          Perfil
        </button>
        <button
          type="button"
          className={aba === "editar" ? "perfil-tab active" : "perfil-tab"}
          onClick={() => setAba("editar")}
        >
          Editar perfil
        </button>
      </div>

      {aba === "perfil" ? (
        <div className="perfil-container">
          <div className="esquerda-profile">
            <p>Bio: {perfil?.bio || "Sem bio"}</p>
          </div>

          <div className="centro-profile">
            <img src={avatarUrl} alt="Avatar do usuário" />
            <p>{perfil?.nome || "Sem nome"}</p>
          </div>

          <div className="direita-profile">
            <p>Email: {user.email}</p>
            <p>Genero: {generoPreferido}</p>
            <p>Pontos: {perfil?.pontos || 0}</p>
            <p>Idade: {perfil?.idade || "Sem idade"}</p>
            <p>HQs Publicadas: {user.hqs_publicadas || 0}</p>
            <p>HQs Lidas: {perfil?.hqs_lidas || 0}</p>
            <p>Ranking: {perfil?.ranking || "Sem ranking"}</p>
          </div>
        </div>
      ) : (
        <form className="perfil-form" onSubmit={salvarPerfil}>
          <label>
            Nome
            <input
              type="text"
              value={form.nome}
              onChange={handleChange("nome")}
            />
          </label>

          <label>
            Bio
            <textarea
              value={form.bio}
              onChange={handleChange("bio")}
              rows="4"
            />
          </label>

          <label>
            Idade
            <input
              type="text"
              value={form.idade}
              onChange={handleChange("idade")}
            />
          </label>

          <label>
            Gênero preferido
            <input
              type="text"
              value={form.genero_preferido}
              onChange={handleChange("genero_preferido")}
            />
          </label>

          <label>
            URL da imagem
            <input
              type="url"
              value={form.avatar_url}
              onChange={handleChange("avatar_url")}
            />
          </label>

          <button type="submit" className="btn-salvar-perfil">
            Salvar perfil
          </button>
        </form>
      )}
    </main>
  );
}

export default Perfil;