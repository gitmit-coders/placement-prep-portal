import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [school, setSchool] = useState("")
  const [studentClass, setStudentClass] = useState("")

  const navigate = useNavigate()

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match ❌")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
          school,
          studentClass,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message)
        navigate("/login")
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Something went wrong")
      console.log(error)
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
          Register 🚀
        </h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* PASSWORD */}
        <div style={{ position: "relative", marginBottom: "15px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {/* CONFIRM PASSWORD */}
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Enter School Name"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Enter Class"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          style={inputStyle}
        />

        <button style={buttonStyle} onClick={handleRegister}>
          Create Account
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
  background: "#8b5cf6",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
}

export default Register