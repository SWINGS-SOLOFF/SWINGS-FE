import { useEffect, useState } from "react";

const usePullToRefresh = ({ onRefresh, targetRef }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    let startY = 0;
    let isPulling = false;

    const handleTouchStart = (e) => {
      if (target.scrollTop === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;
      const currentY = e.touches[0].clientY;
      if (currentY - startY > 80) {
        isPulling = false;
        setIsRefreshing(true);
        Promise.resolve(onRefresh()).finally(() => {
          setTimeout(() => setIsRefreshing(false), 800);
        });
      }
    };

    const handleTouchEnd = () => {
      isPulling = false;
    };

    target.addEventListener("touchstart", handleTouchStart);
    target.addEventListener("touchmove", handleTouchMove);
    target.addEventListener("touchend", handleTouchEnd);

    return () => {
      target.removeEventListener("touchstart", handleTouchStart);
      target.removeEventListener("touchmove", handleTouchMove);
      target.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onRefresh, targetRef]);

  return { isRefreshing };
};

export default usePullToRefresh;
