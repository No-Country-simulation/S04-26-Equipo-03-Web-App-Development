import { Button } from '@/components/ui/button';

export default function HeaderNav() {
  return (
    <>
      <Button className="text-sm text-[#4f46e5] bg-[#EEF2FF] font-normal px-4 py-2 rounded-md">
        Candidatos
      </Button>
      <Button className="text-sm text-[#1a1a2e] bg-white font-normal px-4 py-2 rounded-md">
        Mis guardados
      </Button>
      <Button className="text-sm text-[#1a1a2e] bg-white font-normal px-4 py-2 rounded-md">
        Mis posiciones
      </Button>
      <Button className="hidden sm:inline-flex text-sm text-[#1a1a2e] bg-[#E5E7EB] rounded-full p-2">
        MR
      </Button>
    </>
  );
}
