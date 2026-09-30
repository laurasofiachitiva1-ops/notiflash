const STORAGE_KEYS = {
  NOTICIAS: 'notiflash_noticias',
  FAVORITOS: 'notiflash_favoritos'
};

const NOTICIAS_DEFAULT = [
  {
    "id": 1,
    "titulo": "Título noticia 1",
    "categoria": "Educación",
    "imagen": "",
    "resumen": "Texto de prueba de la noticia. Aquí irá un breve resumen.",
    "contenido": "Este es un texto de prueba para el contenido completo de la noticia. Aquí se mostrará el desarrollo de la información.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-12",
    "destacada": true
  },
  {
    "id": 2,
    "titulo": "Título noticia 2",
    "categoria": "Tecnología",
    "imagen": "",
    "resumen": "Texto de prueba de la noticia. Aquí irá un breve resumen.",
    "contenido": "Este es un texto de prueba para el contenido completo de la noticia. Aquí se mostrará el desarrollo de la información.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-11",
    "destacada": true
  },
  {
    "id": 3,
    "titulo": "Título noticia 3",
    "categoria": "Turismo",
    "imagen": "",
    "resumen": "Texto de prueba de la noticia. Aquí irá un breve resumen.",
    "contenido": "Este es un texto de prueba para el contenido completo de la noticia. Aquí se mostrará el desarrollo de la información.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-10",
    "destacada": true
  },
  {
    "id": 4,
    "titulo": "Título noticia 4",
    "categoria": "Comercial",
    "imagen": "",
    "resumen": "Texto de prueba de la noticia. Aquí irá un breve resumen.",
    "contenido": "Este es un texto de prueba para el contenido completo de la noticia. Aquí se mostrará el desarrollo de la información.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-09",
    "destacada": false
  },
  {
    "id": 5,
    "titulo": "Título noticia 5",
    "categoria": "Educación",
    "imagen": "",
    "resumen": "Texto de prueba de la noticia. Aquí irá un breve resumen.",
    "contenido": "Este es un texto de prueba para el contenido completo de la noticia. Aquí se mostrará el desarrollo de la información.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-08",
    "destacada": false
  },
  {
    "id": 6,
    "titulo": "Título noticia 6",
    "categoria": "Tecnología",
    "imagen": "",
    "resumen": "Texto de prueba de la noticia. Aquí irá un breve resumen.",
    "contenido": "Este es un texto de prueba para el contenido completo de la noticia. Aquí se mostrará el desarrollo de la información.",
    "autor": "Redacción NotiFlash",
    "fecha": "2026-09-07",
    "destacada": false
  }
];

async function obtenerNoticias() {
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
