import { Dialog } from "./dialog";
import { Kbd } from "./kbd";

export interface Shortcut {
  keys: string[];
  description: string;
}

export interface KeyboardShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
  shortcuts: Shortcut[];
  title?: string;
}

/**
 * A shortcut reference, built on `Dialog` so it inherits the focus trap and
 * Escape-to-close every other overlay in the library has — a "just show a
 * list of shortcuts" dialog is exactly the kind of secondary UI that skips
 * this in most apps and traps keyboard users when it does.
 */
export function KeyboardShortcutsHelp({ open, onClose, shortcuts, title = "Keyboard shortcuts" }: KeyboardShortcutsHelpProps) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <ul className="flex flex-col gap-2">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.description} className="flex items-center justify-between gap-4 text-sm">
            <span>{shortcut.description}</span>
            <span className="flex gap-1">
              {shortcut.keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}
