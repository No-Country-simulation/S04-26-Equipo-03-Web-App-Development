import SiteHeader from '../layout/SiteHeader';

export default function Header() {
  return (
    <SiteHeader
      showMobileMenu
      navItems={[
        { label: 'Soy empresa', href: '/login-company' },
        { label: 'Iniciar sesión', href: '/login-talent' },
        { label: 'Crear cuenta', href: '/signup-talent', variant: 'button' },
      ]}
    />
  );
}
