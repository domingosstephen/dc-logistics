import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-pine-deep text-paper/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-display text-2xl font-semibold text-paper">
              PetVoyage
            </span>
            <p className="mt-4 text-sm text-paper/60 max-w-md leading-relaxed">
              Trasporto premium per animali domestici attraverso l&apos;Europa.
              Ogni viaggio e curato con amore, professionalita e attenzione al
              benessere del tuo pet.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-paper mb-4">Navigazione</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/how-it-works", label: "Come Funziona" },
                { href: "/coverage", label: "Copertura" },
                { href: "/track", label: "Traccia il Tuo Pet" },
                { href: "/quote", label: "Richiedi Preventivo" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-paper/60 hover:text-honey transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium text-paper mb-4">Legale</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-paper/60 hover:text-honey transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-paper/60 hover:text-honey transition-colors"
                >
                  Termini e Condizioni
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-paper/10 text-center">
          <p className="text-xs text-paper/40">
            &copy; {new Date().getFullYear()} PetVoyage. Tutti i diritti
            riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
