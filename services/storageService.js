const KEYS = {
	USER: 'lf_user',
	PROJECTS: 'lf_projects'
};

export const storageService = {
	login: (email, name) => {
		const user = {
			id: btoa(email),
			email,
			name
		};
		localStorage.setItem(KEYS.USER, JSON.stringify(user));
		return user;
	},

	getCurrentUser: () => {
		const stored = localStorage.getItem(KEYS.USER);
		return stored ? JSON.parse(stored) : null;
	},

	logout: () => {
		localStorage.removeItem(KEYS.USER);
	},

	getProjects: (userId) => {
		const stored = localStorage.getItem(KEYS.PROJECTS);
		const projects = stored ? JSON.parse(stored) : [];
		return projects.filter((p) => p.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt);
	},

	getProject: (id) => {
		const stored = localStorage.getItem(KEYS.PROJECTS);
		const projects = stored ? JSON.parse(stored) : [];
		return projects.find((p) => p.id === id);
	},

	createProject: (userId, name) => {
		const stored = localStorage.getItem(KEYS.PROJECTS);
		const projects = stored ? JSON.parse(stored) : [];

		const newProject = {
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

	updateProject: (project) => {
		const stored = localStorage.getItem(KEYS.PROJECTS);
		let projects = stored ? JSON.parse(stored) : [];

		const index = projects.findIndex((p) => p.id === project.id);
		if (index !== -1) {
			projects[index] = { ...project, updatedAt: Date.now() };
			localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
		}
	},

	deleteProject: (id) => {
		const stored = localStorage.getItem(KEYS.PROJECTS);
		let projects = stored ? JSON.parse(stored) : [];
		projects = projects.filter((p) => p.id !== id);
		localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
	}
};
