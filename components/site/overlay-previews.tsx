"use client";

import { useState, type ReactElement } from "react";
import { Dialog } from "@/registry/anywhere/ui/dialog";
import { Drawer } from "@/registry/anywhere/ui/drawer";
import { CommandPalette } from "@/registry/anywhere/ui/command-palette";
import { KeyboardShortcutsHelp } from "@/registry/anywhere/ui/keyboard-shortcuts-help";
import { ConsentBanner } from "@/registry/anywhere/ui/consent-banner";
import { ToastProvider, useToast } from "@/registry/anywhere/ui/toast";

/**
 * Docs-only previews for components that cover the page when open.
 *
 * These are the one deliberate exception to "the preview is the CI fixture".
 * The conformance suite renders these components *open*, because the open
 * state is the one worth auditing — that is where the focus trap, the
 * `aria-modal`, and the labelling live. But a docs page that renders six
 * modals open on load is not showing you six components, it is showing you
 * whichever one has the highest z-index.
 *
 * So the docs put the same component behind the trigger a real app would use.
 * The component, its props, and its behaviour are identical; only who opens it
 * differs. Components not listed here render their CI fixture verbatim.
 */

function TriggerButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
    >
      {children}
    </button>
  );
}

function DialogPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TriggerButton onClick={() => setOpen(true)}>Open dialog</TriggerButton>
      <Dialog open={open} onClose={() => setOpen(false)} title="Delete project">
        <p className="text-sm">This cannot be undone.</p>
      </Dialog>
    </>
  );
}

function DrawerPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TriggerButton onClick={() => setOpen(true)}>Open drawer</TriggerButton>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filters">
        <p className="text-sm">Drawer content</p>
      </Drawer>
    </>
  );
}

function CommandPalettePreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TriggerButton onClick={() => setOpen(true)}>Open command palette</TriggerButton>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={[
          { id: "new", label: "New file", onRun: () => setOpen(false) },
          { id: "search", label: "Search components", onRun: () => setOpen(false) },
          { id: "theme", label: "Toggle theme", onRun: () => setOpen(false) },
        ]}
      />
    </>
  );
}

function ShortcutsPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TriggerButton onClick={() => setOpen(true)}>Show shortcuts</TriggerButton>
      <KeyboardShortcutsHelp
        open={open}
        onClose={() => setOpen(false)}
        shortcuts={[
          { keys: ["Ctrl", "K"], description: "Open command palette" },
          { keys: ["Esc"], description: "Close the current overlay" },
        ]}
      />
    </>
  );
}

function ToastTrigger() {
  const { show } = useToast();

  return <TriggerButton onClick={() => show("Changes saved", "success")}>Show toast</TriggerButton>;
}

function ToastPreview() {
  // Toast is a provider plus a hook rather than a rendered element, so its CI
  // fixture mounts an empty provider — correct for conformance, but it shows a
  // reader nothing. This actually raises one.
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}

function ConsentBannerPreview() {
  // A fresh storage key each mount, so the banner is never suppressed by a
  // choice a reader made on a previous visit to this page.
  const [key] = useState(() => `docs-consent-${Math.random()}`);

  return <ConsentBanner storageKey={key} />;
}

export const overlayPreviews: Record<string, () => ReactElement> = {
  dialog: DialogPreview,
  drawer: DrawerPreview,
  "command-palette": CommandPalettePreview,
  "keyboard-shortcuts-help": ShortcutsPreview,
  toast: ToastPreview,
  "consent-banner": ConsentBannerPreview,
};
