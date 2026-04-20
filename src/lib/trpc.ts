// tRPC stub - implement with your backend URL
// Matches React Query v5 API shape (isPending + isLoading alias for compat)
const useQueryStub = (..._args: any) => ({ data: null, isLoading: false, isPending: false, error: null });
const useMutationStub = (..._args: any) => ({
  mutate: (_data: any) => {},
  mutateAsync: async (_data: any) => ({ success: true }),
  isLoading: false,
  isPending: false,
  isError: false,
  isSuccess: false,
  error: null as Error | null,
  data: null as any,
  reset: () => {},
});

export const trpc = {
  analysis: {
    create: Object.assign(async (...args: any) => ({ success: true, id: '1' }), {
      useMutation: (...args: any) => useMutationStub(),
    }),
    get: async (...args: any) => ({ id: '', data: {} }),
    listSessions: Object.assign(async (...args: any) => [], {
      useQuery: (...args: any) => useQueryStub(),
    }),
  },
  project: {
    list: Object.assign(async (...args: any) => [], {
      useQuery: (...args: any) => useQueryStub(),
    }),
    listSessions: Object.assign(async (...args: any) => [], {
      useQuery: (...args: any) => useQueryStub(),
    }),
    get: async (...args: any) => ({ id: '', name: '' }),
    getProjects: Object.assign(async (...args: any) => [], {
      useQuery: (...args: any) => useQueryStub(),
    }),
  },
  voice: {
    transcribe: Object.assign(async (...args: any) => ({ text: '' }), {
      useMutation: (...args: any) => useMutationStub(),
    }),
  },
  contact: {
    submit: Object.assign(async (..._args: any) => ({ success: true }), {
      useMutation: (..._args: any) => useMutationStub(),
    }),
  },
};
