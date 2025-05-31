"use client";

import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";

type ExpenseWithProfile = {
  id: string;
  created_at: string;
  title: string;
  full_name: string | null;
  image_url: string | null;
  amount: string;
  debt: { text: string; amount: string };
};

interface ExpensesTableProps {
  data: ExpenseWithProfile[];
}

export function ExpensesTable({ data }: ExpensesTableProps) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  // Close any open swipe when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".swipeable-item.active")) {
        setActiveItemId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <ScrollArea className="after:to-background h-[500px] grow after:absolute after:bottom-0 after:h-8 after:w-full after:bg-linear-to-b after:from-transparent after:opacity-90">
      <div role="list" aria-label="Expenses list">
        {data.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            isActive={activeItemId === expense.id}
            onClose={() => setActiveItemId(null)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

interface ExpenseItemProps {
  expense: ExpenseWithProfile;
  isActive: boolean;
  onClose: () => void;
}

function ExpenseItem({ expense, isActive, onClose }: ExpenseItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);

  const handleEdit = useCallback(() => {
    // Handle edit action
    console.log("Edit expense:", expense.id);
    onClose();
  }, [expense.id, onClose]);

  return (
    <div
      className={`relative mb-4 overflow-hidden ${isActive ? "swipeable-item active" : "swipeable-item"}`}
      role="listitem"
      aria-label={`Expense: ${expense.title}`}
    >
      <div
        ref={containerRef}
        className="bg-background group relative z-10 grid cursor-grab grid-cols-[auto_auto_1fr_auto] items-center gap-2 gap-x-4 text-xs active:cursor-grabbing"
        style={{
          transform: `translateX(0px)`,
          transition:
            startXRef.current === null
              ? "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
              : "none",
        }}
        aria-roledescription="swipeable item"
        aria-describedby={`expense-${expense.id}-description`}
      >
        <div className="w-min text-center">{expense.created_at}</div>
        <div className="bg-gray-200 p-1">
          <Image
            src={expense.image_url || "/window.svg"}
            width={25}
            height={25}
            alt={expense.title}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-base font-bold">{expense.title}</div>
          <div className="text-gray-500">{`${expense.full_name} paid ${expense.amount}`}</div>
        </div>
        <div className="text-right">
          <div>{expense.debt.text}</div>
          <div>{expense.debt.amount}</div>
        </div>

        {/* Swipe indicator */}
        <div className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-50">
          <span className="text-xs">← Swipe</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute top-0 right-0 bottom-0 flex h-full">
        <Button
          onClick={handleEdit}
          className="h-full w-10 rounded-none"
          variant="secondary"
          aria-label={`Edit expense: ${expense.title}`}
        >
          <Edit size={16} />
        </Button>
        <Button
          className="h-full w-10 rounded-none"
          variant="destructive"
          aria-label={`Delete expense: ${expense.title}`}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* Full-width delete overlay for long swipe */}
      <div
        className="bg-destructive text-destructive-foreground absolute inset-0 flex items-center justify-center transition-all"
        style={{
          opacity: 0,
          transform: `scaleX(0.95)`,
          transformOrigin: "right",
          pointerEvents: "none",
        }}
      >
        <div
          className="flex scale-[0.98] items-center gap-2 transition-transform"
          style={{
            transform: `scale(0.9)`,
            opacity: 0.7,
          }}
        >
          <Trash2 size={24} />
          <span className="text-base font-medium">Delete</span>
        </div>
      </div>

      {/* Hidden description for screen readers */}
      <div className="sr-only" id={`expense-${expense.id}-description`}>
        Swipe left to reveal edit and delete options. Swipe further left to
        delete directly. {expense.title} expense of {expense.amount} paid by{" "}
        {expense.full_name || "unknown"}.
      </div>
    </div>
  );
}
