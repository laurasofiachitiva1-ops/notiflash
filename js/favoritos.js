document.addEventListener('DOMContentLoaded', async () => {
  const main = document.querySelector('main');
  const avisoEl = document.querySelector('.aviso');
  const vacioEl = document.querySelector('.vacio');
  const contenedorFavs = document.getElementById('contenedor-favoritos');

  if (!main) return;

  renderizarFavoritos();

  window.addEventListener('notiflash:favoritosUpdated', () => {
    renderizarFavoritos();
  });

  async function renderizarFavoritos() {
    const favoritos = obtenerFavoritos();
    const todasLasNoticias = await obtenerNoticias();

    const guardadas = favoritos
      .map(fav => {
        const noticia = todasLasNoticias.find(n => String(n.id) === String(fav.id));
        if (!noticia) return null;
        return {
          ...noticia,
          fechaGuardada: fav.fecha || formatearFechaCorta(noticia.fecha)
        };
      })
      .filter(Boolean);

    let contenedor = contenedorFavs;
    if (!contenedor) {
      contenedor = document.createElement('div');
      contenedor.id = 'contenedor-favoritos';
      if (vacioEl) {
        main.insertBefore(contenedor, vacioEl);
      } else {
        main.appendChild(contenedor);
      }
    }

    contenedor.innerHTML = '';

    if (guardadas.length === 0) {
      if (avisoEl) avisoEl.style.display = 'none';
      if (vacioEl) {
        vacioEl.style.display = 'block';
        vacioEl.innerHTML = `
          <p style="font-size:12px; color:var(--gris); margin-bottom:8px;">No tienes noticias guardadas actualmente.</p>
          <strong style="display:block; font-size:13px; color:var(--texto); margin-bottom:16px;">
            "Todavía no has guardado noticias. Explora el listado y guarda las que más te gusten."
          </strong>
          <a href="noticias.html" class="btn btn-nf" role="button" style="height:32px; padding:0 20px; font-size:11px;">
            Explorar noticias
          </a>
        `;
      }
      return;
    }

    if (avisoEl) {
      avisoEl.style.display = 'block';
      const textoPlural = guardadas.length === 1 ? 'noticia guardada' : 'noticias guardadas';
      avisoEl.textContent = `! Tienes ${guardadas.length} ${textoPlural}. Si borras el historial del navegador la lista se pierde.`;
    }

    if (vacioEl) vacioEl.style.display = 'none';

    guardadas.forEach(noticia => {
      const art = document.createElement('article');
      art.className = 'fav';
      art.innerHTML = `
        <div class="row g-3 align-items-center">
          <div class="col-12 col-sm-4 col-md-2">
            <div class="img">${renderizarImagen(noticia)}</div>
          </div>
          <div class="col-12 col-sm-8 col-md-7 info">
            <span class="tag">${escapeHtml(noticia.categoria)}</span>
            <h3>${escapeHtml(noticia.titulo)}</h3>
            <p class="resumen">${escapeHtml(noticia.resumen)}</p>
            <div class="fecha">Guardada el ${escapeHtml(noticia.fechaGuardada)}</div>
          </div>
          <div class="col-12 col-md-3 acciones">
            <a href="detalle.html?id=${noticia.id}" class="btn btn-nf" role="button">Ver más</a>
            <button type="button" class="btn btn-nf btn-nf-borde-rojo btn-quitar" data-id="${noticia.id}">Quitar</button>
          </div>
        </div>
      `;

      const btnQuitar = art.querySelector('.btn-quitar');
      btnQuitar.addEventListener('click', (e) => {
        e.preventDefault();
        quitarFavorito(noticia.id);
        renderizarFavoritos();
      });

      contenedor.appendChild(art);
    });
  }
});
