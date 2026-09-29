// "Todas" se desmarca al elegir una categoría; si no queda ninguna, vuelve a marcarse.
const todas = document.querySelector('input[name="cat"][value="todas"]');
const cats = Array.from(document.querySelectorAll('input[name="cat"]:not([value="todas"])'));
todas.addEventListener('change', () => {
  if (todas.checked) cats.forEach(c => c.checked = false);
  else todas.checked = true;
});
cats.forEach(c => c.addEventListener('change', () => {
  todas.checked = !cats.some(x => x.checked);
}));
