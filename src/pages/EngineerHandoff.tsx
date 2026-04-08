import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';

interface Handoff {
  _id: string;
  projectId: any;
  analysisReportId: any;
  frontendNotes: string;
  backendNotes: string;
  aiNotes: string;
  apiNotes: string;
  riskNotes: string;
  phase1Scope: string[];
  phase2Scope: string[];
  createdAt: string;
}

export default function EngineerHandoff() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedHandoff, setSelectedHandoff] = useState<Handoff | null>(null);

  useEffect(() => {
    loadHandoffs();
  }, []);

  const loadHandoffs = async () => {
    try {
      setIsLoading(true);
      const projectsResponse = await apiClient.getProjects(1, 100);
      if (projectsResponse.success) {
        const allHandoffs: Handoff[] = [];
        for (const project of projectsResponse.data) {
          const handoffResponse = await apiClient.getEngineerHandoffsByProject(project._id, 1, 100);
          if (handoffResponse.success) {
            allHandoffs.push(...handoffResponse.data);
          }
        }
        setHandoffs(allHandoffs);
      }
    } catch (error) {
      console.error('Failed to load handoffs:', error);
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHandoffs = handoffs.filter((h) =>
    h.projectId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setLocation('/')}
            className="p-2 border border-[#c9a84c]/30 hover:border-[#c9a84c] rounded-lg text-gray-400 hover:text-[#c9a84c] transition-all mb-4"
            title="返回儀表板"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-white">工程師交接</h1>
          <p className="text-slate-400 mt-1">技術交接筆記和範疇</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            placeholder="搛索專案..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border-slate-700 bg-slate-800/50 p-4 max-h-96 overflow-y-auto">
                <h2 className="text-lg font-bold text-white mb-4">Handoffs</h2>
                {filteredHandoffs.length > 0 ? (
                  <div className="space-y-2">
                    {filteredHandoffs.map((handoff) => (
                      <button
                        key={handoff._id}
                        onClick={() => setSelectedHandoff(handoff)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          selectedHandoff?._id === handoff._id
                            ? 'bg-blue-600/30 border border-blue-500'
                            : 'hover:bg-slate-700/30 border border-slate-700'
                        }`}
                      >
                        <p className="text-white font-medium text-sm">
                          {handoff.projectId?.name}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {new Date(handoff.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No handoffs found</p>
                )}
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedHandoff ? (
                <div className="space-y-4">
                  {selectedHandoff.frontendNotes && (
                    <Card className="border-slate-700 bg-slate-800/50 p-6">
                      <h3 className="text-lg font-bold text-white mb-3">Frontend Notes</h3>
                      <p className="text-slate-300">{selectedHandoff.frontendNotes}</p>
                    </Card>
                  )}

                  {selectedHandoff.backendNotes && (
                    <Card className="border-slate-700 bg-slate-800/50 p-6">
                      <h3 className="text-lg font-bold text-white mb-3">Backend Notes</h3>
                      <p className="text-slate-300">{selectedHandoff.backendNotes}</p>
                    </Card>
                  )}

                  {selectedHandoff.aiNotes && (
                    <Card className="border-slate-700 bg-slate-800/50 p-6">
                      <h3 className="text-lg font-bold text-white mb-3">AI Notes</h3>
                      <p className="text-slate-300">{selectedHandoff.aiNotes}</p>
                    </Card>
                  )}

                  {selectedHandoff.apiNotes && (
                    <Card className="border-slate-700 bg-slate-800/50 p-6">
                      <h3 className="text-lg font-bold text-white mb-3">API Notes</h3>
                      <p className="text-slate-300">{selectedHandoff.apiNotes}</p>
                    </Card>
                  )}

                  {selectedHandoff.riskNotes && (
                    <Card className="border-slate-700 bg-slate-800/50 p-6">
                      <h3 className="text-lg font-bold text-white mb-3">Risk Notes</h3>
                      <p className="text-slate-300">{selectedHandoff.riskNotes}</p>
                    </Card>
                  )}

                  {selectedHandoff.phase1Scope && selectedHandoff.phase1Scope.length > 0 && (
                    <Card className="border-slate-700 bg-slate-800/50 p-6">
                      <h3 className="text-lg font-bold text-white mb-3">Phase 1 Scope</h3>
                      <ul className="space-y-2">
                        {selectedHandoff.phase1Scope.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <span className="text-green-400 mt-1">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {selectedHandoff.phase2Scope && selectedHandoff.phase2Scope.length > 0 && (
                    <Card className="border-slate-700 bg-slate-800/50 p-6">
                      <h3 className="text-lg font-bold text-white mb-3">Phase 2 Scope</h3>
                      <ul className="space-y-2">
                        {selectedHandoff.phase2Scope.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <span className="text-blue-400 mt-1">→</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="border-slate-700 bg-slate-800/50 p-12 flex items-center justify-center">
                  <p className="text-slate-400">Select a handoff to view details</p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
