import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RESPUESTA RAW:", text);

      if (!res.ok) {
        throw new Error("Error en login");
      }

      const data = JSON.parse(text);
      console.log("DATA:", data);

      localStorage.setItem("token", data.token);

      //  REDIRECCIÓN
      navigate("/dashboard");

    } catch (error) {
      console.error("ERROR:", error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: '600'
        }}>Login</h2>
        
        <input 
          placeholder="Usuario" 
          onChange={e => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '25px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        
        <button 
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#764ba2'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}

export default Login;