import { cn } from "@/lib/utils";
import { Monogram } from "@/components/data-display/Monogram";

/**
 * One person card in the team org chart — mirroring `public/teammembers.png`,
 * but polished:
 *   - Photo placeholder box with red border
   *   Name card (black border) overlapping the bottom edge of the photo box
   *   Title card (black border) below
   *   Hover lift + bronze border on the photo box
 *
 * Real photos: drop one at `public/people/<id>.jpg` and pass
 * `photo="/people/<id>.jpg"`.
 */
export function TeamCard({
  name,
  role,
  photo,
}: {
  name: string;
  role: string;
  photo?: string;
}) {
  return (
    <div className="flex flex-col items-center transition-all duration-300 ease-brand">
      {/* Photo box — red border, fixed size so cards stay uniform. */}
      <div className={cn(
        "relative w-56 aspect-[3/4] border-2 border-band-weak rounded-sm bg-canvas transition-all duration-300 ease-brand group-hover:border-bronze group-hover:shadow-header",
      )}>
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover rounded-sm"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-faint font-serif text-[0.9375rem] font-bold tracking-[0.05em]">
            <Monogram name={name} size="xl" />
          </div>
        )}

        {/* Name card overlapping the bottom edge of the photo box. */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
          <div className="border border-ink bg-canvas px-3 py-1.5 whitespace-nowrap shadow-sm">
            <span className="font-serif text-[0.9375rem] font-bold text-ink">
              {name}
            </span>
          </div>
        </div>
      </div>

      {/* Title card below the photo box. */}
      <div className="mt-2 border border-ink bg-canvas px-3 py-1.5 whitespace-nowrap text-center type-caption text-ink-faint">
        {role}
      </div>
    </div>
  );
}