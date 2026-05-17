import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()


  const handleLogin = () => {
  const savedUser = JSON.parse(
    localStorage.getItem("user")
  )

  if (
    savedUser &&
    savedUser.email === email &&
    savedUser.password === password
  ) {
    alert("Login Successful ✅")

    navigate("/quiz")
  } else {
    alert("Invalid Email or Password ❌")
  }
}

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b12",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#111827",
          padding: "35px",
          borderRadius: "20px",
          color: "white",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Login 🔐
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
  style={buttonStyle}
  onClick={handleLogin}
>
  Login
</button>

        <p
  style={{
    textAlign: "center",
    marginTop: "20px",
    color: "#9ca3af",
  }}
>
  Don't have an account?
</p>

<button
  style={{
    ...buttonStyle,
    background: "#8b5cf6",
    marginTop: "10px",
  }}
>
  Register
</button>


      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  background: "#1f2937",
  color: "white",
  fontSize: "16px",
}

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "#6366f1",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
}

export default Login