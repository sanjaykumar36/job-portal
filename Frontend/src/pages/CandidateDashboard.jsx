import { useEffect, useState } from "react";
import axios from "axios";

function CandidateDashboard() {
const [jobs, setJobs] = useState([]);
const [filteredJobs, setFilteredJobs] = useState([]);

const [resume, setResume] = useState(null);
const [resumeName, setResumeName] = useState("");
const [uploadedResume, setUploadedResume] = useState("");

const [message, setMessage] = useState("");
const [loading, setLoading] = useState(true);

const [searchTerm, setSearchTerm] = useState("");
const [locationFilter, setLocationFilter] = useState("");
const [salaryFilter, setSalaryFilter] = useState("");

// =====================================================
// FETCH JOBS
// =====================================================

useEffect(() => {
const fetchJobs = async () => {
try {
const response = await axios.get(
"http://127.0.0.1:8000/jobs"
);


    console.log("Jobs:", response.data);

    setJobs(response.data);
    setFilteredJobs(response.data);
  } catch (error) {
    console.log(
      "Jobs error:",
      error.response?.data
    );

    setMessage("Unable to load jobs.");
  } finally {
    setLoading(false);
  }
};

fetchJobs();


}, []);

// =====================================================
// SEARCH + FILTER
// =====================================================

useEffect(() => {
let results = [...jobs];


// SEARCH BY JOB TITLE
if (searchTerm.trim() !== "") {
  results = results.filter((job) =>
    job.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
}

// FILTER BY LOCATION
if (locationFilter !== "") {
  results = results.filter(
    (job) =>
      job.location?.toLowerCase() ===
      locationFilter.toLowerCase()
  );
}

// FILTER BY SALARY
if (salaryFilter !== "") {
  const minimumSalary =
    Number(salaryFilter);

  results = results.filter((job) => {
    if (!job.salary) {
      return false;
    }

    const salaryNumbers =
      job.salary.match(/\d+(\.\d+)?/g);

    if (!salaryNumbers) {
      return false;
    }

    const salaries =
      salaryNumbers.map(Number);

    const maximumSalary =
      Math.max(...salaries);

    return maximumSalary >= minimumSalary;
  });
}

setFilteredJobs(results);


}, [
jobs,
searchTerm,
locationFilter,
salaryFilter,
]);

// =====================================================
// CLEAR FILTERS
// =====================================================

const clearFilters = () => {
setSearchTerm("");
setLocationFilter("");
setSalaryFilter("");
};

// =====================================================
// RESUME SELECT
// =====================================================

const handleResumeChange = (e) => {
const file = e.target.files[0];


if (!file) {
  return;
}

if (file.type !== "application/pdf") {
  alert("Only PDF files are allowed.");
  return;
}

setResume(file);
setResumeName(file.name);


};

// =====================================================
// RESUME UPLOAD
// =====================================================

const handleResumeUpload = async () => {
if (!resume) {
alert("Please select a PDF resume.");
return;
}


try {
  const token =
    localStorage.getItem("token");

  if (!token) {
    alert("Please login again.");
    return;
  }

  const formData = new FormData();

  formData.append("file", resume);

  const response = await axios.post(
    "http://127.0.0.1:8000/upload-resume",
    formData,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  console.log(
    "Resume upload:",
    response.data
  );

  setUploadedResume(
    response.data.filename
  );

  alert(
    "Resume uploaded successfully!"
  );
} catch (error) {
  console.log(
    "Resume upload error:",
    error.response?.data
  );

  alert(
    error.response?.data?.detail ||
    "Resume upload failed."
  );
}


};

// =====================================================
// APPLY FOR JOB
// =====================================================

const handleApply = async (jobId) => {
if (!uploadedResume) {
alert(
"Please upload your resume before applying."
);


  return;
}

try {
  const token =
    localStorage.getItem("token");

  if (!token) {
    alert("Please login again.");
    return;
  }

  const response = await axios.post(
    "http://127.0.0.1:8000/applications",
    {
      job_id: jobId,
      resume: uploadedResume,
    },
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  console.log(
    "Application:",
    response.data
  );

  alert(
    "Application submitted successfully!"
  );
} catch (error) {
  console.log(
    "Application error:",
    error.response?.data
  );

  alert(
    error.response?.data?.detail ||
    "Failed to apply for this job."
  );
}


};

// =====================================================
// UNIQUE LOCATIONS
// =====================================================

const locations = [
...new Set(
jobs
.map((job) => job.location)
.filter(Boolean)
),
];

// =====================================================
// UI
// =====================================================

return ( <div className="dashboard-container">


  {/* =================================================
      HEADER
  ================================================= */}

  <div className="dashboard-header">

    <h1>
      Candidate Dashboard
    </h1>

    <p>
      Discover opportunities and find
      your next career move.
    </p>

  </div>


  {/* =================================================
      RESUME SECTION
  ================================================= */}

  <div className="jobs-section">

    <h2>
      Resume
    </h2>

    <p>
      Upload your latest resume before
      applying for jobs.
    </p>

    <input
      type="file"
      accept=".pdf,application/pdf"
      onChange={handleResumeChange}
    />

    {resumeName && (
      <p>
        Selected Resume:{" "}
        <strong>
          {resumeName}
        </strong>
      </p>
    )}

    {uploadedResume && (
      <p>
        <strong>
          ✓ Resume uploaded successfully
        </strong>
      </p>
    )}

    <button
      type="button"
      className="apply-btn"
      onClick={handleResumeUpload}
    >
      Upload Resume
    </button>

  </div>


  {/* =================================================
      SEARCH + FILTER SECTION
  ================================================= */}

  <div className="jobs-section">

    <div className="section-heading">

      <span>
        JOB SEARCH
      </span>

      <h2>
        Find Your Next Opportunity
      </h2>

      <p>
        Search and filter jobs based
        on your requirements.
      </p>

    </div>


    <div className="job-filters">

      {/* SEARCH */}

      <div className="filter-group">

        <label>
          Search Job
        </label>

        <input
          type="text"
          placeholder="Search by job title..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>


      {/* LOCATION */}

      <div className="filter-group">

        <label>
          Location
        </label>

        <select
          value={locationFilter}
          onChange={(e) =>
            setLocationFilter(
              e.target.value
            )
          }
        >

          <option value="">
            All Locations
          </option>

          {locations.map(
            (location) => (
              <option
                key={location}
                value={location}
              >
                {location}
              </option>
            )
          )}

        </select>

      </div>


      {/* SALARY */}

      <div className="filter-group">

        <label>
          Salary Range
        </label>

        <select
          value={salaryFilter}
          onChange={(e) =>
            setSalaryFilter(
              e.target.value
            )
          }
        >

          <option value="">
            All Salaries
          </option>

          <option value="3">
            ₹3 LPA+
          </option>

          <option value="5">
            ₹5 LPA+
          </option>

          <option value="8">
            ₹8 LPA+
          </option>

          <option value="10">
            ₹10 LPA+
          </option>

        </select>

      </div>


      {/* CLEAR */}

      <button
        type="button"
        className="clear-filter-btn"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

    </div>

  </div>


  {/* =================================================
      JOBS SECTION
  ================================================= */}

  <div className="jobs-section">

    <div className="jobs-heading-row">

      <h2>
        Available Jobs
      </h2>

      {!loading && (
        <span>
          {filteredJobs.length}{" "}
          {filteredJobs.length === 1
            ? "job"
            : "jobs"}{" "}
          found
        </span>
      )}

    </div>


    {/* LOADING */}

    {loading && (
      <p>
        Loading jobs...
      </p>
    )}


    {/* ERROR */}

    {!loading && message && (
      <p>
        {message}
      </p>
    )}


    {/* NO JOBS */}

    {!loading &&
      !message &&
      filteredJobs.length === 0 && (
        <div className="no-jobs">

          <h3>
            No jobs found
          </h3>

          <p>
            Try changing your search
            or clearing the filters.
          </p>

          <button
            type="button"
            className="clear-filter-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>
      )}


    {/* JOB GRID */}

    {!loading &&
      filteredJobs.length > 0 && (

        <div className="jobs-grid">

          {filteredJobs.map(
            (job) => (

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


                <button
                  type="button"
                  className="apply-btn"
                  onClick={() =>
                    handleApply(
                      job.id
                    )
                  }
                >
                  Apply Now
                </button>

              </div>

            )
          )}

        </div>

      )}

  </div>

</div>


);
}

export default CandidateDashboard;
