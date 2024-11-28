// components/Register.tsx
import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    const userData = { username, email, password };
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        userData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={registerUser}>Register</button>
    </div>
  );
};

export default Register;
