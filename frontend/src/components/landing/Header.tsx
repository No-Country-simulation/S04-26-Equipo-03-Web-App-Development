import SiteHeader from '../layout/SiteHeader';

export default function Header() {
  return (
    <SiteHeader
      showMobileMenu
      navItems={[
        { label: 'Soy empresa', href: '#' },
        { label: 'Iniciar sesión', href: '/login' },
        { label: 'Crear cuenta', href: '#', variant: 'button' },
      ]}
    />
  );
}
