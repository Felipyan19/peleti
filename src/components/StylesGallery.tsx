"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const styles = [
  {
    id: 1,
    name: "Geodas",
    description: "Piezas inspiradas en formaciones geológicas naturales",
    image: "/images/geode.jpg",
    category: "natural",
  },
  {
    id: 2,
    name: "Océanos",
    description: "Recreaciones de paisajes marinos con efectos de profundidad",
    image: "/images/ocean.jpg",
    category: "natural",
  },
  {
    id: 3,
    name: "Abstracto",
    description: "Diseños modernos y contemporáneos",
    image: "/images/abstract.jpg",
    category: "modern",
  },
  {
    id: 4,
    name: "Minimalista",
    description: "Piezas con líneas limpias y diseño esencial",
    image: "/images/minimal.jpg",
    category: "modern",
  },
];

const categories = [
  { id: "all", name: "Todos" },
  { id: "natural", name: "Natural" },
  { id: "modern", name: "Moderno" },
];

export default function StylesGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredStyles =
    selectedCategory === "all"
      ? styles
      : styles.filter((style) => style.category === selectedCategory);

  return (
    <section id="styles" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Estilos de Figuras
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora nuestra colección de estilos únicos, cada uno con su propia
            personalidad y técnica especial.
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category.id
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredStyles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <div className="relative h-48">
                <Image
                  src={style.image}
                  alt={style.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{style.name}</h3>
                <p className="text-gray-600">{style.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
