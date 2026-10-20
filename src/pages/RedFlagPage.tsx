import { useEffect } from "react";
import { Link, useParams } from "react-router";

import { Container } from "@/components/site/Container";
import { Rule } from "@/components/site/Rule";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { applySeo, redFlagSeo } from "@/lib/seo";
import { getRedFlag } from "@/lib/data";
import type { RedFlag } from "@/lib/types";

/**
 * The inbox for a red-flag dispute. A placeholder until a real address is
 * published — see `docs/06-WORKFLOWS.md`.
 */
const RED_FLAG_EMAIL = "mail@ieainstitute.org";

/**
 * One flagged school and the reasons for it.
 *
 * A flagged school may not exist in the ranked roster (CCRC College, Kavya),
 * so this page never assumes a score, a rank or a band. An unknown id renders
 * the 404 in place rather than redirecting, keeping the reader's URL intact.
 */
export function RedFlagPage() {
  const { id } = useParams<{ id: string }>();
  const redFlag = getRedFlag(id);

  if (!redFlag) return <NotFoundPage />;

  return <RedFlagDetail redFlag={redFlag} />;
}

function RedFlagDetail({ redFlag }: { redFlag: RedFlag }) {
  useEffect(() => {
    applySeo(redFlagSeo(redFlag));
  }, [redFlag]);

  return (
    <Container>
      <div className="animate-route-in">
        <header className="pt-12 md:pt-20">
          <nav aria-label="Breadcrumb" className="type-caption text-ink-faint">
            <Link
              to="/rankings?view=redflags"
              className="text-bronze-ink underline underline-offset-4 hover:decoration-2"
            >
              Red flag schools
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span aria-current="page">{redFlag.name}</span>
          </nav>

          <h1 tabIndex={-1} className="type-title measure-tight mt-6 text-ink outline-none">
            {redFlag.name}
          </h1>
        </header>

        <Rule tone="rule" className="mt-10" />

        <section className="py-12 md:py-16">
          <h2 className="type-label text-bronze-ink">Why this school is flagged</h2>

          {redFlag.reasons.length === 0 ? (
            <p className="type-body measure mt-4 text-ink-muted">
              No specific reasons have been published for this school yet.
            </p>
          ) : (
            <ul className="mt-6 flex flex-col">
              {redFlag.reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-4 border-b border-rule-soft py-4 last:border-b-0"
                >
                  <span aria-hidden="true" className="mt-[0.85em] h-0.5 w-5 shrink-0 bg-rule-soft" />
                  <span className="type-body measure-snug text-ink">{reason}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Rule />

        <section className="py-12 md:py-16">
          <p className="type-body measure text-ink-muted">
            If you disagree with any of this, mail us:{" "}
            <a
              href={`mailto:${RED_FLAG_EMAIL}`}
              className="text-bronze-ink underline underline-offset-4 hover:decoration-2"
            >
              {RED_FLAG_EMAIL}
            </a>
          </p>
        </section>
      </div>
    </Container>
  );
}
