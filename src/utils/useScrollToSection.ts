import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface UseScrollToSectionOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollToSection(
  sectionId: string,
  options: UseScrollToSectionOptions = {}
) {
  const [ref, inView] = useInView({
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || "0px",
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const handleNavigationClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a[href], button[href]") as HTMLAnchorElement;

      if (link && link.getAttribute("href") === `#${sectionId}`) {
        setHasNavigated(true);
        setShouldAnimate(false);

        setTimeout(() => {
          setShouldAnimate(true);
        }, 100);
      }
    };

    document.addEventListener("click", handleNavigationClick);

    return () => {
      document.removeEventListener("click", handleNavigationClick);
    };
  }, [sectionId]);

  useEffect(() => {
    if (inView && !hasNavigated) {
      setShouldAnimate(true);
    }
  }, [inView, hasNavigated]);

  useEffect(() => {
    if (!inView) {
      setShouldAnimate(false);
      if (hasNavigated) {
        setHasNavigated(false);
      }
    }
  }, [inView, hasNavigated]);

  return {
    ref,
    inView,
    shouldAnimate,
  };
}
