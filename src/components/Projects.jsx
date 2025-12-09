import React, { useState, useEffect } from "react";
import ProjectDetail from "./ProjectDetail";

const Projects = () => {

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = "https://funny-activity-cb50ecb0b0.strapiapp.com/api/projects?populate=*&locale=en";
        const response = await fetch(url);
        const data = await response.json();

        const list = data.data || [];

        setProjects(list);

        if (list.length > 0) {
          setSelectedProject(list[0]);
        }

      } catch (err) {
        console.error(err);
        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="projects-container">
      <div className="projects-list-column">
        <h1>Projects</h1>

        {projects.length === 0 && <p>No projects available for now.</p>}

        <ul className="projects-list">
          {projects.map((project) => (
            <li
              key={project.id}
              className={`project-card ${selectedProject?.id === project.id ? "selected" : ""}`}
              onClick={() => setSelectedProject(project)}
              style={{ cursor: "pointer" }}
            >
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

      <div className="projects-detail-column">
        {selectedProject ? (
          <ProjectDetail project={selectedProject} />
        ) : (
          <p>Select a project.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
