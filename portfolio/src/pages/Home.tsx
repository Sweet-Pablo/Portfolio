import { useState, useEffect } from 'react';
import { useProjects, Project } from '@/hooks/useProjects';
import { useAbout } from '@/hooks/useAbout';
import { Timeline } from '@/components/Timeline';
import { AboutSection } from '@/components/AboutSection';
import { ProjectModal } from '@/components/ProjectModal';
import { AddProjectModal } from '@/components/AddProjectModal';
import { TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { projects, addProject, updateProject, storageError } = useProjects();
  const { about, updateAbout } = useAbout();
  const { toast } = useToast();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    if (storageError) {
      toast({
        title: 'Storage full',
        description: storageError,
        variant: 'destructive',
      });
    }
  }, [storageError, toast]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '6') {
        setEditingProject(null);
        setIsAddModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/30 font-sans">

      {/* Hero Section */}
      <header className="relative py-24 sm:py-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-2xl mb-8 border border-border shadow-lg">
            <TerminalSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
            {about.name}
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            {about.title} based in {about.location}.
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 container mx-auto">
        <Timeline
          projects={projects}
          onProjectClick={setSelectedProject}
          onEditProject={handleEditProject}
        />

        <AboutSection
          about={about}
          onUpdate={updateAbout}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} {about.name}. All rights reserved.</p>
      </footer>

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={addProject}
        onUpdate={updateProject}
        editingProject={editingProject}
      />
    </div>
  );
}
