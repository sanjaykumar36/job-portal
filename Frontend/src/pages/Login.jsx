import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

const handleLogin = async (e) => {
e.preventDefault();


if (!email || !password) {
  setMessage("Please enter your email and password.");
  return;
}

try {
  setLoading(true);
  setMessage("");

  const response = await axios.post(
    "http://127.0.0.1:8000/login",
    null,
    {
      params: {
        email: email,
        password: password,
      },
    }
  );

  const token = response.data.access_token;

  localStorage.setItem("token", token);

  const profileResponse = await axios.get(
    "http://127.0.0.1:8000/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const user = profileResponse.data;

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  if (user.role === "recruiter") {
    navigate("/recruiter-dashboard");
  } else {
    navigate("/candidate-dashboard");
  }

} catch (error) {
  console.log("Login error:", error);

  setMessage(
    error.response?.data?.detail ||
    "Invalid email or password."
  );

} finally {
  setLoading(false);
}


};

return ( <div className="login-page">


  <div className="login-container">

    <div className="login-left">

      <div className="login-brand">
        JobPortal
      </div>

      <h1>
        Welcome back.
      </h1>

      <p>
        Sign in to continue your career journey,
        discover opportunities, and connect with
        employers.
      </p>

      <div className="login-benefits">

        <div>
          <span>✓</span>
          Discover new job opportunities
        </div>

        <div>
          <span>✓</span>
          Track your applications
        </div>

        <div>
          <span>✓</span>
          Connect with recruiters
        </div>

      </div>

    </div>

    <div className="login-card">

      <div className="login-card-header">

        <h2>
          Sign in
        </h2>

        <p>
          Enter your details to access your account.
        </p>

      </div>

      <form onSubmit={handleLogin}>

        <div className="login-input-group">

          <label>
            Email address
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </div>

        <div className="login-input-group">

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

        </div>

        {message && (
          <div className="login-error">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="login-submit"
          disabled={loading}
        >
          {loading
            ? "Signing in..."
            : "Sign in"}
        </button>

      </form>

      <div className="login-divider">
        <span>
          New to JobPortal?
        </span>
      </div>

      <Link
        to="/register"
        className="login-register"
      >
        Create an account
      </Link>

    </div>

  </div>

</div>


);
}

export default Login;
