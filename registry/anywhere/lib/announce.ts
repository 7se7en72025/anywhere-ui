/**
 * A single pair of ARIA live regions shared by the whole app.
 *
 * Screen readers only announce a live region that is present *before* the text
 * changes, so creating a region and filling it in the same tick silently does
 * nothing — a mistake that makes "accessible" toasts and form errors inaudible.
 * We mount the regions once, up front, and only ever mutate their text.
 */

type Politeness = "polite" | "assertive";

interface Channel {
  /** Two nodes, alternated so an identical repeated message is still spoken. */
  regions: [HTMLElement, HTMLElement];
  next: 0 | 1;
}

const channels = new Map<Politeness, Channel>();

function createRegion(politeness: Politeness): HTMLElement {
  const region = document.createElement("div");

  region.setAttribute("role", politeness === "assertive" ? "alert" : "status");
  region.setAttribute("aria-live", politeness);
  region.setAttribute("aria-atomic", "true");

  // Visually hidden without being hidden from assistive tech. `display: none`,
  // `visibility: hidden`, and `hidden` all remove it from the accessibility
  // tree, which is exactly what we must not do here.
  Object.assign(region.style, {
    position: "absolute",
    width: "1px",
    height: "1px",
    margin: "-1px",
    padding: "0",
    border: "0",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  } satisfies Partial<CSSStyleDeclaration>);

  document.body.appendChild(region);
  return region;
}

function getChannel(politeness: Politeness): Channel {
  const existing = channels.get(politeness);
  if (existing) return existing;

  const channel: Channel = {
    regions: [createRegion(politeness), createRegion(politeness)],
    next: 0,
  };

  channels.set(politeness, channel);
  return channel;
}

/**
 * Speak `message` to assistive technology.
 *
 * `polite` waits for the user to finish what they are doing — use it for
 * "3 results loaded". `assertive` interrupts — reserve it for errors and
 * anything the user must hear before they act again.
 *
 * No-ops on the server.
 */
export function announce(message: string, politeness: Politeness = "polite"): void {
  if (typeof document === "undefined") return;

  const text = message.trim();
  if (!text) return;

  const channel = getChannel(politeness);
  const region = channel.regions[channel.next];
  const other = channel.regions[channel.next === 0 ? 1 : 0];

  channel.next = channel.next === 0 ? 1 : 0;

  other.textContent = "";
  // A frame between mount and mutation is what makes the change observable to
  // screen readers that diff live-region contents.
  requestAnimationFrame(() => {
    region.textContent = text;
  });
}

/** Remove the shared live regions. Only useful in tests and teardown. */
export function resetAnnouncer(): void {
  for (const channel of channels.values()) {
    for (const region of channel.regions) region.remove();
  }
  channels.clear();
}
