document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const articuloEl = document.querySelector('.articulo');
  const migasEl = document.querySelector('.migas');
  const interesaContenedor = document.querySelector('.interesa');

  if (!articuloEl) return;

  try {
    const noticias = await obtenerNoticias();
    const noticia = id ? noticias.find(n => String(n.id) === String(id)) : (noticias[0] || null);

    if (!noticia) {
      articuloEl.innerHTML = `
        <div class="text-center py-5">
          <h2>Noticia no encontrada</h2>
          <p class="text-muted mt-2">La noticia solicitada no existe o fue eliminada.</p>
          <a href="noticias.html" class="btn btn-nf mt-4" style="height:36px; padding:0 20px;">Volver a noticias</a>
        </div>
      `;
      if (migasEl) migasEl.innerHTML = '<a href="index.html">Inicio</a> &gt; <a href="noticias.html">Noticias</a> &gt; Noticia no encontrada';
      return;
    }

    document.title = `${noticia.titulo} | NotiFlash`;

    if (migasEl) {
      migasEl.innerHTML = `
        <a href="index.html">Inicio</a> &gt; 
        <a href="noticias.html">Noticias</a> &gt; 
        <a href="noticias.html?cat=${encodeURIComponent(sinTildes(noticia.categoria))}">${escapeHtml(noticia.categoria)}</a> &gt; 
        <span>${escapeHtml(noticia.titulo)}</span>
      `;
    }

    const tagEl = articuloEl.querySelector('.tag');
    if (tagEl) tagEl.textContent = noticia.categoria;

    const tituloEl = articuloEl.querySelector('h1');
    if (tituloEl) tituloEl.textContent = noticia.titulo;

    const metaEl = articuloEl.querySelector('.meta');
    if (metaEl) {
      const fechaTexto = formatearFechaLarga(noticia.fecha);
      const autor = noticia.autor || 'Redacción NotiFlash';
      metaEl.textContent = `Por: ${autor} | ${fechaTexto} | 3 min de lectura`;
    }

    const imgEl = articuloEl.querySelector('.img');
    if (imgEl) {
      imgEl.innerHTML = renderizarImagen(noticia);
    }

    const textoEl = articuloEl.querySelector('.texto');
    if (textoEl) {
      const parrafos = (noticia.contenido || noticia.resumen || '')
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      if (parrafos.length === 0) {
        textoEl.innerHTML = `<p class="parrafo">${escapeHtml(noticia.resumen || '')}</p>`;
      } else {
        textoEl.innerHTML = parrafos.map(p => `<p class="parrafo">${escapeHtml(p)}</p>`).join('');
      }
    }

    const btnFav = articuloEl.querySelector('.btn-fav');
    if (btnFav) {
      actualizarBotonFavorito(btnFav, noticia.id);

      btnFav.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorito(noticia.id);
        actualizarBotonFavorito(btnFav, noticia.id);
      });
    }

    const btnCompartir = articuloEl.querySelector('.btn-compartir');
    if (btnCompartir) {
      btnCompartir.addEventListener('click', (e) => {
        e.preventDefault();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(() => {
            btnCompartir.textContent = '¡Enlace copiado!';
            setTimeout(() => btnCompartir.textContent = 'Compartir', 2000);
          }).catch(() => {
            alert('Enlace copiado: ' + window.location.href);
          });
        } else {
          alert('Enlace: ' + window.location.href);
        }
      });
    }

    if (interesaContenedor) {
      renderizarRelacionadas(noticias, noticia, interesaContenedor);
    }

  } catch (error) {
    console.error(error);
  }

  // Quita tildes y pasa a minúsculas: "Educación" -> "educacion" (igual que los filtros de noticias.html)
  function sinTildes(texto) {
    return (texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function actualizarBotonFavorito(btn, noticiaId) {
    const fav = esFavorito(noticiaId);
    if (fav) {
      btn.textContent = '✓ Guardada en favoritos';
      btn.classList.add('btn-nf-borde-azul');
      btn.classList.remove('btn-nf');
      btn.style.borderColor = '#2f6de1';
      btn.style.color = '#2f6de1';
    } else {
      btn.textContent = '+ Agregar a favoritos';
      btn.classList.remove('btn-nf-borde-azul');
      btn.classList.add('btn-nf');
      btn.style.color = '#fff';
    }
  }

  function renderizarRelacionadas(todas, actual, contenedor) {
    let relacionadas = todas.filter(n => String(n.id) !== String(actual.id));
    relacionadas.sort((a, b) => {
      const aMisma = a.categoria === actual.categoria;
      const bMisma = b.categoria === actual.categoria;
      if (aMisma && !bMisma) return -1;
      if (!aMisma && bMisma) return 1;
      return new Date(b.fecha || 0) - new Date(a.fecha || 0);
    });
    relacionadas = relacionadas.slice(0, 3);

    const h3 = contenedor.querySelector('h3') || document.createElement('h3');
    h3.textContent = 'Te puede interesar';
    contenedor.innerHTML = '';
    contenedor.appendChild(h3);

    relacionadas.forEach(rel => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `
        <div class="img">${renderizarImagen(rel)}</div>
        <div class="lineas">
          <a href="detalle.html?id=${rel.id}" class="item-texto" style="font-weight:700; color:var(--texto); display:block; margin-bottom:4px;">
            ${escapeHtml(rel.titulo)}
          </a>
          <span style="font-size:8.5px; color:var(--azul); font-weight:700;">${escapeHtml(rel.categoria)}</span>
          <span style="font-size:8.5px; color:var(--gris); margin-left:6px;">${formatearFechaCorta(rel.fecha)}</span>
        </div>
      `;
      contenedor.appendChild(item);
    });
  }
});
