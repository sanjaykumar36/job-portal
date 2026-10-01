
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const userData =
    localStorage.getItem("user");

  let user = null;

  try {
    user = userData
      ? JSON.parse(userData)
      : null;
  } catch (error) {
    user = null;
  }

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}

      <div className="logo">

        <Link to="/">
          JobPortal
        </Link>

      </div>


      {/* NAVIGATION */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>


        {/* ==========================
            LOGGED OUT
        ========================== */}

        {!token && (

          <>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>

          </>

        )}


        {/* ==========================
            CANDIDATE
        ========================== */}

        {token &&
          user?.role === "candidate" && (

          <>

            <Link to="/candidate-dashboard">
              Jobs
            </Link>

            <Link to="/my-applications">
              My Applications
            </Link>

            <Link to="/profile">
              Profile
            </Link>

          </>

        )}


        {/* ==========================
            RECRUITER
        ========================== */}

        {token &&
          user?.role === "recruiter" && (

          <>

            <Link to="/recruiter-dashboard">
              Recruiter Dashboard
            </Link>

            <Link to="/profile">
              Profile
            </Link>

          </>

        )}


        {/* ==========================
            LOGOUT
        ========================== */}

        {token && (

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        )}

      </div>

    </nav>
  );
}

export default Navbar;

