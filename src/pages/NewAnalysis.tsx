import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

interface FormData {
  clientId: string;
  clientName: string;
  industry: string;
  projectName: string;
  projectGoal: string;
  painPoints: string;
  featureRequests: string;
  needsAI: boolean;
  needsAutomation: boolean;
  needsBackend: boolean;
  needsApiIntegration: boolean;
  budgetRange: string;
  deadline: string;
  notes: string;
}

export default function NewAnalysis() {
  const [, setLocation] = useLocation();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    clientId: '',
    clientName: '',
    industry: '',
    projectName: '',
    projectGoal: '',
    painPoints: '',
    featureRequests: '',
    needsAI: false,
    needsAutomation: false,
    needsBackend: false,
    needsApiIntegration: false,
    budgetRange: 'medium',
    deadline: '',
    notes: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await apiClient.getClients(1, 100);
      if (response.success) {
        setClients(response.data);
      }
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.projectName || !formData.projectGoal) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);

      const projectResponse = await apiClient.createProject({
        clientId: formData.clientId,
        name: formData.projectName,
        goal: formData.projectGoal,
        budgetRange: formData.budgetRange,
        deadline: formData.deadline || undefined,
      });

      if (!projectResponse.success) {
        throw new Error(projectResponse.message);
      }

      const projectId = projectResponse.data._id;

      const requirementResponse = await apiClient.createRequirement({
        projectId,
        painPoints: formData.painPoints.split('\n').filter(p => p.trim()),
        featureRequests: formData.featureRequests.split('\n').filter(f => f.trim()),
        needsAI: formData.needsAI,
        needsAutomation: formData.needsAutomation,
        needsBackend: formData.needsBackend,
        needsApiIntegration: formData.needsApiIntegration,
        notes: formData.notes,
      });

      if (!requirementResponse.success) {
        throw new Error(requirementResponse.message);
      }

      const analysisResponse = await apiClient.createAnalysisReport({
        projectId,
        requirementId: requirementResponse.data._id,
        solutionName: `${formData.projectName} - AI Analysis`,
        feasibilityScore: 85,
        resultJson: generateMockAnalysis(formData),
      });

      if (!analysisResponse.success) {
        throw new Error(analysisResponse.message);
      }

      toast.success('Analysis created successfully!');
      setLocation(`/analysis/${analysisResponse.data._id}`);
    } catch (error: any) {
      console.error('Failed to create analysis:', error);
      toast.error(error.message || 'Failed to create analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalysis = (data: FormData) => ({
    projectName: data.projectName,
    solutionName: `${data.projectName} - AI Analysis`,
    industry: data.industry,
    clientGoal: data.projectGoal,
    painPoints: data.painPoints.split('\n').filter(p => p.trim()),
    requirementsSummary: `Build a solution for ${data.projectName} with focus on ${data.projectGoal}`,
    feasibilityScore: 85,
    recommendedStack: {
      frontend: 'Next.js + React + Tailwind CSS + shadcn/ui',
      backend: 'NestJS + Node.js',
      database: 'MongoDB',
      aiModel: 'GPT-4 Turbo',
      automation: 'Node.js cron jobs',
    },
    timelineEstimate: {
      mvp: '6-8 weeks',
      fullVersion: '12-16 weeks',
    },
    budgetEstimate: {
      low: '$50,000 - $80,000',
      mid: '$80,000 - $150,000',
      high: '$150,000 - $250,000',
    },
    risks: [
      { risk: 'Scope creep', probability: 'High', mitigation: 'Clear requirements' },
      { risk: 'Timeline delays', probability: 'Medium', mitigation: 'Buffer time' },
    ],
    mvpScope: ['Core features', 'User auth', 'Basic dashboard'],
    phase2Scope: ['Advanced features', 'Analytics', 'API'],
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setLocation('/dashboard')} className="p-2 border border-[#c9a84c]/30 hover:border-[#c9a84c] rounded-lg text-gray-400 hover:text-[#c9a84c] transition-all" title="返回儀表板">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">New Analysis</h1>
            <p className="text-slate-400 mt-1">Create a new project analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-slate-700 bg-slate-800/50 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">客戶 *</label>
                  <select name="clientId" value={formData.clientId} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white" required>
                    <option value="">選擇客戶</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">專案名稱 *</label>
                  <Input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="例如：AI 分析平台" className="bg-slate-700/50 border-slate-600 text-white" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">專案目標 *</label>
                  <textarea name="projectGoal" value={formData.projectGoal} onChange={handleInputChange} placeholder="描述此專案的主要目標" className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 min-h-24" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">痛點（每行一個）</label>
                  <textarea name="painPoints" value={formData.painPoints} onChange={handleInputChange} placeholder="列出客戶痛點..." className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 min-h-20" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">功能需求（每行一個）</label>
                  <textarea name="featureRequests" value={formData.featureRequests} onChange={handleInputChange} placeholder="列出必要功能..." className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 min-h-20" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'needsAI', label: '需要 AI' },
                    { name: 'needsAutomation', label: '需要自動化' },
                    { name: 'needsBackend', label: '需要後端' },
                    { name: 'needsApiIntegration', label: '需要 API 整合' },
                  ].map((item) => (
                    <label key={item.name} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name={item.name} checked={formData[item.name as keyof FormData] as boolean} onChange={handleInputChange} className="w-4 h-4" />
                      <span className="text-sm text-white">{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">預算範圍</label>
                    <select name="budgetRange" value={formData.budgetRange} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white">
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                      <option value="enterprise">企業級</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">截止日期</label>
                    <Input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">其他備註</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="任何其他資訊..." className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 min-h-20" />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-[#C5A059] hover:bg-[#d9b770] text-black">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      分析中...
                    </>
                  ) : (
                    '建立分析'
                  )}
                </Button>
              </form>
            </Card>
          </div>

          <div>
            <Card className="border-slate-700 bg-slate-800/50 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4">Preview</h3>
              <div className="space-y-4 text-sm">
                {formData.projectName && (
                  <div>
                    <p className="text-slate-400">Project</p>
                    <p className="text-white font-medium">{formData.projectName}</p>
                  </div>
                )}
                {formData.projectGoal && (
                  <div>
                    <p className="text-slate-400">Goal</p>
                    <p className="text-white text-sm">{formData.projectGoal}</p>
                  </div>
                )}
                {formData.industry && (
                  <div>
                    <p className="text-slate-400">Industry</p>
                    <p className="text-white font-medium">{formData.industry}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-400">Requirements</p>
                  <div className="space-y-1 mt-2">
                    {formData.needsAI && (
                      <span className="inline-block px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs mr-2">AI</span>
                    )}
                    {formData.needsBackend && (
                      <span className="inline-block px-2 py-1 bg-amber-500/15 text-amber-300 rounded text-xs mr-2">Backend</span>
                    )}
                    {formData.needsAutomation && (
                      <span className="inline-block px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs mr-2">Automation</span>
                    )}
                    {formData.needsApiIntegration && (
                      <span className="inline-block px-2 py-1 bg-orange-600/20 text-orange-400 rounded text-xs">API</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
