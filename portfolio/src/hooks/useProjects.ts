import { useState, useEffect, useCallback } from 'react';
import { SEED_PROJECTS } from '@/data/seedProjects';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  date: string;
  shortDescription: string;
  fullDescription: string;
  teamMembers: string[];
  technologies: string[];
  links: ProjectLink[];
  photos: string[];
}

const SEED_IDS = new Set(SEED_PROJECTS.map(p => p.id));

function mergeWithSeeds(stored: Project[]): Project[] {
  const storedIds = new Set(stored.map(p => p.id));
  const missing = SEED_PROJECTS.filter(s => !storedIds.has(s.id));
  return [...stored, ...missing];
}

function sortByDate(list: Project[]): Project[] {
  return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function saveToStorage(projects: Project[]): boolean {
  try {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    return true;
  } catch (e) {
    console.error('localStorage quota exceeded:', e);
    return false;
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => sortByDate(SEED_PROJECTS));
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('portfolio_projects');
    if (data) {
      try {
        const parsed: Project[] = JSON.parse(data);
        setProjects(sortByDate(mergeWithSeeds(parsed)));
      } catch (e) {
        console.error('Failed to parse projects:', e);
        setProjects(sortByDate(SEED_PROJECTS));
      }
    } else {
      setProjects(sortByDate(SEED_PROJECTS));
    }
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: crypto.randomUUID() };
    setProjects(prev => {
      const updated = sortByDate([...prev, newProject]);
      const ok = saveToStorage(updated);
      if (!ok) {
        setStorageError('Storage full — try using smaller or fewer photos.');
        return prev;
      }
      setStorageError(null);
      return updated;
    });
  }, []);

  const updateProject = useCallback((updated: Project) => {
    setProjects(prev => {
      const next = sortByDate(prev.map(p => p.id === updated.id ? updated : p));
      const ok = saveToStorage(next);
      if (!ok) {
        setStorageError('Storage full — try using smaller or fewer photos.');
        return prev;
      }
      setStorageError(null);
      return next;
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    if (SEED_IDS.has(id)) return;
    setProjects(prev => {
      const next = prev.filter(p => p.id !== id);
      saveToStorage(next);
      setStorageError(null);
      return next;
    });
  }, []);

  return { projects, addProject, updateProject, deleteProject, storageError };
}
