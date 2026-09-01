import { cn } from "../lib/cn";
import { Avatar } from "./avatar";

export interface AvatarGroupProps {
  people: Array<{ name: string; src?: string }>;
  max?: number;
  size?: number;
  className?: string;
}

/**
 * An overlapping stack of avatars with a "+N" overflow indicator.
 *
 * The overflow indicator gets a real accessible name listing who it hides —
 * "+3 more: Aisha, Bo, Chidi" — rather than leaving a screen reader user with
 * an unexplained number.
 */
export function AvatarGroup({ people, max = 4, size = 32, className }: AvatarGroupProps) {
  const visible = people.slice(0, max);
  const overflow = people.slice(max);

  return (
    <ul
      className={cn("flex -space-x-2 rtl:space-x-reverse", className)}
      aria-label={`${people.length} people`}
    >
      {visible.map((person, index) => (
        <li key={`${person.name}-${index}`} className="ring-2 ring-white rounded-full dark:ring-neutral-950">
          <Avatar name={person.name} src={person.src} size={size} />
        </li>
      ))}

      {overflow.length > 0 && (
        <li className="ring-2 ring-white rounded-full dark:ring-neutral-950">
          {/* role="img" belongs on the span, not the <li> — axe flags role="img"
              as disallowed directly on a list item, and it also strips the
              item's implicit listitem role from the accessibility tree. */}
          <span
            role="img"
            aria-label={`+${overflow.length} more: ${overflow.map((p) => p.name).join(", ")}`}
            className="flex items-center justify-center rounded-full bg-neutral-300 font-medium text-neutral-700 dark:bg-neutral-600 dark:text-neutral-100"
            style={{ width: size, height: size, fontSize: size * 0.35 }}
          >
            <span aria-hidden="true">+{overflow.length}</span>
          </span>
        </li>
      )}
    </ul>
  );
}
