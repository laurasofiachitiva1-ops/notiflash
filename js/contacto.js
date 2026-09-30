document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.formulario');
  const inputNombre = document.getElementById('nombre');
  const inputCorreo = document.getElementById('correo');
  const inputAsunto = document.getElementById('asunto');
  const inputMensaje = document.getElementById('mensaje');
  const checkAcepto = document.querySelector('.acepto input[type="checkbox"]');
  const btnEnviar = document.querySelector('.btn-enviar');
  const cajaExito = document.querySelector('.exito');
  const btnCerrarExito = cajaExito ? cajaExito.querySelector('.cerrar') : null;

  if (cajaExito) {
    cajaExito.style.display = 'none';
  }

  if (inputCorreo) {
    inputCorreo.classList.remove('error');
    const msgInicial = inputCorreo.parentElement.querySelector('.msg-error');
    if (msgInicial) msgInicial.style.display = 'none';
  }

  if (btnCerrarExito) {
    btnCerrarExito.style.cursor = 'pointer';
    btnCerrarExito.addEventListener('click', () => {
      if (cajaExito) cajaExito.style.display = 'none';
    });
  }

  [inputNombre, inputCorreo, inputAsunto, inputMensaje].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => limpiarError(el));
  });

  if (checkAcepto) {
    checkAcepto.addEventListener('change', () => limpiarErrorCheck(checkAcepto));
  }

  if (btnEnviar) {
    btnEnviar.addEventListener('click', (e) => {
      e.preventDefault();
      procesarEnvio();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      procesarEnvio();
    });

    // "Limpiar" vacía los campos (reset del formulario), desmarca el check y quita el aviso de error.
    form.addEventListener('reset', () => {
      limpiarTodosLosErrores();
      if (cajaExito) cajaExito.style.display = 'none';
    });
  }

  function procesarEnvio() {
    if (validarFormulario()) {
      if (cajaExito) {
        cajaExito.style.display = 'block';
        cajaExito.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      limpiarTodosLosErrores();
    }
  }

  function validarFormulario() {
    let esValido = true;
    limpiarTodosLosErrores();

    const nombreVal = inputNombre ? inputNombre.value.trim() : '';
    if (!nombreVal) {
      mostrarError(inputNombre, 'Ingresa tu nombre completo.');
      esValido = false;
    } else if (nombreVal.length < 3) {
      mostrarError(inputNombre, 'El nombre debe tener al menos 3 caracteres.');
      esValido = false;
    }

    const correoVal = inputCorreo ? inputCorreo.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoVal) {
      mostrarError(inputCorreo, 'Ingresa tu correo electrónico.');
      esValido = false;
    } else if (!emailRegex.test(correoVal)) {
      mostrarError(inputCorreo, 'Ingresa un correo válido (debe contener @ y dominio).');
      esValido = false;
    }

    const asuntoVal = inputAsunto ? inputAsunto.value.trim() : '';
    if (!asuntoVal) {
      mostrarError(inputAsunto, 'Indica el asunto del mensaje.');
      esValido = false;
    } else if (asuntoVal.length < 3) {
      mostrarError(inputAsunto, 'El asunto debe tener al menos 3 caracteres.');
      esValido = false;
    }

    const mensajeVal = inputMensaje ? inputMensaje.value.trim() : '';
    if (!mensajeVal) {
      mostrarError(inputMensaje, 'El mensaje es obligatorio.');
      esValido = false;
    } else if (mensajeVal.length < 10) {
      mostrarError(inputMensaje, 'El mensaje debe tener al menos 10 caracteres.');
      esValido = false;
    }

    if (checkAcepto && !checkAcepto.checked) {
      mostrarErrorCheck(checkAcepto, 'Debes aceptar el tratamiento de datos personales para enviar el mensaje.');
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
    if (msgEl) msgEl.style.display = 'none';
  }

  function mostrarErrorCheck(checkEl, mensaje) {
    const label = checkEl.closest('.acepto');
    if (!label) return;
    let msgEl = label.parentElement.querySelector('.msg-error-check');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'msg-error msg-error-check';
      label.after(msgEl);
    }
    msgEl.textContent = `× ${mensaje}`;
    msgEl.style.display = 'block';
  }

  function limpiarErrorCheck(checkEl) {
    const label = checkEl.closest('.acepto');
    if (!label) return;
    const msgEl = label.parentElement.querySelector('.msg-error-check');
    if (msgEl) msgEl.style.display = 'none';
  }

  function limpiarTodosLosErrores() {
    [inputNombre, inputCorreo, inputAsunto, inputMensaje].forEach(el => limpiarError(el));
    if (checkAcepto) limpiarErrorCheck(checkAcepto);
  }
});
