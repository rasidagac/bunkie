"use client";

import type { ReactNode } from "react";

import { useState, useRef, useEffect } from "react";

import { ListItem } from "./list-item";

type Item = {
  id: string;
};

interface SwipeableListProps<T extends Item> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  onEdit: (item: T) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export function SwipeableList<T extends Item>({
  renderItem,
  data,
  onEdit,
  onDelete,
}: SwipeableListProps<T>) {
  const [activeItemId, setActiveItemId] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);

  // Handle outside click to reset swipe state
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setActiveItemId("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSwipe = (id: string) => {
    setActiveItemId(id);
  };

  const handleEdit = async (item: T) => {
    await onEdit(item);
    setActiveItemId("");
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    setActiveItemId("");
  };

  return (
    <div ref={listRef}>
      {data.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          isActive={activeItemId === item.id}
          onSwipe={handleSwipe}
          onEdit={handleEdit}
          onDelete={handleDelete}
        >
          {renderItem(item)}
        </ListItem>
      ))}
    </div>
  );
}
