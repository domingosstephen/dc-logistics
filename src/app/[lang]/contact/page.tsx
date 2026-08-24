import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import type { Locale } from "../dictionaries";

interface Props { params: Promise<{ lang: string }> }

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const c = dict.contact;
  const isPt = lang === "pt";

  return (
    <main className="mx-auto max-w-[1200px] px-5 md:px-8 py-18 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="font-display text-4xl font-semibold text-deep mb-8">{c.h1}</h1>

          <address className="not-italic text-sm text-steel space-y-3">
            <div>
              <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-1">E-mail</p>
              <a
                href="mailto:info@dclogisticsbrasil.com.br"
                className="text-marine hover:underline"
              >
                info@dclogisticsbrasil.com.br
              </a>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-1">WhatsApp</p>
              <a
                href="https://wa.me/5511952701046"
                target="_blank"
                rel="noopener noreferrer"
                className="text-marine hover:underline"
              >
                +55 (11) 9 5270-1046
              </a>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-1">
                {isPt ? "Horário de atendimento" : "Office hours"}
              </p>
              <p>{isPt ? "Segunda a sexta-feira, das 9h às 18h (BRT)" : "Monday to Friday, 9 am – 6 pm (BRT)"}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-1">
                {isPt ? "Localização" : "Location"}
              </p>
              <p>São Paulo, SP — Brasil</p>
            </div>
          </address>

          <p className="mt-8 text-sm text-steel border-t border-border pt-6">{c.trackingNote}</p>
        </div>

        <form className="space-y-5">
          {([
            ["name", c.formName, "text"],
            ["email", c.formEmail, "email"],
            ["phone", c.formPhone, "tel"],
            ["subject", c.formSubject, "text"],
          ] as const).map(([n, l, t]) => (
            <div key={n}>
              <label htmlFor={n} className="block text-sm text-ink mb-1.5">{l}</label>
              <input
                id={n}
                name={n}
                type={t}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="block text-sm text-ink mb-1.5">{c.formMessage}</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-marine px-6 text-sm font-medium text-white hover:bg-marine/90 transition-colors"
          >
            {c.submit}
          </button>
        </form>
      </div>
    </main>
  );
}
