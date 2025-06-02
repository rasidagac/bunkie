"use client";

import type { ReactNode, TouchEvent, MouseEvent } from "react";

import { Edit3, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Item = {
  id: string;
};

interface ListItemProps<T extends Item> {
  item: T;
  isActive: boolean;
  onSwipe: (id: string) => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  children: ReactNode;
}

export function ListItem<T extends Item>({
  item,
  isActive,
  onSwipe,
  onEdit,
  onDelete,
  children,
}: ListItemProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 80;
  const MAX_SWIPE = 120;

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const deltaX = startX - clientX;
    const newTranslateX = Math.max(0, Math.min(deltaX, MAX_SWIPE));
    setCurrentX(clientX);
    setTranslateX(newTranslateX);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const deltaX = startX - currentX;

    if (deltaX > SWIPE_THRESHOLD) {
      setTranslateX(MAX_SWIPE);
      onSwipe(item.id);
    } else {
      setTranslateX(0);
      onSwipe("");
    }
  };

  // Touch events
  const handleTouchStart = (e: TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events for desktop
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Reset position when not active
  useEffect(() => {
    if (!isActive && !isDragging) {
      setTranslateX(0);
    }
  }, [isActive, isDragging]);

  return (
    <div className="bg-background relative overflow-hidden">
      {/* Action buttons background */}
      <div className="absolute top-0 right-0 flex h-full">
        <button
          onClick={() => onEdit(item)}
          className="flex w-16 items-center justify-center bg-blue-500 text-white transition-colors hover:bg-blue-600"
          aria-label="Edit item"
        >
          <Edit3 className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="flex w-16 items-center justify-center bg-red-500 text-white transition-colors hover:bg-red-600"
          aria-label="Delete item"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Main content */}
      <div
        ref={itemRef}
        className={`bg-background relative cursor-pointer p-1 select-none ${
          isDragging
            ? "transition-none"
            : "transition-transform duration-300 ease-out"
        }`}
        style={{
          transform: `translateX(-${translateX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {children}
      </div>
    </div>
  );
}
