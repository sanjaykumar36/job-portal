import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
role: "candidate",
});

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleRegister = async (e) => {
e.preventDefault();

```
if (
  !formData.name ||
  !formData.email ||
  !formData.password
) {
  setMessage("Please fill in all required fields.");
  return;
}

try {
  setLoading(true);
  setMessage("");

  await axios.post(
    "http://127.0.0.1:8000/register",
    formData
  );

  alert("Account created successfully!");

  navigate("/login");
} catch (error) {
  console.log(
    "Registration error:",
    error.response?.data
  );

  setMessage(
    error.response?.data?.detail ||
    "Registration failed. Please try again."
  );
} finally {
  setLoading(false);
}
```

};

return ( <div className="register-page"> <div className="register-layout">

```
    <div className="register-intro">
      <div className="register-brand">
        JobPortal
      </div>

      <h1>
        Start your
        <br />
        <span>career journey.</span>
      </h1>

      <p>
        Create your account and connect with
        opportunities that match your skills,
        experience, and career goals.
      </p>

      <div className="register-benefits">
        <div>
          <span>✓</span>
          Create your professional profile
        </div>

        <div>
          <span>✓</span>
          Discover relevant job opportunities
        </div>

        <div>
          <span>✓</span>
          Apply and track your applications
        </div>

        <div>
          <span>✓</span>
          Connect with recruiters
        </div>
      </div>
    </div>

    <div className="register-card">

      <div className="register-card-header">
        <h2>Create account</h2>

        <p>
          Fill in your details to get started.
        </p>
      </div>

      <form onSubmit={handleRegister}>

        <div className="register-input-group">
          <label>Full name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="register-input-group">
          <label>Email address</label>

          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="register-input-group">
          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="register-input-group">
          <label>Account type</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="candidate">
              Candidate
            </option>

            <option value="recruiter">
              Recruiter
            </option>
          </select>
        </div>

        {message && (
          <div className="register-error">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="register-submit-btn"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Create account"}
        </button>

      </form>

      <div className="register-divider">
        <span>Already have an account?</span>
      </div>

      <Link
        to="/login"
        className="register-login-btn"
      >
        Sign in
      </Link>

    </div>
  </div>
</div>


);
}

export default Register;
