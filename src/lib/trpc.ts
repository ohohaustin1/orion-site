// tRPC stub - implement with your backend URL
const useQueryStub = (...args: any) => ({ data: null, isLoading: false, error: null });
const useMutationStub = (...args: any) => ({ mutate: (data: any) => {}, isLoading: false });

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
    submit: async (...args: any) => ({ success: true }),
  },
};
