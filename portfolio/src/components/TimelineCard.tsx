import { Project } from '@/hooks/useProjects';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil } from 'lucide-react';

interface TimelineCardProps {
  project: Project;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  index: number;
}

export function TimelineCard({ project, onClick, onEdit, index }: TimelineCardProps) {
  const formattedDate = project.date ? format(new Date(project.date), 'MMMM yyyy') : '';
  const firstPhoto = project.photos?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative mb-16 ml-6 sm:ml-12 w-full max-w-2xl cursor-pointer group"
      onClick={onClick}
    >
      <div className="absolute -left-9 sm:-left-15 top-8 w-4 h-4 rounded-full bg-primary ring-4 ring-background z-10" />

      <Card className="overflow-hidden bg-card border-card-border hover:border-primary/50 transition-colors duration-300">
        {firstPhoto ? (
          <div className="h-48 sm:h-64 w-full overflow-hidden">
            <img
              src={firstPhoto}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="h-48 sm:h-64 w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <span className="text-4xl font-bold text-primary/40 uppercase tracking-widest">
              {project.title.substring(0, 2)}
            </span>
          </div>
        )}

        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-2">
            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-muted-foreground font-mono">{formattedDate}</span>
              {/* Edit button — visible on hover */}
              <button
                data-testid={`button-edit-${project.id}`}
                onClick={onEdit}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground"
                title="Edit project"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-foreground/80 mb-4 line-clamp-2">{project.shortDescription}</p>

          {project.teamMembers && project.teamMembers.length > 0 && (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground/60">Team:</span>{' '}
              {project.teamMembers.join(', ')}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
