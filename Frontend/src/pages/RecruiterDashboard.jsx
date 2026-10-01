
import { useEffect, useState } from "react";
import axios from "axios";

function RecruiterDashboard() {

  const [jobs, setJobs] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // JOB FORM
  // =====================================================

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
  });

  const [editingJobId, setEditingJobId] =
    useState(null);


  // =====================================================
  // FETCH JOBS
  // =====================================================

  useEffect(() => {

    fetchJobs();

  }, []);


  const fetchJobs = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://127.0.0.1:8000/jobs",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setJobs(response.data);

    } catch (error) {

      console.log(
        "Jobs error:",
        error.response?.data
      );

      setMessage(
        "Unable to load jobs"
      );
    }
  };


  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  useEffect(() => {

    const fetchApplications = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response =
          await axios.get(
            "http://127.0.0.1:8000/recruiter/applications",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setApplications(
          response.data
        );

      } catch (error) {

        console.log(
          "Applications error:",
          error.response?.data
        );

      } finally {

        setLoading(false);

      }
    };

    fetchApplications();

  }, []);


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleJobChange = (e) => {

    setJobForm({
      ...jobForm,
      [e.target.name]:
        e.target.value,
    });

  };


  // =====================================================
  // CREATE / UPDATE JOB
  // =====================================================

  const handleJobSubmit = async (e) => {

    e.preventDefault();

    if (
      !jobForm.title ||
      !jobForm.description ||
      !jobForm.location ||
      !jobForm.salary
    ) {

      alert(
        "Please fill all job details"
      );

      return;
    }

    try {

      const token =
        localStorage.getItem("token");


      // UPDATE

      if (editingJobId) {

        const response =
          await axios.put(
            `http://127.0.0.1:8000/jobs/${editingJobId}`,
            jobForm,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setJobs(
          (currentJobs) =>
            currentJobs.map(
              (job) =>
                job.id === editingJobId
                  ? response.data
                  : job
            )
        );

        alert(
          "Job updated successfully!"
        );

        setEditingJobId(null);

      }

      // CREATE

      else {

        const response =
          await axios.post(
            "http://127.0.0.1:8000/jobs",
            jobForm,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setJobs(
          (currentJobs) => [
            ...currentJobs,
            response.data,
          ]
        );

        alert(
          "Job posted successfully!"
        );
      }


      // RESET FORM

      setJobForm({
        title: "",
        description: "",
        location: "",
        salary: "",
      });

    } catch (error) {

      console.log(
        "Job save error:",
        error.response?.data
      );

      alert(
        error.response?.data?.detail ||
        "Failed to save job"
      );
    }
  };


  // =====================================================
  // EDIT JOB
  // =====================================================

  const handleEditJob = (job) => {

    setEditingJobId(job.id);

    setJobForm({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {

    setEditingJobId(null);

    setJobForm({
      title: "",
      description: "",
      location: "",
      salary: "",
    });
  };


  // =====================================================
  // DELETE JOB
  // =====================================================

  const handleDeleteJob = async (jobId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmed) {
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      await axios.delete(
        `http://127.0.0.1:8000/jobs/${jobId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setJobs(
        (currentJobs) =>
          currentJobs.filter(
            (job) =>
              job.id !== jobId
          )
      );

      alert(
        "Job deleted successfully!"
      );

    } catch (error) {

      console.log(
        "Delete job error:",
        error.response?.data
      );

      alert(
        error.response?.data?.detail ||
        "Failed to delete job"
      );
    }
  };


  // =====================================================
  // VIEW RESUME
  // =====================================================

  const viewResume = async (
    filename
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          `http://127.0.0.1:8000/resume/${filename}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            responseType: "blob",
          }
        );

      const pdfBlob =
        new Blob(
          [response.data],
          {
            type: "application/pdf",
          }
        );

      const pdfUrl =
        window.URL.createObjectURL(
          pdfBlob
        );

      window.open(
        pdfUrl,
        "_blank"
      );

    } catch (error) {

      console.log(
        "Resume error:",
        error.response?.data
      );

      alert(
        "Unable to open resume"
      );
    }
  };


  // =====================================================
  // UPDATE APPLICATION STATUS
  // =====================================================

  const updateStatus = async (
    applicationId,
    newStatus
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://127.0.0.1:8000/applications/${applicationId}/status`,
        null,
        {
          params: {
            status: newStatus,
          },

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setApplications(
        (currentApplications) =>
          currentApplications.map(
            (application) =>
              application.id ===
              applicationId
                ? {
                    ...application,
                    status: newStatus,
                  }
                : application
          )
      );

    } catch (error) {

      console.log(
        "Status update error:",
        error.response?.data
      );

      alert(
        error.response?.data?.detail ||
        "Failed to update status"
      );
    }
  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {

    switch (status) {

      case "shortlisted":
        return "status-shortlisted";

      case "rejected":
        return "status-rejected";

      case "selected":
        return "status-selected";

      default:
        return "status-applied";
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="dashboard-container">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-header">

        <h1>
          Recruiter Dashboard
        </h1>

        <p>
          Manage your jobs and applications
        </p>

      </div>


      {/* =================================================
          CREATE / EDIT JOB
      ================================================= */}

      <div className="jobs-section">

        <h2>

          {editingJobId
            ? "Edit Job"
            : "Post a New Job"}

        </h2>


        <form
          onSubmit={handleJobSubmit}
          className="job-form"
        >

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={jobForm.title}
            onChange={handleJobChange}
          />


          <textarea
            name="description"
            placeholder="Job Description"
            value={jobForm.description}
            onChange={handleJobChange}
            rows="5"
          />


          <input
            type="text"
            name="location"
            placeholder="Location"
            value={jobForm.location}
            onChange={handleJobChange}
          />


          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={jobForm.salary}
            onChange={handleJobChange}
          />


          <button
            type="submit"
            className="apply-btn"
          >

            {editingJobId
              ? "Update Job"
              : "Post Job"}

          </button>


          {editingJobId && (

            <button
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </button>

          )}

        </form>

      </div>


      {/* =================================================
          POSTED JOBS
      ================================================= */}

      <div className="jobs-section">

        <h2>
          Posted Jobs
        </h2>


        {loading && (
          <p>
            Loading...
          </p>
        )}


        {message && (
          <p>
            {message}
          </p>
        )}


        {!loading &&
          !message &&
          jobs.length === 0 && (

            <p>
              You haven't posted any jobs yet.
            </p>

          )}


        <div className="jobs-grid">

          {jobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >

              <h3>
                {job.title}
              </h3>


              <p>
                <strong>
                  📍 Location:
                </strong>{" "}
                {job.location}
              </p>


              <p>
                <strong>
                  💰 Salary:
                </strong>{" "}
                {job.salary}
              </p>


              <p className="job-description">
                {job.description}
              </p>


              <p>
                <strong>
                  Job ID:
                </strong>{" "}
                {job.id}
              </p>


              <div className="application-actions">

                <button
                  onClick={() =>
                    handleEditJob(job)
                  }
                >
                  Edit
                </button>


                <button
                  onClick={() =>
                    handleDeleteJob(
                      job.id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* =================================================
          APPLICATIONS
      ================================================= */}

      <div className="jobs-section">

        <h2>
          Applications Received
        </h2>


        {applications.length === 0 ? (

          <p>
            No applications received yet.
          </p>

        ) : (

          <div className="jobs-grid">

            {applications.map(
              (application) => (

                <div
                  className="job-card"
                  key={application.id}
                >

                  <h3>
                    Application #
                    {application.id}
                  </h3>


                  <p>

                    <strong>
                      Job:
                    </strong>{" "}

                    {application.job_title}

                  </p>


                  <p>

                    <strong>
                      Candidate:
                    </strong>{" "}

                    {application.candidate_name}

                  </p>


                  <p>

                    <strong>
                      Email:
                    </strong>{" "}

                    {application.candidate_email}

                  </p>


                  {/* RESUME */}

                  <p>

                    <strong>
                      Resume:
                    </strong>{" "}

                    {application.resume ? (

                      <button
                        type="button"
                        onClick={() =>
                          viewResume(
                            application.resume
                          )
                        }
                      >
                        View Resume
                      </button>

                    ) : (

                      "Not uploaded"

                    )}

                  </p>


                  {/* STATUS */}

                  <p>

                    <strong>
                      Status:
                    </strong>{" "}

                    <span
                      className={`status-badge ${getStatusClass(
                        application.status
                      )}`}
                    >

                      {application.status}

                    </span>

                  </p>


                  {/* STATUS ACTIONS */}

                  <div className="application-actions">

                    <button
                      onClick={() =>
                        updateStatus(
                          application.id,
                          "shortlisted"
                        )
                      }
                    >
                      Shortlist
                    </button>


                    <button
                      onClick={() =>
                        updateStatus(
                          application.id,
                          "rejected"
                        )
                      }
                    >
                      Reject
                    </button>


                    <button
                      onClick={() =>
                        updateStatus(
                          application.id,
                          "selected"
                        )
                      }
                    >
                      Select
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );
}

export default RecruiterDashboard;
