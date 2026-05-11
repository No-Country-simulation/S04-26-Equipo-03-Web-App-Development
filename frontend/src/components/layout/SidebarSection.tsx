import { ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}
export default function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}