import React, { useState } from "react";
import { login } from "./Api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(username, password);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ username: data.username, role: data.role, id: data.id })
      );
      onLogin({ username: data.username, role: data.role });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    display: "block",
    marginBottom: 15,
    width: "100%",
    padding: "10px",
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 16,
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  };

  const inputFocusStyle = {
    borderColor: "#007BFF",
    outline: "none",
    boxShadow: "0 0 5px rgba(0,123,255,0.5)",
  };

  const [usernameFocus, setUsernameFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 350,
          width: "100%",
          background: "#fff",
          padding: 30,
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 5,
            color: "#222",
            fontWeight: "bold",
          }}
        >
          Arya Vidya Mandir
        </h1>
        <h2 style={{ textAlign: "center", marginBottom: 20, color: "#333" }}>
          Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
          required
          style={usernameFocus ? { ...inputStyle, ...inputFocusStyle } : inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
          required
          style={passwordFocus ? { ...inputStyle, ...inputFocusStyle } : inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 5,
            backgroundColor: loading ? "#999" : "#007BFF",
            color: "#fff",
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: 15,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
