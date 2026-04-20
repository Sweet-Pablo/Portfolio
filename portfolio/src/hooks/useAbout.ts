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
  name: "Paul Davliakos",
  title: "University of Pittsburgh Engineering Student",
  location: "Pittsburgh, PA",
  bio: "I am a first year engineering student at Pitt. I love building my ideas and project from scratch. From basic electronics like soildering and circuts to 3d printing housing and mechanical parts I like to create, build, and bring my ideas to life. ",
  skills: ["Electronics", "Design", "3D Printing"],
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  email: "davliakos4@gmail.com"
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
