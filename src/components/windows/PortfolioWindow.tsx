import React from 'react';
import { Window } from '../win95/Window';
import { ExternalLink, FileText, Github, Linkedin, Mail } from 'lucide-react';

export const PortfolioWindow: React.FC = () => {
  const projects = [
    {
      name: 'Gigid-gigid-learn python',
      repo: 'https://github.com/ekasnh/Gigidi-giggid-Learn-Python',
      description: 'Python learning project',
      stack: 'Python',
    },
    {
      name: 'Shardvault',
      repo: 'https://github.com/ekasnh/ShardVault',
      description: 'Secure file storing system using hybrid cryptography',
      stack: 'JavaScript, Python',
    },
    {
      name: 'Inferometer',
      repo: 'https://github.com/ekasnh/Inferometer',
      description: 'Single-file web application designed to measure and visualize API inference latency.',
      stack: 'JavaScript, HTML',
    },
    {
      name: 'Windows 95 Portfolio',
      repo: 'https://github.com/ekasnh/windows95-portfolio',
      description: 'This portfolio website built with Windows 95 aesthetic',
      stack: 'TypeScript, React',
    },
  ];

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Ekansh_Agarwal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Window id="portfolio" icon="📁">
      <div className="p-4 space-y-4 font-win95">
        {/* Header */}
        <div className="win95-border-inset bg-win95-white p-4">
          <h1 className="text-2xl font-bold text-foreground">Ekansh Agarwal</h1>
          <p className="text-lg text-muted italic">"Whatever your mom like to call me"</p>
          <p className="text-sm mt-2">
            <Mail className="inline mr-1" size={14} />
            <a href="mailto:ekanshagarwal9090@gmail.com" className="text-primary hover:underline">
              ekanshagarwal9090@gmail.com
            </a>
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex gap-2 flex-wrap">
          <button
            className="win95-button flex items-center gap-1"
            onClick={() => window.open('https://github.com/ekasnh', '_blank')}
          >
            <Github size={14} />
            GitHub
          </button>
          <button
            className="win95-button flex items-center gap-1"
            onClick={() => window.open('https://www.linkedin.com/in/ekansh-agarwal01/', '_blank')}
          >
            <Linkedin size={14} />
            LinkedIn
          </button>
          <button
            className="win95-button flex items-center gap-1"
            onClick={handleDownloadResume}
            title="ekanshagarwal9090@gmail.com"
          >
            <FileText size={14} />
            Download Resume
          </button>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-foreground">Projects</h2>
          <div className="space-y-2">
            {projects.map((project, index) => (
              <div key={index} className="win95-border-inset bg-win95-white p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-foreground">{project.name}</h3>
                    <p className="text-sm text-muted">{project.description}</p>
                    <p className="text-xs mt-1">
                      <span className="bg-primary text-primary-foreground px-1">{project.stack}</span>
                    </p>
                  </div>
                  <button
                    className="win95-button !min-w-0 !px-2"
                    onClick={() => window.open(project.repo, '_blank')}
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
};
