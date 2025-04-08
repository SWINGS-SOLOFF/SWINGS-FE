import { useEffect } from "react";

const usePullToRefresh = ({
  containerRef,
  onRefresh,
  setIsPulling,
  setPullY,
}) => {
  const touchStartY = { current: 0 };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !("ontouchstart" in window)) return;

    const handleTouchStart = (e) => {
      if (container.scrollTop === 0) {
        touchStartY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      const deltaY = e.touches[0].clientY - touchStartY.current;
      if (deltaY > 0) {
        e.preventDefault();
        setPullY(Math.min(deltaY, 100));
      }
    };

    const handleTouchEnd = () => {
      if (touchStartY.current && pullY > 40) onRefresh();
      setIsPulling(false);
      setPullY(0);
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, onRefresh, setIsPulling, setPullY]);
};

export default usePullToRefresh;
