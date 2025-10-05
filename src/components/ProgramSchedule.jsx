import React, { useState, useEffect, useRef } from "react";
import {
  FaFileAlt, FaUtensils, FaChalkboardTeacher, FaUsers,
  FaTheaterMasks, FaMusic, FaSun, FaMoon, FaFlag
} from "react-icons/fa";

export default function ProgramSchedule() {
  const programa = [
    {
      dia: "Martes, 7 de octubre",
      actividades: [
        { id: "llegada", hora: "1:00 pm", texto: "Llegada de delegaciones", tipo: "general", icono: FaUsers },
        { id: "apertura-acreditacion", hora: "3:30 pm", texto: "Apertura y acreditación de asistentes", tipo: "panel", icono: FaChalkboardTeacher },
        { id: "festival-cultura", hora: "4:30 pm", texto: "Festival secundarista por la cultura, la democracia escolar y la paz", tipo: "cultural", icono: FaTheaterMasks },
        { id: "cena-7", hora: "7:00 pm", texto: "Cena", tipo: "comida", icono: FaUtensils },
        { id: "juntanzas", hora: "7:30 pm", texto: "Juntanzas deportivas Interregionales", tipo: "deporte", icono: FaUsers },
        { id: "descanso-930", hora: "9:30 pm", texto: "Descanso", tipo: "descanso", icono: FaMoon }
      ]
    },
    {
      dia: "Miércoles, 8 de octubre",
      actividades: [
        { id: "desayuno-8", hora: "7:30 am", texto: "Desayuno", tipo: "comida", icono: FaUtensils },
        { id: "acto-instalacion", hora: "8:00 am", texto: "Acto de Instalación, palabras de apertura, presentaciones videos regionales y artísticas", tipo: "panel", icono: FaChalkboardTeacher },
        { id: "panel-educacion", hora: "9:00 am", texto: "Panel: EDUCACIÓN DEL TAMAÑO DE NUESTRAS LUCHAS", tipo: "panel", icono: FaChalkboardTeacher },
        { id: "movimiento-al", hora: "11:00 am", texto: "Movimiento estudiantil secundarista en América Latina y exposición artística-cultural", tipo: "cultural", icono: FaTheaterMasks },
        { id: "almuerzo-1230", hora: "12:30 pm", texto: "Almuerzo", tipo: "comida", icono: FaUtensils },
        { id: "grupos-trabajo", hora: "1:30 pm", texto: "Grupos de trabajo simultáneo (Financiación, Plan Decenal, Articulación con organizaciones, Consejos estudiantiles, Educación rural)", tipo: "trabajo", icono: FaUsers },
        { id: "panel-central", hora: "5:00 pm", texto: "Panel central: Resistimos a la estandarización del sistema educativo", tipo: "panel", icono: FaChalkboardTeacher },
        { id: "trailer", hora: "6:30 pm", texto: "Presentación: Tráiler documental 'Una historia que renace'", tipo: "cultural", icono: FaTheaterMasks },
        { id: "cena-8", hora: "8:00 pm", texto: "Cena", tipo: "comida", icono: FaUtensils }
      ]
    },
    {
      dia: "Jueves, 9 de octubre",
      actividades: [
        { id: "desayuno-9", hora: "7:00 am", texto: "Desayuno", tipo: "comida", icono: FaUtensils },
        { id: "panel-paz", hora: "8:30 am", texto: "Panel central: Una generación que sigue exigiendo paz", tipo: "panel", icono: FaChalkboardTeacher },
        { id: "discusiones", hora: "10:30 am", texto: "Discusiones temáticas: Ley 115, educación superior, PAE, FFIE", tipo: "trabajo", icono: FaUsers },
        { id: "almuerzo-1230-2", hora: "12:30 pm", texto: "Almuerzo", tipo: "comida", icono: FaUtensils },
        { id: "mujer-gen", hora: "1:00 pm", texto: "Mujer, género, diversidad sexual, antimilitarismo, arte y comunicaciones", tipo: "cultural", icono: FaTheaterMasks },
        { id: "talleres-simult", hora: "3:30 - 4:30 pm", texto: "Talleres simultáneos: Stencil, Fotografía, Teatro, Escritura, Batuca y música", tipo: "cultural", icono: FaMusic },
        { id: "cena-7-2", hora: "7:00 pm", texto: "Cena", tipo: "comida", icono: FaUtensils },
        { id: "noche-cultural", hora: "8:00 pm", texto: "Noche Cultural: Voces en rebeldía", tipo: "cultural", icono: FaTheaterMasks },
        { id: "descanso-930-2", hora: "9:30 pm", texto: "Descanso", tipo: "descanso", icono: FaMoon }
      ]
    },
    {
      dia: "Viernes, 10 de octubre",
      actividades: [
        { id: "desayuno-10", hora: "7:00 am", texto: "Desayuno", tipo: "comida", icono: FaUtensils },
        { id: "plenaria-final", hora: "8:00 am", texto: "Plenaria: discusiones temáticas", tipo: "panel", icono: FaChalkboardTeacher },
        { id: "almuerzo-12", hora: "12:00 pm", texto: "Almuerzo", tipo: "comida", icono: FaUtensils },
        { id: "lectura-agenda", hora: "2:00 pm", texto: "Lectura de agenda de movilización", tipo: "panel", icono: FaFlag },
        { id: "declaracion-politica", hora: "2:30 pm", texto: "Declaración política", tipo: "panel", icono: FaFlag },
        { id: "acto-cierre", hora: "3:30 pm", texto: "Acto de Cierre", tipo: "panel", icono: FaFlag },
        { id: "salida", hora: "4:00 pm", texto: "Salida de delegaciones", tipo: "general", icono: FaSun }
      ]
    }
  ];

  const colorTipo = {
    comida: "bg-yellow-100 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-100",
    panel: "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-100",
    cultural: "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-100",
    trabajo: "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-100",
    descanso: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100",
    deporte: "bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-100",
    general: "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100"
  };

  const detailsMap = {
    "Acto de Instalación, palabras de apertura, presentaciones videos regionales y artísticas": {
      title: "Acto de instalación",
      subtitle: "Palabras de apertura — metodología y disposiciones",
      body: (
        <>
          <p className="mb-2">Palabras de apertura (15min): Juan Diego Ballen, coordinador nacional de la ANDES, introducirá objetivos, contexto político, metodología y logística.</p>
          <p className="mb-2">Presentación de videos regionales (10min): Videos de las delegaciones.</p>
          <p className="mb-2">Presentación artística (45min): Varias delegaciones mostrarán piezas artísticas representativas.</p>
        </>
      ),
      resources: [
        { title: "ANDES — página institucional", href: "https://andescolombia.org/", desc: "Información general sobre la organización y sus líneas de trabajo." }
      ]
    },
    "Panel: EDUCACIÓN DEL TAMAÑO DE NUESTRAS LUCHAS": {
      title: "Panel: Educación al tamaño de nuestras luchas",
      subtitle: "Panel (2 hrs)",
      body: (
        <>
          <p className="mb-2">Preguntas orientadoras:</p>
          <ul className="list-disc ml-5 mb-2">
            <li>¿Cuáles son los problemas más agudos en la educación básica y media en Colombia desde su lugar (FECODE, rectoría, ANDES)?</li>
            <li>¿Qué alternativas se proponen?</li>
            <li>¿Cómo articular sectores para defender la educación pública?</li>
          </ul>
          <p className="text-sm italic">Luego habrá ronda de preguntas del público (5 palabras por intervención).</p>
        </>
      ),
      resources: [
        { title: "Sistema General de Participaciones", href: "https://www.mineducacion.gov.co/1759/articles-360397_dia1a_00.pdf", desc: "Documento explicativo sobre el Sistema General de Participaciones." },
        { title: "Ley 1885 de 2018 (CMJ)", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=85540", desc: "Documento explicativo sobre el Sistema General de Participaciones." },
        { title: "FECODE (Wikipedia)", href: "https://es.wikipedia.org/wiki/Federaci%C3%B3n_Colombiana_de_Trabajadores_de_la_Educaci%C3%B3n", desc: "Conoce la historia de la Federación Colombiana De Trabajadores de la Educación." }
      ]
    },
    "Movimiento estudiantil secundarista en América Latina y exposición artística-cultural": {
      title: "Conversatorio: El movimiento estudiantil en América Latina",
      subtitle: "Con invitada: Amanda Harumy (1 hr)",
      body: (
        <>
          <p className="mb-2">Preguntas orientadoras:</p>
          <ul className="list-disc ml-5 mb-2">
            <li>¿Cuáles son los retos más importantes de los estudiantes en América Latina?</li>
            <li>¿Cuál es el papel de la OCLAE?</li>
            <li>¿Cómo enfrentar estos retos desde la educación secundaria?</li>
          </ul>
          <p className="text-sm italic">Ronda pública de 5 palabras.</p>
        </>
      ),
      resources: [
        { title: "OCLAE (Wikipedia)", href: "https://es.wikipedia.org/wiki/Organizaci%C3%B3n_Continental_Latinoamericana_y_Caribe%C3%B1a_de_Estudiantes", desc: "Resumen y enlaces a la organización continental." },
        { title: "Amanda Harumy (Invitada)", href: "hhttps://y20brasil.org/en/time-brasil/amanda/", desc: "Conoce a la secretaria ejecutiva de la OCLAE." },
      ]
    },
    "Grupos de trabajo simultáneo (Financiación, Plan Decenal, Articulación con organizaciones, Consejos estudiantiles, Educación rural)": {
      title: "Grupos de trabajo en simultáneo",
      subtitle: "Exposición magistral y talleres (3 hrs)",
      body: (
        <>
          <ul className="list-disc ml-5 mb-2">
            <li>Exposición sobre el Sistema General de Participaciones y financiación de la educación (Ilich).</li>
                        <ul className="list-disc ml-5 mb-2">
            <li>¿Cómo financiamos la educación en Colombia?</li>
<ul className="list-disc ml-5 mb-2">
<li>En primer lugar, el profesor y director para el desarrollo de la educación en las
regiones, dirigirá una exposición sobre el “sistema general de participaciones” lo
que es y el momento por el que atraviesa la discusión financiera de la educación
básica y media.</li>
<li>En segundo lugar, se realizarán grupos de trabajo entre 12 a 30 estudiantes para
desarrollar una actividad sobre la ubicación de los problemas fundamentales y
necesidades cercanas de las y los estudiantes.</li>
</ul>
            </ul>
            <li>Grupos de trabajo (12–30 estudiantes) para ubicar problemas fundamentales y necesidades estudiantiles.</li>
            <li>Plan decenal de educación</li>
            <ul className="list-disc ml-5 mb-2">
            <li>¿Qué vamos a hacer con la educación en 10 años?
Esta mesa de trabajo tiene como objetivo desarrollar un espacio de construcción y aporte
de las y los estudiantes al plan decenal de educación 2026-2036 en perspectiva de
plasmar las consignas y banderas que hemos desarrollado como organización y
movimiento estudiantil.
El ministerio de educación explicara en que consiste un plan decenal, cuales son sus
objetivos y como se ha determinado su construcción desde el gobierno, posterior a ello, se
abrirá un espacio de diálogo y construcción por ejes temáticos que puedan concluir en
documentos para aportar a esta construcción del plan decenal.</li>
            </ul>
            <li>Conversatorio sobre articulación con movimientos sociales y construcción de comunidad estudiantil.</li>
            <li>Taller: Democracia para la transformación — análisis por escenarios (CMJ, consejo estudiantil, personería) y exposición creativa (10 min por grupo).</li>
          </ul>
        </>
      ),
      resources: [
        { title: "Plan Decenal de Educación", href: "https://www.mineducacion.gov.co/portal/micrositios-institucionales/Plan-Decenal-de-Educacion-2016-2026/", desc: "Información oficial sobre el plan decenal 2016." },
        { title: "Sistema General de Participaciones", href: "https://minvivienda.gov.co/sites/default/files/documentos/abc_sgp.pdf", desc: "Guía sencilla sobre cómo funciona el SGP (contexto financiero local)." }
      ]
    },
    "Panel central: Resistimos a la estandarización del sistema educativo": {
      title: "Panel central: Resistimos la estandarización educativa",
      subtitle: "PCN, Jóvenes CRIC, MJ Álvaro Uque, Fensuagro",
      body: (
        <>
          <p className="mb-2">En Colombia coexisten diferentes visiones de la educación y como garantizarla de acuerdo con los
territorios, culturas y diferentes factores diferenciales propios de un país multicultural. Por ello, desde
la ANDES , queremos enriquecer nuestra visión sobre los modelos educativos y además compartir
nuestras experiencias de trabajo en el marco de la lucha por un nuevo modelo de educación que no
estandarice, sino que pluralice. Preguntas orientadoras incluyen:</p>
          <ul className="list-disc ml-5 mb-2">
            <li>¿Cómo se entiende educación desde cultura y territorio?</li>
            <li>¿Qué elementos centrales debe tener una propuesta autónoma y crítica?</li>
            <li>¿En qué consiste SEIP, la etnoeducación y otras alternativas?</li>
          </ul>
          <p className="text-sm italic">Ronda pública 5 palabras.</p>
        </>
      ),
      resources: [
        { title: "SEIP / Etnoeducación — referencias", href: "https://www.mineducacion.gov.co", desc: "Consulta documentos y programas en el MinEducación relacionados a educación diferencial y territorial." },
        { title: "Consejo Regional Indígena del Cauca (CRIC)", href: "https://es.wikipedia.org/wiki/Consejo_Regional_Ind%C3%ADgena_del_Cauca", desc: "Conoce a profundidad el CRIC y su historia." },
        { title: "Proceso de Comunidades Negras (PCN)", href: "https://renacientes.net/", desc: "Conoce a profundidad el PCN y su historia." },
        { title: "La calidad educativa, un análisis desde la violencia en Colombia", href: "https://www.revistaespacios.com/a20v41n18/20411827.html", desc: "Análisis sobre la estandarización y su relación con la desigualdad socioeconómica y ruralidad." },
      ]
    },
    "Presentación: Tráiler documental 'Una historia que renace'": {
      title: "Presentación: Tráiler documental",
      subtitle: "'Una historia que renace' — memoria estudiantil",
      body: (
        <>
          <p className="mb-2">Un viaje por los momentos mas importantes del movimiento secundarista en Colombia,
sus luchas, sus conquistas y nuestro papel como ANDES en ellas.
En un primer momento, por medio de un recorrido guiado las personas asistentes al
espacio podrán reconocer los hitos y logros de las movilizaciones estudiantiles, incluida la
historia de la ANDES.
En segundo lugar, se presentará el tráiler del documental “una historia que renace” cuya
construcción está a cargo de la ANDES bajo la idea de aportar a la construcción de

memoria estudiantil en Colombia y la recuperación de nuestra historia. Además de otros
cortometrajes.</p>
        </>
      ),
      resources: [
        { title: "ANDES", href: "https://andescolombia.org/", desc: "Posibles materiales audiovisuales y producciones propias." }
      ]
    },
    "Panel central: Una generación que sigue exigiendo paz": {
      title: "Panel: Una generación que sigue exigiendo paz",
      subtitle: "Reflexión sobre militarización y víctimas jóvenes",
      body: (
        <>
          <p className="mb-2">En las guerras, uno de los sectores más afectados son las y los jóvenes, como victimas o incluso en
algunos escenarios lamentables como victimarios, y es por esto que como organización hemos estado
siempre del lado de la paz, alzando la voz por aquellos y aquellas que no pueden, denunciando el
cierre de escuelas por la guerra interna, el reclutamiento forzado de menores, entre otras
consecuencias de la cultura de violencia en la que vivimos.
Por lo anterior, y teniendo en cuenta la grave situación que atraviesa nuestro país y desde luego las
escuelas como una manifestación de la sociedad, se hace necesario que las y los estudiantes de
secundaria creemos alternativas que pretendan acabar esta cultura de la violencia desde las escuelas
con proyección a futuro. Preguntas orientadoras:</p>
          <ul className="list-disc ml-5 mb-2">
            <li>¿En que consiste el problema de la militarización de la vida juvenil?</li>
            <li>¿Cuáles son las alternativas para este problema estructural de la violencia?</li>
            <li>¿Qué papel pueden jugar las escuelas y/o la comunidad educativa?</li>
          </ul>
          <p className="text-sm italic">Las y los asistentes tendrán una ronda de 5 palabras para generar preguntas o comentarios al tema central.</p>
        </>
      ),
      resources: [
        { title: "UNICEF Colombia — informe sobre reclutamiento y uso de niños", href: "https://www.unicef.org/colombia/comunicados-prensa/informe-de-reclutamiento-y-utilizacion-de-ninos-en-conflicto", desc: "Informe y contexto sobre reclutamiento infantil en Colombia." },
        { title: "Cobertura informativa reciente (contexto)", href: "https://elpais.com/america-colombia/2025-05-18/de-panfletos-amenazantes-a-mentiras-en-tiktok-el-reclutamiento-infantil-se-agrava-en-colombia.html", desc: "Reportaje sobre cómo ha evolucionado el reclutamiento (uso de redes sociales)." },
        { title: "Objeción de conciencia (Temblores ONG)", href: "https://www.temblores.org/objecion-conciencia-servicio-militar", desc: "Sobre el Servicio Militar Obligatorio, cifras y la objeción de conciencia." }
      ]
    },
    "Discusiones temáticas: Ley 115, educación superior, PAE, FFIE": {
      title: "Discusiones temáticas",
      subtitle: "ANDES, ACEU, Min educación",
      body: (
        <>
          <p className="mb-2">Acceso a la educación superior ¿ICFES?:</p>
          <ul className="list-disc ml-5 mb-2">
            <li>En la lucha por asegurar la educación como un derecho fundamental y lograr su garantía
en todos los niveles por parte del Estado colombiano, se hace necesario plantear una
postura sobre las “pruebas saber” pues a hoy son un obstáculo central para el tránsito de
la educación media a la educación superior.</li>
          </ul>
          <p className="mb-2">Discusiones temáticas:</p>
          <ul className="list-disc ml-5 mb-2">
            <li>Obstáculos de las pruebas estandarizadas (Saber/ICFES) para el acceso a la universidad.</li>
            <li>Estrategias del Ministerio para la universalización del acceso a educación superior.</li>
            <li>PAE, FFIE y políticas públicas.</li>
          </ul>
        </>
      ),
      resources: [
        { title: "Ley 115 de 1994", href: "https://www.mineducacion.gov.co/1621/articles-85906_archivo_pdf.pdf", desc: "Documento oficial de la Ley 115" },
        { title: "ICFES (sitio web)", href: "https://www.icfes.gov.co/", desc: "Información de citaciones, resultados y guías." },
        { title: "Programa de Alimentación Escolar (PAE)", href: "https://www.mineducacion.gov.co/portal/micrositios-preescolar-basica-y-media/Programa-de-Alimentacion-Escolar-PAE/", desc: "Normativa y detalles del programa." },
        { title: "Fondo de Financiamiento de la Infraestructura Educativa (FFIE)", href: "https://educacionrindecuentas.mineducacion.gov.co/pilar-1-educacion-de-calidad/gestion-del-fondo-de-financiamiento-de-infraestructura/", desc: "Cómo se financia la Educación." },
      ]
    },
    "Mujer, género, diversidad sexual, antimilitarismo, arte y comunicaciones": {
      title: "Mesa: Mujer, género y diversidad en la escuela",
      subtitle: "PAE; perspectivas y propuestas",
      body: (
        <>
          <p className="mb-2">Arte y cultura en las escuelas.</p>
          <p className="mb-2">Por años, las expresiones artísticas y culturales han sido marginadas de los colegios
públicos, y con contadas excepciones de algunos colegios cuyo énfasis es “artístico” y
académico, la posibilidad que tienen los jóvenes y estudiantes cuyas habilidades y
aptitudes no corresponden a la dinámica de competencias es casi nula. La escuela
“oficial” en Colombia no permite a alas y los jóvenes construir un proyecto de vida que
tenga como principio la autonomía académica y profesional.</p>
                <ul className="list-disc ml-5 mb-2">
          <li>Se presentarán algunos actos culturales y sus organizaciones conversaran sobre
como han interiorizado en su idea de educación el papel del arte y la cultura.</li>
        </ul>
        
        </>
      ),
      resources: [
        { title: "Programa de Alimentación Escolar (PAE)", href: "https://www.mineducacion.gov.co/portal/micrositios-preescolar-basica-y-media/Programa-de-Alimentacion-Escolar-PAE/", desc: "Guía y normativa del Programa de Alimentación Escolar." },
        { title: "UNESCO - alfabetización mediática y recursos", href: "https://www.unesco.org/en/media-information-literacy", desc: "Herramientas para formación en medios y combate a la desinformación." }
      ]
    },
    "Talleres simultáneos: Stencil, Fotografía, Teatro, Escritura, Batuca y música": {
      title: "Talleres simultáneos",
      subtitle: "Talleres prácticos (2:30 hrs total en conjunto con otras actividades)",
      body: (
        <>
          <p className="mb-2">Descripción breve de cada taller:</p>
          <ul className="list-disc ml-5 mb-2">
            <li><b>Stencil:</b> Plantillas para iconografías.</li>
            <li><b>Grafiti / Estampado:</b> Intervención colectiva y estampado de banderas/pañuelos.</li>
            <li><b>Fotografía móvil:</b> Salida para documentar el entorno y crear fotoreportajes.</li>
            <li><b>Teatro y expresión corporal:</b> Corporizar conceptos políticos mediante imágenes.</li>
            <li><b>Expresión oral y discursiva:</b> Preparación de discursos breves y contundentes.</li>
            <li><b>Fanzines y collage:</b> Producción de la primera edición del "Fanzine del Congreso".</li>
            <li><b>Escritura creativa:</b> Transformar estadísticas y debates en micro-relatos/poemas.</li>
            <li><b>Batucada y música:</b> Ritmos grupales para movilización y energía colectiva.</li>
          </ul>
        </>
      ),
      resources: [
        { title: "Tutorial Stencil — Instructables (paso a paso)", href: "https://www.instructables.com/Creating-Complex-Spraypaint-Stencils-by-Hand/", desc: "Guía práctica para cortar y usar plantillas." }
      ]
    },
    "Plenaria: discusiones temáticas": {
      title: "Plenaria final",
      subtitle: "Lectura de conclusiones y síntesis colectiva (4 hrs)",
      body: (
        <>
          <p className="mb-2">Posterior a todas las mesas de discusión, talleres y debates simultáneos, reunidos y
reunidas en plenaria, compartiremos las conclusiones de cada uno de los espacios, para
que puedan realizarse algunos aportes finales y poder construir un documento que
sintetice nuestra propuesta y sirva como insumo para el periodo venidero.</p>
        <ul className="list-disc ml-5 mb-2">
          <li>Cada mesa tendrá la posibilidad de leer las conclusiones y se dará una ronde de
intervenciones de 5 palabras, para generar aportes, adendas o correcciones que
se precisen.</li>
        </ul>
        </>
      ),
      resources: []
    },
    "Lectura de agenda de movilización": {
      title: "Agenda de movilización",
      subtitle: "Lectura y aprobación (30 min)",
      body: (
        <>
          <p className="mb-2">Se presentará la agenda de movilización construida para su aprobación y puesta en marcha por las estructuras regionales de la ANDES.</p>
        </>
      ),
      resources: []
    },
    "Declaración política": {
      title: "Declaración política",
      subtitle: "Lectura pública por Juan Diego Ballen (30 min)",
      body: (
        <>
          <p className="mb-2">Lectura de la declaración política del congreso.</p>
        </>
      ),
      resources: []
    },
    "Acto de Cierre": {
      title: "Acto de cierre",
      subtitle: "Cierre formal del CONES",
      body: (
        <>
          <p className="mb-2">Cierre y despedida de las delegaciones.</p>
        </>
      ),
      resources: []
    },
    default: (act) => ({
      title: act.texto,
      subtitle: act.hora,
      body: (<p className="mb-2">Actividad programada: {act.texto}. Más detalles disponibles en la coordinación.</p>),
      resources: []
    })
  };

  // estado de modal con animación controlada
  const [open, setOpen] = useState(false);        // si el modal está "mount-eado"
  const [isShown, setIsShown] = useState(false);  // controla clases de entrada/salida (anim)
  const [active, setActive] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isShown && dialogRef.current) {
      setTimeout(() => dialogRef.current?.focus(), 120);
    }
  }, [isShown]);

  function openModal(act, dia) {
    const lookup = detailsMap[act.texto] || detailsMap.default(act);
    setActive({ ...act, dia, lookup });
    setOpen(true);
    requestAnimationFrame(() => setIsShown(true));
  }

  function handleClose() {
    setIsShown(false);
    setTimeout(() => {
      setOpen(false);
      setActive(null);
    }, 320);
  }

  return (
    <section className="max-w-6xl mx-auto my-8 px-2 sm:px-4">
      <div className="space-y-12">
        {programa.map((diaObj) => (
          <div key={diaObj.dia}>
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 dark:text-white">{diaObj.dia}</h3>
            {/* GRID: 1 columna en móvil, 2 columnas en tablet/pc (md y superiores) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diaObj.actividades.map((act) => {
                const Icon = act.icono || FaFileAlt;
                return (
                  <button
                    key={act.id}
                    onClick={() => openModal(act, diaObj.dia)}
                    className={`text-left p-4 rounded-xl border ${colorTipo[act.tipo] || colorTipo.general} 
                      hover:shadow-lg hover:-translate-y-1 transform transition 
                      focus:outline-none focus:ring-0 focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-700`}
                    aria-haspopup="dialog"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl mt-1"><Icon /></div>
                      <div className="flex-1">
                        <p className="font-semibold">{act.hora}</p>
                        <p className="text-sm leading-5 break-words max-h-14 overflow-hidden" title={act.texto}>
                          {act.texto}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: solo montado cuando open === true */}
      {open && active && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          {/* Overlay sin blur (mejor rendimiento) */}
          <div
            onClick={handleClose}
            aria-hidden="true"
            className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${isShown ? "opacity-100" : "opacity-0"}`}
            style={{ willChange: "opacity" }}
          />

          {/* Modal panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            ref={dialogRef}
            className={
              `z-50 w-full max-w-3xl mx-auto
               bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100
               shadow-2xl p-5 sm:p-8
               transform transition-all duration-300
               rounded-t-2xl md:rounded-2xl md:my-8
               max-h-[90vh] overflow-auto
              ` +
              (isShown
                ? " translate-y-0 opacity-100 md:scale-100 md:opacity-100"
                : " translate-y-full opacity-0 md:scale-95 md:opacity-0")
            }
            style={{ bottom: 0 }}
          >
            <header className="flex items-start justify-between gap-4">
              <div>
                <h4 id="modal-title" className="text-xl font-bold">{active.lookup.title || active.texto}</h4>
                <p className="text-sm opacity-80">{active.dia} • {active.hora}</p>
                {active.lookup.subtitle && <p className="mt-2 text-sm opacity-80">{active.lookup.subtitle}</p>}
              </div>

              <div className="ml-4 flex items-start gap-2">
                <button
                  onClick={handleClose}
                  className="inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </header>

            <div className="mt-4 prose dark:prose-invert max-w-none">
              {active.lookup.body}

              {/* Recursos (si existen) */}
              {active.lookup.resources && active.lookup.resources.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Recursos</h5>
                  <ul className="list-disc ml-5 space-y-1">
                    {active.lookup.resources.map((r) => (
                      <li key={r.href}>
                        <a href={r.href} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-blue-600">
                          {r.title}
                        </a>
                        {r.desc ? <span className="text-sm opacity-80"> — {r.desc}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <footer className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
