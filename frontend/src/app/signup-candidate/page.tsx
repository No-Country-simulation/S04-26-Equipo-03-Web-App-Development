'use client';

import { AuthTemplate } from '@/components/layout/auth/AuthTemplate';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterCandidatePage() {
  return (
    <AuthTemplate>
      <RegisterForm />
    </AuthTemplate>
  );
}
