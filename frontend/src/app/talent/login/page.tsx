'use client';

import { AuthTemplate } from '@/components/layout/auth/AuthTemplate';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginTalentPage() {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
}
