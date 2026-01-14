import { Icon } from "@iconify/react";

const Resume = () => {
  return (
    <div>
      <div className="resume-wrapper">
        
        <div className="left-column">
          <div className="card">
            <h1>Mélody Stephan</h1>
            <h2 className="lead">Frontend Web Developer & 3D Generalist</h2>
            <p>+33 7 71 00 77 71 | Haut-Rhin, Alsace | melody_stephan@icloud.com</p>

            <div className="resume-links"> 
              <p>
                <Icon icon="icomoon-free:linkedin" width="25" />
                <a href="https://www.linkedin.com/in/m%C3%A9lody-stephan-b4a485172/">Mélody Stephan</a>
              </p>
              <p> 
                <Icon icon="akar-icons:github-fill" width="25" />
                <a href="https://github.com/melody-ste">melody-ste</a>
              </p>
              <p>
                <Icon icon="simple-icons:artstation" width="25" />
                <a href="https://github.com/melody-ste">Mélody Stephan</a>
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="skill-title">Skills</h2>
            <div className="grid">
              <div>
                <h3>Development</h3>
                <ul>
                  <li>HTML - CSS/Sass</li>
                  <li>Ruby/Ruby on rails</li>
                  <li>Database SQLite/PostgreSQL</li>
                  <li>Javascript/ReactJS</li>
                  <li>ThreeJS</li>
                  <li>Bootstrap</li>
                  <li>Git/Github</li>
                  <li>Penpot</li>
                </ul>
              </div>

              <div>
                <h3>3D Softwares</h3>
                <ul>
                  <li>Maya</li>
                  <li>Arnold</li>
                  <li>ZBrush</li>
                  <li>Adobe Photoshop</li>
                  <li>Substance Painter</li>
                  <li>Mari</li>
                  <li>Nuke</li>
                </ul>
              </div>

              <div>
                <h3>Languages</h3>
                <ul>
                  <li>French (native language)</li>
                  <li>English (fluent)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Education</h2>
            <div>
              <h3>Web Development Training</h3>
              <p className="date">The Hacking Project | May 2025 - January 2026</p>
             
              <h3>Bachelor in 3D Animation & Video Games</h3>
              <p className="date">Bellecour School | 2019 - 2022</p>

              <h3>Foundation Year in Applied Arts</h3>
              <p className="date">LISAA (Higher Institute of Applied Arts) | 2018 - 2019</p>

              {/* <h3>Scientific Baccalaureate ( high school diploma )</h3>
              <p>Camille Sée High School | 2015 - 2018</p> */}
            </div>
          </div>

        </div>

        <div className="right-column">
          <div className="card">
            <h2>Professional Experience</h2>
            <ul>
              <h3>Web Developer Intern - The Hacking Project</h3>
              <p className="date">November 2025 - January 2026</p>
              <ul>
                <li>Completed training in Three.js.</li>
                <li>Designed and developed a website during the internship.</li>
              </ul>

              <h3>3D Generalist - Busterwood Studio</h3>
              <p className="date">February 2023 - February 2024</p>
              <ul>
                <li>Modeling/texturing for the AR department.</li>
                <li>Modeling, UV mapping and asset optimization for several commercials.</li>
                <li>Environment set dressing and lighting of several shots in Maya.</li>
                <li>Image rendering management with Deadline.</li>
                <li>Compositing of some shots in Nuke and After Effects.</li>
              </ul>
              
              <h3>3D Generalist Intern - Busterwood Studio</h3>
              <p className="date">September 2022 - December 2022</p>
              <ul>
                <li>Modeling/texturing for the AR department.</li>
                <li>Modeling, UV mapping and asset optimization for a commercial.</li>
                <li>Texturing and shader creation.</li>
              </ul>
            </ul>
          </div>

          

        </div>
      </div>
    </div>
  );
};
export default Resume;