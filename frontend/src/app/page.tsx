import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden  px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,_transparent_0%,_var(--color-accent)/12_40%,_transparent_80%)]" />

      <section className="w-full max-w-3xl rounded-2xl border border-border/60 bg-card/80 p-8 shadow-xl backdrop-blur md:p-12">
        <p className="mb-3 inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          Tailwind v4 + shadcn/ui listos
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          Base de UI integrada en frontend
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Esta pantalla es una demo funcional del setup: estilos de Tailwind,
          tokens del tema y componente `Button` de shadcn ya operativos.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="https://ui.shadcn.com/docs" target="_blank">
              Ver docs de shadcn
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="https://tailwindcss.com/docs" target="_blank">
              Ver docs de Tailwind
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
