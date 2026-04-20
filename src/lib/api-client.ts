/**
 * apiClient — stub for backend integration.
 * 所有方法回傳統一 { success, data, message? } shape（對齊 consumer 解構）。
 * 真實 backend 上線時用 fetch/trpc 替換實作、shape 保持一致即可。
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data });

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
  // ────── Auth ──────
  getCurrentUser: async (): Promise<ApiResponse<any>> => ok(null),
  login: async (_email: string, _password: string): Promise<ApiResponse<{ accessToken: string; user: any } | null>> =>
    ok(null),
  setAuthToken: (_token: string): void => {},
  logout: async (): Promise<void> => {},
  // ────── Analysis / Report ──────
  getAnalysisReportById: async (_id: string): Promise<ApiResponse<any>> => ok(null),
  createAnalysisReport: async (_data: any): Promise<ApiResponse<{ _id: string } & Record<string, any>>> =>
    ok({ _id: '' }),
  // ────── Projects ──────
  getProjects: async (_page = 1, _limit = 100): Promise<ApiResponse<any[]>> => ok([]),
  getProjectById: async (_id: string): Promise<ApiResponse<any>> => ok(null),
  createProject: async (_data: any): Promise<ApiResponse<{ _id: string } & Record<string, any>>> =>
    ok({ _id: '' }),
  // ────── Requirements / Clients / Handoffs ──────
  getEngineerHandoffsByProject: async (_id: string, _page = 1, _limit = 100): Promise<ApiResponse<any[]>> =>
    ok([]),
  getClients: async (_page = 1, _limit = 100): Promise<ApiResponse<any[]>> => ok([]),
  getRequirementsByProject: async (_id: string): Promise<ApiResponse<any[]>> => ok([]),
  createRequirement: async (_data: any): Promise<ApiResponse<{ _id: string } & Record<string, any>>> =>
    ok({ _id: '' }),
};
