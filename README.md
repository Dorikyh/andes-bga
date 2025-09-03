
Proyecto convertido automáticamente de Remix -> Astro (conservando componentes React).

Qué hice:
- Copié public/ a public/
- Copié app/components/ a src/components/ (sin modificar código — preservé estilos y clases)
- Copié app/tailwind.css a src/styles.css
- Generé archivos de páginas en src/pages/ por cada ruta de Remix como placeholders que intentan usar React components como islands.
- Añadí /src/original-remix/ con las rutas originales para referencia y migración manual de loaders/actions.

Notas importantes:
- Las rutas que dependen de 'loader' y 'action' de Remix necesitan migración manual (fetch en front-end o uso de endpoints). Revisa src/original-remix/* para ver el código original.
- Para correr: npm install && npm run dev (instala dependencias de Astro, React, Tailwind).
- Algunos componentes usan APIs de Remix (useTransition, Link, Form, etc.). Tendrás que reemplazar Link por <a> o usar react-router if you want SPA routing.
