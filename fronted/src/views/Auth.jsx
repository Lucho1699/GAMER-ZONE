import { useState } from "react";
import "../Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register
  const [msg, setMsg] = useState("");

  // Formulario de Login
  const [loginForm, setLoginForm] = useState({
    usernameOrEmail: "",
    password: "",
  });

  // Formulario de Register
  const [registerForm, setRegisterForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // Imágenes para la galería (puedes cambiarlas)
  const gameImages = [
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
    "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400",
  ];

  // ========== HANDLERS LOGIN ==========
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("✅ " + data.message);
        // Guardar token y usuario en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirigir a la biblioteca
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        setMsg("❌ " + data.error);
      }
    } catch {
      setMsg("❌ Error de conexión");
    }
  };

  // ========== HANDLERS REGISTER ==========
  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg("✅ " + data.message + " - Ahora puedes iniciar sesión");
        setRegisterForm({
          name: "",
          username: "",
          email: "",
          password: "",
        });
        // Cambiar a login después de registrarse
        setTimeout(() => {
          setIsLogin(true);
          setMsg("");
        }, 2000);
      } else {
        setMsg("❌ " + data.error);
      }
    } catch {
      setMsg("❌ Error de conexión");
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-container ${!isLogin ? "register-active" : ""}`}>
        
        {/* ========== PANEL IZQUIERDO (LOGIN o GALERÍA) ========== */}
        <div className="auth-panel left-panel">
          {isLogin ? (
            <div className="form-container">
              <h2>Iniciar Sesión</h2>
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  name="usernameOrEmail"
                  placeholder="Usuario o Email"
                  value={loginForm.usernameOrEmail}
                  onChange={handleLoginChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
                <button type="submit" className="btn-primary">Entrar</button>
              </form>
            </div>
          ) : (
            <div className="gallery-container">
              <div className="gallery-grid">
                {gameImages.map((img, index) => (
                  <div key={index} className="gallery-item">
                    <img src={img} alt={`Game ${index + 1}`} />
                  </div>
                ))}
              </div>
              <div className="switch-message">
                <p>¿Ya tienes cuenta?</p>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    setIsLogin(true);
                    setMsg("");
                  }}
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========== PANEL DERECHO (GALERÍA o REGISTER) ========== */}
        <div className="auth-panel right-panel">
          {isLogin ? (
            <div className="gallery-container">
              <div className="gallery-grid">
                {gameImages.map((img, index) => (
                  <div key={index} className="gallery-item">
                    <img src={img} alt={`Game ${index + 1}`} />
                  </div>
                ))}
              </div>
              <div className="switch-message">
                <p>¿No tienes cuenta?</p>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    setIsLogin(false);
                    setMsg("");
                  }}
                >
                  Crear Cuenta
                </button>
              </div>
            </div>
          ) : (
            <div className="form-container">
              <h2>Crear Cuenta</h2>
              <form onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  required
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Usuario"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                />
                <button type="submit" className="btn-primary">Registrarse</button>
              </form>
            </div>
          )}
        </div>

      </div>

      {/* Mensaje de feedback */}
      {msg && (
        <div className={`message ${msg.includes("✅") ? "success" : "error"}`}>
          {msg}
        </div>
      )}
    </div>
  );
}

export default Auth;