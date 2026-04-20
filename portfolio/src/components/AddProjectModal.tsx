import { useState, useEffect, useRef } from 'react';
import { Project } from '@/hooks/useProjects';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X, Upload } from 'lucide-react';
import { compressImage } from '@/lib/compressImage';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
  teamMembers: z.string(),
  technologies: z.string(),
  links: z.array(
    z.object({
      label: z.string().min(1, 'Label required'),
      url: z.string().url('Must be a valid URL'),
    })
  ),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  onUpdate?: (project: Project) => void;
  editingProject?: Project | null;
}

export function AddProjectModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingProject,
}: AddProjectModalProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragIdx = useRef<number | null>(null);
  const isEditing = !!editingProject;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      date: new Date().toISOString().split('T')[0],
      shortDescription: '',
      fullDescription: '',
      teamMembers: '',
      technologies: '',
      links: [],
    },
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (editingProject) {
      form.reset({
        title: editingProject.title,
        date: editingProject.date,
        shortDescription: editingProject.shortDescription,
        fullDescription: editingProject.fullDescription,
        teamMembers: editingProject.teamMembers.join(', '),
        technologies: editingProject.technologies.join(', '),
        links: editingProject.links,
      });
      setPhotos(editingProject.photos);
    } else {
      form.reset({
        title: '',
        date: new Date().toISOString().split('T')[0],
        shortDescription: '',
        fullDescription: '',
        teamMembers: '',
        technologies: '',
        links: [],
      });
      setPhotos([]);
    }
  }, [editingProject, form]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        const compressed = await compressImage(file);
        setPhotos((prev) => [...prev, compressed]);
      } catch {
        console.error('Failed to compress image');
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ProjectFormValues) => {
    const teamMembers = data.teamMembers.split(',').map((s) => s.trim()).filter(Boolean);
    const technologies = data.technologies.split(',').map((s) => s.trim()).filter(Boolean);

    if (isEditing && editingProject && onUpdate) {
      onUpdate({
        ...editingProject,
        title: data.title,
        date: data.date,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        teamMembers,
        technologies,
        links: data.links,
        photos,
      });
    } else {
      onSave({
        title: data.title,
        date: data.date,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        teamMembers,
        technologies,
        links: data.links,
        photos,
      });
    }

    form.reset();
    setPhotos([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl bg-background border-border p-0 sm:rounded-xl"
        style={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
      >
        {/* Fixed header */}
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-2xl font-bold">
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
          >
            {/* Scrollable fields */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Apollo Mission Control" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description *</FormLabel>
                    <FormControl>
                      <Input placeholder="One line summary..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Deep dive into the project..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="teamMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Members (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Alice, Bob, Charlie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Node, Postgres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Links */}
              <div>
                <label className="block text-sm font-medium mb-2">Links</label>
                {form.watch('links').map((_, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-start">
                    <FormField
                      control={form.control}
                      name={`links.${idx}.label`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Label (e.g. GitHub)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`links.${idx}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newLinks = [...form.getValues('links')];
                        newLinks.splice(idx, 1);
                        form.setValue('links', newLinks);
                      }}
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue('links', [
                      ...form.getValues('links'),
                      { label: '', url: '' },
                    ]);
                  }}
                  className="mt-1"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Link
                </Button>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium mb-1">Photos</label>
                {photos.length > 1 && (
                  <p className="text-xs text-muted-foreground mb-3">Drag to reorder — the first image is the cover shown on the timeline.</p>
                )}
                <div className="flex flex-wrap gap-4">
                  {photos.map((photo, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => { dragIdx.current = idx; }}
                      onDragEnter={() => setDragOverIdx(idx)}
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDragEnd={() => {
                        if (dragIdx.current !== null && dragOverIdx !== null && dragIdx.current !== dragOverIdx) {
                          setPhotos(prev => {
                            const next = [...prev];
                            const [moved] = next.splice(dragIdx.current!, 1);
                            next.splice(dragOverIdx, 0, moved);
                            return next;
                          });
                        }
                        dragIdx.current = null;
                        setDragOverIdx(null);
                      }}
                      className={[
                        'relative w-24 h-24 rounded-md overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all duration-150 select-none',
                        dragOverIdx === idx && dragIdx.current !== idx
                          ? 'border-primary scale-105 shadow-lg shadow-primary/30'
                          : 'border-border',
                      ].join(' ')}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover pointer-events-none" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] font-semibold text-center py-0.5 leading-tight">
                          COVER
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 rounded-md border border-dashed border-muted-foreground/50 hover:border-primary flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-xs">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
              </div>

            </div>

            {/* Fixed footer */}
            <div className="shrink-0 border-t border-border px-6 py-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" size="lg">
                {isEditing ? 'Save Changes' : 'Save Project'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
