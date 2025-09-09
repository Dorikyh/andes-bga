import { motion } from "framer-motion";
import { FaHandshake, FaUsers, FaWhatsapp, FaArrowRight } from "react-icons/fa";

export default function GlobalCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className="my-16"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-yellow-500 to-secondary p-8 md:p-12 text-white shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, white 2px, transparent 2px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-6 left-6 w-14 h-14 bg-white/10 rounded-full animate-float delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white/10 rounded-full animate-float delay-500"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm"
          >
            <FaHandshake className="text-3xl" />
          </motion.div>

          {/* Main Content */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            ¿Listo para ser parte del cambio?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed"
          >
            Únete a cientos de estudiantes que ya están transformando la educación en Colombia. 
            Tu voz importa, tu participación marca la diferencia.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center items-center gap-8 mb-8 flex-wrap"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">500+</div>
              <div className="text-sm text-white/80">Estudiantes activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">15+</div>
              <div className="text-sm text-white/80">Colegios aliados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">8</div>
              <div className="text-sm text-white/80">Años de lucha</div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="https://chat.whatsapp.com/HMRPmy1mlD88tbhSI1oZBD"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <FaWhatsapp className="text-xl group-hover:animate-bounce" />
              <span>Únete al WhatsApp</span>
              <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a
              href="/candidatos"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300"
            >
              <FaUsers className="text-xl group-hover:animate-bounce" />
              <span>Conoce los candidatos</span>
            </motion.a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex justify-center items-center gap-2 text-sm text-white/80"
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold">+</span>
              </div>
            </div>
            <span>Ya se unieron más de 500 estudiantes</span>
          </motion.div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </motion.section>
  );
}