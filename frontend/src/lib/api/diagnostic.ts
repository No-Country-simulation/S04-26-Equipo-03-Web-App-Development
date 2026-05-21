import { apiClient } from './client';

export interface DiagnosticQuestion {
  id: number;
  skill_related: string;
  question_text: string;
  options: { a: string; b: string; c: string; d: string };
}

export interface SkillScore {
  skill: string;
  score: number;
  feedback: string;
}

export interface GapAnalysis {
  overall_score: number;
  skill_scores: SkillScore[];
  strengths: string[];
  gaps: string[];
  recommendation: string;
}

export interface DiagnosticSession {
  diagnosticId: string;
  questions: DiagnosticQuestion[];
  profileId: string;
  roleName: string;
}

export interface DiagnosticResultStore {
  gapAnalysis: GapAnalysis;
  completedAt: string;
  roleName: string;
}

export interface PastDiagnostic {
  id: string;
  type: string;
  status: string;
  completed_at: string | null;
}

export const DIAGNOSTIC_SESSION_KEY = 'tb_diagnostic';
export const DIAGNOSTIC_RESULT_KEY = 'tb_diagnostic_result';

export const diagnosticApi = {
  create: async (
    token: string,
    profileId: string
  ): Promise<{ id: string; questions: DiagnosticQuestion[] }> => {
    const { data } = await apiClient.post<{
      id: string;
      questions: DiagnosticQuestion[];
    }>(
      '/diagnostic',
      { talent_profile_id: profileId, type: 'INITIAL_ONBOARDING' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  submitResponses: async (
    token: string,
    diagnosticId: string,
    responses: { question_id: number; selected_option: 'a' | 'b' | 'c' | 'd' }[]
  ): Promise<{
    id: string;
    gap_analysis: GapAnalysis;
    completed_at: string;
  }> => {
    const { data } = await apiClient.post<{
      id: string;
      gap_analysis: GapAnalysis;
      completed_at: string;
    }>(
      `/diagnostic/${diagnosticId}/responses`,
      { responses },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  findByProfile: async (
    token: string,
    profileId: string
  ): Promise<{ diagnostics: PastDiagnostic[] }> => {
    const { data } = await apiClient.get<{ diagnostics: PastDiagnostic[] }>(
      `/diagnostic/profile/${profileId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
};
