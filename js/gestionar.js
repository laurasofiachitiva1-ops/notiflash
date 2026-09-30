document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('form.panel');
  const inputTitulo = document.getElementById('titulo');
  const inputCategoria = document.getElementById('categoria');
  const inputUrl = document.getElementById('url');
  const inputDesc = document.getElementById('desc');
  const inputContenido = document.getElementById('contenido');
  const btnGuardar = document.querySelector('.btn-guardar');
  const btnCancelar = document.querySelector('.form .btn-cancelar');

  const tablaBody = document.querySelector('table tbody');
  const cajaConfirmar = document.querySelector('.confirmar');
  const btnConfirmarSi = cajaConfirmar ? cajaConfirmar.querySelector('.btn-si') : null;
  const btnConfirmarNo = cajaConfirmar ? cajaConfirmar.querySelector('.btn-cancelar') : null;
  const btnRestablecer = document.getElementById('btnRestablecer');

  let todasLasNoticias = [];
  let idNoticiaAEliminar = null;

  if (cajaConfirmar) {
    cajaConfirmar.style.display = 'none';
  }

  try {
    todasLasNoticias = await obtenerNoticias();
    renderizarTabla();
  } catch (e) {
    console.error(e);
  }

  [inputTitulo, inputCategoria, inputUrl, inputDesc, inputContenido].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => limpiarError(el));
    el.addEventListener('change', () => limpiarError(el));
  });

  if (btnGuardar) {
    btnGuardar.addEventListener('click', (e) => {
      e.preventDefault();
      procesarFormulario();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      procesarFormulario();
    });
  }

  if (btnCancelar) {
    btnCancelar.addEventListener('click', () => {
      limpiarTodosLosErrores();
      ocultarMensajeExito();
    });
  }

  if (btnConfirmarSi) {
    btnConfirmarSi.addEventListener('click', () => {
      if (idNoticiaAEliminar !== null) {
        eliminarNoticia(idNoticiaAEliminar);
        idNoticiaAEliminar = null;
        if (cajaConfirmar) cajaConfirmar.style.display = 'none';
      }
    });
  }

  if (btnConfirmarNo) {
    btnConfirmarNo.addEventListener('click', () => {
      idNoticiaAEliminar = null;
      if (cajaConfirmar) cajaConfirmar.style.display = 'none';
    });
  }

  if (btnRestablecer) {
    btnRestablecer.addEventListener('click', async () => {
      if (confirm('¿Deseas restaurar las 6 noticias originales desde noticias.json?')) {
        todasLasNoticias = await restablecerNoticiasPorDefecto();
        renderizarTabla();
        mostrarMensajeExito('Se han restablecido las noticias originales.');
      }
    });
  }

  function validarFormulario() {
    let esValido = true;
    limpiarTodosLosErrores();

    const tituloVal = inputTitulo.value.trim();
    if (!tituloVal) {
      mostrarError(inputTitulo, 'El título es obligatorio.');
      esValido = false;
    } else if (tituloVal.length < 5) {
      mostrarError(inputTitulo, 'El título debe tener al menos 5 caracteres.');
      esValido = false;
    }

    const catVal = inputCategoria.value.trim();
    const categoriasValidas = ['educación', 'educacion', 'tecnología', 'tecnologia', 'turismo', 'comercial'];
    if (!catVal) {
      mostrarError(inputCategoria, 'La categoría es obligatoria.');
      esValido = false;
    } else if (!categoriasValidas.includes(catVal.toLowerCase())) {
      mostrarError(inputCategoria, 'Elige una categoría válida: Educación, Tecnología, Turismo o Comercial.');
      esValido = false;
    }

    const urlVal = inputUrl.value.trim();
    if (urlVal) {
      try {
        new URL(urlVal);
      } catch (_) {
        mostrarError(inputUrl, 'Ingresa una URL válida (ej. https://ejemplo.com/foto.jpg) o déjalo vacío.');
        esValido = false;
      }
    }

    const descVal = inputDesc.value.trim();
    if (!descVal) {
      mostrarError(inputDesc, 'La descripción breve es obligatoria.');
      esValido = false;
    } else if (descVal.length < 10) {
      mostrarError(inputDesc, 'La descripción debe tener al menos 10 caracteres.');
      esValido = false;
    }

    const contVal = inputContenido.value.trim();
    if (!contVal) {
      mostrarError(inputContenido, 'El contenido completo es obligatorio.');
      esValido = false;
    } else if (contVal.length < 20) {
      mostrarError(inputContenido, 'El contenido debe tener al menos 20 caracteres.');
      esValido = false;
    }

    return esValido;
  }

  function mostrarError(elemento, mensaje) {
    if (!elemento) return;
    elemento.classList.add('error');
    const padre = elemento.parentElement;
    let msgEl = padre.querySelector('.msg-error');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'msg-error';
      padre.appendChild(msgEl);
    }
    msgEl.textContent = `× ${mensaje}`;
    msgEl.style.display = 'block';
  }

  function limpiarError(elemento) {
    if (!elemento) return;
    elemento.classList.remove('error');
    const padre = elemento.parentElement;
    const msgEl = padre.querySelector('.msg-error');
    if (msgEl) {
      msgEl.style.display = 'none';
    }
  }

  function limpiarTodosLosErrores() {
    [inputTitulo, inputCategoria, inputUrl, inputDesc, inputContenido].forEach(el => {
      limpiarError(el);
    });
  }

  function procesarFormulario() {
    if (!validarFormulario()) return;

    const catRaw = inputCategoria.value.trim().toLowerCase();
    let catFinal = 'Educación';
    if (catRaw.includes('tec')) catFinal = 'Tecnología';
    else if (catRaw.includes('tur')) catFinal = 'Turismo';
    else if (catRaw.includes('com')) catFinal = 'Comercial';
    else if (catRaw.includes('edu')) catFinal = 'Educación';

    const hoy = new Date();
    const fechaISO = hoy.toISOString().split('T')[0];

    const nuevaNoticia = {
      id: Date.now(),
      titulo: inputTitulo.value.trim(),
      categoria: catFinal,
      imagen: inputUrl.value.trim(),
      resumen: inputDesc.value.trim(),
      contenido: inputContenido.value.trim(),
      autor: 'Redacción NotiFlash',
      fecha: fechaISO,
      destacada: false,
      creadaPorUsuario: true
    };

    todasLasNoticias.unshift(nuevaNoticia);
    guardarNoticias(todasLasNoticias);

    if (form) form.reset();
    limpiarTodosLosErrores();
    renderizarTabla();
    mostrarMensajeExito('¡Noticia publicada con éxito!');
  }

  function eliminarNoticia(id) {
    todasLasNoticias = todasLasNoticias.filter(n => String(n.id) !== String(id));
    guardarNoticias(todasLasNoticias);
    quitarFavorito(id);
    renderizarTabla();
    mostrarMensajeExito('Noticia eliminada correctamente.');
  }

  function renderizarTabla() {
    if (!tablaBody) return;
    tablaBody.innerHTML = '';

    if (todasLasNoticias.length === 0) {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td colspan="5" style="text-align:center; padding:24px 12px; color:var(--gris);">
          No hay noticias registradas. Utiliza el formulario para crear una nueva noticia.
        </td>
      `;
      tablaBody.appendChild(fila);
      return;
    }

    todasLasNoticias.forEach((noticia, index) => {
      const fila = document.createElement('tr');
      const esUsuario = noticia.creadaPorUsuario;
      const subtexto = esUsuario ? 'creada por el usuario' : 'noticia del portal';

      fila.innerHTML = `
        <td>${index + 1}</td>
        <td class="titulo">
          <strong><a href="detalle.html?id=${noticia.id}" style="color:inherit;">${escapeHtml(noticia.titulo)}</a></strong>
          <small>${subtexto}</small>
        </td>
        <td>${escapeHtml(noticia.categoria)}</td>
        <td>${escapeHtml(formatearFechaCorta(noticia.fecha))}</td>
        <td class="centro">
          <button type="button" class="btn btn-nf btn-nf-borde-rojo btn-eliminar" data-id="${noticia.id}">
            Eliminar
          </button>
        </td>
      `;

      const btnEliminar = fila.querySelector('.btn-eliminar');
      btnEliminar.addEventListener('click', (e) => {
        e.preventDefault();
        solicitarConfirmacionEliminar(noticia);
      });

      tablaBody.appendChild(fila);
    });
  }

  function solicitarConfirmacionEliminar(noticia) {
    idNoticiaAEliminar = noticia.id;
    if (cajaConfirmar) {
      cajaConfirmar.style.display = 'block';
      const p = cajaConfirmar.querySelector('p');
      if (p) {
        p.innerHTML = `¿Seguro que desea eliminar la noticia <strong>"${escapeHtml(noticia.titulo)}"</strong>?<br>Esta acción no se puede deshacer.`;
      }
      cajaConfirmar.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function mostrarMensajeExito(texto) {
    let aviso = document.getElementById('aviso-gestion');
    if (!aviso) {
      aviso = document.createElement('div');
      aviso.id = 'aviso-gestion';
      aviso.style.cssText = 'background:#e8f5ec; border:1px solid #8ec9a0; color:#2e7d4f; border-radius:6px; padding:12px 16px; font-size:12px; font-weight:700; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;';
      const main = document.querySelector('main');
      const layout = document.querySelector('.layout');
      if (main && layout) {
        main.insertBefore(aviso, layout);
      }
    }
    aviso.innerHTML = `<span>✓ ${escapeHtml(texto)}</span> <button type="button" style="background:none; border:0; color:#2e7d4f; font-weight:700; cursor:pointer;" onclick="this.parentElement.style.display='none'">x</button>`;
    aviso.style.display = 'flex';

    setTimeout(() => {
      if (aviso) aviso.style.display = 'none';
    }, 4000);
  }

  function ocultarMensajeExito() {
    const aviso = document.getElementById('aviso-gestion');
    if (aviso) aviso.style.display = 'none';
  }
});
