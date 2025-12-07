import { Project, User, ProjectData } from "../types";

const KEYS = {
  USER: 'lf_user',
  PROJECTS: 'lf_projects'
};

export const storageService = {
  // Auth
  login: (email: string, name: string): User => {
    // Mock login/signup by just saving/retrieving a simple user object
    const user: User = {
      id: btoa(email), // Simple ID generation
      email,
      name
    };
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
    return user;
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  },

  logout: () => {
    localStorage.removeItem(KEYS.USER);
  },

  // Projects
  getProjects: (userId: string): Project[] => {
    const stored = localStorage.getItem(KEYS.PROJECTS);
    const projects: Project[] = stored ? JSON.parse(stored) : [];
    return projects.filter(p => p.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getProject: (id: string): Project | undefined => {
    const stored = localStorage.getItem(KEYS.PROJECTS);
    const projects: Project[] = stored ? JSON.parse(stored) : [];
    return projects.find(p => p.id === id);
  },

  createProject: (userId: string, name: string): Project => {
    const stored = localStorage.getItem(KEYS.PROJECTS);
    const projects: Project[] = stored ? JSON.parse(stored) : [];
    
    const newProject: Project = {
      id: crypto.randomUUID(),
      userId,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentStep: 1,
      data: {
        topic: '',
        goal: '',
        scenarios: [],
        strategy: null
      }
    };

    projects.push(newProject);
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    return newProject;
  },

  updateProject: (project: Project): void => {
    const stored = localStorage.getItem(KEYS.PROJECTS);
    let projects: Project[] = stored ? JSON.parse(stored) : [];
    
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      projects[index] = { ...project, updatedAt: Date.now() };
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    }
  },

  deleteProject: (id: string): void => {
     const stored = localStorage.getItem(KEYS.PROJECTS);
     let projects: Project[] = stored ? JSON.parse(stored) : [];
     projects = projects.filter(p => p.id !== id);
     localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  }
};
