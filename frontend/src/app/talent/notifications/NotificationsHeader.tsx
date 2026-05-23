const NotificationsHeader = () => {
  return (
    <header className="w-full border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#1a1a2e] text-white text-sm font-bold">
            T
          </div>
          <span className="text-lg font-bold text-[#1a1a2e]">TalentBridge</span>
        </div>
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-[#1a1a2e] hover:text-[#1a1a2e]/80"
          >
            Perfil
          </a>
          <a
            href="#"
            className="text-sm text-[#1a1a2e] hover:text-[#1a1a2e]/80"
          >
            Diagnóstico
          </a>
          <a
            href="#"
            className="text-sm text-[#1a1a2e] hover:text-[#1a1a2e]/80"
          >
            Mi ruta
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-[#4f46e5]"
          >
            Notificaciones
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4f46e5] text-xs font-bold text-white">
              3
            </span>
          </a>
          <a href="#" className="text-sm text-[#9ca3af] hover:text-[#1a1a2e]">
            MR
          </a>
        </nav>
      </div>
    </header>
  );
};
export default NotificationsHeader;
