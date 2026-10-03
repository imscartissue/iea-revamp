import { memo } from "react";

import { RankCell, SchoolCell } from "@/components/rankings/SchoolCell";
import { OverallCell, ScoreCell } from "@/components/rankings/ScoreCell";
import { Badge } from "@/components/ui/badge";
import { ALL_COLUMNS, SORTS, type ColumnKey, type SortKey } from "@/lib/filters";
import type { School } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The rankings table.
 *
 * Real `<table>` semantics: a screen reader announces row/column relationships,
 * and `aria-sort` tells a non-visual user which way a column is ordered. A grid
 * of divs would look the same and mean nothing.
 *
 * PERFORMANCE — the three rules that keep this fast:
 *
 * 1. **`SchoolRow` is `memo`'d and receives a `School` reference.** The schools
 *    array is built once at module scope and never mutated, so a row only
 *    re-renders when its own `school` prop changes. Typing in the search box
 *    re-renders the table, not all 42 rows.
 * 2. **No row animation.** Sorting reorders instantly. This is the single
 *    largest jank source in v1, and at 42 rows it has no upside.
 * 3. **No library.** Filtering and sorting are pure functions in
 *    `@/lib/filters` over an array that is already rank-ordered. A table
 *    library would cost 21.3 kB gzipped to do what a `filter` and a
 *    `comparator` do here.
 *
 * Virtualisation: deliberately absent. 42 rows is roughly 380 elements, which
 * React renders in about a millisecond, and a virtualiser needs a scroll
 * container of its own — which would break the page's natural scroll. If the
 * roster ever grows past a few hundred rows, add `@tanstack/react-virtual`
 * (measured at 0.9 kB) then, not now.
 */
export function RankingsTable({
  rows,
  columns,
  sort,
  onSort,
  onNavigate,
}: {
  rows: School[];
  columns: ColumnKey[];
  sort: SortKey;
  onSort: (key: SortKey) => void;
  /** Row-click convenience. The accessible target is the name link. */
  onNavigate: (id: number) => void;
}) {
  const visible = ALL_COLUMNS.filter((c) => columns.includes(c));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse">
        <caption className="sr-only">
          Nepali +2 school rankings. {rows.length} schools, sorted by {currentSortLabel(sort)}.
        </caption>
        <thead>
          <tr className="border-y border-rule">
            {visible.map((col) => (
              <HeadCell key={col} column={col} sort={sort} onSort={onSort} />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((school) => (
            <SchoolRow key={school.id} school={school} columns={columns} onNavigate={onNavigate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function currentSortLabel(sort: SortKey): string {
  return SORTS.find((s) => s.key === sort)?.label.toLowerCase() ?? "rank";
}

/**
 * A sortable column header.
 *
 * Clicking a header that is not the active sort switches to that column's
 * default direction; clicking the active one flips it. The arrow is the only
 * indicator of direction, so it is `aria-hidden` and the state is carried by
 * `aria-sort` on the `<th>`.
 */
function HeadCell({
  column,
  sort,
  onSort,
}: {
  column: ColumnKey;
  sort: SortKey;
  onSort: (key: SortKey) => void;
}) {
  const options = SORTS.filter((s) => s.column === column);
  const active = options.find((s) => s.key === sort);
  const label = headerLabel(column);

  const activate = () => {
    if (active) onSort(flip(active.key));
    else onSort(options[0]?.key ?? "rank");
  };

  return (
    <th
      scope="col"
      aria-sort={active ? (sort.startsWith("-") ? "descending" : "ascending") : "none"}
      className={cn(
        "px-3 py-3 text-left align-bottom first:pl-0 last:pr-0",
        column === "score" && "text-right",
      )}
    >
      {options.length === 0 ? (
        <span className="type-label text-ink-muted">{label}</span>
      ) : (
        <button
          type="button"
          onClick={activate}
          className={cn(
            "type-label inline-flex items-center gap-1 rounded-sm transition-colors",
            active ? "text-ink" : "text-ink-muted hover:text-ink",
            column === "score" && "flex-row-reverse",
          )}
        >
          {label}
          <span
            aria-hidden="true"
            className={cn(
              "text-[0.5rem] leading-none transition-opacity",
              active ? "opacity-100" : "opacity-0",
            )}
          >
            {sort.startsWith("-") ? "▼" : "▲"}
          </span>
        </button>
      )}
    </th>
  );
}

function headerLabel(column: ColumnKey): string {
  switch (column) {
    case "rank":
      return "#";
    case "school":
      return "School";
    case "type":
      return "Type";
    case "env":
      return "School Env.";
    case "infra":
      return "Infrastructure";
    case "cost":
      return "Net Cost";
    case "benefit":
      return "Net Benefit";
    case "score":
      return "Overall";
  }
}

/** Flips the direction of a sort key, preserving which column it belongs to. */
function flip(key: SortKey): SortKey {
  return key.startsWith("-") ? (key.slice(1) as SortKey) : (`-${key}` as SortKey);
}

/* -------------------------------------------------------------------------- */

const SchoolRow = memo(function SchoolRow({
  school,
  columns,
  onNavigate,
}: {
  school: School;
  columns: ColumnKey[];
  onNavigate: (id: number) => void;
}) {
  /**
   * Row-level navigation is a *convenience*, not the accessible target — the
   * real link is on the school name in `SchoolCell`.
   *
   * Two guards matter: a click that started on a link or button belongs to
   * that element, and a modified click (cmd/ctrl/middle) must open a new tab
   * rather than navigate. Without the second check, ctrl-clicking a row would
   * navigate in the same tab, which is maddening.
   */
  const onClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if ((event.target as HTMLElement).closest("a, button, input, select, [role='button']")) return;
    onNavigate(school.id);
  };

  return (
    <tr
      onClick={onClick}
      className="group cursor-pointer border-b border-rule-soft transition-colors hover:bg-bronze-wash"
    >
      {ALL_COLUMNS.filter((c) => columns.includes(c)).map((col) => (
        <td
          key={col}
          className={cn("px-3 py-3 align-middle first:pl-0 last:pr-0", col === "score" && "text-right")}
        >
          {cell(school, col)}
        </td>
      ))}
    </tr>
  );
});

function cell(school: School, col: ColumnKey) {
  switch (col) {
    case "rank":
      return <RankCell rank={school.rank} />;
    case "school":
      return <SchoolCell school={school} />;
    case "type":
      return <Badge size="sm">{school.type}</Badge>;
    case "env":
      return <ScoreCell value={school.categories.environment} bar />;
    case "infra":
      return <ScoreCell value={school.categories.infrastructure} bar />;
    case "cost":
      return <ScoreCell value={school.categories.cost} invert bar />;
    case "benefit":
      return <ScoreCell value={school.categories.benefit} bar />;
    case "score":
      return <OverallCell value={school.overallScore} />;
  }
}
