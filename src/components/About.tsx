"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Sobre Nosotros
          </h2>

          <div className="space-y-6 text-lg text-gray-700">
            <p>
              Somos apasionados artistas especializados en la creación de piezas
              únicas en resina. Nuestro viaje comenzó hace más de 5 años, cuando
              descubrimos la magia de transformar materiales simples en obras de
              arte extraordinarias.
            </p>

            <p>
              Nuestra misión es crear piezas que no solo sean visualmente
              impresionantes, sino que también cuenten una historia y evoquen
              emociones en quienes las contemplan. Cada creación es única, hecha
              a mano con amor y atención al detalle.
            </p>

            <p>
              Nos especializamos en una amplia variedad de técnicas, desde
              geodas y océanos hasta piezas abstractas y personalizadas. Cada
              proyecto es una oportunidad para explorar nuevos límites y crear
              algo verdaderamente especial.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
