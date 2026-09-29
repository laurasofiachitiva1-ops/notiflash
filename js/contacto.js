// "Limpiar" vacía los campos (reset del formulario), desmarca el check y quita el aviso de error.
document.querySelector('.formulario').addEventListener('reset', function () {
  document.getElementById('correo').classList.remove('error');
  document.querySelector('.msg-error').style.display = 'none';
});
