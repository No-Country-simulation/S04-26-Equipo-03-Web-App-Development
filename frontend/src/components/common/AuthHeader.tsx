interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}
export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-[#1a1a2e]">{title}</h1>
      {subtitle && <p className="text-gray-500 mb-0">{subtitle}</p>}
    </>
  );
}