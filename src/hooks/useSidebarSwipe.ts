import { useEffect, useRef } from "react";

interface UseSidebarSwipeProps {
  onOpen: () => void;
  enabled?: boolean;
}

export function useSidebarSwipe({
  onOpen,
  enabled = true,
}: UseSidebarSwipeProps) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];

      // Only allow swipe to start in the left 50%
      if (touch.clientX > window.innerWidth / 2) {
        startX.current = null;
        startY.current = null;
        return;
      }

      startX.current = touch.clientX;
      startY.current = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (startX.current === null || startY.current === null) return;

      const touch = e.changedTouches[0];

      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;

      startX.current = null;
      startY.current = null;

      // Ignore normal vertical scrolling
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;

      // Swipe right
      if (deltaX >= 70) {
        onOpen();
      }
    };

    const handleTouchCancel = () => {
      startX.current = null;
      startY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    window.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    window.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [enabled, onOpen]);
}
