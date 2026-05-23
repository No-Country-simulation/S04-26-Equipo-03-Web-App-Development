import { DiagnosticQuiz } from '@/components/diagnostic/DiagnosticQuiz';
import {
  SKILL_VALIDATION_SESSION_KEY,
  SKILL_VALIDATION_RESULT_KEY,
} from '@/lib/api/diagnostic';

export default function SkillValidationQuizPage() {
  return (
    <DiagnosticQuiz
      sessionKey={ SKILL_VALIDATION_SESSION_KEY }
      resultKey={ SKILL_VALIDATION_RESULT_KEY }
      fallbackPath="/talent/skill-validation"
      resultPath="/talent/skill-validation/results"
    />
  );
}
