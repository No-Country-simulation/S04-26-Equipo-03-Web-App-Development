const ProfileHeader = () => {
  return (
    <header className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">TB</span>
          </div>
          <span className="font-bold text-lg">TalentBridge</span>
        </div>
        <nav className="flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-[#4f46e5] bg-[#EEF2FF] py-1.5 px-2.5 rounded-md"
          >
            Perfil
          </a>
          <a href="#" className="text-sm text-gray-700">
            Diagnóstico
          </a>
          <a href="#" className="text-sm text-gray-700">
            Mi ruta
          </a>
          <a href="#" className="text-sm text-gray-700 flex items-center gap-1">
            Notificaciones
            <span className="bg-[#4f46e5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </a>
          <span className="text-sm font-medium text-gray-700 bg-[#E5E7EB] p-1.5 rounded-full">
            MR
          </span>
        </nav>
      </div>
    </header>
  );
};
export default ProfileHeader;
