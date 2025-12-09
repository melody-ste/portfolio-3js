import React from "react";

const ProjectDetail = ({ project }) => {
  if (!project) return null;

  return (
    <div>

      <h1>{project.title}</h1>

      {project.description && (
        <p>{project.description}</p>
      )}

      <div>
        {project.multimedia?.map((media, index) => {
          const url = media.url;
          const mime = media.mime;

          if (!url) return null;

          if (mime.startsWith("image")) {
            return (
              <img
                key={index}
                src={url}
                alt={media.alternativeText || media.name}
                
              />
            );
          }

          if (mime.startsWith("video")) {
            return (
              <video key={index} controls className="project-media">
                <source src={url} type={mime} />
                Your browser does not support video playback.
              </video>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default ProjectDetail;
