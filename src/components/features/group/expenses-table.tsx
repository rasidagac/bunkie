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
            onSwipe={(id) => setActiveItemId(id)}
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
  onSwipe: (id: string) => void;
  onClose: () => void;
}

function ExpenseItem({
  expense,
  isActive,
  onSwipe,
  onClose,
}: ExpenseItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef<number>(0);
  const [translateX, setTranslateX] = useState(0);
  const isDraggingRef = useRef(false);
  const [swipeMode, setSwipeMode] = useState<"none" | "actions" | "delete">(
    "none",
  );
  const hasVibratedRef = useRef(false);

  // Constants for swipe thresholds
  const ACTIONS_THRESHOLD = -80; // Threshold to show actions
  const DELETE_THRESHOLD = -160; // Threshold to trigger delete directly

  // Calculate background opacity based on swipe distance
  const getDeleteBackgroundOpacity = useCallback(
    (translateValue: number) => {
      if (translateValue > ACTIONS_THRESHOLD) return 0;

      // Map translateX from ACTIONS_THRESHOLD to DELETE_THRESHOLD to opacity 0-1
      const progress = Math.min(
        1,
        (translateValue - ACTIONS_THRESHOLD) /
          (DELETE_THRESHOLD - ACTIONS_THRESHOLD),
      );
      return Math.max(0, progress);
    },
    [ACTIONS_THRESHOLD, DELETE_THRESHOLD],
  );

  // Reset position when isActive changes to false
  useEffect(() => {
    if (!isActive) {
      setTranslateX(0);
      setSwipeMode("none");
      hasVibratedRef.current = false;
    }
  }, [isActive]);

  // Provide haptic feedback when crossing into delete mode
  const triggerHapticFeedback = useCallback(() => {
    if (hasVibratedRef.current) return;

    if ("vibrate" in navigator) {
      navigator.vibrate(50); // Short vibration
      hasVibratedRef.current = true;
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    document.body.style.overflow = "hidden"; // Prevent scrolling while swiping
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (startXRef.current === null) return;

      const currentX = e.touches[0].clientX;
      const diff = currentX - startXRef.current;

      // Only allow left swipe (negative diff)
      if (diff <= 0) {
        // Update swipe mode based on distance
        const prevMode = swipeMode;
        if (diff < DELETE_THRESHOLD) {
          setSwipeMode("delete");
          if (prevMode !== "delete") {
            triggerHapticFeedback();
          }
        } else if (diff < ACTIONS_THRESHOLD) {
          setSwipeMode("actions");
          hasVibratedRef.current = false;
        } else {
          setSwipeMode("none");
          hasVibratedRef.current = false;
        }

        // Apply resistance when swiping beyond DELETE_THRESHOLD
        let newTranslateX;
        if (diff < DELETE_THRESHOLD) {
          // Add resistance to make it harder to swipe beyond DELETE_THRESHOLD
          const overSwipe = diff - DELETE_THRESHOLD;
          newTranslateX = DELETE_THRESHOLD + overSwipe * 0.2;
        } else {
          newTranslateX = diff;
        }

        setTranslateX(newTranslateX);
        currentXRef.current = newTranslateX;
      }
    },
    [DELETE_THRESHOLD, ACTIONS_THRESHOLD, swipeMode, triggerHapticFeedback],
  );

  const handleTouchEnd = useCallback(() => {
    document.body.style.overflow = "";

    if (startXRef.current === null) return;

    // Handle different swipe modes
    if (swipeMode === "delete") {
      // Trigger delete action immediately
      handleDelete();
    } else if (swipeMode === "actions") {
      // Snap to actions position
      setTranslateX(ACTIONS_THRESHOLD);
      onSwipe(expense.id);
    } else {
      // Snap back to closed position
      setTranslateX(0);
      onClose();
    }

    startXRef.current = null;
  }, [expense.id, onSwipe, onClose, swipeMode]);

  // Mouse events for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
    document.body.style.overflow = "hidden";

    // Prevent text selection during drag
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (startXRef.current === null || !isDraggingRef.current) return;

      const currentX = e.clientX;
      const diff = currentX - startXRef.current;

      // Only allow left swipe (negative diff)
      if (diff <= 0) {
        // Update swipe mode based on distance
        const prevMode = swipeMode;
        if (diff < DELETE_THRESHOLD) {
          setSwipeMode("delete");
          if (prevMode !== "delete") {
            triggerHapticFeedback();
          }
        } else if (diff < ACTIONS_THRESHOLD) {
          setSwipeMode("actions");
          hasVibratedRef.current = false;
        } else {
          setSwipeMode("none");
          hasVibratedRef.current = false;
        }

        // Apply resistance when swiping beyond DELETE_THRESHOLD
        let newTranslateX;
        if (diff < DELETE_THRESHOLD) {
          // Add resistance to make it harder to swipe beyond DELETE_THRESHOLD
          const overSwipe = diff - DELETE_THRESHOLD;
          newTranslateX = DELETE_THRESHOLD + overSwipe * 0.2;
        } else {
          newTranslateX = diff;
        }

        setTranslateX(newTranslateX);
        currentXRef.current = newTranslateX;
      }
    },
    [DELETE_THRESHOLD, ACTIONS_THRESHOLD, swipeMode, triggerHapticFeedback],
  );

  const handleDelete = useCallback(() => {
    // Handle delete action
    console.log("Delete expense:", expense.id);
    onClose();

    // Here you would add the actual delete logic
    // For example, call an API to delete the expense
  }, [expense.id, onClose]);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;

    document.body.style.overflow = "";
    isDraggingRef.current = false;

    if (startXRef.current === null) return;

    // Handle different swipe modes
    if (swipeMode === "delete") {
      // Trigger delete action immediately
      handleDelete();
    } else if (swipeMode === "actions") {
      // Snap to actions position
      setTranslateX(ACTIONS_THRESHOLD);
      onSwipe(expense.id);
    } else {
      // Snap back to closed position
      setTranslateX(0);
      onClose();
    }

    startXRef.current = null;
  }, [
    swipeMode,
    handleDelete,
    ACTIONS_THRESHOLD,
    onSwipe,
    expense.id,
    onClose,
  ]);

  // Add global mouse up event to handle cases where mouse is released outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        handleMouseUp();
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleMouseUp]);

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
          transform: `translateX(${translateX}px)`,
          transition:
            startXRef.current === null
              ? "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
              : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
          onClick={handleDelete}
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
          opacity: getDeleteBackgroundOpacity(translateX),
          transform: `scaleX(${swipeMode === "delete" ? 1 : 0.95})`,
          transformOrigin: "right",
          pointerEvents: swipeMode === "delete" ? "auto" : "none",
        }}
      >
        <div
          className="flex scale-[0.98] items-center gap-2 transition-transform"
          style={{
            transform: `scale(${swipeMode === "delete" ? 1.1 : 0.9})`,
            opacity: swipeMode === "delete" ? 1 : 0.7,
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
