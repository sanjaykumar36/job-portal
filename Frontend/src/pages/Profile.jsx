import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");

useEffect(() => {
const fetchProfile = async () => {
try {
const token = localStorage.getItem("token");


    const response = await axios.get(
      "http://127.0.0.1:8000/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUser(response.data);
  } catch (error) {
    console.log(
      "Profile error:",
      error.response?.data
    );

    setMessage(
      error.response?.data?.detail ||
      "Unable to load profile"
    );
  } finally {
    setLoading(false);
  }
};

fetchProfile();


}, []);

if (loading) {
return ( <div className="profile-page"> <div className="profile-loading">
Loading profile... </div> </div>
);
}

if (message) {
return ( <div className="profile-page"> <div className="profile-error">
{message} </div> </div>
);
}

return ( <div className="profile-page">


  <div className="profile-header">
    <div>
      <span className="profile-label">
        ACCOUNT
      </span>

      <h1>My Profile</h1>

      <p>
        View your account information and profile
        details.
      </p>
    </div>
  </div>

  {user && (
    <div className="profile-layout">

      <div className="profile-main-card">

        <div className="profile-cover"></div>

        <div className="profile-avatar">
          {user.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div className="profile-main-content">

          <h2>{user.name}</h2>

          <span
            className={`profile-role ${
              user.role === "recruiter"
                ? "role-recruiter"
                : "role-candidate"
            }`}
          >
            {user.role}
          </span>

          <p className="profile-email">
            {user.email}
          </p>

        </div>
      </div>

      <div className="profile-details-card">

        <div className="profile-card-heading">
          <h2>Personal Information</h2>

          <p>
            Your registered account details.
          </p>
        </div>

        <div className="profile-details">

          <div className="profile-detail-item">
            <span className="detail-icon">
              👤
            </span>

            <div>
              <span className="detail-label">
                Full Name
              </span>

              <strong>
                {user.name}
              </strong>
            </div>
          </div>

          <div className="profile-detail-item">
            <span className="detail-icon">
              ✉️
            </span>

            <div>
              <span className="detail-label">
                Email Address
              </span>

              <strong>
                {user.email}
              </strong>
            </div>
          </div>

          <div className="profile-detail-item">
            <span className="detail-icon">
              🏷️
            </span>

            <div>
              <span className="detail-label">
                Account Type
              </span>

              <strong>
                {user.role}
              </strong>
            </div>
          </div>

          <div className="profile-detail-item">
            <span className="detail-icon">
              🔐
            </span>

            <div>
              <span className="detail-label">
                Account Status
              </span>

              <strong className="active-status">
                Active
              </strong>
            </div>
          </div>

        </div>
      </div>

      <div className="profile-info-card">

        <div className="profile-info-icon">
          {user.role === "recruiter"
            ? "🏢"
            : "💼"}
        </div>

        <div>
          <h3>
            {user.role === "recruiter"
              ? "Recruiter Account"
              : "Candidate Account"}
          </h3>

          <p>
            {user.role === "recruiter"
              ? "Manage job postings, review applications, view resumes, and connect with candidates."
              : "Discover jobs, upload your resume, apply for opportunities, and track your applications."}
          </p>
        </div>

      </div>

    </div>
  )}

</div>

);
}

export default Profile;
