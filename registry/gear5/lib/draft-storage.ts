/**
 * Persistence for in-progress form input.
 *
 * Deliberately narrow: this stores what the user typed so a dropped connection,
 * a killed background tab, or a dead battery does not erase twenty minutes of
 * work. It is not a cache and not a queue of secrets.
 */

const PREFIX = "gear5-ui:draft:";

/**
 * Field types whose values are never written to disk, regardless of what the
 * form contains: credentials, payment details, and anything the author has
 * explicitly opted out with `data-no-persist`.
 *
 * Browsers hand `localStorage` to any script on the origin, so a persisted
 * password is a password one XSS away from being stolen.
 */
const NEVER_PERSIST_TYPES = new Set(["password", "file", "hidden"]);

const SENSITIVE_AUTOCOMPLETE = /(cc-|password|one-time-code|current-|new-)/i;

export type Draft = Record<string, string>;

function isStorageAvailable(): boolean {
  try {
    // Private browsing and locked-down enterprise profiles both throw on
    // access rather than returning null, so this has to be a real write.
    const probe = `${PREFIX}probe`;
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** True when a control's value may be written to disk. */
export function isPersistable(element: Element): boolean {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
    return false;
  }
  if (!element.name) return false;
  if (element.dataset.noPersist !== undefined) return false;

  if (element instanceof HTMLInputElement) {
    if (NEVER_PERSIST_TYPES.has(element.type)) return false;
    if (SENSITIVE_AUTOCOMPLETE.test(element.autocomplete ?? "")) return false;
  }

  return true;
}

/** Collect the persistable values of a form. */
export function readForm(form: HTMLFormElement): Draft {
  const draft: Draft = {};

  for (const element of Array.from(form.elements)) {
    if (!isPersistable(element)) continue;

    const control = element as HTMLInputElement | HTMLTextAreaElement;
    if (control.value) draft[control.name] = control.value;
  }

  return draft;
}

/** Write previously saved values back into a form, without clobbering input. */
export function applyDraft(form: HTMLFormElement, draft: Draft): string[] {
  const restored: string[] = [];

  for (const [name, value] of Object.entries(draft)) {
    const control = form.elements.namedItem(name);
    if (!control || !isPersistable(control as Element)) continue;

    const field = control as HTMLInputElement | HTMLTextAreaElement;
    // Never overwrite something the user has already typed in this session —
    // the live value is always more current than the saved one.
    if (field.value) continue;

    field.value = value;
    restored.push(name);
  }

  return restored;
}

export function saveDraft(key: string, draft: Draft): void {
  if (typeof window === "undefined" || !isStorageAvailable()) return;

  try {
    if (Object.keys(draft).length === 0) {
      localStorage.removeItem(PREFIX + key);
      return;
    }
    localStorage.setItem(PREFIX + key, JSON.stringify(draft));
  } catch {
    // Quota exceeded. A lost draft is bad; a form that throws while you type
    // is worse.
  }
}

export function loadDraft(key: string): Draft | null {
  if (typeof window === "undefined" || !isStorageAvailable()) return null;

  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const draft: Draft = {};
    for (const [name, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "string") draft[name] = value;
    }

    return Object.keys(draft).length > 0 ? draft : null;
  } catch {
    return null;
  }
}

export function clearDraft(key: string): void {
  if (typeof window === "undefined" || !isStorageAvailable()) return;

  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* nothing useful to do */
  }
}
