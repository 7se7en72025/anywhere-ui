import { VisuallyHidden } from "./visually-hidden";

export interface HoneypotFieldProps {
  name?: string;
}

/**
 * A bot trap that stays invisible to real users without becoming invisible
 * to assistive technology in the wrong way. `VisuallyHidden` (clip-based, not
 * `display: none`) keeps it out of the visual layout while `tabIndex={-1}`
 * and `aria-hidden` keep a keyboard or screen reader user from ever landing
 * on it — a simple bot filling every field still fills this one.
 *
 * Server-side: reject the submission if this field arrives non-empty.
 */
export function HoneypotField({ name = "company_website" }: HoneypotFieldProps) {
  return (
    <VisuallyHidden as="div">
      <label htmlFor={`hp-${name}`}>Leave this field empty</label>
      <input id={`hp-${name}`} name={name} type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    </VisuallyHidden>
  );
}
