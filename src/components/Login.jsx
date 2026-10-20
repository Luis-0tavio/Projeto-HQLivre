import "../Login.css";
import { useState } from "react";
import { supabase } from "../lib/supabase.js";

function Login() {
    const [message, setMessage] = useState("");

    const [isRegistering, setIsRegistering] = useState(false);

        async function handleSubmit(event) {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const email = formData.get("email");
            const password = formData.get("password");

            setMessage("Verificando seus dados...");
            
            if(isRegistering) {
                const { error } = await supabase.auth.signUp({
                email,
                password
                });
                if (error) {
                setMessage(`Não foi possível criar a conta: ${error.message}`);
                return;
                }else{
                    setMessage("Conta criada com sucesso. Você já pode entrar.");
                }
            }

            const { error } = await supabase.auth.signInWithPassword({
            email,
            password
            });

            if (error) {
            setMessage(`Não foi possível entrar: ${error.message}`);
            return;
            }

            setMessage("Login realizado com sucesso.");
            }

return (
<main className="login-page">
    <section className="login-card">
    <h1>{isRegistering ? "Criar conta" : "Entrar"}</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>
            <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            />
            <label htmlFor="password">Senha</label>
            <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            />
        <button type="submit">{isRegistering ? "Criar conta" : "Entrar"}</button>
        <button
            type="button"
            onClick={() => {
            setIsRegistering((currentMode) => !currentMode);
            setMessage("");
            }}
            >
            {isRegistering ? "Já tem conta? Entrar" : "Não tem conta? Criar conta"}
        </button>
        </form>
        {message && <p role="status">{message}</p>}
    </section>
</main>
);
}

export default Login;