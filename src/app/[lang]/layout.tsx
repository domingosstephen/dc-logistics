import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ServiceAlertBanner } from "@/components/layout/service-alert-banner";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import type { Locale } from "./dictionaries";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
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
    <>
      <ServiceAlertBanner />
      <Header lang={lang as Locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang as Locale} dict={dict} />
      <WhatsAppButton />
    </>
  );
}
