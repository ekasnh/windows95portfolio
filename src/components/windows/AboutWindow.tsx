import React from 'react';
import { Window } from '../win95/Window';
import { Mail, MapPin, GraduationCap, Briefcase, Code, BookOpen } from 'lucide-react';

export const AboutWindow: React.FC = () => {
  return (
    <Window id="about" icon="👤">
      <div className="p-4 space-y-4 font-win95 text-foreground">
        {/* Header */}
        <div className="win95-border-inset bg-win95-white p-4 text-center">
          <div className="text-6xl mb-2">👨‍💻</div>
          <h1 className="text-2xl font-bold">Ekansh Agarwal</h1>
          <p className="text-sm text-muted flex items-center justify-center gap-1 mt-1">
            <MapPin size={12} />
            Ghaziabad, India
          </p>
          <p className="text-xs mt-2">
            <Mail className="inline mr-1" size={12} />
            <a href="mailto:ekanshagarwal9090@gmail.com" className="text-primary hover:underline">
              ekanshagarwal9090@gmail.com
            </a>
          </p>
        </div>

        {/* Professional Summary */}
        <div className="win95-border-inset bg-win95-white p-3">
          <h2 className="font-bold flex items-center gap-1 mb-2">
            <Briefcase size={14} />
            Professional Summary
          </h2>
          <p className="text-sm">
            A data-driven and analytical MBA (Tech) student with a strong background in Business Intelligence 
            and Analytics, and Strategy, Innovation, and Entrepreneurship. Proven ability to leverage tools 
            like PowerBI and QlikSense to decrease data processing time (by 37%) and optimize user experience, 
            resulting in a 10% increase in average session duration and a 25% decrease in cart abandonment rate.
          </p>
        </div>

        {/* Education */}
        <div className="win95-border-inset bg-win95-white p-3">
          <h2 className="font-bold flex items-center gap-1 mb-2">
            <GraduationCap size={14} />
            Education
          </h2>
          <div className="text-sm space-y-2">
            <div>
              <p className="font-bold">NMIMS University Mumbai</p>
              <p>MBA (Tech) EXTC - Business Intelligence and Analytics & Strategy, Innovation and Entrepreneurship</p>
              <p className="text-muted">GPA: 3.44/4 | Expected June 2024</p>
            </div>
            <div>
              <p className="font-bold">Delhi Public School Ghaziabad International</p>
              <p>High School - PCM Background</p>
              <p className="text-muted">86% | July 2019</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="win95-border-inset bg-win95-white p-3">
          <h2 className="font-bold flex items-center gap-1 mb-2">
            <Code size={14} />
            Technical Skills
          </h2>
          <div className="text-sm space-y-1">
            <p><strong>Languages:</strong> Python, R, Fuse, HTML, CSS, JavaScript</p>
            <p><strong>Software:</strong> PowerBI, Tableau, QlikSense, Alteryx, Matlab, SPSS, Visual Studio</p>
            <p><strong>Database:</strong> SQL, NoSQL, SQLite, Oracle</p>
          </div>
        </div>

        {/* Research Interests */}
        <div className="win95-border-inset bg-win95-white p-3">
          <h2 className="font-bold flex items-center gap-1 mb-2">
            <BookOpen size={14} />
            Research Interests
          </h2>
          <p className="text-sm">Machine Learning, Computer Vision, Algorithms</p>
        </div>
      </div>
    </Window>
  );
};
