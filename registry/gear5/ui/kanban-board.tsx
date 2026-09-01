"use client";

import { useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveCard?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  className?: string;
}

/**
 * Kanban board with columns and draggable cards. Uses `aria-roledescription="kanban board"`
 * and each card has `aria-roledescription="kanban card"` with `aria-grabbed`.
 * Arrow keys navigate between cards; Enter/Space grabs and drops.
 */
export function KanbanBoard({ columns, onMoveCard, className }: KanbanBoardProps) {
  const [boardState, setBoardState] = useState(columns);
  const [grabbedCard, setGrabbedCard] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function findCardLocation(cardId: string) {
    for (const col of boardState) {
      const index = col.cards.findIndex((c) => c.id === cardId);
      if (index !== -1) return { columnId: col.id, index };
    }
    return null;
  }

  function handleKeyDown(event: React.KeyboardEvent, cardId: string) {
    const loc = findCardLocation(cardId);
    if (!loc) return;
    const col = boardState.find((c) => c.id === loc.columnId)!;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (grabbedCard === cardId) {
        setGrabbedCard(null);
      } else {
        setGrabbedCard(cardId);
      }
    } else if (grabbedCard && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      const colIndex = boardState.findIndex((c) => c.id === loc.columnId);
      const targetColIndex = event.key === "ArrowRight" ? colIndex + 1 : colIndex - 1;
      if (targetColIndex < 0 || targetColIndex >= boardState.length) return;

      const targetCol = boardState[targetColIndex];
      setBoardState((prev) => {
        const next = prev.map((c) => ({ ...c, cards: [...c.cards] }));
        const fromCol = next.find((c) => c.id === loc.columnId)!;
        const toCol = next.find((c) => c.id === targetCol.id)!;
        const [moved] = fromCol.cards.splice(loc.index, 1);
        toCol.cards.push(moved);
        return next;
      });
      onMoveCard?.(cardId, loc.columnId, targetCol.id);
      requestAnimationFrame(() => cardRefs.current[cardId]?.focus());
    } else if (!grabbedCard) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextCard = col.cards[loc.index + 1];
        if (nextCard) cardRefs.current[nextCard.id]?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevCard = col.cards[loc.index - 1];
        if (prevCard) cardRefs.current[prevCard.id]?.focus();
      }
    }
  }

  return (
    <div
      aria-roledescription="kanban board"
      className={cn("flex gap-4 overflow-x-auto", className)}
    >
      {boardState.map((column) => (
        <div
          key={column.id}
          role="region"
          aria-label={column.title}
          className="flex min-w-[280px] flex-1 flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <h3 className="px-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {column.title}
            <span className="ms-1 text-xs font-normal text-neutral-400">
              ({column.cards.length})
            </span>
          </h3>
          <div className="flex flex-col gap-2" role="list" aria-label={`${column.title} cards`}>
            {column.cards.map((card) => (
              <div
                key={card.id}
                ref={(node) => {
                  cardRefs.current[card.id] = node;
                }}
                role="listitem"
                aria-roledescription="kanban card"
                aria-grabbed={grabbedCard === card.id}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, card.id)}
                className={cn(
                  "rounded-md border bg-white p-3 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-800",
                  grabbedCard === card.id && "ring-2 ring-blue-500",
                )}
              >
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{card.title}</span>
                {card.description && (
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{card.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
