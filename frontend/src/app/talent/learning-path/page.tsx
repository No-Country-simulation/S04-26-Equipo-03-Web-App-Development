import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { learningPathApi } from '@/lib/api/learning-path';
import { LearningPathView } from '@/components/learning-path/LearningPathView';
import { LearningPathEmpty } from '@/components/learning-path/LearningPathEmpty';

export default async function LearningPathPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/talent/login');
  }

  let pathData = null;

  try {
    const { learning_paths } = await learningPathApi.findMe(token);

    if (learning_paths.length > 0) {
      // Solo se maneja una ruta por usuario en el MVP
      pathData = await learningPathApi.findById(token, learning_paths[0].id);
    }
  } catch {
    // Si hay error de red o 404, mostramos el empty state
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header placeholder — reemplazar por el header de la app cuando esté listo */ }
      <div className="border-b border-[#e5e7eb] px-[24px] py-[14px]">
        <span className="font-semibold text-[#1a1a2e] text-[15px]">TalentBridge</span>
      </div>

      <div className="flex-1 flex flex-col">
        { pathData ? (
          <LearningPathView initialPath={ pathData } />
        ) : (
          <LearningPathEmpty />
        ) }
      </div>
    </div>
  );
}
