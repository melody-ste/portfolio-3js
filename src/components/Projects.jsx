import React, { useState, useEffect } from "react";

const Projects = () => {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = "https://funny-activity-cb50ecb0b0.strapiapp.com/api/projects?populate=header";
        const response = await fetch(url);
        const data = await response.json();

        setProjects(data.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); // no dependencies

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div>
        <h1>Personal Projects</h1>

        {projects.length === 0 && <p>No projects available for now.</p>}

        <ul className="projects-list">
          {projects.map((project) => (
            <li key={project.id} className="project-card">

              {project.header?.url && (
                <img
                  src={project.header.url}
                  alt={project.title}
                  className="project-card-header"
                />
              )}

              <h3>{project.title}</h3>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
