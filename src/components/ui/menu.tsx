import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A menu primitive.
 *
 * WHY THIS EXISTS INSTEAD OF shadcn's `dropdown-menu`
 * ------------------------------------------------------------------
 * `dropdown-menu` measured **13.8 kB gzipped** in this build — more than
 * react-router, and 30% of the entire app-code budget — for two lists of
 * buttons. It brings a full menu system (popper positioning, focus scope,
 * typeahead, submenu machinery) that a sort menu and a column picker do not
 * need, and its default styling is a battle we would lose anyway, because this
 * design wants 2px corners, hairlines and the type scale rather than shadcn's
 * generic rounded-popover look.
 *
 * This implements the WAI-ARIA menu pattern directly: `role="menu"`, roving
 * focus, Arrow/Home/End, Escape to close and return focus, click-outside to
 * dismiss. About 130 lines instead of 13.8 kB.
 *
 * `sheet` (3 kB) was KEPT: dialog focus trapping, scroll locking, and outside-
 * press handling are genuinely hard to get right by hand.
 *
 * See docs/01-STACK.md § Rejected.
 */

type MenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  /** Register an item so arrow keys can move between them. */
  itemsRef: React.RefObject<Set<HTMLButtonElement>>;
  focusItem: (from: number, delta: number) => void;
};

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenu(): MenuContextValue {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error("Menu subcomponents must be inside <Menu>");
  return ctx;
}

export function Menu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const itemsRef = React.useRef<Set<HTMLButtonElement>>(new Set());

  /** Arrow / Home / End over the registered items. */
  const focusItem = React.useCallback((from: number, delta: number) => {
    const items = [...itemsRef.current];
    if (items.length === 0) return;
    const next = (from + delta + items.length) % items.length;
    items[next]?.focus();
  }, []);

  // Focus the first item when the menu opens, so keyboard users land inside.
  React.useEffect(() => {
    if (!open) return;
    const items = [...itemsRef.current];
    // Prefer the currently-checked item; it is the most likely target.
    const checked = panelRef.current?.querySelector<HTMLButtonElement>(
      '[role="menuitemradio"][aria-checked="true"]',
    );
    (checked ?? items[0])?.focus();
  }, [open]);

  // Escape closes and returns focus to the trigger, per the ARIA pattern.
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const value = React.useMemo<MenuContextValue>(
    () => ({ open, setOpen, triggerRef, panelRef, itemsRef, focusItem }),
    [open, focusItem],
  );

  return (
    <MenuContext.Provider value={value}>
      <div className={cn("relative", className)}>{children}</div>
    </MenuContext.Provider>
  );
}

/**
 * The trigger. Closes the menu when clicked while open, so it behaves like a
 * toggle rather than only an opener.
 */
export function MenuTrigger({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { open, setOpen, triggerRef } = useMenu();
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-rule px-4",
        "font-sans type-ui whitespace-nowrap text-ink transition-colors duration-[120ms]",
        "hover:bg-bronze-wash active:bg-bronze-soft",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function MenuPanel({
  children,
  label,
  align = "start",
  className,
}: {
  children: React.ReactNode;
  /** Group label, rendered as a non-interactive header. */
  label: string;
  align?: "start" | "end";
  className?: string;
}) {
  const { open, panelRef, itemsRef, focusItem, setOpen } = useMenu();

  if (!open) return null;

  const items = () => [...itemsRef.current];

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label={label}
      // `tabIndex={-1}` so the panel itself is not a tab stop; focus goes to items.
      tabIndex={-1}
      onKeyDown={(event) => {
        const list = items();
        const current = list.indexOf(document.activeElement as HTMLButtonElement);
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            focusItem(current < 0 ? 0 : current, 1);
            break;
          case "ArrowUp":
            event.preventDefault();
            focusItem(current < 0 ? list.length - 1 : current, -1);
            break;
          case "Home":
            event.preventDefault();
            items()[0]?.focus();
            break;
          case "End":
            event.preventDefault();
            items()[items().length - 1]?.focus();
            break;
          case "Tab":
            // The ARIA pattern: Tab closes the menu and moves focus onward.
            setOpen(false);
            break;
        }
      }}
      className={cn(
        "absolute top-full z-50 mt-1.5 min-w-56 rounded-md border border-rule-soft",
        "bg-raised p-1 shadow-float",
        align === "start" ? "left-0" : "right-0",
        className,
      )}
    >
      <div aria-hidden="true" className="type-label px-2.5 py-1.5 text-ink-faint">
        {label}
      </div>
      <div className="my-1 h-px bg-rule-soft" />
      {children}
    </div>
  );
}

/**
 * A menu item.
 *
 * `checked` renders it as a radio/checkbox item with a tick, and is what makes
 * the sort menu and column picker legible at a glance. `disabled` is used for
 * the two columns that cannot be switched off.
 */
export function MenuItem({
  checked,
  disabled,
  children,
  onSelect,
  className,
}: {
  checked?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onSelect: () => void;
  className?: string;
}) {
  const { setOpen, triggerRef, itemsRef } = useMenu();

  return (
    <button
      ref={(node) => {
        if (node) itemsRef.current.add(node);
        else itemsRef.current.delete(node!);
      }}
      type="button"
      role={checked === undefined ? "menuitem" : "menuitemradio"}
      aria-checked={checked === undefined ? undefined : checked}
      // Roving tabindex: only the focused item is a tab stop; arrows do the rest.
      tabIndex={-1}
      disabled={disabled}
      onClick={() => {
        onSelect();
        // Selection closes the menu and returns focus, so a keyboard user is
        // not dropped at the top of the document after every sort click.
        setOpen(false);
        triggerRef.current?.focus();
      }}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-sm px-2.5 py-2",
        "text-left type-ui transition-colors",
        "disabled:pointer-events-none disabled:opacity-40",
        checked ? "text-bronze-ink" : "text-ink-muted hover:bg-bronze-wash hover:text-ink",
        className,
      )}
    >
      <span>{children}</span>
      {checked ? (
        <span aria-hidden="true" className="text-bronze-ink">
          ✓
        </span>
      ) : null}
    </button>
  );
}
