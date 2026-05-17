
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface CardSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function CardSection({
  title,
  description,
  children,
}: CardSectionProps) {
  return (
    <Card className="p-6 border-[#E5E7EB]">
      <div className="mb-0">
        <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
        )}
        {children}
      </div>
    </Card>
  );
}
