import { FaInstagram } from "react-icons/fa";

export default function Candidatos() {
  const candidatos = [
    {
      ciudad: "Bucaramanga",
      personas: [
        {
          nombre: "Nikol Colmenares",
          edad: 19,
          descripcion: "Estudiante de Derecho, apasionada por el trabajo alienante",
          img: "/candidatos/nikotinerr.jpg",
          instagram: "nikotinerr",
        },
        {
          nombre: "Jhexy Toncón",
          edad: 18,
          descripcion: "Líderesa comunitaria y promotora del mamertismo.",
          img: "/candidatos/jhexy.jpg",
          instagram: "jessxy.tl",
        },
        {
          nombre: "Fabián Márquez",
          edad: 17,
          descripcion: "Programador revolucionario, y muy lindo.",
          img: "/candidatos/fabian.jpg",
          instagram: "dorikyh",
        },
      ],
    },
    {
      ciudad: "Floridablanca",
      personas: [
        {
          nombre: "Luz Mariana",
          edad: 18,
          descripcion: "Joven líder ambiental comprometida con el cuidado del agua.",
          img: "/candidatos/luz.webp",
          instagram: "marialu8295",
        },
        {
          nombre: "Karen Dayanna",
          edad: 22,
          descripcion: "Activista feminista y promotora de la cultura juvenil.",
          img: "/candidatos/karen.webp",
          instagram: "karencita",
        },
        {
          nombre: "Juan Sebastián",
          edad: 19,
          descripcion: "Estudiante de ingeniería apasionado por la ciencia y el deporte.",
          img: "/candidatos/pelao.webp",
          instagram: "juancito",
        },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-12">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 dark:text-white">
        Candidatos
      </h1>

      <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
        Conoce a nuestras y nuestros representantes juveniles en Bucaramanga y Floridablanca.
      </p>

      <div className="space-y-16">
        {candidatos.map((grupo, idx) => (
          <section key={idx}>
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-center dark:text-white">
              {grupo.ciudad}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {grupo.personas.map((persona, i) => (
                <div key={i} className="w-full">
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-xl transition p-4 h-full">
                    <img
                      src={persona.img}
                      alt={persona.nombre}
                      loading="lazy"
                      className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-primary/50"
                    />
                    <h3 className="text-xl font-bold mb-1 dark:text-white">{persona.nombre}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{persona.edad} años</p>
                    <p className="text-sm text-gray-700 dark:text-gray-400 mb-3 px-2">{persona.descripcion}</p>
                    <a
                      href={`https://instagram.com/${persona.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 font-medium hover:underline text-sm"
                    >
                      <FaInstagram className="w-4 h-4" />
                      {persona.instagram}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
