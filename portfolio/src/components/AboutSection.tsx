import React, { useState } from 'react';
import { AboutData } from '@/hooks/useAbout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Github, Linkedin, Mail, Edit3, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AboutSectionProps {
  about: AboutData;
  onUpdate: (data: AboutData) => void;
}

export function AboutSection({ about, onUpdate }: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<AboutData>(about);

  const handleSave = () => {
    onUpdate({
      ...editData,
      skills: typeof editData.skills === 'string' 
        ? (editData.skills as string).split(',').map(s => s.trim()).filter(Boolean)
        : editData.skills
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(about);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <section className="py-16 px-6 max-w-4xl mx-auto bg-card rounded-2xl border border-border shadow-lg mt-12 mb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input 
                value={editData.name} 
                onChange={e => setEditData({...editData, name: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input 
                value={editData.title} 
                onChange={e => setEditData({...editData, title: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input 
                value={editData.location} 
                onChange={e => setEditData({...editData, location: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Skills (comma separated)</label>
              <Input 
                value={typeof editData.skills === 'string' ? editData.skills : editData.skills.join(', ')} 
                onChange={e => setEditData({...editData, skills: e.target.value as any})} 
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Bio</label>
            <Textarea 
              value={editData.bio} 
              onChange={e => setEditData({...editData, bio: e.target.value})}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">GitHub URL</label>
              <Input 
                value={editData.github} 
                onChange={e => setEditData({...editData, github: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">LinkedIn URL</label>
              <Input 
                value={editData.linkedin} 
                onChange={e => setEditData({...editData, linkedin: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input 
                value={editData.email} 
                onChange={e => setEditData({...editData, email: e.target.value})} 
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 sm:px-12 max-w-4xl mx-auto bg-card rounded-2xl border border-border mt-12 mb-24 relative group">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => {
          setEditData(about);
          setIsEditing(true);
        }}
      >
        <Edit3 className="w-5 h-5 text-muted-foreground" />
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{about.name}</h2>
            <p className="text-xl text-primary font-medium mb-2">{about.title}</p>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {about.location}
            </div>
          </div>
          
          <p className="text-foreground/80 leading-relaxed text-lg">
            {about.bio}
          </p>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {about.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 text-sm font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-4 shrink-0 bg-background/50 p-6 rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Connect</h3>
          
          {about.github && (
            <a href={about.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5 mr-3" />
              <span>GitHub</span>
            </a>
          )}
          
          {about.linkedin && (
            <a href={about.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-foreground hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5 mr-3" />
              <span>LinkedIn</span>
            </a>
          )}
          
          {about.email && (
            <a href={`mailto:${about.email}`} className="flex items-center text-foreground hover:text-primary transition-colors">
              <Mail className="w-5 h-5 mr-3" />
              <span>Email</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
