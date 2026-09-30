const STORAGE_KEYS = {
  NOTICIAS: 'notiflash_noticias',
  FAVORITOS: 'notiflash_favoritos',
  VERSION: 'notiflash_version'
};

// Súbelo (por ejemplo a '3') cuando cambies noticias.json: así los navegadores que ya tenían
// noticias guardadas vuelven a leer el archivo y ven los cambios.
const VERSION_DATOS = '2';

const NOTICIAS_DEFAULT = [
  {
    "id": 1,
    "titulo": "Crece el uso de la robótica en las aulas de primaria",
    "categoria": "Educación",
    "imagen": "img/noticia1.svg",
    "resumen": "Cada vez más colegios incorporan kits de robótica para que los niños aprendan a programar jugando.",
    "contenido": "Cada vez más colegios incorporan kits de robótica y programación en sus clases de primaria, con el fin de que los estudiantes aprendan matemáticas y lógica de una forma práctica y divertida.\nSegún los docentes, los niños se motivan más cuando pueden armar y programar sus propios robots, y mejoran su capacidad para trabajar en equipo y resolver problemas.\nLos expertos recomiendan que estas actividades vayan acompañadas de capacitación para los profesores y de guías sencillas, de modo que la tecnología apoye el aprendizaje y no lo reemplace.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-12",
    "destacada": true
  },
  {
    "id": 2,
    "titulo": "La inteligencia artificial llega a las herramientas de estudio de los universitarios",
    "categoria": "Tecnología",
    "imagen": "img/noticia2.svg",
    "resumen": "Resúmenes, traducciones y tutorías personalizadas: así usan los estudiantes la IA en su día a día.",
    "contenido": "Los estudiantes universitarios están usando asistentes de inteligencia artificial para resumir textos, practicar idiomas y aclarar dudas fuera del horario de clase.\nLos profesores coinciden en que la herramienta es útil cuando se emplea para comprender mejor un tema, pero advierten que no debe usarse para copiar trabajos ni para reemplazar el estudio propio.\nVarias instituciones ya trabajan en guías de uso responsable que piden citar la ayuda recibida y verificar siempre la información con fuentes confiables.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-11",
    "destacada": true
  },
  {
    "id": 3,
    "titulo": "Los pueblos cafeteros ganan terreno entre los viajeros en temporada alta",
    "categoria": "Turismo",
    "imagen": "img/noticia3.svg",
    "resumen": "Fincas, caminatas y gastronomía local se consolidan como una de las opciones favoritas para el descanso.",
    "contenido": "Los pueblos cafeteros se consolidan como uno de los destinos preferidos para el turismo nacional, gracias a su paisaje de montaña, su clima agradable y su cocina tradicional.\nLos visitantes destacan las visitas guiadas a las fincas, donde pueden conocer el proceso del café desde la siembra hasta la taza, además de las caminatas y los miradores.\nLos comerciantes de la zona esperan una buena ocupación en los próximos fines de semana y recomiendan reservar el alojamiento con anticipación.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-10",
    "destacada": true
  },
  {
    "id": 4,
    "titulo": "Pequeños negocios apuestan por el comercio electrónico para vender más",
    "categoria": "Comercial",
    "imagen": "img/noticia4.svg",
    "resumen": "Tiendas de barrio y emprendimientos locales abren canales en línea para llegar a nuevos clientes.",
    "contenido": "Cada vez más tiendas de barrio y emprendimientos locales abren canales de venta por internet para llegar a clientes que antes no podían alcanzar.\nEntre las estrategias más usadas están las redes sociales, los catálogos por mensajería y los pagos digitales, que reducen el uso de efectivo y agilizan las compras.\nLos especialistas aconsejan cuidar la atención al cliente, mostrar fotos claras de los productos y cumplir siempre con los tiempos de entrega prometidos.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-09",
    "destacada": false
  },
  {
    "id": 5,
    "titulo": "Las bibliotecas públicas amplían su horario con talleres gratuitos de lectura",
    "categoria": "Educación",
    "imagen": "img/noticia5.svg",
    "resumen": "Clubes de lectura, cuentacuentos y apoyo con tareas para niños, jóvenes y adultos.",
    "contenido": "Las bibliotecas públicas están ampliando sus horarios de atención y ofrecen talleres gratuitos de lectura, escritura y apoyo escolar para todas las edades.\nEntre las actividades más concurridas están los clubes de lectura y los espacios de cuentacuentos, que buscan acercar los libros a los más pequeños desde temprana edad.\nLos organizadores invitan a la comunidad a inscribirse en el mostrador de cada sede o a través de las carteleras informativas.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-08",
    "destacada": false
  },
  {
    "id": 6,
    "titulo": "Cinco hábitos sencillos para proteger tus cuentas en línea",
    "categoria": "Tecnología",
    "imagen": "img/noticia6.svg",
    "resumen": "Contraseñas distintas, verificación en dos pasos y cuidado con los enlaces sospechosos.",
    "contenido": "Proteger las cuentas en línea no requiere conocimientos técnicos avanzados: basta con adoptar algunos hábitos simples y practicarlos con constancia.\nLos especialistas recomiendan usar una contraseña diferente para cada servicio, activar la verificación en dos pasos, mantener actualizadas las aplicaciones y desconfiar de los mensajes que piden datos personales.\nTambién aconsejan revisar de vez en cuando los dispositivos con sesión abierta y cerrar las que ya no se usen.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-07",
    "destacada": false
  }
];

async function obtenerNoticias() {
  if (localStorage.getItem(STORAGE_KEYS.VERSION) !== VERSION_DATOS) {
    localStorage.removeItem(STORAGE_KEYS.NOTICIAS);
    localStorage.setItem(STORAGE_KEYS.VERSION, VERSION_DATOS);
  }
  const guardadas = localStorage.getItem(STORAGE_KEYS.NOTICIAS);
  if (guardadas) {
    try {
      const parsed = JSON.parse(guardadas);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn(e);
    }
  }

  try {
    const res = await fetch('noticias.json');
    if (!res.ok) throw new Error('Error al cargar noticias.json');
    const datos = await res.json();
    guardarNoticias(datos);
    return datos;
  } catch (error) {
    console.warn('No se pudo leer noticias.json, se usa la copia de respaldo:', error);
    guardarNoticias(NOTICIAS_DEFAULT);
    return NOTICIAS_DEFAULT;
  }
}

function guardarNoticias(noticias) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTICIAS, JSON.stringify(noticias));
    window.dispatchEvent(new CustomEvent('notiflash:noticiasUpdated', { detail: noticias }));
  } catch (e) {
    console.error(e);
  }
}

async function obtenerNoticiaPorId(id) {
  const noticias = await obtenerNoticias();
  return noticias.find(n => String(n.id) === String(id)) || null;
}

function obtenerFavoritos() {
  const data = localStorage.getItem(STORAGE_KEYS.FAVORITOS);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function guardarFavoritos(favoritos) {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITOS, JSON.stringify(favoritos));
    window.dispatchEvent(new CustomEvent('notiflash:favoritosUpdated', { detail: favoritos }));
  } catch (e) {
    console.error(e);
  }
}

function esFavorito(id) {
  const favoritos = obtenerFavoritos();
  return favoritos.some(f => String(f.id) === String(id));
}

function toggleFavorito(id) {
  const favoritos = obtenerFavoritos();
  const index = favoritos.findIndex(f => String(f.id) === String(id));
  if (index >= 0) {
    favoritos.splice(index, 1);
    guardarFavoritos(favoritos);
    mostrarNotificacionToast('Noticia quitada de favoritos', 'info');
    return false;
  } else {
    favoritos.push({
      id: Number(id) || id,
      fecha: formatearFechaHoy()
    });
    guardarFavoritos(favoritos);
    mostrarNotificacionToast('✓ Noticia guardada en favoritos', 'exito');
    return true;
  }
}

function quitarFavorito(id) {
  const favoritos = obtenerFavoritos().filter(f => String(f.id) !== String(id));
  guardarFavoritos(favoritos);
  mostrarNotificacionToast('Noticia quitada de favoritos', 'info');
}

async function restablecerNoticiasPorDefecto() {
  try {
    const res = await fetch('noticias.json');
    const datos = await res.json();
    guardarNoticias(datos);
    return datos;
  } catch (_) {
    guardarNoticias(NOTICIAS_DEFAULT);
    return NOTICIAS_DEFAULT;
  }
}

function mostrarNotificacionToast(mensaje, tipo = 'info') {
  let toast = document.getElementById('notiflash-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'notiflash-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      background: #16365f;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      gap: 10px;
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  const colorPunto = tipo === 'exito' ? '#2e7d4f' : '#f0b90b';
  toast.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${colorPunto};"></span> ${escapeHtml(mensaje)}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(window.__notiflashToastTimeout);
  window.__notiflashToastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
}

function formatearFechaHoy() {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const anio = hoy.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function formatearFechaCorta(fechaStr) {
  if (!fechaStr) return formatearFechaHoy();
  if (fechaStr.includes('/')) return fechaStr;
  const partes = fechaStr.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return fechaStr;
}

function formatearFechaLarga(fechaStr) {
  if (!fechaStr) return 'Fecha no disponible';
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  if (fechaStr.includes('-')) {
    const [anio, mes, dia] = fechaStr.split('-');
    const mesNombre = meses[parseInt(mes, 10) - 1] || mes;
    return `${parseInt(dia, 10)} de ${mesNombre} de ${anio}`;
  }
  return fechaStr;
}

function renderizarImagen(noticia) {
  const label = noticia.categoria ? noticia.categoria.toLowerCase() : 'noticia';
  if (noticia.imagen && noticia.imagen.trim()) {
    return `<img src="${escapeHtml(noticia.imagen)}" alt="${escapeHtml(noticia.titulo || 'Noticia')}" onerror="this.onerror=null; this.parentElement.innerHTML='<span>${escapeHtml(label)}</span>';" style="width:100%;height:100%;object-fit:cover;display:block;">`;
  }
  return `<span>${escapeHtml(label)}</span>`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  const formulariosBuscador = document.querySelectorAll('form.buscador');
  formulariosBuscador.forEach(form => {
    const input = form.querySelector('input');
    if (!input) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (query) {
        window.location.href = `noticias.html?buscar=${encodeURIComponent(query)}`;
      }
    });

    const btn = form.querySelector('button');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          window.location.href = `noticias.html?buscar=${encodeURIComponent(query)}`;
        }
      });
    }
  });
});
