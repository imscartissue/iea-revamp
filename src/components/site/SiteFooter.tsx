import { Link } from "react-router";

import { Container } from "@/components/site/Container";
import { Logo } from "@/components/site/Logo";
import { Rule } from "@/components/site/Rule";
import { formatCount, formatCountPlus, formatDate } from "@/lib/format";
import { meta, totalSchools } from "@/lib/data";

/**
 * Full-bleed ink footer. The one place the site goes dark on purpose — it
 * closes the page like the colophon of a printed volume, and it makes the
 * provenance ("where did this number come from?") impossible to miss.
 *
 * The Madison woodcut returns here at 7% (`.site-footer` in the
 * stylesheet) — a ghost of the engraving that opens the site, so every
 * page ends where the intro begins.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer mt-16 bg-ink text-ink-inverse md:mt-24">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_0.5fr_0.9fr_1.7fr] md:gap-12 md:py-16">
          <div>
            <Logo variant="dark" size="md" />
            <p className="type-body mt-5 measure-snug text-ink-inverse/70">
              An independent examination of Nepali schools, grounded in verified student
              testimony, field inquiry, and credible public sources, undertaken to illuminate
              the institutions entrusted with educating the next generation.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="type-label text-ink-inverse/50">Pages</h2>
            <ul className="mt-4 space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/rankings">Ranking</FooterLink>
              <FooterLink to="/about">About</FooterLink>
            </ul>
          </nav>

          <div>
            <h2 className="type-label text-ink-inverse/50">Data</h2>
            <dl className="mt-4 space-y-2">
              <Datum term="Schools" value={formatCount(totalSchools)} />
              <Datum term="Responses" value={formatCountPlus(meta.totalResponses)} />
              <Datum term="Published" value={formatDate(meta.publicationDate)} />
            </dl>
          </div>

          <div>
            <h2 className="type-label text-ink-inverse/50">Contact us</h2>
            <dl className="mt-4 space-y-4">
              <ContactLine term="General enquiries" email="info@ieainstitute.org" />
              <ContactLine term="Founder enquiries" email="founder@ieainstitute.org" />
            </dl>

            <p className="type-caption measure mt-5 text-ink-inverse/50">
              Requests for underlying sources and supporting evidence are considered
              only from government bodies, international watchdogs, and human rights
              institutions.
            </p>
            <p className="mt-1.5">
              <FooterEmail email="request@ieainstitute.org" />
            </p>

            <p className="type-caption measure mt-5 text-ink-inverse/50">
              Interested in joining IEA? Find the membership form on our Instagram page.
            </p>
            <a
              href="https://www.instagram.com/theinstituteforea"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="IEA on Instagram — opens in a new tab"
              className="mt-3 inline-flex size-10 items-center justify-center border border-ink-inverse/30 text-ink-inverse/80 transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon className="size-5" />
            </a>
          </div>
        </div>

        <Rule className="bg-ink-inverse/15" />

        {/*
          The intro's Madison quote, reprised as the closing epigraph —
          same voice as the splash, in brand yellow (bronze) as there.
        */}
        <blockquote className="pt-8 pb-12 md:pt-10 md:pb-16">
          <p className="max-w-[32ch] font-serif text-2xl leading-snug text-bronze md:text-3xl">
            “If men were angels, no government would be necessary”.
          </p>
          <cite className="mt-3 block font-sans text-[0.7rem] font-bold uppercase not-italic tracking-[0.2em] text-bronze-soft/70">
            James Madison, Federalist No. 51
          </cite>
        </blockquote>
      </Container>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="type-ui text-ink-inverse/80 underline decoration-1 underline-offset-4 transition-colors hover:text-ink-inverse hover:decoration-bronze"
      >
        {children}
      </Link>
    </li>
  );
}

function Datum({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="type-caption text-ink-inverse/50">{term}</dt>
      <dd className="type-numeric-sm text-ink-inverse/80">{value}</dd>
    </div>
  );
}

function ContactLine({ term, email }: { term: string; email: string }) {
  return (
    <div>
      <dt className="type-caption text-ink-inverse/50">{term}</dt>
      <dd className="mt-0.5">
        <FooterEmail email={email} />
      </dd>
    </div>
  );
}

function FooterEmail({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className="type-ui text-ink-inverse/80 underline decoration-1 underline-offset-4 transition-colors hover:text-ink-inverse hover:decoration-bronze"
    >
      {email}
    </a>
  );
}

/** Instagram glyph, in lucide's stroke style (lucide ships no brand icons). */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
