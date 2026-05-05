import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

// 🔥 IMPORTANTE: exportar aqui
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // carregar usuário ao iniciar
  useEffect(() => {
    const storagedUser = localStorage.getItem("@Auth:user");
    const storagedToken = localStorage.getItem("@Auth:token");

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${storagedToken}`;
    }
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await api.post("/api/users/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      setUser(user);

      localStorage.setItem("@Auth:user", JSON.stringify(user));
      localStorage.setItem("@Auth:token", token);

      return true;
    } catch (error) {
      console.error("Erro no login:", error.response?.data);
      return false;
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const response = await api.post("/api/users", {
        name,
        email,
        password,
      });

      const { user, token } = response.data;

      setUser(user);

      localStorage.setItem("@Auth:user", JSON.stringify(user));
      localStorage.setItem("@Auth:token", token);

      return true;
    } catch (error) {
      console.error("Erro no cadastro:", error.response?.data);
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};