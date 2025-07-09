"use client";

import { useState, useEffect } from "react";

export interface ImageData {
  name: string;
  path: string;
}

export const GALLERY_IMAGES: ImageData[] = [
  { name: "guerrero.jpg", path: "/images/guerrero.jpg" },
  { name: "espada.jpg", path: "/images/espada.jpg" },
  { name: "arcangeles.jpg", path: "/images/arcangeles.jpg" },
  { name: "familia.jpg", path: "/images/familia.jpg" },
  { name: "virgen.jpg", path: "/images/virgen.jpg" },
  { name: "justicia.jpg", path: "/images/justicia.jpg" },
  { name: "elefantes.jpg", path: "/images/elefantes.jpg" },
  { name: "vikingos.jpg", path: "/images/vikingos.jpg" },
];

export function getRandomImage(): ImageData {
  const randomIndex = Math.floor(Math.random() * GALLERY_IMAGES.length);
  return GALLERY_IMAGES[randomIndex];
}

export function getAllImages(): ImageData[] {
  return GALLERY_IMAGES;
}

export function useRandomImages() {
  const [currentImage, setCurrentImage] = useState<ImageData>(() =>
    getRandomImage()
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentImage(getRandomImage());
        setIsTransitioning(false);
      }, 1000);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const changeImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImage(getRandomImage());
      setIsTransitioning(false);
    }, 1000);
  };

  return {
    currentImage,
    changeImage,
    isTransitioning,
    allImages: getAllImages(),
  };
}
