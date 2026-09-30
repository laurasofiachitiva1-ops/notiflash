document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.getElementById('contenedor-noticias') || document.querySelector('.listado .row');
  const conteoEl = document.querySelector('.conteo');
  const todasCheckbox = document.querySelector('input[name="cat"][value="todas"]');
  const catCheckboxes = Array.from(document.querySelectorAll('input[name="cat"]:not([value="todas"])'));
  const inputBuscar = document.getElementById('buscar');
  const btnBuscar = document.getElementById('btn-buscar');
  const selectOrden = document.getElementById('orden');
  const btnAplicar = document.querySelector('.btn-aplicar');

  if (!contenedor) return;

  let todasLasNoticias = [];

  // "Todas" se desmarca al elegir una categoría; si no queda ninguna, vuelve a marcarse.
  if (todasCheckbox) {
    todasCheckbox.addEventListener('change', () => {
      if (todasCheckbox.checked) {
        catCheckboxes.forEach(c => c.checked = false);
      } else {
        todasCheckbox.checked = true;
      }
      aplicarFiltrosYRenderizar();
    });
  }

  catCheckboxes.forEach(c => {
    c.addEventListener('change', () => {
      if (todasCheckbox) {
        todasCheckbox.checked = !catCheckboxes.some(x => x.checked);
      }
      aplicarFiltrosYRenderizar();
    });
  });

  const params = new URLSearchParams(window.location.search);
  const buscarParam = params.get('buscar');
  if (buscarParam && inputBuscar) {
    inputBuscar.value = buscarParam;
  }
  const catParam = params.get('cat');
  if (catParam) {
    const matchingCheckbox = catCheckboxes.find(c => c.value.toLowerCase() === catParam.toLowerCase());
    if (matchingCheckbox) {
      if (todasCheckbox) todasCheckbox.checked = false;
      matchingCheckbox.checked = true;
    }
  }

  contenedor.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">Cargando noticias...</p></div>';
  try {
    todasLasNoticias = await obtenerNoticias();
    aplicarFiltrosYRenderizar();
  } catch (error) {
    contenedor.innerHTML = '<div class="col-12 text-center py-5"><p class="text-danger">Error al cargar las noticias.</p></div>';
  }

  if (inputBuscar) {
    inputBuscar.addEventListener('input', () => {
      aplicarFiltrosYRenderizar();
    });
    inputBuscar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        aplicarFiltrosYRenderizar();
      }
    });
  }

  if (btnBuscar) {
    btnBuscar.addEventListener('click', (e) => {
      e.preventDefault();
      aplicarFiltrosYRenderizar();
    });
  }

  if (selectOrden) {
    selectOrden.addEventListener('change', () => {
      aplicarFiltrosYRenderizar();
    });
  }

  if (btnAplicar) {
    btnAplicar.addEventListener('click', (e) => {
      e.preventDefault();
      aplicarFiltrosYRenderizar();
    });
  }

  window.addEventListener('notiflash:noticiasUpdated', (e) => {
    todasLasNoticias = e.detail || [];
    aplicarFiltrosYRenderizar();
  });

  window.addEventListener('notiflash:favoritosUpdated', () => {
    actualizarEstadosFavoritos();
  });

  function aplicarFiltrosYRenderizar() {
    let filtradas = [...todasLasNoticias];

    const esTodas = todasCheckbox ? todasCheckbox.checked : true;
    if (!esTodas) {
      const categoriasSeleccionadas = catCheckboxes
        .filter(c => c.checked)
        .map(c => normalizarTexto(c.value));

      if (categoriasSeleccionadas.length > 0) {
        filtradas = filtradas.filter(noticia => {
          const catNorm = normalizarTexto(noticia.categoria);
          return categoriasSeleccionadas.includes(catNorm);
        });
      }
    }

    const termino = inputBuscar ? normalizarTexto(inputBuscar.value) : '';
    if (termino) {
      filtradas = filtradas.filter(noticia => {
        const titulo = normalizarTexto(noticia.titulo);
        const resumen = normalizarTexto(noticia.resumen);
        return titulo.includes(termino) || resumen.includes(termino);
      });
    }

    const orden = selectOrden ? selectOrden.value : 'recientes';
    ordenarNoticias(filtradas, orden);

    if (conteoEl) {
      const total = filtradas.length;
      if (total === 0) {
        conteoEl.textContent = 'No se encontraron noticias con los filtros seleccionados';
      } else if (total === 1) {
        conteoEl.textContent = 'Se encontró 1 noticia';
      } else {
        conteoEl.textContent = `Se encontraron ${total} noticias`;
      }
    }

    renderizarListado(filtradas);
  }

  function ordenarNoticias(array, criterio) {
    switch (criterio) {
      case 'antiguas':
        array.sort((a, b) => new Date(a.fecha || 0) - new Date(b.fecha || 0) || a.id - b.id);
        break;
      case 'az':
        array.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
        break;
      case 'za':
        array.sort((a, b) => (b.titulo || '').localeCompare(a.titulo || ''));
        break;
      case 'cat-tecnologia':
        array.sort((a, b) => ordenarPorCategoriaPrioritaria(a, b, 'tecnología'));
        break;
      case 'cat-educacion':
        array.sort((a, b) => ordenarPorCategoriaPrioritaria(a, b, 'educación'));
        break;
      case 'cat-turismo':
        array.sort((a, b) => ordenarPorCategoriaPrioritaria(a, b, 'turismo'));
        break;
      case 'cat-comercial':
        array.sort((a, b) => ordenarPorCategoriaPrioritaria(a, b, 'comercial'));
        break;
      case 'recientes':
      default:
        array.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0) || b.id - a.id);
        break;
    }
  }

  function ordenarPorCategoriaPrioritaria(a, b, catPrioridad) {
    const aEs = normalizarTexto(a.categoria) === normalizarTexto(catPrioridad);
    const bEs = normalizarTexto(b.categoria) === normalizarTexto(catPrioridad);
    if (aEs && !bEs) return -1;
    if (!aEs && bEs) return 1;
    return new Date(b.fecha || 0) - new Date(a.fecha || 0);
  }

  function normalizarTexto(texto) {
    return (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function renderizarListado(noticias) {
    contenedor.innerHTML = '';

    if (noticias.length === 0) {
      contenedor.innerHTML = `
        <div class="col-12 py-5 text-center">
          <div class="p-4 bg-white rounded border">
            <h4 class="mb-2" style="font-size:16px; font-weight:700;">No se encontraron noticias</h4>
            <p class="text-muted mb-3" style="font-size:12px;">Intenta cambiar los filtros o el término de búsqueda.</p>
            <button type="button" class="btn btn-nf" id="btn-limpiar-filtros" style="height:32px; padding:0 16px;">Ver todas las noticias</button>
          </div>
        </div>
      `;
      const btnReset = document.getElementById('btn-limpiar-filtros');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (todasCheckbox) todasCheckbox.checked = true;
          catCheckboxes.forEach(c => c.checked = false);
          if (inputBuscar) inputBuscar.value = '';
          if (selectOrden) selectOrden.value = 'recientes';
          aplicarFiltrosYRenderizar();
        });
      }
      return;
    }

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
            <div class="acciones">
              <a href="detalle.html?id=${noticia.id}" class="btn btn-nf ver" role="button">Ver más</a>
              <button type="button" class="btn btn-nf fav ${fav ? 'btn-nf-borde-azul' : ''}" data-id="${noticia.id}" role="button">
                ${fav ? '✓ Guardada' : '+ Favoritos'}
              </button>
            </div>
          </div>
        </article>
      `;

      const btnFav = col.querySelector('.fav');
      btnFav.addEventListener('click', (e) => {
        e.preventDefault();
        const nuevoEstado = toggleFavorito(noticia.id);
        if (nuevoEstado) {
          btnFav.classList.add('btn-nf-borde-azul');
          btnFav.textContent = '✓ Guardada';
        } else {
          btnFav.classList.remove('btn-nf-borde-azul');
          btnFav.textContent = '+ Favoritos';
        }
      });

      contenedor.appendChild(col);
    });
  }

  function actualizarEstadosFavoritos() {
    const btnsFav = contenedor.querySelectorAll('.fav[data-id]');
    btnsFav.forEach(btn => {
      const id = btn.getAttribute('data-id');
      const fav = esFavorito(id);
      if (fav) {
        btn.classList.add('btn-nf-borde-azul');
        btn.textContent = '✓ Guardada';
      } else {
        btn.classList.remove('btn-nf-borde-azul');
        btn.textContent = '+ Favoritos';
      }
    });
  }
});
