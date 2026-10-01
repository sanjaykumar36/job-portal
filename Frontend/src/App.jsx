
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import MyApplications from "./pages/MyApplications";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ==============================
            PUBLIC ROUTES
        ============================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ==============================
            PROFILE
        ============================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ==============================
            CANDIDATE DASHBOARD
        ============================== */}

        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute role="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />


        {/* ==============================
            MY APPLICATIONS
        ============================== */}

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="candidate">
              <MyApplications />
            </ProtectedRoute>
          }
        />


        {/* ==============================
            RECRUITER DASHBOARD
        ============================== */}

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

