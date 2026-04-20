import React, { useState } from 'react';
import { Project } from '@/hooks/useProjects';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!project) return null;

  const formattedDate = project.date ? format(new Date(project.date), 'MMMM yyyy') : '';

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % project.photos.length);
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev - 1 + project.photos.length) % project.photos.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background border-border p-0 sm:rounded-xl">
        {project.photos && project.photos.length > 0 && (
          <div className="relative h-64 sm:h-96 w-full bg-black group">
            <img 
              src={project.photos[photoIndex]} 
              alt={`${project.title} - ${photoIndex + 1}`}
              className="w-full h-full object-contain"
            />
            {project.photos.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-black/50 bg-black/20"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-black/50 bg-black/20"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {project.photos.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${idx === photoIndex ? 'bg-primary' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
        <div className="p-6 sm:p-10">
          <DialogHeader className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <DialogTitle className="text-3xl font-bold text-foreground">
                  {project.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground font-mono mt-1">
                  {formattedDate}
                </DialogDescription>
              </div>
              
              {project.links && project.links.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {project.links.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                    >
                      {link.label.toLowerCase().includes('github') ? (
                        <Github className="w-4 h-4 mr-2" />
                      ) : (
                        <ExternalLink className="w-4 h-4 mr-2" />
                      )}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Overview</h4>
              <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                {project.fullDescription}
              </p>
            </div>

            {project.teamMembers && project.teamMembers.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Team</h4>
                <p className="text-muted-foreground">{project.teamMembers.join(', ')}</p>
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
