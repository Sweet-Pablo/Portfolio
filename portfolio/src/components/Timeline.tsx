import { Project } from '@/hooks/useProjects';
import { TimelineCard } from './TimelineCard';
import { FolderGit2 } from 'lucide-react';

interface TimelineProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onEditProject: (project: Project) => void;
}

export function Timeline({ projects, onProjectClick, onEditProject }: TimelineProps) {
  if (projects.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <FolderGit2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Your story starts here</h3>
        <p className="text-muted-foreground mb-8">
          Add your first project to the timeline to begin showcasing your engineering journey.
        </p>
      </div>
    );
  }

  return (
    <div className="relative py-12 px-4 sm:px-8 max-w-4xl mx-auto">
      {/* Vertical line */}
      <div className="absolute left-10 sm:left-[4.5rem] top-12 bottom-0 w-0.5 bg-border z-0" />

      <div className="relative z-10">
        {projects.map((project, index) => (
          <TimelineCard
            key={project.id}
            project={project}
            index={index}
            onClick={() => onProjectClick(project)}
            onEdit={(e) => {
              e.stopPropagation();
              onEditProject(project);
            }}
          />
        ))}
      </div>

      {/* End dot */}
      <div className="absolute left-8 sm:left-[4.125rem] bottom-0 w-4 h-4 rounded-full bg-border" />
    </div>
  );
}
