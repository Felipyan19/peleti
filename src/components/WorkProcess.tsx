"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaFlask, FaPaintBrush, FaMagic, FaCheckCircle } from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Preparación",
    description: "Selección de materiales y preparación del espacio de trabajo",
    icon: FaFlask,
  },
  {
    id: 2,
    title: "Diseño",
    description: "Planificación del diseño y selección de colores",
    icon: FaPaintBrush,
  },
  {
    id: 3,
    title: "Creación",
    description: "Proceso de mezcla y aplicación de la resina",
    icon: FaMagic,
  },
  {
    id: 4,
    title: "Acabado",
    description: "Pulido y detalles finales para un acabado perfecto",
    icon: FaCheckCircle,
  },
];

export default function WorkProcess() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="process" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proceso de Trabajo
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cada pieza es creada con dedicación y atención al detalle, siguiendo
            un proceso cuidadosamente planificado.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
