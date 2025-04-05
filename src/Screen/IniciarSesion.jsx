import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Modal from "../components/ModalInicioSesion";
import "./IniciarSesion.css";

const Login = ({ login }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   const data = {
  //     user_name: user,
  //     password: password,
  //   };

  //   try {
  //     const response = await fetch("/api/user/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     const result = await response.json();
  //     console.log(result)

  //     if (result.user_code === 1) {
  //       localStorage.setItem('idusuario', result.user_code)
  //       setOpenModal(true);
  //       setMessage(true)
  //       setTimeout(() => {
  //         navigate('/Menu');
  //         login(result.user_code);
  //       }, 2400);
  //     } else {
  //       setOpenModal(true);
  //       setMessage(false);
  //       setTimeout(() => {
  //         setOpenModal(false);
  //       }, 1600);
  //     }
  //   } catch (error) {
  //     console.error("Error en la solicitud:", error);
  //     setMessage("Hubo un problema al conectar con el servidor.");
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      user_name: user,
      password: password,
    };

    if (user=="MartinG" && password=="#7martin7#") {
      localStorage.setItem('idusuario', user)
      setOpenModal(true);
      setMessage(true)
      setTimeout(() => {
        navigate('/Menu');
        login(user);
      }, 2400);
    } else {
      setOpenModal(true);
      setMessage(false);
      setTimeout(() => {
        setOpenModal(false);
      }, 1600);
    }
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

          <label htmlFor="password" className="label">Contraseña</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}  // Cambiar tipo de input según el estado
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
            <button
              type="button"
              className="buttonEye-icon"
              onClick={() => setShowPassword(!showPassword)}  // Cambiar el estado para mostrar/ocultar
            >
              {!showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="buttonIngresar" type="submit">Ingresar</button>
        </form>
      </div>
      <div>
        {openModal && (
          <>
            {message === true ? (
              <Modal text={`Has iniciado sesión correctamente. ¡Bienvenido/a ${user}!`} type={'success'} />
            ) : (
              <Modal text={"Credenciales incorrectas. Intenta nuevamente."} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
