import React from 'react';
import { Window } from '../win95/Window';
import { Mail, Github, Linkedin, GraduationCap, ExternalLink } from 'lucide-react';

export const ContactWindow: React.FC = () => {
  return (
    <Window id="contact" icon="📧">
      <div className="p-4 space-y-4 font-win95 text-foreground">
        <div className="win95-border-inset bg-win95-white p-4 text-center">
          <div className="text-4xl mb-2">📬</div>
          <h1 className="text-xl font-bold">Get In Touch</h1>
          <p className="text-sm text-muted mt-1">Feel free to reach out!</p>
        </div>

        <div className="space-y-2">
          <a 
            href="mailto:ekanshagarwal9090@gmail.com"
            className="win95-border-outset bg-secondary p-3 flex items-center gap-3 hover:bg-win95-lightGray cursor-pointer block"
          >
            <Mail size={24} className="text-primary" />
            <div>
              <p className="font-bold">Email</p>
              <p className="text-sm text-primary">ekanshagarwal9090@gmail.com</p>
            </div>
          </a>

          <a 
            href="https://github.com/ekasnh"
            target="_blank"
            rel="noopener noreferrer"
            className="win95-border-outset bg-secondary p-3 flex items-center gap-3 hover:bg-win95-lightGray cursor-pointer block"
          >
            <Github size={24} />
            <div>
              <p className="font-bold">GitHub</p>
              <p className="text-sm text-primary">github.com/ekasnh</p>
            </div>
            <ExternalLink size={14} className="ml-auto" />
          </a>

          <a 
            href="https://www.linkedin.com/in/ekansh-agarwal01/"
            target="_blank"
            rel="noopener noreferrer"
            className="win95-border-outset bg-secondary p-3 flex items-center gap-3 hover:bg-win95-lightGray cursor-pointer block"
          >
            <Linkedin size={24} className="text-primary" />
            <div>
              <p className="font-bold">LinkedIn</p>
              <p className="text-sm text-primary">linkedin.com/in/ekansh-agarwal01</p>
            </div>
            <ExternalLink size={14} className="ml-auto" />
          </a>

          <a 
            href="https://scholar.google.com/citations?user=xDg34AYAAAAJ&hl=en&authuser=1"
            target="_blank"
            rel="noopener noreferrer"
            className="win95-border-outset bg-secondary p-3 flex items-center gap-3 hover:bg-win95-lightGray cursor-pointer block"
          >
            <GraduationCap size={24} className="text-accent" />
            <div>
              <p className="font-bold">Google Scholar</p>
              <p className="text-sm text-primary">View Publications</p>
            </div>
            <ExternalLink size={14} className="ml-auto" />
          </a>
        </div>
      </div>
    </Window>
  );
};
