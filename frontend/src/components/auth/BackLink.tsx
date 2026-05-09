import { useRouter } from 'next/navigation';

export const BackLink = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-[#6b7280] text-[12px] leading-[18px] font-['Inter'] hover:text-[#111827] transition-colors"
    >
      ← Atrás
    </button>
  );
};
