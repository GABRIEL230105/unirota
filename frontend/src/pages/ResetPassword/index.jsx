import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3333/api/users/resetar-senha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
      navigate("/login");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Redefinir senha</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Salvar nova senha</button>
      </form>
    </div>
  );
};