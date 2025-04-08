import { useRef, useEffect } from "react";

const useIntersectionObserver = ({ targetRef, onIntersect, enabled }) => {
  const observer = useRef();

  useEffect(() => {
    if (!enabled) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersect();
      }
    });

    const el = targetRef.current;
    if (el) observer.current.observe(el);

    return () => observer.current?.disconnect();
  }, [targetRef, onIntersect, enabled]);
};

export default useIntersectionObserver;
