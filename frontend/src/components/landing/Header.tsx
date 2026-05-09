import SiteHeader from '../layout/SiteHeader';

export default function Header() {
  return (
    <SiteHeader
      showMobileMenu
      navItems={[
        { label: 'Soy empresa', href: '/login-company' },
        { label: 'Iniciar sesión', href: '/login-candidate' },
        { label: 'Crear cuenta', href: '/signup-candidate', variant: 'button' },
      ]}
    />
  );
}
