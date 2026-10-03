import { Button } from "@/components/ui/button";

/**
 * Shown when filters match nothing.
 *
 * Centred, generous whitespace, one thin bronze rule, and a specific message
 * that names the query — "no school matches 'xyz'" is actionable in a way that
 * "no results" is not. No illustration, no emoji: this is a newspaper, and a
 * cartoon ghost next to a ranking table would undo the whole tone.
 */
export function EmptyState({ query, onReset }: { query?: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center px-4 py-20 text-center">
      <div aria-hidden="true" className="h-0.5 w-7 bg-bronze" />
      <h2 className="type-heading mt-6 text-ink">
        {query ? <>No school matches “{query}”</> : "No schools match these filters"}
      </h2>
      <p className="type-body measure-tight mt-3 text-ink-muted">
        {query
          ? "Try a shorter search, or search by the school's short name — for example “BNKS” instead of “Budhanilkantha”."
          : "There is only one public school in this survey, so a type filter can hide almost everything."}
      </p>
      <Button variant="outline" onClick={onReset} className="mt-8">
        Clear all filters
      </Button>
    </div>
  );
}
