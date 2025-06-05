"use client";

import type { ReactNode } from "react";

import { useEffect, useRef, useState } from "react";

import { ListItem } from "./list-item";

type Item = {
  id: string;
};

interface SwipeableListProps<T extends Item> {
  data: T[];
  onDelete: (id: string) => Promise<void> | void;
  onEdit: (item: T) => Promise<void> | void;
  renderItem: (item: T) => ReactNode;
}

export function SwipeableList<T extends Item>({
  data,
  onDelete,
  onEdit,
  renderItem,
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
          isActive={activeItemId === item.id}
          item={item}
          key={item.id}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSwipe={handleSwipe}
        >
          {renderItem(item)}
        </ListItem>
      ))}
    </div>
  );
}
