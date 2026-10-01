import { useEffect, useState } from "react";
import axios from "axios";

function RecruiterDashboard() {
const [jobs, setJobs] = useState([]);
const [applications, setApplications] = useState([]);

const [loadingJobs, setLoadingJobs] = useState(true);
const [loadingApplications, setLoadingApplications] =
useState(true);

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [location, setLocation] = useState("");
const [salary, setSalary] = useState("");

const [editingJobId, setEditingJobId] = useState(null);
const [message, setMessage] = useState("");

const token = localStorage.getItem("token");

const axiosConfig = {
headers: {
Authorization: `Bearer ${token}`,
},
};

const fetchJobs = async () => {
try {
setLoadingJobs(true);


  const response = await axios.get(
    "http://127.0.0.1:8000/jobs"
  );

  setJobs(response.data);
} catch (error) {
  console.log(
    "Jobs error:",
    error.response?.data
  );
} finally {
  setLoadingJobs(false);
}


};

const fetchApplications = async () => {
try {
setLoadingApplications(true);


  const response = await axios.get(
    "http://127.0.0.1:8000/recruiter/applications",
    axiosConfig
  );

  setApplications(response.data);
} catch (error) {
  console.log(
    "Applications error:",
    error.response?.data
  );
} finally {
  setLoadingApplications(false);
}


};

useEffect(() => {
fetchJobs();
fetchApplications();
}, []);

const clearForm = () => {
setTitle("");
setDescription("");
setLocation("");
setSalary("");
setEditingJobId(null);
};

const handleSubmit = async (event) => {
event.preventDefault();


setMessage("");

try {
  const jobData = {
    title,
    description,
    location,
    salary,
  };

  if (editingJobId) {
    await axios.put(
      `http://127.0.0.1:8000/jobs/${editingJobId}`,
      jobData,
      axiosConfig
    );

    setMessage(
      "Job updated successfully"
    );
  } else {
    await axios.post(
      "http://127.0.0.1:8000/jobs",
      jobData,
      axiosConfig
    );

    setMessage(
      "Job posted successfully"
    );
  }

  clearForm();
  fetchJobs();
} catch (error) {
  console.log(
    "Job save error:",
    error.response?.data
  );

  setMessage(
    error.response?.data?.detail ||
    "Unable to save job"
  );
}


};

const handleEdit = (job) => {
setEditingJobId(job.id);
setTitle(job.title);
setDescription(job.description);
setLocation(job.location);
setSalary(job.salary);


window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

const handleDelete = async (jobId) => {
const confirmed = window.confirm(
"Are you sure you want to delete this job?"
);


if (!confirmed) {
  return;
}

try {
  await axios.delete(
    `http://127.0.0.1:8000/jobs/${jobId}`,
    axiosConfig
  );

  setMessage(
    "Job deleted successfully"
  );

  fetchJobs();
  fetchApplications();
} catch (error) {
  console.log(
    "Delete error:",
    error.response?.data
  );

  setMessage(
    error.response?.data?.detail ||
    "Unable to delete job"
  );
}


};

const handleStatusUpdate = async (
applicationId,
status
) => {
try {
await axios.put(
`http://127.0.0.1:8000/applications/${applicationId}/status?status=${status}`,
{},
axiosConfig
);


  setMessage(
    `Application ${status} successfully`
  );

  fetchApplications();
} catch (error) {
  console.log(
    "Status update error:",
    error.response?.data
  );

  setMessage(
    error.response?.data?.detail ||
    "Unable to update application"
  );
}

};

const totalJobs = jobs.length;
const totalApplications = applications.length;

const selectedApplications =
applications.filter(
(application) =>
application.status === "selected"
).length;

const shortlistedApplications =
applications.filter(
(application) =>
application.status === "shortlisted"
).length;

const appliedApplications =
applications.filter(
(application) =>
application.status === "applied"
).length;

return ( <div className="dashboard-container">

```
  <div className="dashboard-header">
    <h1>Recruiter Dashboard</h1>
    <p>
      Manage your job postings and candidates
    </p>
  </div>

  {message && (
    <p>{message}</p>
  )}

  <div className="dashboard-stats">

    <div className="stat-card">
      <h3>Total Jobs</h3>
      <strong>{totalJobs}</strong>
    </div>

    <div className="stat-card">
      <h3>Applications</h3>
      <strong>{totalApplications}</strong>
    </div>

    <div className="stat-card">
      <h3>Shortlisted</h3>
      <strong>
        {shortlistedApplications}
      </strong>
    </div>

    <div className="stat-card">
      <h3>Selected</h3>
      <strong>
        {selectedApplications}
      </strong>
    </div>

  </div>

  <div className="job-form-section">

    <h2>
      {editingJobId
        ? "Edit Job"
        : "Post a New Job"}
    </h2>

    <form
      className="job-form"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        required
      />

      <textarea
        placeholder="Job Description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        required
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(event) =>
          setLocation(event.target.value)
        }
        required
      />

      <input
        type="text"
        placeholder="Salary"
        value={salary}
        onChange={(event) =>
          setSalary(event.target.value)
        }
        required
      />

      <button
        type="submit"
        className="primary-btn"
      >
        {editingJobId
          ? "Update Job"
          : "Post Job"}
      </button>

      {editingJobId && (
        <button
          type="button"
          className="clear-filter-btn"
          onClick={clearForm}
        >
          Cancel Edit
        </button>
      )}

    </form>

  </div>

  <div className="jobs-section">

    <div className="jobs-heading-row">
      <h2>My Job Postings</h2>

      <span>
        {totalJobs}{" "}
        {totalJobs === 1
          ? "Job"
          : "Jobs"}
      </span>
    </div>

    {loadingJobs && (
      <p>Loading jobs...</p>
    )}

    {!loadingJobs &&
      jobs.length === 0 && (
        <div className="no-jobs">
          <h3>No Jobs Posted</h3>
          <p>
            Post your first job to start
            receiving applications.
          </p>
        </div>
      )}

    {!loadingJobs &&
      jobs.length > 0 && (
        <div className="jobs-grid">

          {jobs.map((job) => (
            <div
              className="job-card"
              key={job.id}
            >

              <h3>{job.title}</h3>

              <p>
                <strong>
                  Location:
                </strong>{" "}
                {job.location}
              </p>

              <p>
                <strong>
                  Salary:
                </strong>{" "}
                {job.salary}
              </p>

              <p>
                {job.description}
              </p>

              <div className="application-actions">

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() =>
                    handleEdit(job)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(job.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

  </div>

  <div className="jobs-section">

    <div className="jobs-heading-row">
      <h2>Candidate Applications</h2>

      <span>
        {totalApplications}{" "}
        {totalApplications === 1
          ? "Application"
          : "Applications"}
      </span>
    </div>

    {loadingApplications && (
      <p>
        Loading applications...
      </p>
    )}

    {!loadingApplications &&
      applications.length === 0 && (
        <div className="no-jobs">
          <h3>No Applications Yet</h3>
          <p>
            Applications from candidates
            will appear here.
          </p>
        </div>
      )}

    {!loadingApplications &&
      applications.length > 0 && (
        <div className="jobs-grid">

          {applications.map(
            (application) => (
              <div
                className="job-card"
                key={application.id}
              >

                <h3>
                  {application.candidate_name}
                </h3>

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {application.candidate_email}
                </p>

                <p>
                  <strong>
                    Job:
                  </strong>{" "}
                  {application.job_title}
                </p>

                <p>
                  <strong>
                    Application ID:
                  </strong>{" "}
                  #{application.id}
                </p>

                <p>
                  <strong>
                    Status:
                  </strong>{" "}

                  <span
                    className={`status-badge status-${application.status}`}
                  >
                    {application.status}
                  </span>
                </p>

                {application.resume && (
                  <p>
                    <a
                      href={`http://127.0.0.1:8000/resume/${application.resume}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Resume
                    </a>
                  </p>
                )}

                <div className="application-actions">

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() =>
                      handleStatusUpdate(
                        application.id,
                        "shortlisted"
                      )
                    }
                  >
                    Shortlist
                  </button>

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() =>
                      handleStatusUpdate(
                        application.id,
                        "selected"
                      )
                    }
                  >
                    Select
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      handleStatusUpdate(
                        application.id,
                        "rejected"
                      )
                    }
                  >
                    Reject
                  </button>

                </div>

              </div>
            )
          )}

        </div>
      )}

  </div>

  <div className="jobs-section">

    <div className="jobs-heading-row">
      <h2>Application Summary</h2>
    </div>

    <div className="jobs-grid">

      <div className="job-card">
        <h3>Applied</h3>
        <p>
          Candidates currently in applied status
        </p>
        <strong>
          {appliedApplications}
        </strong>
      </div>

      <div className="job-card">
        <h3>Shortlisted</h3>
        <p>
          Candidates shortlisted for the next stage
        </p>
        <strong>
          {shortlistedApplications}
        </strong>
      </div>

      <div className="job-card">
        <h3>Selected</h3>
        <p>
          Candidates selected for the job
        </p>
        <strong>
          {selectedApplications}
        </strong>
      </div>

    </div>

  </div>

</div>

);
}

export default RecruiterDashboard;
