import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./IniciarSesion.css";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    navigate('/menu');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>SiloRoll</h2>
        <p>Venta de Alimentos para Ganado</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>

      </div>
    </div>
  );
};

export default Login;
