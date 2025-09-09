import { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaMapMarkerAlt, FaCalendarAlt, FaQuoteLeft, FaUsers, FaGraduationCap, FaHeart, FaLightbulb } from "react-icons/fa";

export default function Candidatos() {
  const [activeCity, setActiveCity] = useState("Bucaramanga");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const candidatos = [
    {
      ciudad: "Bucaramanga",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      personas: [
        {
          id: 1,
          nombre: "Nikol Colmenares",
          edad: 19,
          descripcion: "Estudiante de Derecho, apasionada por el trabajo alienante",
          descripcionLarga: "Líder estudiantil comprometida con la defensa de los derechos juveniles. Ha participado en múltiples iniciativas de participación democrática y es reconocida por su trabajo en la promoción de espacios seguros para estudiantes.",
          img: "/candidatos/nikotinerr.jpg",
          instagram: "nikotinerr",
          especialidad: "Derechos Estudiantiles",
          logros: ["Representante estudiantil 2023", "Organizadora de 3 foros juveniles", "Certificada en liderazgo social"],
          propuestas: ["Crear espacios de diálogo estudiantil", "Implementar programas de apoyo psicológico", "Fortalecer la representación femenina"],
          quote: "La juventud no es el futuro, somos el presente que construye el mañana."
        },
        {
          id: 2,
          nombre: "Jhexy Toncón",
          edad: 18,
          descripcion: "Líderesa comunitaria y promotora del mamertismo.",
          descripcionLarga: "Activista social con amplia experiencia en trabajo comunitario. Su enfoque se centra en la construcción de una sociedad más justa y equitativa, especialmente para los sectores más vulnerables.",
          img: "/candidatos/jhexy.jpg",
          instagram: "jessxy.tl",
          especialidad: "Trabajo Comunitario",
          logros: ["Líder de 2 proyectos sociales", "Voluntaria en organizaciones locales", "Promotora de la participación juvenil"],
          propuestas: ["Ampliar programas sociales juveniles", "Crear redes de apoyo comunitario", "Impulsar la educación popular"],
          quote: "Solo en comunidad podemos transformar nuestra realidad y construir un futuro más justo."
        },
        {
          id: 3,
          nombre: "Fabián Márquez",
          edad: 17,
          descripcion: "Programador revolucionario, y muy lindo.",
          descripcionLarga: "Joven programador con visión de futuro, comprometido con el uso de la tecnología para el cambio social. Combina sus habilidades técnicas con un profundo sentido de la justicia social.",
          img: "/candidatos/fabian.jpg",
          instagram: "dorikyh",
          especialidad: "Tecnología Social",
          logros: ["Desarrollador de 5 proyectos web", "Mentor en programación juvenil", "Organizador de hackathons sociales"],
          propuestas: ["Democratizar el acceso a la tecnología", "Crear plataformas digitales participativas", "Formar nuevos programadores sociales"],
          quote: "El código puede cambiar el mundo, pero solo si lo escribimos juntos y para todos."
        },
      ],
    },
    {
      ciudad: "Floridablanca",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      personas: [
        {
          id: 4,
          nombre: "Luz Mariana",
          edad: 18,
          descripcion: "Joven líder ambiental comprometida con el cuidado del agua.",
          descripcionLarga: "Activista ambiental con enfoque especial en la conservación del recurso hídrico. Ha liderado campañas de concientización y proyectos de sostenibilidad en su comunidad.",
          img: "/candidatos/luz.webp",
          instagram: "marialu8295",
          especialidad: "Medio Ambiente",
          logros: ["Líder de campaña 'Agua para todos'", "Organizadora de 4 jornadas ecológicas", "Reconocimiento ambiental juvenil 2023"],
          propuestas: ["Crear comités ambientales estudiantiles", "Implementar programas de reciclaje", "Proteger fuentes hídricas locales"],
          quote: "Cuidar nuestro planeta no es una opción, es nuestra responsabilidad generacional."
        },
        {
          id: 5,
          nombre: "Karen Dayanna",
          edad: 22,
          descripcion: "Activista feminista y promotora de la cultura juvenil.",
          descripcionLarga: "Defensora incansable de los derechos de las mujeres y promotora de la diversidad cultural. Su trabajo se enfoca en crear espacios inclusivos y libres de violencia.",
          img: "/candidatos/karen.webp",
          instagram: "karencita",
          especialidad: "Derechos de Género",
          logros: ["Fundadora de colectivo feminista", "Organizadora de festival cultural", "Capacitada en derechos humanos"],
          propuestas: ["Crear espacios libres de violencia", "Impulsar la cultura juvenil", "Fortalecer la participación femenina"],
          quote: "Una sociedad justa es aquella donde todas las voces son escuchadas y valoradas."
        },
        {
          id: 6,
          nombre: "Juan Sebastián",
          edad: 19,
          descripcion: "Estudiante de ingeniería apasionado por la ciencia y el deporte.",
          descripcionLarga: "Estudiante destacado que combina su pasión por la ingeniería con el deporte como herramienta de transformación social. Promueve el uso de la ciencia para resolver problemas comunitarios.",
          img: "/candidatos/pelao.webp",
          instagram: "juancito",
          especialidad: "Ciencia y Deporte",
          logros: ["Campeón intercolegiado 2023", "Inventor de 2 proyectos científicos", "Entrenador voluntario juvenil"],
          propuestas: ["Crear laboratorios científicos comunitarios", "Impulsar el deporte popular", "Fomentar la innovación juvenil"],
          quote: "La ciencia y el deporte son herramientas poderosas para construir una sociedad mejor."
        },
      ],
    },
  ];

  const ciudades = candidatos.map(grupo => grupo.ciudad);
  const candidatosActivos = candidatos.find(grupo => grupo.ciudad === activeCity);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleCandidateClick = (candidato) => {
    setSelectedCandidate(candidato);
  };

  const closeModal = () => {
    setSelectedCandidate(null);
  };

  return (
    <div className="max-w-7xl mx-auto pt-20 px-6">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-purple-600 bg-clip-text text-transparent">
          Nuestros Candidatos
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Conoce a las personas que representarán tu voz y lucharán por tus derechos en 
          <span className="font-semibold text-primary"> Bucaramanga</span> y 
          <span className="font-semibold text-secondary"> Floridablanca</span>
        </p>
        
        {/* Stats */}
        <div className="flex justify-center items-center gap-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{candidatos.reduce((acc, city) => acc + city.personas.length, 0)}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Candidatos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">2</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Ciudades</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">100%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Comprometidos</div>
          </div>
        </div>
      </motion.div>

      {/* City Selector */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mb-12"
      >
        <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          {ciudades.map((ciudad) => (
            <button
              key={ciudad}
              onClick={() => setActiveCity(ciudad)}
              className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                activeCity === ciudad
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md transform scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <FaMapMarkerAlt className="inline mr-2" />
              {ciudad}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Candidates Grid */}
      <motion.div
        key={activeCity}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
      >
        {candidatosActivos?.personas.map((candidato) => (
          <motion.div
            key={candidato.id}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => handleCandidateClick(candidato)}
          >
            <div className={`${candidatosActivos.bgColor} rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col relative overflow-hidden transition-all duration-300 group-hover:shadow-2xl`}>
              {/* Background Gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${candidatosActivos.color}`} />
              
              {/* Specialty Badge */}
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-md">
                {candidato.especialidad}
              </div>

              <div className="relative z-10 flex flex-col items-center text-center h-full">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${candidatosActivos.color} rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                  <img
                    src={candidato.img}
                    alt={candidato.nombre}
                    loading="lazy"
                    className="relative w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-600 shadow-xl group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Age Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-lg">
                    {candidato.edad}
                  </div>
                </div>

                {/* Name and Description */}
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                  {candidato.nombre}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow leading-relaxed">
                  {candidato.descripcion}
                </p>

                {/* Quote Preview */}
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-4 relative">
                  <FaQuoteLeft className="text-primary opacity-30 absolute top-1 left-1" />
                  <p className="text-sm italic text-gray-700 dark:text-gray-300 pl-4">
                    {candidato.quote.substring(0, 60)}...
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto">
                  <a
                    href={`https://instagram.com/${candidato.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <FaInstagram />
                    <span className="hidden sm:inline">Seguir</span>
                  </a>
                  
                  <button className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300">
                    <FaUsers />
                    Más
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      {selectedCandidate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Header */}
              <div className={`bg-gradient-to-r ${candidatosActivos.color} p-8 text-white`}>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  ×
                </button>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <img
                    src={selectedCandidate.img}
                    alt={selectedCandidate.nombre}
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl"
                  />
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-bold mb-2">{selectedCandidate.nombre}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-white/90">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {selectedCandidate.edad} años
                      </span>
                      <span className="flex items-center gap-1">
                        <FaGraduationCap />
                        {selectedCandidate.especialidad}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Quote */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 relative">
                  <FaQuoteLeft className="text-primary text-3xl opacity-30 absolute top-4 left-4" />
                  <p className="text-lg italic text-center pt-8 text-gray-700 dark:text-gray-300">
                    "{selectedCandidate.quote}"
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <FaHeart className="text-red-500" />
                    Sobre {selectedCandidate.nombre.split(' ')[0]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedCandidate.descripcionLarga}
                  </p>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <FaGraduationCap className="text-blue-500" />
                    Logros destacados
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCandidate.logros.map((logro, index) => (
                      <li key={index} className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-gray-700 dark:text-gray-300">{logro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Proposals */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                    <FaLightbulb className="text-yellow-500" />
                    Propuestas principales
                  </h3>
                  <ul className="space-y-3">
                    {selectedCandidate.propuestas.map((propuesta, index) => (
                      <li key={index} className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{propuesta}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social Link */}
                <div className="text-center">
                  <a
                    href={`https://instagram.com/${selectedCandidate.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <FaInstagram className="text-xl" />
                    Seguir en Instagram
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center bg-gradient-to-r from-primary via-secondary to-purple-600 rounded-3xl p-12 text-white mb-16"
      >
        <h2 className="text-4xl font-bold mb-4">¿Listo para conocer más?</h2>
        <p className="text-xl mb-8 opacity-90">
          Únete a nosotros y sé parte del cambio que nuestra juventud necesita
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://chat.whatsapp.com/HMRPmy1mlD88tbhSI1oZBD"
            className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
          >
            Únete al WhatsApp
          </a>
          <a
            href="/propuestas"
            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-primary transition-colors transform hover:scale-105"
          >
            Ver Propuestas
          </a>
        </div>
      </motion.div>
    </div>
  );
}