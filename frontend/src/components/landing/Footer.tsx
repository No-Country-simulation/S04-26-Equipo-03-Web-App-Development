export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] px-4 sm:px-6 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">TalentBridge</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a href="#" className="text-sm text-gray-400 hover:text-white">
            Producto
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-white">
            Empresas
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-white">
            Privacidad
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-white">
            Términos
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-white">
            Contacto
          </a>
        </nav>
      </div>
    </footer>
  );
}
