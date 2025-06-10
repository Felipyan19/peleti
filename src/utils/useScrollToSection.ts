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
    threshold: options.threshold || 0.05,
    rootMargin: options.rootMargin || "50px 0px 50px 0px",
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
    if (inView) {
      setShouldAnimate(true);
      if (hasNavigated) {
        setHasNavigated(false);
      }
    }
  }, [inView, hasNavigated]);

  useEffect(() => {
    if (!inView && shouldAnimate && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        if (!inView) {
          setShouldAnimate(false);
        }
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [inView, shouldAnimate, hasNavigated]);

  return {
    ref,
    inView,
    shouldAnimate,
  };
}
