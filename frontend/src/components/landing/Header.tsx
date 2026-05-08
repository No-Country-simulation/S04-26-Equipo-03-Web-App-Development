import SiteHeader from '../layout/SiteHeader';

export default function Header() {
  return (
    <SiteHeader
      showMobileMenu
      navItems={[
        { label: 'Soy empresa', href: '/login-company' },
        { label: 'Iniciar sesión', href: '#' },
        { label: 'Crear cuenta', href: '#', variant: 'button' },
      ]}
    />
  );
}
