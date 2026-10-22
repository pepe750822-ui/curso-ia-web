// Lee clases.json y arma la portada (index.html) o la página de una clase (clase.html).
// Para agregar un video NO hace falta tocar este archivo: solo pegar el link en clases.json.

// Convierte cualquier link de YouTube (watch, youtu.be, shorts, live) en el id del video.
function idDeYoutube(link) {
  if (!link) return "";
  const m = link.match(/(?:v=|youtu\.be\/|shorts\/|live\/|embed\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(link) ? link : "";
}

// Las clases vistas se recuerdan en el navegador de cada alumno.
function vistas() {
  try { return JSON.parse(localStorage.getItem("clases-vistas") || "[]"); } catch { return []; }
}
function marcarVista(id, valor) {
  const set = new Set(vistas());
  valor ? set.add(id) : set.delete(id);
  try { localStorage.setItem("clases-vistas", JSON.stringify([...set])); } catch {}
}

function esc(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function cargarDatos() {
  const r = await fetch("clases.json", { cache: "no-cache" });
  return r.json();
}

function todasLasClases(datos) {
  return datos.modulos.flatMap(m => m.clases.map(c => ({ ...c, modulo: m })));
}

function pintarPie(curso) {
  const pie = document.getElementById("pie");
  if (!pie) return;
  const partes = [`© ${new Date().getFullYear()} ${esc(curso.autor)}`];
  if (curso.youtube_canal) partes.push(`<a href="${esc(curso.youtube_canal)}" target="_blank" rel="noopener">Canal de YouTube</a>`);
  if (curso.contacto_whatsapp) partes.push(`<a href="https://wa.me/${esc(curso.contacto_whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`);
  pie.innerHTML = partes.join(" · ");
}

async function portada() {
  const datos = await cargarDatos();
  const { curso } = datos;
  document.getElementById("titulo").textContent = curso.titulo;
  document.getElementById("promesa").textContent = curso.promesa;
  document.title = curso.titulo;
  const ejemplo = document.getElementById("ejemplo");
  if (curso.proyecto_ejemplo) ejemplo.href = curso.proyecto_ejemplo; else ejemplo.remove();

  const vistasSet = new Set(vistas());
  const clases = todasLasClases(datos);
  const publicadas = clases.filter(c => idDeYoutube(c.youtube));
  const primera = publicadas.find(c => !vistasSet.has(c.id)) || publicadas[0] || clases[0];
  document.getElementById("empezar").href = `clase.html?id=${encodeURIComponent(primera.id)}`;

  const nVistas = clases.filter(c => vistasSet.has(c.id)).length;
  document.getElementById("progreso-texto").textContent =
    `${publicadas.length} de ${clases.length} clases publicadas · ${nVistas} vistas por vos`;
  document.getElementById("progreso-barra").style.width = `${Math.round((nVistas / clases.length) * 100)}%`;

  document.getElementById("modulos").innerHTML = datos.modulos.map(m => `
    <article class="modulo">
      <header>
        <span class="num">${m.numero}</span>
        <h2>${esc(m.titulo)}</h2>
        <p class="entregable">Al terminar: ${esc(m.entregable)}</p>
      </header>
      <ul class="clases">
        ${m.clases.map(c => {
          const hay = idDeYoutube(c.youtube);
          const vista = vistasSet.has(c.id);
          return `<li><a href="clase.html?id=${encodeURIComponent(c.id)}">
            <span class="marca ${vista ? "vista" : ""}">${vista ? "✓" : ""}</span>
            <span class="t">${esc(c.id)} · ${esc(c.titulo)}</span>
            ${hay ? (c.duracion ? `<span class="tag">${esc(c.duracion)}</span>` : `<span class="tag">Video</span>`)
                  : `<span class="tag pronto">Próximamente</span>`}
          </a></li>`;
        }).join("")}
      </ul>
    </article>`).join("");
  pintarPie(curso);
}

async function paginaClase() {
  const datos = await cargarDatos();
  const clases = todasLasClases(datos);
  const id = new URLSearchParams(location.search).get("id");
  const i = Math.max(0, clases.findIndex(c => c.id === id));
  const c = clases[i];
  document.title = `${c.titulo} · ${datos.curso.titulo}`;

  document.getElementById("migas").innerHTML =
    `<a href="./">Inicio</a> › Módulo ${c.modulo.numero}: ${esc(c.modulo.titulo)}`;
  document.getElementById("titulo").textContent = `${c.id} · ${c.titulo}`;

  const vid = idDeYoutube(c.youtube);
  document.getElementById("video").innerHTML = vid
    ? `<iframe src="https://www.youtube-nocookie.com/embed/${vid}?rel=0" title="${esc(c.titulo)}"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
         allowfullscreen></iframe>`
    : `<div class="vacio"><div><strong>Esta clase todavía no está grabada.</strong><br>Muy pronto la subimos.</div></div>`;

  document.getElementById("resumen").textContent = c.resumen || "";
  document.getElementById("pasos").innerHTML = (c.pasos || []).map(p => `<li>${esc(p)}</li>`).join("");

  const check = document.getElementById("vista");
  check.checked = vistas().includes(c.id);
  check.addEventListener("change", () => marcarVista(c.id, check.checked));

  const ant = clases[i - 1], sig = clases[i + 1];
  document.getElementById("nav-clases").innerHTML = `
    ${ant ? `<a class="btn ghost" href="clase.html?id=${encodeURIComponent(ant.id)}">← ${esc(ant.titulo)}</a>` : "<span></span>"}
    ${sig ? `<a class="btn" href="clase.html?id=${encodeURIComponent(sig.id)}">${esc(sig.titulo)} →</a>` : `<a class="btn" href="./">Volver al inicio</a>`}`;
  pintarPie(datos.curso);
}

(document.body.dataset.pagina === "clase" ? paginaClase : portada)().catch(err => {
  console.error(err);
  document.querySelector("main").insertAdjacentHTML("afterbegin",
    `<p class="wrap">No se pudieron cargar las clases. Revisá que clases.json no tenga errores (una coma de más o una comilla sin cerrar).</p>`);
});
