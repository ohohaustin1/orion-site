// API client stub - implement with your backend URL
export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },
  getCurrentUser: async () => null,
  login: async (email: string, password: string) => null,
  setAuthToken: (token: string) => {},
  logout: async () => {},
  getAnalysisReportById: async (id: string) => null,
  getProjects: async () => [],
  getEngineerHandoffsByProject: async (id: string) => [],
  getClients: async () => [],
  createProject: async (data: any) => null,
  createRequirement: async (data: any) => null,
  createAnalysisReport: async (data: any) => null,
  getProjectById: async (id: string) => null,
  getRequirementsByProject: async (id: string) => [],
};
