"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaTimes } from "react-icons/fa";

const portfolioItems = [
  {
    id: 1,
    title: "Geoda Azul",
    description:
      "Pieza inspirada en formaciones geológicas naturales con tonos azules profundos",
    image: "/images/portfolio/geode-blue.jpg",
    dimensions: "30x30 cm",
    technique: "Resina epoxi con pigmentos minerales",
  },
  {
    id: 2,
    title: "Océano Profundo",
    description:
      "Recreación de un paisaje marino con efectos de profundidad y movimiento",
    image: "/images/portfolio/ocean-deep.jpg",
    dimensions: "40x60 cm",
    technique: "Resina epoxi con efectos de olas",
  },
  {
    id: 3,
    title: "Abstracción Moderna",
    description: "Diseño contemporáneo con formas fluidas y colores vibrantes",
    image: "/images/portfolio/abstract-modern.jpg",
    dimensions: "50x50 cm",
    technique: "Resina epoxi con pigmentos metálicos",
  },
  {
    id: 4,
    title: "Minimalista Blanco",
    description: "Pieza minimalista con líneas limpias y diseño esencial",
    image: "/images/portfolio/minimal-white.jpg",
    dimensions: "35x35 cm",
    technique: "Resina epoxi con acabado mate",
  },
];

export default function Portfolio() {
  const [selectedItem, setSelectedItem] = useState<
    (typeof portfolioItems)[0] | null
  >(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="portfolio" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Catálogo</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora nuestra colección de piezas únicas, cada una con su propia
            historia y técnica especial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-96">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                  />
                  <button
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
                    onClick={() => setSelectedItem(null)}
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    {selectedItem.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedItem.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Dimensiones</h4>
                      <p className="text-gray-600">{selectedItem.dimensions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Técnica</h4>
                      <p className="text-gray-600">{selectedItem.technique}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
