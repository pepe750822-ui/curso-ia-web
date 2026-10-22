# Curso: de la idea a tu web con IA

Web del curso. Cada clase tiene su video de YouTube, un resumen y los pasos que hace el alumno.

## Qué es cada archivo

| Archivo | Para qué sirve |
|---|---|
| `clases.json` | **El único que vas a tocar.** La lista de módulos y clases, con el link de YouTube de cada una. |
| `index.html` | La portada: título, botón Empezar y la lista de clases. |
| `clase.html` | La página de una clase: video, resumen, pasos, anterior/siguiente. |
| `app.js` | Lee `clases.json` y arma las dos páginas. |
| `styles.css` | Colores, letras y diseño. |

No hay base de datos ni claves: es una web estática. Vercel la publica tal cual.

## Cómo subir una clase nueva

1. Subí el video a YouTube (puede ser "Público" o "No listado").
2. Copiá el link del video (por ejemplo `https://youtu.be/abc123XYZ00`).
3. En GitHub, abrí `clases.json` y tocá el lápiz (Edit).
4. Buscá la clase y pegá el link entre las comillas de `"youtube": ""`.
   Si querés, completá `"duracion": "12 min"`.
5. Tocá **Commit changes**. En un minuto Vercel publica la web con el video nuevo.

Mientras una clase no tenga link, aparece como "Próximamente".

**Cuidado con el formato:** cada texto va entre comillas y entre una clase y otra hay una coma.
Si la web dice "No se pudieron cargar las clases", casi siempre es una coma o una comilla de más o de menos.

## Cómo agregar una clase que no está

Copiá un bloque `{ "id": ..., "pasos": [...] }` entero, pegalo después del último de ese módulo
(con una coma entre los dos) y cambiale el `id` (por ejemplo `"3-3"`), el título y el resto.

## Datos del curso

Arriba de todo en `clases.json` están el título, la promesa, tu nombre, el link al canal de YouTube
y tu WhatsApp (solo números, con código de país, ej. `5493511234567`). Los dos últimos aparecen en el pie de página si los completás.

## Probarla en tu compu

Abrir `index.html` con doble clic no alcanza (el navegador bloquea la lectura de `clases.json`).
Desde esta carpeta corré `npx serve` o `python3 -m http.server` y entrá a la dirección que te muestra.
