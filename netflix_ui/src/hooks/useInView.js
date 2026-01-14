import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Custom hook to detect when an element is visible in the viewport
 * Uses IntersectionObserver for performance
 *
 * @param {object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (default: 0.2)
 * @param {string} options.rootMargin - Root margin (default: "100px")
 * @param {boolean} options.triggerOnce - Only trigger once (default: true)
 *
 * @returns {array} [ref, isVisible, entry]
 *
 * @example
 * const [ref, isVisible] = useInView({ threshold: 0.1 });
 *
 * <div ref={ref}>
 *   {isVisible && <ExpensiveComponent />}
 * </div>
 */
const useInView = (options = {}) => {
  const { threshold = 0.2, rootMargin = "100px", triggerOnce = true } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState(null);

  // Track if we've already triggered (for triggerOnce)
  const hasTriggered = useRef(false);

  const handleIntersection = useCallback(
    ([entry]) => {
      setEntry(entry);

      if (entry.isIntersecting) {
        setIsVisible(true);

        if (triggerOnce) {
          hasTriggered.current = true;
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;

    // Skip if already triggered and triggerOnce is true
    if (hasTriggered.current && triggerOnce) return;

    if (!element) return;

    // Check for IntersectionObserver support
    if (!("IntersectionObserver" in window)) {
      // Fallback: always show content
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, handleIntersection]);

  return [ref, isVisible, entry];
};

export default useInView;
