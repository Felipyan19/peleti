import { useEffect, useState, useRef } from "react";
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
    triggerOnce: false,
  });

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleNavigationClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest(
        "a[href*='#'], button[href*='#']"
      ) as HTMLAnchorElement;

      if (link) {
        const href = link.getAttribute("href");
        if (href === `#${sectionId}`) {
          console.log(`🎯 Navigating to section: ${sectionId}`);
          setIsNavigating(true);
          setShouldAnimate(false);

          if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
          }

          navigationTimeoutRef.current = setTimeout(() => {
            console.log(`✨ Triggering animation for section: ${sectionId}`);
            setShouldAnimate(true);
            setIsNavigating(false);
          }, 500);
        }
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === sectionId) {
        console.log(`🔗 Hash changed to section: ${sectionId}`);
        setIsNavigating(true);
        setShouldAnimate(false);

        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
        }

        navigationTimeoutRef.current = setTimeout(() => {
          setShouldAnimate(true);
          setIsNavigating(false);
        }, 300);
      }
    };

    document.addEventListener("click", handleNavigationClick, true);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      document.removeEventListener("click", handleNavigationClick, true);
      window.removeEventListener("hashchange", handleHashChange);
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [sectionId]);

  useEffect(() => {
    if (inView && !hasAnimated && !isNavigating) {
      console.log(`👁️ Section ${sectionId} came into view - animating`);
      setShouldAnimate(true);
      setHasAnimated(true);
    }
  }, [inView, hasAnimated, isNavigating, sectionId]);

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  return {
    ref,
    inView,
    shouldAnimate,
    hasAnimated,
  };
}

// Enhanced hook for more sophisticated animations
interface UseEnhancedAnimationOptions extends UseScrollToSectionOptions {
  staggerDelay?: number;
  animationDuration?: number;
  enableStagger?: boolean;
}

export function useEnhancedAnimation(
  sectionId: string,
  options: UseEnhancedAnimationOptions = {}
) {
  const {
    staggerDelay = 0.1,
    animationDuration = 0.8,
    enableStagger = true,
    ...scrollOptions
  } = options;

  const { ref, inView, shouldAnimate, hasAnimated } = useScrollToSection(
    sectionId,
    scrollOptions
  );

  const [animationState, setAnimationState] = useState({
    isReady: false,
    currentStagger: 0,
  });

  useEffect(() => {
    if (shouldAnimate && !animationState.isReady) {
      console.log(`🎬 Setting up enhanced animation for section: ${sectionId}`);
      setAnimationState({
        isReady: true,
        currentStagger: 0,
      });
    }
  }, [shouldAnimate, animationState.isReady, sectionId]);

  const getStaggerVariants = (index: number = 0) => ({
    hidden: {
      opacity: 0,
      y: 30,
      transition: { duration: animationDuration },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationDuration,
        delay: enableStagger ? index * staggerDelay : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  });

  const getContainerVariants = () => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: enableStagger ? staggerDelay : 0,
        delayChildren: 0.1,
      },
    },
  });

  return {
    ref,
    inView,
    shouldAnimate: animationState.isReady,
    hasAnimated,
    getStaggerVariants,
    getContainerVariants,
    animationState,
  };
}
