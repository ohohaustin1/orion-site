import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectData {
  _id: string;
  name: string;
  goal: string;
  status: string;
  budgetRange: string;
  deadline: string;
  clientId: any;
  latestAnalysisReportId: any;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetail() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [projectId, setProjectId] = useState<string>('');
  const [project, setProject] = useState<ProjectData | null>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split('/').pop();
    if (id) {
      setProjectId(id);
      loadProjectData(id);
    }
  }, []);

  const loadProjectData = async (id: string) => {
    try {
      setIsLoading(true);
      const [projectResponse, requirementsResponse] = await Promise.all([
        apiClient.getProjectById(id),
        apiClient.getRequirementsByProject(id),
      ]);

      if (projectResponse.success) {
        setProject(projectResponse.data);
      }
      if (requirementsResponse.success) {
        setRequirements(requirementsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">專案不存在</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-600/20 text-blue-400',
    reviewing: 'bg-yellow-600/20 text-yellow-400',
    analyzed: 'bg-amber-500/15 text-amber-300',
    quoted: 'bg-green-600/20 text-green-400',
    in_progress: 'bg-orange-600/20 text-orange-400',
    completed: 'bg-emerald-600/20 text-emerald-400',
    archived: 'bg-slate-600/20 text-slate-400',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLocation('/projects')}
            className="p-2 border border-[#c9a84c]/30 hover:border-[#c9a84c] rounded-lg text-gray-400 hover:text-[#c9a84c] transition-all"
            title="返回專案列表"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <p className="text-slate-400 mt-1">{project.goal}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColors[project.status] || 'bg-slate-600/20 text-slate-400'}`}>
            {project.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-700 bg-slate-800/50 p-4">
            <p className="text-slate-400 text-sm">Budget Range</p>
            <p className="text-white font-bold text-lg mt-2">{project.budgetRange}</p>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50 p-4">
            <p className="text-slate-400 text-sm">Deadline</p>
            <p className="text-white font-bold text-lg mt-2">
              {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
            </p>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50 p-4">
            <p className="text-slate-400 text-sm">Created</p>
            <p className="text-white font-bold text-lg mt-2">
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </Card>
          <Card className="border-slate-700 bg-slate-800/50 p-4">
            <p className="text-slate-400 text-sm">Client</p>
            <p className="text-white font-bold text-lg mt-2">
              {project.clientId?.name || 'N/A'}
            </p>
          </Card>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
          {requirements.length > 0 ? (
            <div className="space-y-4">
              {requirements.map((req) => (
                <div key={req._id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {req.needsAI && (
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                        AI
                      </span>
                    )}
                    {req.needsBackend && (
                      <span className="px-2 py-1 bg-amber-500/15 text-amber-300 rounded text-xs">
                        Backend
                      </span>
                    )}
                    {req.needsAutomation && (
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                        Automation
                      </span>
                    )}
                    {req.needsApiIntegration && (
                      <span className="px-2 py-1 bg-orange-600/20 text-orange-400 rounded text-xs">
                        API
                      </span>
                    )}
                  </div>
                  {req.painPoints && req.painPoints.length > 0 && (
                    <div className="mb-2">
                      <p className="text-slate-400 text-sm">Pain Points:</p>
                      <ul className="text-slate-300 text-sm mt-1 ml-2">
                        {req.painPoints.map((point: string, idx: number) => (
                          <li key={idx}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {req.notes && (
                    <p className="text-slate-300 text-sm">Notes: {req.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No requirements added yet</p>
          )}
        </Card>

        {project.latestAnalysisReportId && (
          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Latest Analysis</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {project.latestAnalysisReportId.solutionName}
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Feasibility Score: {project.latestAnalysisReportId.feasibilityScore}%
                </p>
              </div>
              <Button
                onClick={() => setLocation(`/analysis/${project.latestAnalysisReportId._id}`)}
                className="bg-[#C5A059] hover:bg-[#d9b770] text-black"
              >
                View Report
              </Button>
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-700/30"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => setLocation('/analysis/new')}
            className="bg-[#C5A059] hover:bg-[#d9b770] text-black"
          >
            New Analysis
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
