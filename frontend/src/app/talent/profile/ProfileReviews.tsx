import RatingDisplay from './RatingDisplay';

const ProfileReviews = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Reseñas</h2>
          <p className="text-xs text-gray-500">habilidades blandas</p>
        </div>
        <a href="#" className="text-sm text-[#4f46e5] font-medium">
          + Solicitar reseña
        </a>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 mt-6 border-b border-[#E5E7EB] pb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">—</div>
          <RatingDisplay stars={ 0 } />
        </div>
        <p className="text-xs text-gray-600">
          Aún no tenés reseñas verificadas.
        </p>
      </div>

      <p className="text-sm text-gray-500 text-center py-4">
        Las reseñas de reclutadores y compañeros aparecerán aquí cuando las recibas.
      </p>
    </div>
  );
};

export default ProfileReviews;
