import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnalysisData {
  _id: string;
  solutionName: string;
  feasibilityScore: number;
  resultJson: any;
}

export default function AnalysisResult() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [analysisId, setAnalysisId] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const id = path.split('/').pop();
    if (id) {
      setAnalysisId(id);
      loadAnalysis(id);
    }
  }, []);

  const loadAnalysis = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAnalysisReportById(id);
      if (response.success) {
        setAnalysis(response.data);
      }
    } catch (error) {
      console.error('Failed to load analysis:', error);
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

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">分析不存在</p>
        </div>
      </DashboardLayout>
    );
  }

  const result = analysis.resultJson;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLocation('/war-room')}
            className="p-2 border border-[#c9a84c]/30 hover:border-[#c9a84c] rounded-lg text-gray-400 hover:text-[#c9a84c] transition-all"
            title="返回 War Room"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{analysis.solutionName}</h1>
            <p className="text-slate-400 mt-1">AI Analysis Report</p>
          </div>
        </div>

        <Card className="border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-lg">Feasibility Score</p>
              <p className="text-5xl font-bold text-white mt-2">{analysis.feasibilityScore}%</p>
            </div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{analysis.feasibilityScore}</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Requirements Summary</h2>
            <p className="text-slate-300">{result.requirementsSummary}</p>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recommended Stack</h2>
            <div className="space-y-3">
              {Object.entries(result.recommendedStack || {}).map(([key, value]) => (
                <div key={key}>
                  <p className="text-slate-400 text-sm capitalize">{key}</p>
                  <p className="text-white text-sm">{String(value)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Timeline Estimate</h2>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">MVP</p>
                <p className="text-white font-medium">{result.timelineEstimate?.mvp}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Full Version</p>
                <p className="text-white font-medium">{result.timelineEstimate?.fullVersion}</p>
              </div>
            </div>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Budget Estimate</h2>
            <div className="space-y-3">
              {Object.entries(result.budgetEstimate || {}).map(([key, value]) => (
                <div key={key}>
                  <p className="text-slate-400 text-sm capitalize">{key}</p>
                  <p className="text-white font-medium">{String(value)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">MVP Scope</h2>
            <ul className="space-y-2">
              {(result.mvpScope || []).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Phase 2 Scope</h2>
            <ul className="space-y-2">
              {(result.phase2Scope || []).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-blue-400 mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {result.risks && result.risks.length > 0 && (
          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Identified Risks</h2>
            <div className="space-y-4">
              {result.risks.map((risk: any, idx: number) => (
                <div key={idx} className="border-l-4 border-red-500 pl-4">
                  <p className="text-white font-medium">{risk.risk}</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Probability: <span className="text-yellow-400">{risk.probability}</span>
                  </p>
                  <p className="text-slate-400 text-sm">
                    Mitigation: <span className="text-slate-300">{risk.mitigation}</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {result.engineerHandoffNotes && (
          <Card className="border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Engineer Handoff Notes</h2>
            <p className="text-slate-300">{result.engineerHandoffNotes}</p>
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
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Export Report
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
