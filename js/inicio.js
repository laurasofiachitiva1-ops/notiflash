document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('contenedor-destacadas') || document.querySelector('.destacadas .row');
  if (!contenedor) return;

  contenedor.innerHTML = '<div class="col-12 text-center py-4"><p class="text-muted">Cargando noticias...</p></div>';

  try {
    const noticias = await obtenerNoticias();
    let destacadas = noticias.filter(n => n.destacada);
    if (destacadas.length === 0) {
      destacadas = noticias.slice(0, 3);
    } else if (destacadas.length > 3) {
      destacadas = destacadas.slice(0, 3);
    }

    renderizarDestacadas(destacadas, contenedor);
  } catch (error) {
    contenedor.innerHTML = '<div class="col-12 text-center py-4"><p class="text-danger">No se pudieron cargar las noticias.</p></div>';
  }
});

function renderizarDestacadas(noticias, contenedor) {
  contenedor.innerHTML = '';

  noticias.forEach(noticia => {
    const fav = esFavorito(noticia.id);
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';

    col.innerHTML = `
      <article class="noticia h-100">
        <div class="img">${renderizarImagen(noticia)}</div>
        <div class="cuerpo">
          <span class="tag">${escapeHtml(noticia.categoria)}</span>
          <h4>${escapeHtml(noticia.titulo)}</h4>
          <p class="resumen">${escapeHtml(noticia.resumen)}</p>
          <div class="pie">
            <a href="detalle.html?id=${noticia.id}" class="btn btn-nf btn-ver" role="button">Ver más</a>
            <div class="guardar ${fav ? 'activo' : ''}" data-id="${noticia.id}" role="button" tabindex="0" title="${fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}">
              <span>${fav ? 'guardada' : 'guardar'}</span>
              <svg viewBox="0 0 17 12"><polyline points="1,2 8.5,10 16,2"/></svg>
            </div>
          </div>
        </div>
      </article>
    `;

    const btnGuardar = col.querySelector('.guardar');
    btnGuardar.addEventListener('click', (e) => {
      e.preventDefault();
      const nuevoEstado = toggleFavorito(noticia.id);
      const span = btnGuardar.querySelector('span');
      if (nuevoEstado) {
        btnGuardar.classList.add('activo');
        span.textContent = 'guardada';
        btnGuardar.title = 'Quitar de favoritos';
      } else {
        btnGuardar.classList.remove('activo');
        span.textContent = 'guardar';
        btnGuardar.title = 'Guardar en favoritos';
      }
    });

    contenedor.appendChild(col);
  });
}
