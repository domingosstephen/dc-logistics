import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { getDictionary, hasLocale } from "./dictionaries";
import type { Locale } from "./dictionaries";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }, { lang: "de" }, { lang: "es" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <LenisProvider>
      <Header lang={lang as Locale} dict={dict} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer lang={lang as Locale} dict={dict} />
    </LenisProvider>
  );
}
