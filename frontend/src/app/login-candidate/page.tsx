'use client';

import { AuthTemplate } from '@/components/layout/auth/AuthTemplate';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginCandidatePage() {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
}
