import { useState, useEffect, useCallback } from 'react';

export interface AboutData {
  name: string;
  title: string;
  location: string;
  bio: string;
  skills: string[];
  github: string;
  linkedin: string;
  email: string;
}

const defaultAbout: AboutData = {
  name: "Your Name",
  title: "Software Engineer",
  location: "San Francisco, CA",
  bio: "I build robust systems and beautiful interfaces.",
  skills: ["TypeScript", "React", "Node.js"],
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  email: "hello@example.com"
};

export function useAbout() {
  const [about, setAbout] = useState<AboutData>(defaultAbout);

  useEffect(() => {
    const data = localStorage.getItem('portfolio_about');
    if (data) {
      try {
        setAbout(JSON.parse(data));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const updateAbout = useCallback((newAbout: AboutData) => {
    setAbout(newAbout);
    localStorage.setItem('portfolio_about', JSON.stringify(newAbout));
  }, []);

  return { about, updateAbout };
}
