import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props { params: Promise<{ lang: string }> }

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const c = dict.contact;
  return (
    <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-18 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="font-display text-4xl font-semibold text-deep mb-8">{c.h1}</h1>
          <address className="not-italic text-sm text-steel space-y-2">
            <p>[EMAIL]</p><p>[TELEFONE]</p><p>[NÚMERO WHATSAPP]</p><p>[HORÁRIO] (BRT)</p><p>[ENDEREÇO COMPLETO]</p>
          </address>
          <p className="mt-6 text-sm text-steel">{c.trackingNote}</p>
        </div>
        <form className="space-y-5">
          {[["name", c.formName], ["email", c.formEmail], ["phone", c.formPhone], ["subject", c.formSubject]].map(([n, l]) => (
            <div key={n}>
              <label htmlFor={n} className="block text-sm text-ink mb-1.5">{l}</label>
              <input id={n} name={n} type={n === "email" ? "email" : "text"}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="block text-sm text-ink mb-1.5">{c.formMessage}</label>
            <textarea id="message" name="message" rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <button type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-marine px-6 text-sm font-medium text-white hover:bg-marine/90 transition-colors">
            {c.submit}
          </button>
        </form>
      </div>
    </main>
  );
}
